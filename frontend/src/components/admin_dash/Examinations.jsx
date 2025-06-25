// src/components/admin/Examinations.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faDownload,
  faEye,
  faCalendar,
  faClock,
  faUsers,
  faFileAlt,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const Examinations = () => {
  const [examinations, setExaminations] = useState([
    {
      id: 1,
      examName: 'Unit Test 1 - Mathematics',
      examType: 'Unit Test',
      subject: 'Mathematics',
      class: '10-A',
      date: '2024-07-15',
      time: '09:00 AM',
      duration: '2 hours',
      totalMarks: 100,
      passingMarks: 40,
      venue: 'Room 101',
      invigilator: 'Dr. Priya Sharma',
      status: 'completed',
      studentsAppeared: 35,
      studentsRegistered: 38,
      averageScore: 78.5,
      highestScore: 98,
      lowestScore: 45
    },
    {
      id: 2,
      examName: 'Half Yearly - Science',
      examType: 'Half Yearly',
      subject: 'Science',
      class: '9-A',
      date: '2024-07-20',
      time: '10:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 35,
      venue: 'Room 201',
      invigilator: 'Mr. Rajesh Kumar',
      status: 'scheduled',
      studentsAppeared: 0,
      studentsRegistered: 42,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0
    },
    {
      id: 3,
      examName: 'Final Exam - English',
      examType: 'Final',
      subject: 'English',
      class: '12-A',
      date: '2024-07-25',
      time: '11:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      venue: 'Main Hall',
      invigilator: 'Ms. Anita Singh',
      status: 'in-progress',
      studentsAppeared: 28,
      studentsRegistered: 30,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0
    },
    {
      id: 4,
      examName: 'Unit Test 2 - Hindi',
      examType: 'Unit Test',
      subject: 'Hindi',
      class: '11-A',
      date: '2024-07-30',
      time: '02:00 PM',
      duration: '2 hours',
      totalMarks: 80,
      passingMarks: 32,
      venue: 'Room 301',
      invigilator: 'Dr. Vikram Patel',
      status: 'draft',
      studentsAppeared: 0,
      studentsRegistered: 25,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredExaminations = examinations.filter(exam => {
    const matchesSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || exam.class === filterClass;
    const matchesStatus = filterStatus === '' || exam.status === filterStatus;
    const matchesSubject = filterSubject === '' || exam.subject === filterSubject;
    return matchesSearch && matchesClass && matchesStatus && matchesSubject;
  });

  const handleDeleteExam = (examId) => {
    if (window.confirm('Are you sure you want to delete this examination?')) {
      setExaminations(examinations.filter(exam => exam.id !== examId));
    }
  };

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'in-progress': return 'warning';
      case 'draft': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return faCheck;
      case 'scheduled': return faCalendar;
      case 'in-progress': return faClock;
      case 'draft': return faFileAlt;
      case 'cancelled': return faExclamationTriangle;
      default: return faFileAlt;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="examinations">
      <div className="page-header">
        <div className="header-content">
          <h1>Examinations</h1>
          <p>Schedule and manage school examinations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} />
            Schedule Exam
          </button>
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faDownload} />
            Export Schedule
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search examinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="filter-select"
          >
            <option value="">All Classes</option>
            <option value="9-A">Class 9-A</option>
            <option value="10-A">Class 10-A</option>
            <option value="11-A">Class 11-A</option>
            <option value="12-A">Class 12-A</option>
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Social Studies">Social Studies</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Examinations Grid */}
      <div className="examinations-grid">
        {filteredExaminations.map(exam => (
          <div key={exam.id} className="exam-card">
            <div className="exam-header">
              <div className="exam-info">
                <h3 className="exam-name">{exam.examName}</h3>
                <p className="exam-type">{exam.examType} • {exam.subject}</p>
              </div>
              <div className="exam-status">
                <span className={`status-badge ${getStatusColor(exam.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(exam.status)} />
                  {exam.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="exam-body">
              <div className="exam-details">
                <div className="detail-row">
                  <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(exam.date)}</span>
                </div>
                <div className="detail-row">
                  <FontAwesomeIcon icon={faClock} className="detail-icon" />
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{exam.time}</span>
                </div>
                <div className="detail-row">
                  <FontAwesomeIcon icon={faUsers} className="detail-icon" />
                  <span className="detail-label">Class:</span>
                  <span className="detail-value">{exam.class}</span>
                </div>
                <div className="detail-row">
                  <FontAwesomeIcon icon={faFileAlt} className="detail-icon" />
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{exam.duration}</span>
                </div>
                <div className="detail-row">
                  <FontAwesomeIcon icon={faClipboard} className="detail-icon" />
                  <span className="detail-label">Total Marks:</span>
                  <span className="detail-value">{exam.totalMarks}</span>
                </div>
              </div>

              {exam.status === 'completed' && (
                <div className="exam-results">
                  <h4>Results Summary</h4>
                  <div className="results-grid">
                    <div className="result-item">
                      <span className="result-label">Appeared</span>
                      <span className="result-value">{exam.studentsAppeared}/{exam.studentsRegistered}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Average</span>
                      <span className="result-value">{exam.averageScore}%</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Highest</span>
                      <span className="result-value">{exam.highestScore}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="exam-footer">
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleViewDetails(exam)}
              >
                <FontAwesomeIcon icon={faEye} />
                View Details
              </button>
              <button className="btn btn-sm btn-outline">
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteExam(exam.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="exam-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClipboard} />
          </div>
          <div className="stat-content">
            <h4>Total Exams</h4>
            <span className="stat-value">{examinations.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
          <div className="stat-content">
            <h4>Scheduled</h4>
            <span className="stat-value">
              {examinations.filter(e => e.status === 'scheduled').length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="stat-content">
            <h4>Completed</h4>
            <span className="stat-value">
              {examinations.filter(e => e.status === 'completed').length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-content">
            <h4>In Progress</h4>
            <span className="stat-value">
              {examinations.filter(e => e.status === 'in-progress').length}
            </span>
          </div>
        </div>
      </div>

      {/* Examination Details Modal */}
      {showDetails && selectedExam && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Examination Details</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="exam-detail-grid">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-item">
                    <label>Exam Name:</label>
                    <span>{selectedExam.examName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedExam.examType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Subject:</label>
                    <span>{selectedExam.subject}</span>
                  </div>
                  <div className="detail-item">
                    <label>Class:</label>
                    <span>{selectedExam.class}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${getStatusColor(selectedExam.status)}`}>
                      {selectedExam.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Schedule & Venue</h3>
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{formatDate(selectedExam.date)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Time:</label>
                    <span>{selectedExam.time}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{selectedExam.duration}</span>
                  </div>
                  <div className="detail-item">
                    <label>Venue:</label>
                    <span>{selectedExam.venue}</span>
                  </div>
                  <div className="detail-item">
                    <label>Invigilator:</label>
                    <span>{selectedExam.invigilator}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Marking Scheme</h3>
                  <div className="detail-item">
                    <label>Total Marks:</label>
                    <span>{selectedExam.totalMarks}</span>
                  </div>
                  <div className="detail-item">
                    <label>Passing Marks:</label>
                    <span>{selectedExam.passingMarks}</span>
                  </div>
                  <div className="detail-item">
                    <label>Pass Percentage:</label>
                    <span>{((selectedExam.passingMarks / selectedExam.totalMarks) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Statistics</h3>
                  <div className="detail-item">
                    <label>Registered Students:</label>
                    <span>{selectedExam.studentsRegistered}</span>
                  </div>
                  <div className="detail-item">
                    <label>Students Appeared:</label>
                    <span>{selectedExam.studentsAppeared}</span>
                  </div>
                  {selectedExam.status === 'completed' && (
                    <>
                      <div className="detail-item">
                        <label>Average Score:</label>
                        <span>{selectedExam.averageScore}%</span>
                      </div>
                      <div className="detail-item">
                        <label>Highest Score:</label>
                        <span>{selectedExam.highestScore}%</span>
                      </div>
                      <div className="detail-item">
                        <label>Lowest Score:</label>
                        <span>{selectedExam.lowestScore}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Examinations;