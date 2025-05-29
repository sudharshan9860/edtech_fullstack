import React, { useState } from 'react';
import './HomeworkSubmissionForm.css';

const HomeworkSubmissionForm = ({ assignment, student, onSubmit }) => {
  const [submissionType, setSubmissionType] = useState("text");
  const [textResponse, setTextResponse] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (submissionType === "text" && !textResponse.trim()) return;
    if (submissionType === "image" && !imageFile) return;

    const submission = {
      assignmentId: assignment.id,
      studentId: student.id,
      textResponse: submissionType === "text" ? textResponse.trim() : undefined,
      imageUrl: submissionType === "image" && imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    onSubmit(submission);
  };

  const isOverdue = new Date() > assignment.dueDate;

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
            <h3 className="assignment-title">{assignment.title}</h3>

            {assignment.description && (
              <p className="assignment-description">{assignment.description}</p>
            )}

            {assignment.imageUrl && (
              <img
                src={assignment.imageUrl}
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
                Due: {assignment.dueDate.toLocaleDateString()} at {assignment.dueDate.toLocaleTimeString()}
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Student: {student.name}
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
              <button type="submit" className="submit-btn">
                Submit Homework
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeworkSubmissionForm;