// Fixed QuestionListModal.jsx - All Errors Resolved
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./QuestionListModal.css";
import MarkdownWithMath from "./MarkdownWithMath";

const QuestionListModal = ({
  show,
  onHide,
  questionList = [],
  onQuestionClick,
  isMultipleSelect = false,
  onMultipleSelectSubmit,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Reset selected questions when modal opens/closes
  useEffect(() => {
    if (!show) {
      setSelectedQuestions([]);
    }
  }, [show]);

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
      console.log("Question clicked:", { questionData, index });

      const selectedQuestion = {
        question: questionData.question,
        image: questionData.question_image
          ? `data:image/png;base64,${questionData.question_image}`
          : null,
      };

      // Call the parent's question click handler
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

  // Fixed close handler - use the onHide prop
  const handleModalClose = () => {
    setSelectedQuestions([]); // Reset selections when closing
    onHide(); // Call the parent's close handler
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      size="lg"
      className="question-modal"
      backdrop="static" // Prevent closing by clicking outside
    >
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
                  style={{ cursor: 'pointer' }}
                >
                  {isMultipleSelect && (
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(index)}
                      onChange={() => {}} // Handled by parent onClick
                      style={{ marginRight: '10px' }}
                    />
                  )}
                  
                  <div className="question-number">{index + 1}</div>
                  
                  <div className="question-content">
                    <div className="question-text">
                      <MarkdownWithMath content={questionData.question} />
                    </div>

                    {questionData.level && (
                      <div
                        className={`question-level ${
                          questionData.level?.toLowerCase() || ""
                        }`}
                      >
                        {questionData.level}
                      </div>
                    )}

                    {questionData.question_image && (
                      <div className="question-image-preview">
                        <img
                          src={`data:image/png;base64,${questionData.question_image}`}
                          alt={`Question ${index + 1}`}
                          className="preview-image"
                          style={{ 
                            maxWidth: '100%', 
                            height: 'auto',
                            borderRadius: '8px',
                            marginTop: '10px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-questions-message">
              <p>No questions available.</p>
            </div>
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