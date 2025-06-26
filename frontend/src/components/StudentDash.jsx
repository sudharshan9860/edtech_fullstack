// Enhanced StudentDash.jsx - Sidebar Layout
import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import QuestionListModal from "./QuestionListModal";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "./AuthContext";
import GreetingHeader from "./GreetingHeader";
import MotivationalQuote from "./MotivationalQuote";
import StudyStreaks from "./StudyStreaks";
import Achievements from "./Achievements";
import ProgressCard from "./ProgressCard";
import RecentSessions from "./RecentSessions";
import "./StudentDash.css";
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faMoon,
  faSun,
  faBars,
  faTimes,
  faChartLine,
  faTrophy,
  faFire,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

function StudentDash() {
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);

  // Theme and sidebar state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [worksheets, setWorksheets] = useState([]);

  // State for selections with smart defaults
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [questionLevel, setQuestionLevel] = useState("");
  const [selectedWorksheet, setSelectedWorksheet] = useState("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Extract class from username (e.g., 10HPS24 -> 10)
  const extractClassFromUsername = (username) => {
    if (!username) return "";
    const classNumber = username.substring(0, 2);
    return isNaN(classNumber) ? "" : classNumber;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Apply dark mode on component mount
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Fetch classes and set defaults
  useEffect(() => {
    async function fetchData() {
      try {
        const classResponse = await axiosInstance.get("/classes/");
        const classesData = classResponse.data.data;
        setClasses(classesData);

        // Set default class based on username
        const defaultClass = extractClassFromUsername(username);
        if (defaultClass) {
          const matchingClass = classesData.find(cls => 
            cls.class_name.includes(defaultClass) || cls.class_code === defaultClass
          );
          if (matchingClass) {
            setSelectedClass(matchingClass.class_code);
          }
        }
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    }
    fetchData();
  }, [username]);

  // Fetch subjects and set default
  useEffect(() => {
    async function fetchSubjects() {
      if (selectedClass) {
        try {
          const subjectResponse = await axiosInstance.post("/subjects/", {
            class_id: selectedClass,
          });
          const subjectsData = subjectResponse.data.data;
          setSubjects(subjectsData);

          // Set default subject to Mathematics
          const mathSubject = subjectsData.find(subject => 
            subject.subject_name.toLowerCase().includes('math')
          );
          if (mathSubject) {
            setSelectedSubject(mathSubject.subject_code);
          }

          // Reset dependent fields
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
          setSelectedWorksheet("");
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        }
      }
    }
    fetchSubjects();
  }, [selectedClass]);

  // Fetch chapters
  useEffect(() => {
    async function fetchChapters() {
      if (selectedSubject && selectedClass) {
        try {
          const chapterResponse = await axiosInstance.post("/chapters/", {
            subject_id: selectedSubject,
            class_id: selectedClass,
          });
          setChapters(chapterResponse.data.data);
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
          setSelectedWorksheet("");
        } catch (error) {
          console.error("Error fetching chapters:", error);
          setChapters([]);
        }
      }
    }
    fetchChapters();
  }, [selectedSubject, selectedClass]);

  // Determine if generate button should be enabled
  const isGenerateButtonEnabled = () => {
    if (questionType === "external") {
      return (
        selectedClass !== "" &&
        selectedSubject !== "" &&
        selectedChapters.length > 0 &&
        questionType !== "" &&
        questionLevel !== ""
      );
    }

    if (questionType === "worksheets") {
      return (
        selectedClass !== "" &&
        selectedSubject !== "" &&
        selectedChapters.length > 0 &&
        questionType !== "" &&
        selectedWorksheet !== ""
      );
    }

    return (
      selectedClass !== "" &&
      selectedSubject !== "" &&
      selectedChapters.length > 0 &&
      questionType !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isGenerateButtonEnabled()) {
      console.error("Please select all required fields");
      return;
    }

    const requestData = {
      classid: Number(selectedClass),
      subjectid: Number(selectedSubject),
      topicid: selectedChapters,
      solved: questionType === "solved",
      exercise: questionType === "exercise",
      subtopic: questionType === "external" ? questionLevel : null,
      worksheet_name: questionType === "worksheets" ? selectedWorksheet : null,
    };

    try {
      const response = await axiosInstance.post("/question-images/", requestData);
      
      const questionsWithImages = response.data.questions.map((question) => ({
        ...question,
        question: question.question,
        image: question.question_image
          ? `data:image/png;base64,${question.question_image}`
          : null,
      }));

      setQuestionList(questionsWithImages);
      setSelectedQuestions([]);
      setShowQuestionList(true);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  const handleQuestionClick = (question, index, image) => {
    navigate("/solvequestion", {
      state: {
        question,
        questionNumber: index + 1,
        questionList,
        class_id: selectedClass,
        subject_id: selectedSubject,
        topic_ids: selectedChapters,
        subtopic: questionType === "external" ? questionLevel : "",
        worksheet_id: questionType === "worksheets" ? selectedWorksheet : "",
        image,
        selectedQuestions: selectedQuestions,
      },
    });
  };

  const handleMultipleSelectSubmit = (selectedQuestionsData) => {
    setSelectedQuestions(selectedQuestionsData);
    setShowQuestionList(false);

    const firstQuestion = selectedQuestionsData[0];
    navigate("/solvequestion", {
      state: {
        question: firstQuestion.question,
        questionNumber: firstQuestion.index + 1,
        questionList,
        class_id: selectedClass,
        subject_id: selectedSubject,
        topic_ids: selectedChapters,
        subtopic: questionType === "external" ? questionLevel : "",
        worksheet_id: questionType === "worksheets" ? selectedWorksheet : "",
        image: firstQuestion.image,
        selectedQuestions: selectedQuestionsData,
      },
    });
  };

  return (
    <div className={`student-dashboard-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faRocket} className="brand-icon" />
            {!sidebarCollapsed && <span className="brand-text">Dashboard</span>}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={sidebarCollapsed ? faBars : faTimes} />
          </button>
        </div>

        <div className="sidebar-stats">
          <div className="stat-card-sidebar">
            <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">89%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
          
          <div className="stat-card-sidebar">
            <FontAwesomeIcon icon={faFire} className="stat-icon fire" />
            <div className="stat-content">
              <div className="stat-number">5</div>
              <div className="stat-label">Streak</div>
            </div>
          </div>
          
          <div className="stat-card-sidebar">
            <FontAwesomeIcon icon={faTrophy} className="stat-icon trophy" />
            <div className="stat-content">
              <div className="stat-number">3</div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <div className="section-title">Overview</div>
            <ProgressCard />
          </div>
          
          <div className="menu-section">
            <div className="section-title">Achievements</div>
            <StudyStreaks />
            <Achievements />
          </div>
        </div>

        {/* Theme Toggle in Sidebar */}
        <div className="sidebar-footer">
          <button className="theme-toggle-sidebar" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            {!sidebarCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Container fluid className="main-container">
          {/* Greeting Header */}
          <GreetingHeader username={username} />
          
          {/* Motivational Quote */}
          <MotivationalQuote />

          {/* Question Generation Form */}
          <div className="main-content-card">
            <div className="content-header">
              <h3>🚀 Start Your Learning Adventure</h3>
              <p>Select your preferences and let's begin!</p>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Row className="form-row">
                <Col md={6}>
                  <Form.Group controlId="formClass">
                    <Form.Label>
                      <FontAwesomeIcon icon={faSchool} className="me-2" />
                      Class
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="form-control-enhanced"
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.class_code} value={cls.class_code}>
                          {cls.class_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group controlId="formSubject">
                    <Form.Label>
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Subject
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="form-control-enhanced"
                      disabled={!selectedClass}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.subject_code} value={subject.subject_code}>
                          {subject.subject_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-row">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <FontAwesomeIcon icon={faListAlt} className="me-2" />
                      Chapters
                    </Form.Label>
                    <Select
                      isMulti
                      options={chapters.map((chapter) => ({
                        value: chapter.chapter_code,
                        label: chapter.name,
                      }))}
                      value={selectedChapters.map((chapterCode) => {
                        const chapter = chapters.find(ch => ch.chapter_code === chapterCode);
                        return { value: chapterCode, label: chapter?.name || chapterCode };
                      })}
                      onChange={(selectedOptions) =>
                        setSelectedChapters(selectedOptions.map(option => option.value))
                      }
                      placeholder="Select chapters to study"
                      className="react-select-enhanced"
                      classNamePrefix="react-select"
                      isDisabled={!selectedSubject}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group controlId="formQuestionType">
                    <Form.Label>
                      <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
                      Question Type
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="form-control-enhanced"
                      disabled={selectedChapters.length === 0}
                    >
                      <option value="">Select Type</option>
                      <option value="solved">Solved Examples</option>
                      <option value="exercise">Practice Exercises</option>
                      <option value="external">External Questions</option>
                      <option value="worksheets">Worksheets</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {/* Conditional fields for external questions and worksheets */}
              {questionType === "external" && (
                <Row className="form-row">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Difficulty Level</Form.Label>
                      <Form.Control
                        as="select"
                        value={questionLevel}
                        onChange={(e) => setQuestionLevel(e.target.value)}
                        className="form-control-enhanced"
                      >
                        <option value="">Select Level</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {questionType === "worksheets" && (
                <Row className="form-row">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Select Worksheet</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedWorksheet}
                        onChange={(e) => setSelectedWorksheet(e.target.value)}
                        className="form-control-enhanced"
                      >
                        <option value="">Select Worksheet</option>
                        {worksheets.map((worksheet) => (
                          <option key={worksheet.id} value={worksheet.worksheet_name}>
                            {worksheet.worksheet_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <div className="form-actions">
                <Button
                  variant="primary"
                  type="submit"
                  className="btn-generate-enhanced"
                  disabled={!isGenerateButtonEnabled()}
                >
                  <FontAwesomeIcon icon={faRocket} className="me-2" />
                  Generate Questions
                </Button>
              </div>
            </Form>
          </div>

          {/* Recent Sessions */}
          <RecentSessions />
        </Container>
      </div>

      <QuestionListModal
        show={showQuestionList}
        onHide={() => setShowQuestionList(false)}
        questionList={questionList}
        onQuestionClick={handleQuestionClick}
        isMultipleSelect={questionType === "external"}
        onMultipleSelectSubmit={handleMultipleSelectSubmit}
      />
    </div>
  );
}

export default StudentDash;