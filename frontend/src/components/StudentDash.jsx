import React, { useState, useEffect } from "react";
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./StudentDash.css";
import axiosInstance from "../api/axiosInstance";
import QuestionListModal from "./QuestionListModal";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tutorial from "./Tutorial";
import { useTutorial } from "../contexts/TutorialContext";
import RecentSessions from "./RecentSessions"; // Import the new component
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

function StudentDash() {
  const navigate = useNavigate();

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subTopics, setSubTopics] = useState([]); // Added for external questions

  // State for selections
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [questionLevel, setQuestionLevel] = useState("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Enhanced tutorial usage
  const {
    shouldShowTutorialForPage,
    markPageCompleted,
    resetTutorial,
    setCurrentPage,
    continueTutorialFlow,
    restartTutorialForPage,
  } = useTutorial();

  // Update current page when component mounts
  useEffect(() => {
    setCurrentPage("studentDash");
  }, [setCurrentPage]);

  const tutorialSteps = [
    {
      target: "#formClass",
      content: "Start by selecting your class",
      disableBeacon: true,
    },
    {
      target: "#formSubject",
      content: "Next, choose your subject",
    },
    {
      target: ".select-chapters",
      content: "Select one or more chapters to study",
    },
    {
      target: "#formQuestionType",
      content: "Choose the type of questions you want to practice",
    },
    {
      target: ".btn-generate",
      content:
        "Click here to generate your questions. After this, we'll continue the tutorial on the question list.",
    },
    {
      target: ".recent-sessions-container",
      content: "Here you can see your recent study sessions and quickly resume where you left off.",
    },
  ];

  // Determine if generate button should be enabled
  const isGenerateButtonEnabled = () => {
    // If external question type is selected, also check question level
    if (questionType === "external") {
      return (
        selectedClass !== "" &&
        selectedSubject !== "" &&
        selectedChapters.length > 0 &&
        questionType !== "" &&
        questionLevel !== ""
      );
    }

    // For other question types, just check the main 4 categories
    return (
      selectedClass !== "" &&
      selectedSubject !== "" &&
      selectedChapters.length > 0 &&
      questionType !== ""
    );
  };

  // Handle tutorial completion for this component
  const handleTutorialComplete = () => {
    console.log("Tutorial steps in StudentDash completed");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const classResponse = await axiosInstance.get("/classes/");
        const classesData = classResponse.data.data;
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      if (selectedClass) {
        try {
          const subjectResponse = await axiosInstance.post("/subjects/", {
            class_id: selectedClass,
          });
          setSubjects(subjectResponse.data.data);
          // Reset dependent fields when class changes
          setSelectedSubject("");
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        }
      }
    }
    fetchSubjects();
  }, [selectedClass]);

  useEffect(() => {
    async function fetchChapters() {
      if (selectedSubject && selectedClass) {
        try {
          const chapterResponse = await axiosInstance.post("/chapters/", {
            subject_id: selectedSubject,
            class_id: selectedClass,
          });
          setChapters(chapterResponse.data.data);
          // Reset dependent fields when subject changes
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
        } catch (error) {
          console.error("Error fetching chapters:", error);
          setChapters([]);
        }
      }
    }
    fetchChapters();
  }, [selectedSubject, selectedClass]);

  // New effect for fetching subtopics when External question type is selected
  useEffect(() => {
    async function fetchSubTopics() {
      if (
        questionType === "external" &&
        selectedClass &&
        selectedSubject &&
        selectedChapters.length > 0
      ) {
        try {
          const response = await axiosInstance.post("/question-images/", {
            classid: selectedClass,
            subjectid: selectedSubject,
            topicid: selectedChapters[0], // Assuming single chapter selection
            external: true,
          });
          console.log("the response data is : ", response);
          setSubTopics(response.data.subtopics);
        } catch (error) {
          console.error("Error fetching subtopics:", error);
          setSubTopics([]);
        }
      }
    }
    fetchSubTopics();
  }, [questionType, selectedClass, selectedSubject, selectedChapters]);

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
    };

    try {
      const response = await axiosInstance.post(
        "/question-images/",
        requestData
      );

      console.log("the response data is : ", response.data.questions);
      // Process questions with images
      const questionsWithImages = response.data.questions.map((question) => ({
        ...question,
        question: question.question,
        image: question.question_image
          ? `data:image/png;base64,${question.question_image}`
          : null,
      }));

      setQuestionList(questionsWithImages);
      setSelectedQuestions([]); // Reset selected questions

      // Continue tutorial flow to QuestionListModal before showing the modal
      continueTutorialFlow("studentDash", "questionListModal");

      // Show the modal after setting up tutorial flow
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
        image,
        selectedQuestions: selectedQuestions,
      },
    });
  };

  const handleMultipleSelectSubmit = (selectedQuestionsData) => {
    setSelectedQuestions(selectedQuestionsData);
    setShowQuestionList(false);

    // Navigate to SolveQuestion with the first selected question
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
        image: firstQuestion.image,
        selectedQuestions: selectedQuestionsData,
      },
    });
  };

  // Reset Question Level when Question Type changes
  useEffect(() => {
    if (questionType !== "external") {
      setQuestionLevel("");
    }
  }, [questionType]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {shouldShowTutorialForPage("studentDash") && (
        <Tutorial steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}
      <main className="flex-fill">
        <Container className="py-4">
          <div className="form-container mb-4">
            <Form onSubmit={handleSubmit}>
              <div className="restart-tutorial-btn-container mb-3 text-right">
                <Button
                  variant="outline-info"
                  className="restart-tutorial-btn"
                  onClick={() => {
                    console.log("Restarting tutorial on StudentDash page...");
                    restartTutorialForPage("studentDash");
                  }}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  Replay Tutorial
                </Button>
              </div>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formClass">
                    <Form.Label>
                      <FontAwesomeIcon icon={faSchool} className="me-2" />
                      Class
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="form-control"
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
                <Col xs={12} md={6}>
                  <Form.Group controlId="formSubject">
                    <Form.Label>
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Subject
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="form-control"
                      disabled={!selectedClass}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option
                          key={subject.subject_code}
                          value={subject.subject_code}
                        >
                          {subject.subject_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col className="select-chapters" xs={12} md={6}>
                  <Form.Group controlId="formChapters">
                    <Form.Label>
                      <FontAwesomeIcon icon={faListAlt} className="me-2" />
                      Chapters
                    </Form.Label>
                    <Select
                      isMulti
                      options={chapters.map((chapter) => ({
                        value: chapter.topic_code,
                        label: chapter.name,
                      }))}
                      value={selectedChapters.map((code) => ({
                        value: code,
                        label: chapters.find(
                          (chapter) => chapter.topic_code === code
                        )?.name,
                      }))}
                      onChange={(selectedOptions) => {
                        setSelectedChapters(
                          selectedOptions.map((option) => option.value)
                        );
                      }}
                      classNamePrefix="react-select"
                      placeholder="Select Chapters"
                      isDisabled={!selectedSubject}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="formQuestionType">
                    <Form.Label>
                      <FontAwesomeIcon
                        icon={faClipboardQuestion}
                        className="me-2"
                      />
                      Question Type
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="form-control"
                      disabled={selectedChapters.length === 0}
                    >
                      <option value="">Select Question Type</option>
                      <option value="solved">Solved</option>
                      <option value="exercise">Exercise</option>
                      <option value="external">Set of Questions</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {questionType === "external" && (
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formQuestionLevel">
                      <Form.Label>
                        <FontAwesomeIcon
                          icon={faClipboardQuestion}
                          className="me-2"
                        />
                        Select The Set
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={questionLevel}
                        onChange={(e) => setQuestionLevel(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select The Set</option>
                        {subTopics.map((subTopic, index) => (
                          <option key={subTopic} value={subTopic}>
                            {`Exercise ${index + 1}`}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="btn-generate mt-3"
                  disabled={!isGenerateButtonEnabled()}
                >
                  Generate Questions
                </Button>
              </div>
            </Form>
          </div>

          {/* Recent Sessions Section */}

          
          <RecentSessions />
        </Container>
      </main>

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