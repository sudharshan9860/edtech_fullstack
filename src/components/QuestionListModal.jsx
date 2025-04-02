import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "./QuestionListModal.css";
import Tutorial from "./Tutorial";
import { useTutorial } from "../contexts/TutorialContext";

const QuestionListModal = ({
  show,
  onHide,
  questionList = [],
  onQuestionClick,
}) => {
  const {
    markPageCompleted,
    setCurrentPage,
    continueTutorialFlow,
    shouldShowTutorialForPage,
    exitTutorialFlow,
  } = useTutorial();

  // Set current page when modal is shown
  useEffect(() => {
    if (show) {
      setCurrentPage("questionListModal");
      console.log("QuestionListModal is now visible");
    }
  }, [show, setCurrentPage]);

  const tutorialSteps = [
    {
      target: ".question-list",
      content:
        "Here's the list of questions we generated for you. Browse through them and select one to start.",
      disableBeacon: true,
    },
    {
      target: ".question-item",
      content:
        "Click on any question to start solving it. We'll continue the tutorial once you select a question.",
    },
  ];

  const handleTutorialComplete = () => {
    // Don't mark as completed here, we'll do it when a question is clicked
    console.log("Tutorial steps in QuestionListModal completed");
  };

  const handleQuestionClick = (questionData, index) => {
    // Continue tutorial flow to SolveQuestion
    continueTutorialFlow("questionListModal", "solveQuestion");

    // Extract the necessary data from the question object
    const selectedQuestion = {
      question: questionData.question,
      image: questionData.question_image
        ? `data:image/png;base64,${questionData.question_image}`
        : null,
    };

    // Call the onQuestionClick prop with the processed data
    onQuestionClick(selectedQuestion.question, index, selectedQuestion.image);
  };

  // Handle modal closing - if this happens during tutorial, make sure to mark as complete
  const handleModalClose = () => {
    if (shouldShowTutorialForPage("questionListModal")) {
      console.log(
        "Modal closed during tutorial, marking as complete and continuing flow"
      );
      exitTutorialFlow();
    }
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      size="lg"
      className="question-modal"
    >
      {shouldShowTutorialForPage("questionListModal") && (
        <Tutorial steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}

      <Modal.Header closeButton>
        <Modal.Title>Question List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="question-list-container">
          {questionList && questionList.length > 0 ? (
            <ul className="question-list">
              {questionList.map((questionData, index) => (
                <li
                  key={index}
                  className="question-item"
                  onClick={() => handleQuestionClick(questionData, index)}
                >
                  <div className="question-number">{index + 1}</div>
                  <div className="question-content">
                    <div className="question-text">{questionData.question}</div>
                    {questionData.question_image && (
                      <div className="question-image-preview">
                        <img
                          src={`data:image/png;base64,${questionData.question_image}`}
                          alt={`Question ${index + 1}`}
                          className="preview-image"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionListModal;
