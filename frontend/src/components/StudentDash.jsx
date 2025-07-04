import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./StudentDash.css";
import axiosInstance from "../api/axiosInstance";
import QuestionListModal from "./QuestionListModal";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "./AuthContext";
import { useTheme } from "../contexts/ThemeContext"; // Import global theme context
import RecentSessions from "./RecentSessions";
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faRocket,
  faGraduationCap,
  faBrain,
  faFire,
  faTrophy,
  faBookmark,
  faUsers,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

function StudentDash() {
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);
  const { isDarkMode } = useTheme(); // Use global theme context

  // Form data state
  const [formData, setFormData] = useState({
    classes: [],
    subjects: [],
    chapters: [],
    subTopics: [],
    worksheets: [],
    selectedClass: "",
    selectedSubject: "",
    selectedChapters: [],
    questionType: "",
    questionLevel: "",
    selectedWorksheet: "",
  });

  // UI state
  const [uiState, setUiState] = useState({
    showQuestionList: false,
    questionList: [],
    selectedQuestions: [],
    isLoading: false,
  });

  // Enhanced greeting function
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  // Get current date info
  const getCurrentDateInfo = () => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const date = now.getDate();
    const year = now.getFullYear();
    
    return { dayName, monthName, date, year };
  };

  // Extract class from username
  const extractClassFromUsername = (username) => {
    if (!username) return "";
    const classNumber = username.substring(0, 2);
    return isNaN(classNumber) ? "" : classNumber;
  };

  // Form validation
  const isGenerateButtonEnabled = () => {
    const { selectedClass, selectedSubject, selectedChapters, questionType, questionLevel, selectedWorksheet } = formData;
    
    if (questionType === "external") {
      return selectedClass && selectedSubject && selectedChapters.length > 0 && questionLevel;
    }
    if (questionType === "worksheets") {
      return selectedClass && selectedSubject && selectedChapters.length > 0 && selectedWorksheet;
    }
    return selectedClass && selectedSubject && selectedChapters.length > 0 && questionType;
  };

  // Enhanced data fetching functions
  const fetchClasses = async () => {
    try {
      setUiState(prev => ({ ...prev, isLoading: true }));
      const response = await axiosInstance.get("/classes/");
      const classesData = response.data.data;
      
      setFormData(prev => ({ ...prev, classes: classesData }));

      // Auto-select class based on username
      const defaultClass = extractClassFromUsername(username);
      if (defaultClass) {
        const matchingClass = classesData.find(cls => 
          cls.class_name.includes(defaultClass) || cls.class_code === defaultClass
        );
        if (matchingClass) {
          setFormData(prev => ({ ...prev, selectedClass: matchingClass.class_code }));
        }
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchSubjects = async (classId) => {
    if (!classId) return;
    
    try {
      const response = await axiosInstance.post("/subjects/", { class_id: classId });
      const subjectsData = response.data.data;
      
      setFormData(prev => ({ 
        ...prev, 
        subjects: subjectsData,
        selectedSubject: "",
        selectedChapters: [],
        questionType: "",
        questionLevel: "",
        selectedWorksheet: ""
      }));

      // Auto-select Mathematics
      const mathSubject = subjectsData.find(subject => 
        subject.subject_name.toLowerCase().includes('math')
      );
      if (mathSubject) {
        setFormData(prev => ({ ...prev, selectedSubject: mathSubject.subject_code }));
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setFormData(prev => ({ ...prev, subjects: [] }));
    }
  };

  const fetchChapters = async (subjectId, classId) => {
    if (!subjectId || !classId) return;
    
    try {
      const response = await axiosInstance.post("/chapters/", {
        subject_id: subjectId,
        class_id: classId,
      });
      
      const chaptersData = response.data.data || [];
      setFormData(prev => ({ 
        ...prev, 
        chapters: chaptersData,
        selectedChapters: [],
        questionType: "",
        questionLevel: "",
        selectedWorksheet: ""
      }));
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setFormData(prev => ({ ...prev, chapters: [] }));
    }
  };

  const fetchSubTopics = async () => {
    const { questionType, selectedClass, selectedSubject, selectedChapters } = formData;
    
    if (questionType === "external" && selectedClass && selectedSubject && selectedChapters.length > 0) {
      try {
        const response = await axiosInstance.post("/question-images/", {
          classid: selectedClass,
          subjectid: selectedSubject,
          topicid: selectedChapters[0],
          external: true,
        });
        setFormData(prev => ({ ...prev, subTopics: response.data.subtopics || [] }));
      } catch (error) {
        console.error("Error fetching subtopics:", error);
        setFormData(prev => ({ ...prev, subTopics: [] }));
      }
    }
  };

  const fetchWorksheets = async () => {
    const { questionType, selectedClass, selectedSubject, selectedChapters } = formData;
    
    if (questionType === "worksheets" && selectedClass && selectedSubject && selectedChapters.length > 0) {
      try {
        const response = await axiosInstance.post("/question-images/", {
          classid: selectedClass,
          subjectid: selectedSubject,
          topicid: selectedChapters[0],
          worksheets: true,
        });
        setFormData(prev => ({ ...prev, worksheets: response.data.worksheets || [] }));
      } catch (error) {
        console.error("Error fetching worksheets:", error);
        setFormData(prev => ({ ...prev, worksheets: [] }));
      }
    }
  };

  // Effects for data fetching
  useEffect(() => {
    fetchClasses();
  }, [username]);

  useEffect(() => {
    if (formData.selectedClass) {
      fetchSubjects(formData.selectedClass);
    }
  }, [formData.selectedClass]);

  useEffect(() => {
    if (formData.selectedSubject && formData.selectedClass) {
      fetchChapters(formData.selectedSubject, formData.selectedClass);
    }
  }, [formData.selectedSubject, formData.selectedClass]);

  useEffect(() => {
    fetchSubTopics();
  }, [formData.questionType, formData.selectedClass, formData.selectedSubject, formData.selectedChapters]);

  useEffect(() => {
    fetchWorksheets();
  }, [formData.questionType, formData.selectedClass, formData.selectedSubject, formData.selectedChapters]);

  // Form handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isGenerateButtonEnabled()) {
      console.error("Please select all required fields");
      return;
    }

    const { selectedClass, selectedSubject, selectedChapters, questionType, questionLevel, selectedWorksheet } = formData;

    const requestData = {
      classid: Number(selectedClass),
      subjectid: Number(selectedSubject),
      topicid: selectedChapters,
      solved: questionType === "solved",
      exercise: questionType === "exercise",
      worksheets: questionType === "worksheets",
      subtopic: questionType === "external" ? questionLevel : null,
      worksheet_name: questionType === "worksheets" ? selectedWorksheet : null,
    };

    try {
      setUiState(prev => ({ ...prev, isLoading: true }));
      const response = await axiosInstance.post("/question-images/", requestData);

      const questionsWithImages = (response.data.questions || []).map((question, index) => ({
        ...question,
        id: index,
        question: question.question,
        image: question.question_image
          ? `data:image/png;base64,${question.question_image}`
          : null,
      }));

      setUiState(prev => ({ 
        ...prev, 
        questionList: questionsWithImages,
        selectedQuestions: [],
        showQuestionList: true 
      }));
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleQuestionClick = (question, index, image) => {
    setUiState(prev => ({ ...prev, showQuestionList: false }));
    
    navigate("/solvequestion", {
      state: {
        question,
        questionNumber: index + 1,
        questionList: uiState.questionList,
        class_id: formData.selectedClass,
        subject_id: formData.selectedSubject,
        topic_ids: formData.selectedChapters,
        subtopic: formData.questionType === "external" ? formData.questionLevel : "",
        worksheet_id: formData.questionType === "worksheets" ? formData.selectedWorksheet : "",
        image,
        selectedQuestions: uiState.selectedQuestions,
      },
    });
  };

  const handleMultipleSelectSubmit = (selectedQuestionsData) => {
    setUiState(prev => ({ 
      ...prev, 
      selectedQuestions: selectedQuestionsData,
      showQuestionList: false 
    }));

    const firstQuestion = selectedQuestionsData[0];
    navigate("/solvequestion", {
      state: {
        question: firstQuestion.question,
        questionNumber: firstQuestion.index + 1,
        questionList: uiState.questionList,
        class_id: formData.selectedClass,
        subject_id: formData.selectedSubject,
        topic_ids: formData.selectedChapters,
        subtopic: formData.questionType === "external" ? formData.questionLevel : "",
        worksheet_id: formData.questionType === "worksheets" ? formData.selectedWorksheet : "",
        image: firstQuestion.image,
        selectedQuestions: selectedQuestionsData,
      },
    });
  };

  // Enhanced chapter select styles
  const getSelectStyles = () => ({
    control: (provided, state) => ({
      ...provided,
      minHeight: '56px',
      border: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '12px',
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'white',
      borderColor: state.isFocused 
        ? '#00BCD4' 
        : (isDarkMode ? '#334155' : '#e2e8f0'),
      boxShadow: state.isFocused 
        ? `0 0 0 3px ${isDarkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)'}` 
        : 'none',
      '&:hover': {
        borderColor: '#00BCD4',
      },
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.98)' : 'white',
      border: `2px solid #00BCD4`,
      borderRadius: '12px',
      boxShadow: isDarkMode 
        ? '0 25px 50px rgba(0, 0, 0, 0.8)'
        : '0 10px 25px rgba(0, 0, 0, 0.15)',
      maxHeight: 'min(70vh, 500px)',
      minWidth: '400px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? '#00BCD4' 
        : state.isSelected 
        ? '#2196F3' 
        : (isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'white'),
      color: state.isFocused || state.isSelected 
        ? 'white' 
        : (isDarkMode ? '#f8fafc' : '#2d3748'),
      padding: '12px 16px',
      borderRadius: '6px',
      margin: '2px 0',
      '&:hover': {
        backgroundColor: '#00BCD4',
        color: 'white',
        transform: 'translateX(4px)',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#00BCD4',
      borderRadius: '6px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      fontWeight: '600',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      '&:hover': {
        backgroundColor: '#e53e3e',
        color: 'white',
      },
    }),
  });

  const dateInfo = getCurrentDateInfo();

  return (
    <div className={`student-dash-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Enhanced Sidebar */}
      <div className="top-left-brand">
  <FontAwesomeIcon icon={faGraduationCap} className="brand-icon-top" />
  <span className="brand-text-top">AI Educator</span>
</div>
      <div className="sidebar-fixed">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faGraduationCap} className="brand-icon" />
            <span>AI Educator</span>
          </div>
        </div>

        <div className="sidebar-content">
          {/* Progress Card */}
          <div className="progress-card">
            <div className="progress-icon">
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div className="progress-details">
              <h4>89%</h4>
              <span>Progress</span>
            </div>
          </div>

          {/* Streak Card */}
          <div className="streak-card">
            <div className="streak-icon">
              <FontAwesomeIcon icon={faFire} />
            </div>
            <div className="streak-details">
              <h4>5</h4>
              <span>Day Streak</span>
            </div>
          </div>

          {/* Badges Card */}
          <div className="badges-card">
            <div className="badges-icon">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <div className="badges-details">
              <h4>3</h4>
              <span>Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content-fixed">
        {/* Improved Greeting Header */}
        <div className="greeting-header-main">
          <Container fluid>
            <div className="greeting-main-content">
              {/* Left side - Greeting */}
              <div className="greeting-section">
                <h1 className="main-greeting">
                  <FontAwesomeIcon icon={faGraduationCap} className="greeting-icon" />
                  {getTimeBasedGreeting()}, {username}! 
                  <span className="graduation-emoji">🎓</span>
                </h1>
                <p className="greeting-subtext">Ready to start your learning journey? Select your preferences below.</p>
              </div>
              
              {/* Right side - Date and Time */}
              <div className="date-time-section">
                <div className="date-display">
                  <div className="day-info">
                    <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                    <span className="day-name">{dateInfo.dayName}</span>
                  </div>
                  <div className="date-info">
                    <span className="month-date">{dateInfo.monthName} {dateInfo.date}</span>
                    <span className="year">{dateInfo.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Main Selection Container */}
        <div className="main-selection-container">
          <Container fluid>
            <div className="selection-form-wrapper">
              <div className="form-header">
                <h2 className="form-title">
                  <FontAwesomeIcon icon={faRocket} className="form-icon" />
                  Generate Your Questions
                </h2>
                <p className="form-description">Select your preferences to get started with personalized learning</p>
              </div>

              <Form onSubmit={handleSubmit} className="selection-form">
                <Row className="form-row">
                  <Col md={6}>
                    <Form.Group controlId="formClass">
                      <Form.Label>
                        <FontAwesomeIcon icon={faSchool} className="me-2" />
                        Class
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.selectedClass}
                        onChange={(e) => handleFormChange('selectedClass', e.target.value)}
                        className="form-control-enhanced"
                        disabled={uiState.isLoading}
                      >
                        <option value="">Select Class</option>
                        {formData.classes.map((cls) => (
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
                        value={formData.selectedSubject}
                        onChange={(e) => handleFormChange('selectedSubject', e.target.value)}
                        className="form-control-enhanced"
                        disabled={!formData.selectedClass || uiState.isLoading}
                      >
                        <option value="">Select Subject</option>
                        {formData.subjects.map((subject) => (
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
                    <Form.Group controlId="formChapters">
                      <Form.Label>
                        <FontAwesomeIcon icon={faListAlt} className="me-2" />
                        Chapters (Select Multiple) - {formData.chapters.length} Available
                      </Form.Label>
                      
                      <Select
                        isMulti
                        value={formData.selectedChapters.map(chapterCode => {
                          const chapter = formData.chapters.find(ch => ch.topic_code === chapterCode);
                          return chapter ? { value: chapter.topic_code, label: chapter.name } : null;
                        }).filter(Boolean)}
                        onChange={(selectedOptions) => {
                          const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                          handleFormChange('selectedChapters', values);
                        }}
                        options={formData.chapters.map(chapter => ({
                          value: chapter.topic_code,
                          label: chapter.name
                        }))}
                        placeholder="Select chapters..."
                        isDisabled={!formData.selectedSubject || formData.chapters.length === 0 || uiState.isLoading}
                        className="chapters-select-final"
                        classNamePrefix="select"
                        closeMenuOnSelect={false}
                        isSearchable={true}
                        isClearable={true}
                        hideSelectedOptions={false}
                        menuPortalTarget={document.body}
                        styles={getSelectStyles()}
                      />
                      
                      <div className="mt-2 d-flex gap-2 flex-wrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleFormChange('selectedChapters', formData.chapters.map(ch => ch.topic_code))}
                          disabled={!formData.chapters.length || uiState.isLoading}
                          style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}
                        >
                          Select All ({formData.chapters.length})
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleFormChange('selectedChapters', [])}
                          disabled={!formData.selectedChapters.length || uiState.isLoading}
                          style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}
                        >
                          Clear ({formData.selectedChapters.length})
                        </Button>
                      </div>
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
                        value={formData.questionType}
                        onChange={(e) => handleFormChange('questionType', e.target.value)}
                        className="form-control-enhanced"
                        disabled={formData.selectedChapters.length === 0 || uiState.isLoading}
                      >
                        <option value="">Select Question Type</option>
                        <option value="solved">📚 Solved Examples</option>
                        <option value="exercise">💪 Practice Exercises</option>
                        <option value="external">🎯 Set of Questions</option>
                        <option value="worksheets">📄 Worksheets</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                {formData.questionType === "external" && (
                  <Row className="form-row">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FontAwesomeIcon icon={faBookmark} className="me-2" />
                          Select The Set
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={formData.questionLevel}
                          onChange={(e) => handleFormChange('questionLevel', e.target.value)}
                          className="form-control-enhanced"
                          disabled={uiState.isLoading}
                        >
                          <option value="">Select The Set</option>
                          {formData.subTopics.map((subTopic, index) => (
                            <option key={subTopic} value={subTopic}>
                              Exercise {index + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {formData.questionType === "worksheets" && (
                  <Row className="form-row">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FontAwesomeIcon icon={faUsers} className="me-2" />
                          Select Worksheet
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={formData.selectedWorksheet}
                          onChange={(e) => handleFormChange('selectedWorksheet', e.target.value)}
                          className="form-control-enhanced"
                          disabled={uiState.isLoading}
                        >
                          <option value="">Select Worksheet</option>
                          {formData.worksheets.map((worksheet) => (
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
                    className="btn-generate-main"
                    disabled={!isGenerateButtonEnabled() || uiState.isLoading}
                  >
                    <FontAwesomeIcon icon={faRocket} className="me-2" />
                    {uiState.isLoading ? 'Generating...' : 'Generate Questions'}
                  </Button>
                </div>
              </Form>
            </div>
          </Container>
        </div>

        {/* Recent Sessions */}
        <div className="recent-sessions-wrapper">
          <Container fluid>
            <RecentSessions />
          </Container>
        </div>
      </div>

      {/* Enhanced Question List Modal */}
      <QuestionListModal
        show={uiState.showQuestionList}
        onHide={() => setUiState(prev => ({ ...prev, showQuestionList: false }))}
        questionList={uiState.questionList}
        onQuestionClick={handleQuestionClick}
        isMultipleSelect={formData.questionType === "external"}
        onMultipleSelectSubmit={handleMultipleSelectSubmit}
      />
    </div>
  );
}

export default StudentDash;