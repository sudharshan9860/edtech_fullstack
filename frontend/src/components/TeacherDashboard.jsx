import React, { useState } from 'react';
import './TeacherDashboard.css';
import axiosInstance from '../api/axiosInstance';

const TeacherDashboard = ({ user, assignments, submissions, onAssignmentSubmit }) => {
  const [homework_code, setHomeworkCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [submissionType, setSubmissionType] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!title.trim() || !dueDate) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;
      if (submissionType === "image" && imageFile) {
        // Create FormData for image upload
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Upload image first
        const imageResponse = await axiosInstance.post('/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = imageResponse.data.imageUrl;
      }
      console.log("User_details:", user);
      const assignment = {
        homework_code: homework_code.trim(),
        title: title.trim(),
        description: submissionType === "text" ? description : undefined,
        imageUrl: imageUrl,
        teacherId: user.username,
        classId: user.id,
        due_date: new Date(dueDate).toISOString(),
        date_assigned: new Date().toISOString(),
      };
      console.log("Creating assignment:", assignment);
      await onAssignmentSubmit(assignment);

      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);
      setDueDate("");
      setSubmissionType("text");
      setHomeworkCode("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create assignment");
      console.error("Error creating assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const getSubmissionCount = (assignmentId) => {
    return submissions.filter((s) => s.assignmentId === assignmentId).length;
  };
  const mappedAssignments = assignments.map((a, idx) => {
    const data = a.data || {};
    return {
      id: data.homework_code || idx, // fallback to idx if no code
      title: data.title,
      description: data.description,
      imageUrl: data.attachment, // or null
      createdAt: data.date_assigned ? new Date(data.date_assigned) : new Date(),
      dueDate: data.due_date ? new Date(data.due_date) : new Date(),
    };
  });
  return (
    <div className="teacher-dashboard">
      {/* Assignment Creation Form */}
      <div className="dashboard-card create-assignment-card">
        <div className="card-header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <div>
            <h2 className="card-title">Create New Assignment</h2>
            <p className="card-description">Create a homework assignment for your students</p>
          </div>
        </div>
        
        <div className="card-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-group">
              <label htmlFor="homework_code" className="form-label">Homework_code</label>
              <input
                id="homework_code"
                type="text"
                className="form-input"
                value={homework_code}
                onChange={(e) => setHomeworkCode(e.target.value)}
                placeholder="enter homework code"
                required
              />
            </div>          
            <div className="form-group">
              <label htmlFor="title" className="form-label">Assignment Title</label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="due-date" className="form-label">Due Date</label>
              <input
                id="due-date"
                type="datetime-local"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assignment Type</label>
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
                  Text Description
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
                <label htmlFor="description" className="form-label">Assignment Description</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed assignment instructions"
                  rows="4"
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="image" className="form-label">Upload Assignment Image</label>
                <input
                  id="image"
                  type="file"
                  className="form-input file-input"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {imageFile && (
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Assignment preview"
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </button>
          </form>
        </div>
      </div>

      {/* Assignments List */}
      <div className="dashboard-card assignments-list-card">
        <div className="card-header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h2 className="card-title">Your Assignments</h2>
            <p className="card-description">Manage your created assignments and view submissions</p>
          </div>
        </div>
        
        <div className="card-content">
          <div className="assignments-list">
            {mappedAssignments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <p>No assignments created yet</p>
              </div>
            ) : (
              mappedAssignments.map((assignment) => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-header">
                    <h3 className="assignment-title">{assignment.title}</h3>
                    <div className="submission-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {getSubmissionCount(assignment.id)} submissions
                    </div>
                  </div>
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
                  <div className="assignment-dates">
                    <span>Created: {assignment.createdAt.toLocaleDateString()}</span>
                    <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;