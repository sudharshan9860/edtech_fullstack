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
    console.log("Question clicked in modal:", questionData, index);
    
    if (isMultipleSelect) {
      // MODIFIED: Only allow selection of 1 question
      setSelectedQuestions([index]); // Always replace with new selection
      
      // MODIFIED: Auto-submit when a question is selected
      setTimeout(() => {
        handleSingleQuestionSubmit(questionData, index);
      }, 100); // Small delay to show selection visually
      
    } else {
      // Handle different image field names and formats
      let imageUrl = null;
      if (questionData.question_image) {
        if (questionData.question_image.startsWith('data:image')) {
          imageUrl = questionData.question_image;
        } else {
          imageUrl = `data:image/png;base64,${questionData.question_image}`;
        }
      } else if (questionData.image) {
        imageUrl = questionData.image;
      } else if (questionData.questionImage) {
        imageUrl = questionData.questionImage;
      }

      // Ensure we're passing proper string content and IDs
      const selectedQuestion = {
        question: typeof questionData.question === 'string' 
          ? questionData.question 
          : questionData.question?.text || questionData.question?.question || String(questionData.question || ''),
        id: questionData.id || questionData.question_id || questionData._id,
        image: imageUrl,
        level: questionData.level || 'Medium',
        originalIndex: index
      };

      console.log("Processed selected question:", selectedQuestion);
      onQuestionClick(selectedQuestion.question, index, selectedQuestion.image, selectedQuestion.id);
    }
  };

  // NEW: Handle single question submission and navigation
  const handleSingleQuestionSubmit = (questionData, index) => {
    console.log("Raw question data:", questionData);
    
    // Handle different image field names and formats
    let imageUrl = null;
    if (questionData.question_image) {
      // If it's already base64 with data URL prefix
      if (questionData.question_image.startsWith('data:image')) {
        imageUrl = questionData.question_image;
      } else {
        // Add base64 prefix if missing
        imageUrl = `data:image/png;base64,${questionData.question_image}`;
      }
    } else if (questionData.image) {
      imageUrl = questionData.image;
    } else if (questionData.questionImage) {
      imageUrl = questionData.questionImage;
    }

    const selectedQuestion = {
      question: typeof questionData.question === 'string'
        ? questionData.question
        : questionData.question?.text || questionData.question?.question || String(questionData.question || ''),
      id: questionData.id || questionData.question_id || questionData._id,
      image: imageUrl,
      level: questionData.level || 'Medium',
      originalIndex: index
    };

    console.log("Navigating to solve question with:", selectedQuestion);
    console.log("Image URL:", imageUrl);
    
    // Close modal first
    onHide();
    
    // Navigate to solve question page with the selected question data
    navigate("/solvequestion", {
      state: {
        question: selectedQuestion.question,
        questionId: selectedQuestion.id,
        image: selectedQuestion.image, // Use 'image' instead of 'questionImage'
        level: selectedQuestion.level,
        fromQuestionSelection: true
      }
    });
  };

  const handleMultipleSelectSubmit = () => {
    // This function is kept for compatibility but modified for single selection
    if (selectedQuestions.length === 1) {
      const index = selectedQuestions[0];
      const questionData = questionList[index];
      handleSingleQuestionSubmit(questionData, index);
    }
  };

  const handleSolveWorksheet = () => {
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

  const renderQuestionContent = (questionData) => {
    let questionText = '';
    
    if (typeof questionData.question === 'string') {
      questionText = questionData.question;
    } else if (questionData.question?.text) {
      questionText = questionData.question.text;
    } else if (questionData.question?.question) {
      questionText = questionData.question.question;
    } else {
      questionText = String(questionData.question || 'Question content unavailable');
    }

    return <MarkdownWithMath content={questionText} />;
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
              ? "Select a Question" // MODIFIED: Changed from "Select up to 5 Questions"
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
                      type="radio" // MODIFIED: Changed from checkbox to radio button
                      name="questionSelection" // MODIFIED: Added name for radio group
                      checked={selectedQuestions.includes(index)}
                      onChange={() => handleQuestionClick(questionData, index)}
                    />
                  )}
                  <div className="question-number">{index + 1}</div>
                  <div className="question-content">
                    <div className="question-text">
                      {renderQuestionContent(questionData)}
                    </div>

                    <div
                      className={`question-level ${
                        questionData.level?.toLowerCase() || ""
                      }`}
                    >
                      {questionData.level || 'Medium'}
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
        {/* MODIFIED: Hide submit button for multiple select since auto-navigation occurs */}
        {isMultipleSelect && !worksheetName && selectedQuestions.length === 0 && (
          <div className="text-muted">
            Click on any question to start solving
          </div>
        )}
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionListModal;