import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, 
  faCode, 
  faCalendarAlt, 
  faCheckCircle,
  faTimesCircle,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import './SessionDetails.css';

const SessionDetails = ({ show, onHide, session }) => {
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Helper function to parse array-like strings
  const parseArrayString = (str) => {
    if (!str) return [];
    
    try {
      // Check if it's a string representation of an array
      if (typeof str === 'string' && str.startsWith('[') && str.endsWith(']')) {
        // Convert to actual array and trim quotes
        const cleanStr = str.replace(/^\[|\]$/g, '').trim();
        if (!cleanStr) return [];
        
        // Split by commas that are followed by a quote
        const items = cleanStr.split(/,(?=\s*['"])/);
        
        // Clean up each item (remove quotes)
        return items.map(item => item.replace(/^['"]|['"]$/g, '').trim());
      }
    } catch (e) {
      console.error("Error parsing array string:", e);
    }
    
    return [str]; // Return as a single-item array if parsing failed
  };

  // Function to determine session status color
  const getStatusColor = (score, type) => {
    if (type === 'solve') return '#34A853'; // Green for solved examples
    
    // For exercises/correct attempts
    if (score > 80) return '#34A853'; // Green for high scores
    if (score > 40) return '#FBBC05'; // Yellow for medium scores
    return '#EA4335'; // Red for low scores
  };

  // If no session is provided, don't render anything
  if (!session) {
    return null;
  }

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      centered
      className="session-details-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon 
            icon={session.subject?.toLowerCase().includes('math') ? faCalculator : faCode} 
            className="me-2" 
          />
          Session Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Session Header */}
        <div className="session-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="session-title mb-0">
              {session.subject} - {session.answering_type === 'correct' ? 'Exercise' : 'Solved Examples'}
            </h4>
            <div className="session-date">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              {formatDate(session.date)}
            </div>
          </div>
          <div className="session-meta mt-2">
            <span className="badge bg-primary me-2">Class {session.class_name}</span>
            <span className="badge bg-secondary me-2">Chapter {session.chapter_number}</span>
            <span 
              className={`badge ${session.student_score > 50 ? 'bg-success' : 'bg-danger'} me-2`}
            >
              Score: {session.student_score}%
            </span>
          </div>
        </div>

        {/* Question Section */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <strong>Question</strong>
          </Card.Header>
          <Card.Body>
            <p className="question-text">{session.question_text}</p>
            {session.question_image_base64 && session.question_image_base64 !== "No image for question" && (
              <div className="text-center">
                <img 
                  src={session.question_image_base64.startsWith('data:') 
                    ? session.question_image_base64 
                    : `data:image/jpeg;base64,${session.question_image_base64}`}
                  alt="Question" 
                  className="question-image"
                />
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Student Answer Section */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <strong>Your Answer</strong>
          </Card.Header>
          <Card.Body>
            <pre className="student-answer">{session.student_answer}</pre>
            {session.student_answer_base64 && (
              <div className="text-center mt-3">
                <img 
                  src={session.student_answer_base64.startsWith('data:') 
                    ? session.student_answer_base64 
                    : `data:image/jpeg;base64,${session.student_answer_base64}`}
                  alt="Student Answer" 
                  className="answer-image"
                />
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Correct Answer Section */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <strong>Correct Answer</strong>
          </Card.Header>
          <Card.Body>
            <div className="correct-answer">
              {parseArrayString(session.ai_answer).map((step, index) => (
                <div key={index} className="solution-step">
                  <span className="step-number">{index + 1}.</span> {step}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Teacher's Comment */}
        {session.comment && (
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <FontAwesomeIcon icon={faComment} className="me-2" />
              <strong>Teacher's Comment</strong>
            </Card.Header>
            <Card.Body>
              <p className="teacher-comment">{session.comment}</p>
            </Card.Body>
          </Card>
        )}

        {/* Session Result */}
        <div className="session-result p-3 text-center">
          <h5 className="mb-3">Session Result</h5>
          <div 
            className={`result-indicator ${session.student_score > 50 ? 'success' : 'danger'}`}
          >
            <FontAwesomeIcon 
              icon={session.student_score > 50 ? faCheckCircle : faTimesCircle} 
              size="2x"
            />
            <span className="ms-2">
              {session.student_score > 50 ? 'Passed' : 'Needs Improvement'}
            </span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionDetails;