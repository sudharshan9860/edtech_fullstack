import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./QuestionListModal.css";
import Tutorial from "./Tutorial";
import { useTutorial } from "../contexts/TutorialContext";

const QuestionListModal = ({
  show,
  onHide,
  questionList = [],
  onQuestionClick,
  isMultipleSelect = false,
  onMultipleSelectSubmit,
}) => {
  const {
    markPageCompleted,
    setCurrentPage,
    continueTutorialFlow,
    shouldShowTutorialForPage,
    exitTutorialFlow,
  } = useTutorial();

  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    if (show) {
      console.log("QuestionListModal is now visible, setting current page");
      setCurrentPage("questionListModal");
      if (shouldShowTutorialForPage("questionListModal")) {
        console.log("Should show tutorial for QuestionListModal");
      }
    }
  }, [show, setCurrentPage, shouldShowTutorialForPage]);

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
    console.log("Tutorial steps in QuestionListModal completed");
  };

  const handleQuestionClick = (questionData, index) => {
    if (isMultipleSelect) {
      setSelectedQuestions((prev) => {
        const isSelected = prev.includes(index);
        if (isSelected) {
          return prev.filter((i) => i !== index);
        } else {
          if (prev.length < 5) {
            return [...prev, index];
          }
          return prev;
        }
      });
    } else {
      console.log("Question clicked, continuing tutorial flow");
      continueTutorialFlow("questionListModal", "solveQuestion");

      const selectedQuestion = {
        question: questionData.question,
        image: questionData.question_image
          ? `data:image/png;base64,${questionData.question_image}`
          : null,
      };

      onQuestionClick(selectedQuestion.question, index, selectedQuestion.image);
    }
  };

  const handleMultipleSelectSubmit = () => {
    if (selectedQuestions.length >= 1 && selectedQuestions.length <= 5) {
      const selectedQuestionsData = selectedQuestions.map((index) => ({
        question: questionList[index].question,
        image: questionList[index].question_image
          ? `data:image/png;base64,${questionList[index].question_image}`
          : null,
        index: index,
      }));
      onMultipleSelectSubmit(selectedQuestionsData);
    }
  };

  const handleModalClose = () => {
    console.log("QuestionListModal closing");
    if (shouldShowTutorialForPage("questionListModal")) {
      console.log("Modal closed during tutorial, marking as complete");
      markPageCompleted("questionListModal");
      exitTutorialFlow();
    }
    setSelectedQuestions([]);
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
        <Modal.Title>
          {isMultipleSelect ? "Select up to 5 Questions" : "Question List"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="question-list-container">
          {Array.isArray(questionList) && questionList.length > 0 ? (
            <ul className="question-list">
              {questionList.map((questionData, index) => (
                <li
                  key={index}
                  className={`question-item ${
                    selectedQuestions.includes(index) ? "selected" : ""
                  }`}
                  onClick={() => handleQuestionClick(questionData, index)}
                >
                  {isMultipleSelect && (
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(index)}
                      onChange={() => handleQuestionClick(questionData, index)}
                    />
                  )}
                  <div className="question-number">{index + 1}</div>
                  <div className="question-content">
                    <div className="question-text">
                      {questionData.question}
                    </div>
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
        {isMultipleSelect && (
          <Button
            variant="primary"
            onClick={handleMultipleSelectSubmit}
            disabled={
              selectedQuestions.length < 1 || selectedQuestions.length > 5
            }
          >
            Submit Selected Questions ({selectedQuestions.length}/5)
          </Button>
        )}
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionListModal;
