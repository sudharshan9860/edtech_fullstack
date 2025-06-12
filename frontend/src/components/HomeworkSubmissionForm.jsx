import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from './AuthContext';
import './HomeworkSubmissionForm.css';

const HomeworkSubmissionForm = () => {
  const [submissionType, setSubmissionType] = useState("text");
  const [textResponse, setTextResponse] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Get homework details from location state (passed from notification)
        const homeworkDetails = location.state?.homeworkDetails;
        // Get homework code from either state or URL query parameters
        const homeworkCode = location.state?.homeworkCode || new URLSearchParams(location.search).get('code');
        console.log("Homework_Code",homeworkCode)
        if (!homeworkCode) {
          setError("No homework code provided");
          return;
        }
        
        // If homework details are passed directly, use them
        if (homeworkDetails) {
          console.log("Using homework details from navigation state:", homeworkDetails);
          setAssignment(homeworkDetails);
        } else {
          // Otherwise fetch the details using the homework code
          console.log("Fetching homework details for code:", homeworkCode);
          const response = await axiosInstance.get(`/homework/${homeworkCode}/`);
          setAssignment(response.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch assignment details");
        console.error("Error fetching assignment:", error);
      }
    };
    
    fetchAssignment();
  }, [location]);

  // Check if user is loaded
  if (!username) {
    return (
      <div className="submission-form-container">
        <div className="submission-card">
          <div className="loading-state">
            <div>Please log in to submit homework</div>
          </div>
        </div>
      </div>
    );
  }

  // Check if assignment is loaded
  if (!assignment) {
    return (
      <div className="submission-form-container">
        <div className="submission-card">
          <div className="loading-state">
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div>Loading assignment details...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (submissionType === "text" && !textResponse.trim()) {
      setError("Please provide a text response");
      setIsSubmitting(false);
      return;
    }
    if (submissionType === "image" && !imageFile) {
      setError("Please upload an image");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('homework_code', assignment.homework_code);
      formData.append('student_id', username);
      formData.append('submission_type', submissionType);

      if (submissionType === "text") {
        formData.append('text_response', textResponse.trim());
      } else if (imageFile) {
        formData.append('image_response', imageFile);
      }

      // Submit the homework
      console.log(formData)
      await axiosInstance.post('/homework-submission/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess("Homework submitted successfully!");
      setTextResponse("");
      setImageFile(null);

      // Redirect to student dashboard after submission
      setTimeout(() => {
        navigate('/student-dash', {
          state: {
            message: 'Homework submitted successfully!',
            type: 'success'
          }
        });
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit homework");
      console.error("Error submitting homework:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if assignment is overdue
  const isOverdue = assignment.due_date ? (new Date() > new Date(assignment.due_date)) : false;

  return (
    <div className="submission-form-container">
      <div className="submission-card">
        <div className="card-header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <h2 className="card-title">Submit Homework</h2>
            <p className="card-description">Submit your response for the assignment</p>
          </div>
        </div>

        <div className="card-content">
          {/* Assignment Details */}
          <div className="assignment-details">
            <h3 className="assignment-title">{assignment.title || 'Untitled Homework'}</h3>
            {assignment.description && (
              <p className="assignment-description">{assignment.description}</p>
            )}
            {assignment.attachment && (
              <img
    src={`data:image/jpeg;base64,${assignment.attachment}`}
    alt="Assignment"
    className="assignment-image"
  />
            )}
            <div className="assignment-meta">
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}
                {assignment.due_date && (
                  <> at {new Date(assignment.due_date).toLocaleTimeString()}</>
                )}
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Student: {username}
              </div>
            </div>
            {isOverdue && (
              <div className="overdue-warning">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                This assignment is overdue
              </div>
            )}
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="submission-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Response Type</label>
              <div className="type-buttons">
                <button
                  type="button"
                  className={`type-btn ${submissionType === "text" ? 'active' : ''}`}
                  onClick={() => setSubmissionType("text")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Text Response
                </button>
                <button
                  type="button"
                  className={`type-btn ${submissionType === "image" ? 'active' : ''}`}
                  onClick={() => setSubmissionType("image")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17,8 12,3 7,8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload Image
                </button>
              </div>
            </div>
            {submissionType === "text" ? (
              <div className="form-group">
                <label htmlFor="text-response" className="form-label">Your Response</label>
                <textarea
                  id="text-response"
                  className="form-textarea"
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  placeholder="Write your homework response here..."
                  rows="8"
                  required
                />
                <p className="character-count">{textResponse.length} characters</p>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="image-response" className="form-label">Upload Your Response</label>
                <input
                  id="image-response"
                  type="file"
                  className="form-input file-input"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required
                />
                {imageFile && (
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Response preview"
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            )}
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Homework'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeworkSubmissionForm;