import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./QuestionListModal.css";
import MarkdownWithMath from "./MarkdownWithMath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";

const QuestionListModal = ({
  show,
  onHide,
  questionList = [],
  onQuestionClick,
  isMultipleSelect = false,
  onMultipleSelectSubmit,
  worksheetName = "",
}) => {
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState([]);

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
      // console.log("Selected question data:", questionData);
      const selectedQuestion = {
        question: questionData.question,
        image: questionData.question_image
          ? `data:image/png;base64,${questionData.question_image}`
          : null,
        question_id: questionData.question_id || index, // Ensure each question has a unique ID
      };
      console.log("Selected question data:", selectedQuestion);
      onQuestionClick(selectedQuestion.question, index, selectedQuestion.image,selectedQuestion.question_id);
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
        question_id: questionList[index].question_id || index, // Ensure each question has a unique ID
      }));
      console.log("Selected questions data:", selectedQuestionsData);
      onMultipleSelectSubmit(selectedQuestionsData);
    }
  };

  const handleSolveWorksheet = () => {
    // Navigate to worksheet submission page with worksheet name and questions
    navigate("/worksheet-submission", {
      state: {
        worksheetName: worksheetName,
        worksheetQuestions: questionList,
      }
    });
    onHide();
  };

  const handleModalClose = () => {
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
      <Modal.Header closeButton>
        <Modal.Title>
          {worksheetName 
            ? `Worksheet: ${worksheetName}` 
            : isMultipleSelect 
              ? "Select up to 5 Questions" 
              : "Question List"}
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
                  } ${worksheetName ? "worksheet-question" : ""}`}
                  onClick={() => !worksheetName && handleQuestionClick(questionData, index)}
                  style={{ cursor: worksheetName ? "default" : "pointer" }}
                >
                  {isMultipleSelect && !worksheetName && (
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(index)}
                      onChange={() => handleQuestionClick(questionData, index)}
                    />
                  )}
                  <div className="question-number">{index + 1}</div>
                  <div className="question-content">
                    <div className="question-text">
                      <MarkdownWithMath content={questionData.question} />
                    </div>

                    <div
                      className={`question-level ${
                        questionData.level?.toLowerCase() || ""
                      }`}
                    >
                      {questionData.level}
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
        {worksheetName && (
          <Button
            variant="success"
            onClick={handleSolveWorksheet}
            className="me-2"
          >
            <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
            Solve Worksheet
          </Button>
        )}
        {isMultipleSelect && !worksheetName && (
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