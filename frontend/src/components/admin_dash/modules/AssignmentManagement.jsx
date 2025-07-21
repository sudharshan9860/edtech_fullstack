import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/AssignmentManagement.css';
import {
  faFileAlt,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faUpload,
  faEye,
  faTimes,
  faCheck,
  faDownload,
  faCalendarAlt,
  faClock,
  faUsers,
  faChartLine,
  faGraduationCap,
  faExclamationTriangle,
  faCheckCircle,
  faStar,
  faClipboardList,
  faUserCheck
} from '@fortawesome/free-solid-svg-icons';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Quadratic Equations Worksheet',
      subject: 'Mathematics',
      classes: ['10-A', '10-B'],
      teacher: 'Dr. Priya Sharma',
      type: 'Homework',
      dueDate: '2024-02-15',
      createdDate: '2024-02-01',
      totalMarks: 50,
      description: 'Solve problems related to quadratic equations and graphing',
      instructions: 'Complete all 15 problems. Show your work clearly.',
      attachments: ['worksheet.pdf', 'example_solutions.pdf'],
      status: 'active',
      totalStudents: 65,
      submitted: 48,
      graded: 35,
      avgScore: 42.5,
      difficulty: 'Medium',
      estimatedTime: '2 hours'
    },
    {
      id: 2,
      title: 'Photosynthesis Lab Report',
      subject: 'Biology',
      classes: ['11-A'],
      teacher: 'Dr. Vikram Patel',
      type: 'Lab Work',
      dueDate: '2024-02-20',
      createdDate: '2024-02-05',
      totalMarks: 100,
      description: 'Conduct photosynthesis experiment and write detailed report',
      instructions: 'Follow lab safety protocols. Include observations, data analysis, and conclusions.',
      attachments: ['lab_manual.pdf', 'report_template.docx'],
      status: 'active',
      totalStudents: 30,
      submitted: 25,
      graded: 20,
      avgScore: 78.5,
      difficulty: 'Hard',
      estimatedTime: '4 hours'
    },
    {
      id: 3,
      title: 'Essay on Climate Change',
      subject: 'English',
      classes: ['9-A', '9-B', '9-C'],
      teacher: 'Ms. Anita Singh',
      type: 'Essay',
      dueDate: '2024-02-18',
      createdDate: '2024-02-03',
      totalMarks: 75,
      description: 'Write a comprehensive essay on climate change and its impacts',
      instructions: 'Minimum 1000 words. Include references and citations.',
      attachments: ['essay_guidelines.pdf'],
      status: 'active',
      totalStudents: 90,
      submitted: 72,
      graded: 60,
      avgScore: 65.2,
      difficulty: 'Medium',
      estimatedTime: '3 hours'
    },
    {
      id: 4,
      title: 'Programming Project - Calculator',
      subject: 'Computer Science',
      classes: ['12-A'],
      teacher: 'Mr. Arjun Gupta',
      type: 'Project',
      dueDate: '2024-02-25',
      createdDate: '2024-02-10',
      totalMarks: 200,
      description: 'Create a functional calculator application using Python',
      instructions: 'Include GUI, error handling, and documentation.',
      attachments: ['project_requirements.pdf', 'sample_code.py'],
      status: 'active',
      totalStudents: 25,
      submitted: 15,
      graded: 8,
      avgScore: 145.8,
      difficulty: 'Hard',
      estimatedTime: '10 hours'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    classes: [],
    teacher: '',
    type: 'Homework',
    dueDate: '',
    totalMarks: 100,
    description: '',
    instructions: '',
    attachments: [],
    difficulty: 'Medium',
    estimatedTime: '2 hours'
  });

  // Available options
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Social Studies'];
  const assignmentTypes = ['Homework', 'Project', 'Lab Work', 'Essay', 'Quiz', 'Presentation', 'Research'];
  const availableClasses = ['9-A', '9-B', '9-C', '10-A', '10-B', '10-C', '11-A', '11-B', '12-A', '12-B'];
  const teachers = ['Dr. Priya Sharma', 'Dr. Vikram Patel', 'Ms. Anita Singh', 'Mr. Arjun Gupta', 'Mrs. Meera Joshi'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === '' || assignment.subject === filterSubject;
    const matchesType = filterType === '' || assignment.type === filterType;
    const matchesStatus = filterStatus === '' || assignment.status === filterStatus;
    return matchesSearch && matchesSubject && matchesType && matchesStatus;
  });

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.subject && newAssignment.classes.length > 0) {
      const newId = Math.max(...assignments.map(a => a.id)) + 1;
      setAssignments([...assignments, { 
        ...newAssignment, 
        id: newId, 
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        totalStudents: newAssignment.classes.length * 30,
        submitted: 0,
        graded: 0,
        avgScore: 0
      }]);
      setNewAssignment({
        title: '',
        subject: '',
        classes: [],
        teacher: '',
        type: 'Homework',
        dueDate: '',
        totalMarks: 100,
        description: '',
        instructions: '',
        attachments: [],
        difficulty: 'Medium',
        estimatedTime: '2 hours'
      });
      setShowAddModal(false);
    }
  };

  const handleEditAssignment = () => {
    if (selectedAssignment) {
      setAssignments(assignments.map(assignment => 
        assignment.id === selectedAssignment.id ? selectedAssignment : assignment
      ));
      setShowEditModal(false);
      setSelectedAssignment(null);
    }
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleEditAssignmentModal = (assignment) => {
    setSelectedAssignment({...assignment});
    setShowEditModal(true);
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
  };

  const handleClassToggle = (cls, isNewAssignment = true) => {
    if (isNewAssignment) {
      const updatedClasses = newAssignment.classes.includes(cls)
        ? newAssignment.classes.filter(c => c !== cls)
        : [...newAssignment.classes, cls];
      setNewAssignment({ ...newAssignment, classes: updatedClasses });
    } else {
      const updatedClasses = selectedAssignment.classes.includes(cls)
        ? selectedAssignment.classes.filter(c => c !== cls)
        : [...selectedAssignment.classes, cls];
      setSelectedAssignment({ ...selectedAssignment, classes: updatedClasses });
    }
  };

  const getStatusClass = (status) => {
    return `assignment-status-badge ${status}`;
  };

  const getDifficultyClass = (difficulty) => {
    return `assignment-difficulty-badge ${difficulty.toLowerCase()}`;
  };

  const getTypeClass = (type) => {
    return `assignment-type-badge ${type.toLowerCase().replace(' ', '-')}`;
  };

  const getSubmissionProgress = (assignment) => {
    return Math.round((assignment.submitted / assignment.totalStudents) * 100);
  };

  const getGradingProgress = (assignment) => {
    return Math.round((assignment.graded / assignment.submitted) * 100);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="assignment-management">
      {/* Header */}
      <div className="assignment-header">
        <div className="assignment-header-content">
          <div className="assignment-title-section">
            <h1>Assignment Management</h1>
            <p>Create, distribute, and grade assignments efficiently</p>
          </div>
          <div className="assignment-actions">
            <button
              onClick={() => setShowAddModal(true)}
              className="assignment-btn primary"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="assignment-search-filters">
        <div className="assignment-filters-container">
          <div className="assignment-search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="assignment-search-icon" />
            <input
              type="text"
              placeholder="Search assignments by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="assignment-search-input"
            />
          </div>
          <div className="assignment-filter-row">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="assignment-filter-select"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="assignment-filter-select"
            >
              <option value="">All Types</option>
              {assignmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="assignment-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="assignment-stats-grid">
        <div className="assignment-stat-card">
          <div className="assignment-stat-icon">
            <FontAwesomeIcon icon={faFileAlt} />
          </div>
          <div className="assignment-stat-content">
            <h3>Total Assignments</h3>
            <span className="assignment-stat-value">{assignments.length}</span>
            <span className="assignment-stat-label">Active assignments</span>
          </div>
        </div>
        <div className="assignment-stat-card">
          <div className="assignment-stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="assignment-stat-content">
            <h3>Total Submissions</h3>
            <span className="assignment-stat-value">{assignments.reduce((sum, a) => sum + a.submitted, 0)}</span>
            <span className="assignment-stat-label">Student submissions</span>
          </div>
        </div>
        <div className="assignment-stat-card">
          <div className="assignment-stat-icon">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="assignment-stat-content">
            <h3>Graded</h3>
            <span className="assignment-stat-value">{assignments.reduce((sum, a) => sum + a.graded, 0)}</span>
            <span className="assignment-stat-label">Assignments graded</span>
          </div>
        </div>
        <div className="assignment-stat-card">
          <div className="assignment-stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="assignment-stat-content">
            <h3>Avg Score</h3>
            <span className="assignment-stat-value">{Math.round(assignments.reduce((sum, a) => sum + a.avgScore, 0) / assignments.length)}%</span>
            <span className="assignment-stat-label">Class average</span>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="assignment-grid">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-card-header">
              <div className="assignment-title">
                <h3>{assignment.title}</h3>
                <div className="assignment-meta">
                  <span className="assignment-subject">{assignment.subject}</span>
                  <span className={getTypeClass(assignment.type)}>{assignment.type}</span>
                </div>
              </div>
              <div className="assignment-status-section">
                <span className={getStatusClass(assignment.status)}>
                  {assignment.status}
                </span>
                {isOverdue(assignment.dueDate) && (
                  <span className="assignment-overdue-badge">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Overdue
                  </span>
                )}
              </div>
            </div>

            <div className="assignment-card-body">
              <div className="assignment-details">
                <div className="assignment-detail-row">
                  <span className="assignment-detail-label">Teacher:</span>
                  <span className="assignment-detail-value">{assignment.teacher}</span>
                </div>
                <div className="assignment-detail-row">
                  <span className="assignment-detail-label">Classes:</span>
                  <div className="assignment-classes-list">
                    {assignment.classes.map((cls, index) => (
                      <span key={index} className="assignment-class-tag">{cls}</span>
                    ))}
                  </div>
                </div>
                <div className="assignment-detail-row">
                  <span className="assignment-detail-label">Due Date:</span>
                  <span className={`assignment-detail-value ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {new Date(assignment.dueDate).toLocaleDateString()}
                    {!isOverdue(assignment.dueDate) && (
                      <span className="days-until-due">
                        ({getDaysUntilDue(assignment.dueDate)} days left)
                      </span>
                    )}
                  </span>
                </div>
                <div className="assignment-detail-row">
                  <span className="assignment-detail-label">Marks:</span>
                  <span className="assignment-detail-value">{assignment.totalMarks} points</span>
                </div>
                <div className="assignment-detail-row">
                  <span className="assignment-detail-label">Difficulty:</span>
                  <span className={getDifficultyClass(assignment.difficulty)}>
                    {assignment.difficulty}
                  </span>
                </div>
              </div>

              <div className="assignment-progress">
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Submissions</span>
                    <span className="progress-value">{assignment.submitted}/{assignment.totalStudents}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill submission" 
                      style={{ width: `${getSubmissionProgress(assignment)}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{getSubmissionProgress(assignment)}%</span>
                </div>

                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Graded</span>
                    <span className="progress-value">{assignment.graded}/{assignment.submitted}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill graded" 
                      style={{ width: `${assignment.submitted > 0 ? getGradingProgress(assignment) : 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{assignment.submitted > 0 ? getGradingProgress(assignment) : 0}%</span>
                </div>

                {assignment.avgScore > 0 && (
                  <div className="assignment-avg-score">
                    <FontAwesomeIcon icon={faStar} />
                    Average Score: {assignment.avgScore.toFixed(1)}/{assignment.totalMarks}
                  </div>
                )}
              </div>
            </div>

            <div className="assignment-card-footer">
              <div className="assignment-actions-row">
                <button
                  onClick={() => handleViewAssignment(assignment)}
                  className="assignment-action-btn view"
                >
                  <FontAwesomeIcon icon={faEye} />
                  View
                </button>
                <button
                  onClick={() => handleEditAssignmentModal(assignment)}
                  className="assignment-action-btn edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
                <button
                  onClick={() => handleViewSubmissions(assignment)}
                  className="assignment-action-btn submissions"
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  Submissions
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="assignment-action-btn delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="assignment-modal-overlay">
          <div className="assignment-modal large">
            <div className="assignment-modal-header">
              <h2 className="assignment-modal-title">Create New Assignment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="assignment-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="assignment-modal-body">
              <div className="assignment-form-grid">
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Assignment Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="assignment-form-input"
                    placeholder="Enter assignment title"
                  />
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Subject</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    className="assignment-form-select"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Assignment Type</label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value})}
                    className="assignment-form-select"
                  >
                    {assignmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Teacher</label>
                  <select
                    value={newAssignment.teacher}
                    onChange={(e) => setNewAssignment({...newAssignment, teacher: e.target.value})}
                    className="assignment-form-select"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Due Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="assignment-form-input"
                  />
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Total Marks</label>
                  <input
                    type="number"
                    value={newAssignment.totalMarks}
                    onChange={(e) => setNewAssignment({...newAssignment, totalMarks: parseInt(e.target.value)})}
                    className="assignment-form-input"
                    min="1"
                  />
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Difficulty Level</label>
                  <select
                    value={newAssignment.difficulty}
                    onChange={(e) => setNewAssignment({...newAssignment, difficulty: e.target.value})}
                    className="assignment-form-select"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="assignment-form-group">
                  <label className="assignment-form-label">Estimated Time</label>
                  <input
                    type="text"
                    value={newAssignment.estimatedTime}
                    onChange={(e) => setNewAssignment({...newAssignment, estimatedTime: e.target.value})}
                    className="assignment-form-input"
                    placeholder="e.g., 2 hours"
                  />
                </div>
                <div className="assignment-form-group full-width">
                  <label className="assignment-form-label">Description</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="assignment-form-textarea"
                    placeholder="Enter assignment description"
                    rows="3"
                  />
                </div>
                <div className="assignment-form-group full-width">
                  <label className="assignment-form-label">Instructions</label>
                  <textarea
                    value={newAssignment.instructions}
                    onChange={(e) => setNewAssignment({...newAssignment, instructions: e.target.value})}
                    className="assignment-form-textarea"
                    placeholder="Enter detailed instructions for students"
                    rows="4"
                  />
                </div>
                <div className="assignment-form-group full-width">
                  <label className="assignment-form-label">Assign to Classes</label>
                  <div className="assignment-checkbox-grid">
                    {availableClasses.map(cls => (
                      <div key={cls} className="assignment-checkbox-item">
                        <input
                          type="checkbox"
                          checked={newAssignment.classes.includes(cls)}
                          onChange={() => handleClassToggle(cls, true)}
                          className="assignment-checkbox"
                        />
                        <label className="assignment-checkbox-label">{cls}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="assignment-modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="assignment-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                className="assignment-modal-btn submit"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Assignment Modal */}
      {showViewModal && selectedAssignment && (
        <div className="assignment-modal-overlay">
          <div className="assignment-modal large">
            <div className="assignment-modal-header">
              <h2 className="assignment-modal-title">{selectedAssignment.title}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="assignment-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="assignment-modal-body">
              <div className="assignment-view-grid">
                <div className="assignment-view-section">
                  <h4>Assignment Details</h4>
                  <div className="assignment-view-details">
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Subject:</span>
                      <span className="assignment-view-value">{selectedAssignment.subject}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Type:</span>
                      <span className={getTypeClass(selectedAssignment.type)}>{selectedAssignment.type}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Teacher:</span>
                      <span className="assignment-view-value">{selectedAssignment.teacher}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Created:</span>
                      <span className="assignment-view-value">{new Date(selectedAssignment.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Due Date:</span>
                      <span className="assignment-view-value">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Total Marks:</span>
                      <span className="assignment-view-value">{selectedAssignment.totalMarks}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Difficulty:</span>
                      <span className={getDifficultyClass(selectedAssignment.difficulty)}>{selectedAssignment.difficulty}</span>
                    </div>
                    <div className="assignment-view-row">
                      <span className="assignment-view-label">Estimated Time:</span>
                      <span className="assignment-view-value">{selectedAssignment.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="assignment-view-section">
                  <h4>Progress Statistics</h4>
                  <div className="assignment-stats-details">
                    <div className="stat-item">
                      <span className="stat-label">Total Students:</span>
                      <span className="stat-value">{selectedAssignment.totalStudents}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Submitted:</span>
                      <span className="stat-value">{selectedAssignment.submitted}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Graded:</span>
                      <span className="stat-value">{selectedAssignment.graded}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average Score:</span>
                      <span className="stat-value">{selectedAssignment.avgScore.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="assignment-view-section full-width">
                  <h4>Description</h4>
                  <p className="assignment-description">{selectedAssignment.description}</p>
                </div>

                <div className="assignment-view-section full-width">
                  <h4>Instructions</h4>
                  <p className="assignment-instructions">{selectedAssignment.instructions}</p>
                </div>

                <div className="assignment-view-section">
                  <h4>Assigned Classes</h4>
                  <div className="assigned-classes-list">
                    {selectedAssignment.classes.map((cls, index) => (
                      <span key={index} className="assigned-class-tag">{cls}</span>
                    ))}
                  </div>
                </div>

                <div className="assignment-view-section">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 ? (
                      selectedAssignment.attachments.map((attachment, index) => (
                        <div key={index} className="attachment-item">
                          <FontAwesomeIcon icon={faFileAlt} />
                          <span>{attachment}</span>
                          <button className="download-btn">
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="no-attachments">No attachments</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="assignment-modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="assignment-modal-btn cancel"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditAssignmentModal(selectedAssignment);
                }}
                className="assignment-modal-btn submit"
              >
                Edit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;