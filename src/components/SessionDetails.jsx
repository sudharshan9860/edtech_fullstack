import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, 
  faCode, 
  faCalendarAlt, 
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

  // Helper function to parse array-like strings or handle direct string
  const formatAIAnswer = (aiAnswer) => {
    if (!aiAnswer) return 'No AI answer available';
    
    // If aiAnswer is already a string, return it directly
    if (typeof aiAnswer === 'string' && !aiAnswer.startsWith('[')) {
      return aiAnswer;
    }
    
    try {
      // Try to parse if it's a string representation of an array
      if (typeof aiAnswer === 'string' && aiAnswer.startsWith('[') && aiAnswer.endsWith(']')) {
        // Convert to actual array and trim quotes
        const cleanStr = aiAnswer.replace(/^\[|\]$/g, '').trim();
        if (!cleanStr) return 'No AI answer available';
        
        // Split by commas that are followed by a quote
        const items = cleanStr.split(/,(?=\s*['"])/);
        
        // Clean up each item (remove quotes) and join with line breaks
        return items
          .map(item => item.replace(/^['"]|['"]$/g, '').trim())
          .join('\n');
      }
      
      // If it's already an array, join with line breaks
      if (Array.isArray(aiAnswer)) {
        return aiAnswer.join('\n');
      }
    } catch (e) {
      console.error("Error parsing AI answer:", e);
    }
    
    // If all else fails, return the original
    return String(aiAnswer);
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
            {session.student_score !== undefined && (
              <span className={`badge ${session.student_score > 50 ? 'bg-success' : 'bg-danger'} me-2`}>
                Score: {session.student_score}
              </span>
            )}
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

        {/* AI Answer Section */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <strong>AI Answer</strong>
          </Card.Header>
          <Card.Body>
            <pre className="ai-answer">
              {formatAIAnswer(session.ai_answer)}
            </pre>
          </Card.Body>
        </Card>

        {/* Teacher's Comment Section */}
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