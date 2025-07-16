import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Examinations.css'; // Make sure this path is correct

import {
  faClipboard,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faEye,
  faCalendar,
  faClock,
  faUsers,
  faFileAlt,
  faCheck,
  faExclamationTriangle,
  faTimes,
  faMapMarkerAlt,
  faChalkboardTeacher,
  faGraduationCap,
  faChartBar,
  faAward
} from '@fortawesome/free-solid-svg-icons';

const Examinations = () => {
  const [examinations, setExaminations] = useState([
    {
      id: 1,
      examName: 'Unit Test 1 - Mathematics',
      examType: 'Unit Test',
      subject: 'Mathematics',
      class: '10-A',
      section: 'A',
      grade: '10',
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
      lowestScore: 45,
      instructions: 'Bring calculator and drawing instruments'
    },
    {
      id: 2,
      examName: 'Half Yearly - Science',
      examType: 'Half Yearly',
      subject: 'Science',
      class: '9-A',
      section: 'A',
      grade: '9',
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
      lowestScore: 0,
      instructions: 'Bring lab manual and calculator'
    },
    {
      id: 3,
      examName: 'Final Exam - English',
      examType: 'Final',
      subject: 'English',
      class: '12-A',
      section: 'A',
      grade: '12',
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
      lowestScore: 0,
      instructions: 'Dictionary not allowed'
    },
    {
      id: 4,
      examName: 'Unit Test 2 - Hindi',
      examType: 'Unit Test',
      subject: 'Hindi',
      class: '11-A',
      section: 'A',
      grade: '11',
      date: '2024-07-30',
      time: '02:00 PM',
      duration: '2 hours',
      totalMarks: 80,
      passingMarks: 32,
      venue: 'Room 301',
      invigilator: 'Dr. Meena Gupta',
      status: 'draft',
      studentsAppeared: 0,
      studentsRegistered: 35,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      instructions: 'Write in Hindi only'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [newExam, setNewExam] = useState({
    examName: '',
    examType: 'Unit Test',
    subject: '',
    class: '',
    section: '',
    grade: '',
    date: '',
    time: '',
    duration: '',
    totalMarks: 100,
    passingMarks: 40,
    venue: '',
    invigilator: '',
    instructions: '',
    studentsRegistered: 0
  });

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const subjects = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies'];
  const examTypes = ['Unit Test', 'Half Yearly', 'Final', 'Practical', 'Project'];
  const venues = ['Room 101', 'Room 201', 'Room 301', 'Main Hall', 'Science Lab', 'Computer Lab'];

  const filteredExaminations = examinations.filter(exam => {
    const matchesSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.invigilator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || exam.class === filterClass;
    const matchesSection = filterSection === '' || exam.section === filterSection;
    const matchesSubject = filterSubject === '' || exam.subject === filterSubject;
    const matchesStatus = filterStatus === '' || exam.status === filterStatus;
    return matchesSearch && matchesClass && matchesSection && matchesSubject && matchesStatus;
  });

  const handleAddExam = () => {
    if (newExam.examName && newExam.subject && newExam.class && newExam.date) {
      const newId = Math.max(...examinations.map(e => e.id)) + 1;
      setExaminations([...examinations, { 
        ...newExam, 
        id: newId,
        status: 'draft',
        studentsAppeared: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      }]);
      setNewExam({
        examName: '',
        examType: 'Unit Test',
        subject: '',
        class: '',
        section: '',
        grade: '',
        date: '',
        time: '',
        duration: '',
        totalMarks: 100,
        passingMarks: 40,
        venue: '',
        invigilator: '',
        instructions: '',
        studentsRegistered: 0
      });
      setShowAddModal(false);
    }
  };

  const handleEditExam = () => {
    if (selectedExam) {
      setExaminations(examinations.map(exam => 
        exam.id === selectedExam.id ? selectedExam : exam
      ));
      setShowEditModal(false);
      setSelectedExam(null);
    }
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm('Are you sure you want to delete this examination?')) {
      setExaminations(examinations.filter(exam => exam.id !== examId));
    }
  };

  const handleViewExam = (exam) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  const handleEditExamModal = (exam) => {
    setSelectedExam({...exam});
    setShowEditModal(true);
  };

  const getStatusClass = (status) => {
    return `exam-status-badge ${status}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return faCheck;
      case 'in-progress': return faClock;
      case 'scheduled': return faCalendar;
      case 'cancelled': return faExclamationTriangle;
      default: return faFileAlt;
    }
  };

  const getExamTypeClass = (type) => {
    const typeKey = type.toLowerCase().replace(' ', '-');
    return `exam-type-badge ${typeKey}`;
  };

  // Summary Statistics
  const totalExams = examinations.length;
  const scheduledExams = examinations.filter(e => e.status === 'scheduled').length;
  const completedExams = examinations.filter(e => e.status === 'completed').length;
  const inProgressExams = examinations.filter(e => e.status === 'in-progress').length;

  return (
    <div className="examinations">
      {/* Header */}
      <div className="exam-header">
        <div className="exam-header-content">
          <div className="exam-title-section">
            <h1>Examinations</h1>
            <p>Schedule and manage school examinations</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="exam-schedule-btn"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="exam-stats-grid">
        <div className="exam-stat-card">
          <div className="exam-stat-content">
            <div className="exam-stat-info">
              <h3>Total Exams</h3>
              <p className="exam-stat-value">{totalExams}</p>
            </div>
            <FontAwesomeIcon icon={faClipboard} className="exam-stat-icon blue" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="exam-stat-content">
            <div className="exam-stat-info">
              <h3>Scheduled</h3>
              <p className="exam-stat-value yellow">{scheduledExams}</p>
            </div>
            <FontAwesomeIcon icon={faCalendar} className="exam-stat-icon yellow" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="exam-stat-content">
            <div className="exam-stat-info">
              <h3>Completed</h3>
              <p className="exam-stat-value green">{completedExams}</p>
            </div>
            <FontAwesomeIcon icon={faCheck} className="exam-stat-icon green" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="exam-stat-content">
            <div className="exam-stat-info">
              <h3>In Progress</h3>
              <p className="exam-stat-value blue">{inProgressExams}</p>
            </div>
            <FontAwesomeIcon icon={faClock} className="exam-stat-icon blue" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="exam-search-filters">
        <div className="exam-filters-container">
          <div className="exam-search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="exam-search-icon" />
            <input
              type="text"
              placeholder="Search examinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="exam-search-input"
            />
          </div>
          <div className="exam-filter-controls">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="exam-filter-select"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="exam-filter-select"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="exam-filter-select"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="exam-filter-select"
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
      </div>

      {/* Examinations Grid */}
      <div className="examinations-grid">
        {filteredExaminations.map(exam => (
          <div key={exam.id} className="exam-card">
            <div className="exam-card-content">
              <div className="exam-card-header">
                <div className="exam-basic-info">
                  <h3 className="exam-name">{exam.examName}</h3>
                  <div className="exam-type-subject">
                    <span className={getExamTypeClass(exam.examType)}>
                      {exam.examType}
                    </span>
                    <span className="exam-subject">• {exam.subject}</span>
                  </div>
                </div>
                <span className={getStatusClass(exam.status)}>
                  <FontAwesomeIcon icon={getStatusIcon(exam.status)} />
                  {exam.status.toUpperCase()}
                </span>
              </div>

              <div className="exam-details">
                <div className="exam-detail-row">
                  <FontAwesomeIcon icon={faCalendar} className="exam-detail-icon blue" />
                  <span>{new Date(exam.date).toLocaleDateString()} at {exam.time}</span>
                </div>
                <div className="exam-detail-row">
                  <FontAwesomeIcon icon={faGraduationCap} className="exam-detail-icon green" />
                  <span>Class {exam.class} • {exam.duration}</span>
                </div>
                <div className="exam-detail-row">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="exam-detail-icon red" />
                  <span>{exam.venue}</span>
                </div>
                <div className="exam-detail-row">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="exam-detail-icon purple" />
                  <span>{exam.invigilator}</span>
                </div>
              </div>

              <div className="exam-marks-info">
                <div className="exam-marks-grid">
                  <div className="exam-marks-item">
                    <p className="exam-marks-label">Total Marks</p>
                    <p className="exam-marks-value">{exam.totalMarks}</p>
                  </div>
                  <div className="exam-marks-item">
                    <p className="exam-marks-label">Registered</p>
                    <p className="exam-marks-value" style={{color: '#3b82f6'}}>{exam.studentsRegistered}</p>
                  </div>
                </div>
              </div>

              {exam.status === 'completed' && (
                <div className="exam-results-section">
                  <h4 className="exam-results-title">Performance Statistics</h4>
                  <div className="exam-results-grid">
                    <div className="exam-result-item">
                      <p className="exam-result-label">Average</p>
                      <p className="exam-result-value green">{exam.averageScore}%</p>
                    </div>
                    <div className="exam-result-item">
                      <p className="exam-result-label">Highest</p>
                      <p className="exam-result-value blue">{exam.highestScore}%</p>
                    </div>
                    <div className="exam-result-item">
                      <p className="exam-result-label">Lowest</p>
                      <p className="exam-result-value red">{exam.lowestScore}%</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="exam-card-footer">
                <button
                  onClick={() => handleViewExam(exam)}
                  className="exam-footer-btn primary"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleEditExamModal(exam)}
                  className="exam-action-btn edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="exam-action-btn delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="exam-modal-overlay">
          <div className="exam-modal">
            <div className="exam-modal-header">
              <h2 className="exam-modal-title">Schedule New Exam</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="exam-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="exam-modal-body">
              <div className="exam-form-grid">
                <div className="exam-form-group full-width">
                  <label className="exam-form-label">Exam Name</label>
                  <input
                    type="text"
                    value={newExam.examName}
                    onChange={(e) => setNewExam({...newExam, examName: e.target.value})}
                    className="exam-form-input"
                    placeholder="e.g., Unit Test 1 - Mathematics"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Exam Type</label>
                  <select
                    value={newExam.examType}
                    onChange={(e) => setNewExam({...newExam, examType: e.target.value})}
                    className="exam-form-select"
                  >
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Subject</label>
                  <select
                    value={newExam.subject}
                    onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                    className="exam-form-select"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Class</label>
                  <select
                    value={newExam.class}
                    onChange={(e) => setNewExam({...newExam, class: e.target.value})}
                    className="exam-form-select"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Section</label>
                  <select
                    value={newExam.section}
                    onChange={(e) => setNewExam({...newExam, section: e.target.value})}
                    className="exam-form-select"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Time</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Duration</label>
                  <input
                    type="text"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                    className="exam-form-input"
                    placeholder="e.g., 2 hours"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Total Marks</label>
                  <input
                    type="number"
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: parseInt(e.target.value)})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Passing Marks</label>
                  <input
                    type="number"
                    value={newExam.passingMarks}
                    onChange={(e) => setNewExam({...newExam, passingMarks: parseInt(e.target.value)})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Venue</label>
                  <select
                    value={newExam.venue}
                    onChange={(e) => setNewExam({...newExam, venue: e.target.value})}
                    className="exam-form-select"
                  >
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Invigilator</label>
                  <input
                    type="text"
                    value={newExam.invigilator}
                    onChange={(e) => setNewExam({...newExam, invigilator: e.target.value})}
                    className="exam-form-input"
                    placeholder="Teacher name"
                  />
                </div>
                <div className="exam-form-group full-width">
                  <label className="exam-form-label">Instructions</label>
                  <textarea
                    value={newExam.instructions}
                    onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                    className="exam-form-textarea"
                    placeholder="Special instructions for students"
                  />
                </div>
              </div>
            </div>
            
            <div className="exam-modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="exam-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExam}
                className="exam-modal-btn submit"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Exam Modal */}
      {showViewModal && selectedExam && (
        <div className="exam-modal-overlay">
          <div className="exam-modal">
            <div className="exam-modal-header">
              <h2 className="exam-modal-title">Exam Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="exam-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="exam-modal-body">
              {/* Header Info */}
              <div className="exam-view-header">
                <h3>{selectedExam.examName}</h3>
                <div className="exam-view-badges">
                  <span className="exam-view-badge">
                    {selectedExam.examType}
                  </span>
                  <span className="exam-view-badge">
                    <FontAwesomeIcon icon={getStatusIcon(selectedExam.status)} />
                    {selectedExam.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Exam Information */}
              <div className="exam-info-grid">
                <div className="exam-info-section">
                  <h4 className="exam-section-title">
                    <FontAwesomeIcon icon={faClipboard} className="exam-section-icon blue" />
                    Exam Information
                  </h4>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Subject:</span>
                    <span className="exam-info-value">{selectedExam.subject}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Class:</span>
                    <span className="exam-info-value">{selectedExam.class}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Date & Time:</span>
                    <span className="exam-info-value">{new Date(selectedExam.date).toLocaleDateString()} at {selectedExam.time}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Duration:</span>
                    <span className="exam-info-value">{selectedExam.duration}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Venue:</span>
                    <span className="exam-info-value">{selectedExam.venue}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Invigilator:</span>
                    <span className="exam-info-value">{selectedExam.invigilator}</span>
                  </div>
                </div>

                <div className="exam-info-section">
                  <h4 className="exam-section-title">
                    <FontAwesomeIcon icon={faChartBar} className="exam-section-icon green" />
                    Marking Scheme
                  </h4>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Total Marks:</span>
                    <span className="exam-info-value">{selectedExam.totalMarks}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Passing Marks:</span>
                    <span className="exam-info-value">{selectedExam.passingMarks}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Pass Percentage:</span>
                    <span className="exam-info-value">{((selectedExam.passingMarks / selectedExam.totalMarks) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Registered Students:</span>
                    <span className="exam-info-value" style={{color: '#3b82f6'}}>{selectedExam.studentsRegistered}</span>
                  </div>
                  <div className="exam-info-row">
                    <span className="exam-info-label">Students Appeared:</span>
                    <span className="exam-info-value" style={{color: '#10b981'}}>{selectedExam.studentsAppeared}</span>
                  </div>
                </div>
              </div>

              {/* Performance Statistics */}
              {selectedExam.status === 'completed' && (
                <div className="exam-performance-stats">
                  <h4 className="exam-performance-title">
                    <FontAwesomeIcon icon={faAward} className="exam-section-icon yellow" />
                    Performance Statistics
                  </h4>
                  <div className="exam-performance-grid">
                    <div className="exam-performance-item">
                      <p className="exam-performance-value green">{selectedExam.averageScore}%</p>
                      <p className="exam-performance-label">Average Score</p>
                    </div>
                    <div className="exam-performance-item">
                      <p className="exam-performance-value blue">{selectedExam.highestScore}%</p>
                      <p className="exam-performance-label">Highest Score</p>
                    </div>
                    <div className="exam-performance-item">
                      <p className="exam-performance-value red">{selectedExam.lowestScore}%</p>
                      <p className="exam-performance-label">Lowest Score</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {selectedExam.instructions && (
                <div className="exam-instructions-section">
                  <h4 className="exam-instructions-title">
                    <FontAwesomeIcon icon={faFileAlt} className="exam-section-icon" style={{color: '#8b5cf6'}} />
                    Instructions
                  </h4>
                  <p className="exam-instructions-content">
                    {selectedExam.instructions}
                  </p>
                </div>
              )}
            </div>

            <div className="exam-modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="exam-modal-btn cancel"
                style={{flex: 'none', width: '100%'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditModal && selectedExam && (
        <div className="exam-modal-overlay">
          <div className="exam-modal">
            <div className="exam-modal-header">
              <h2 className="exam-modal-title">Edit Exam</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="exam-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="exam-modal-body">
              <div className="exam-form-grid">
                <div className="exam-form-group full-width">
                  <label className="exam-form-label">Exam Name</label>
                  <input
                    type="text"
                    value={selectedExam.examName}
                    onChange={(e) => setSelectedExam({...selectedExam, examName: e.target.value})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Exam Type</label>
                  <select
                    value={selectedExam.examType}
                    onChange={(e) => setSelectedExam({...selectedExam, examType: e.target.value})}
                    className="exam-form-select"
                  >
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Status</label>
                  <select
                    value={selectedExam.status}
                    onChange={(e) => setSelectedExam({...selectedExam, status: e.target.value})}
                    className="exam-form-select"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Date</label>
                  <input
                    type="date"
                    value={selectedExam.date}
                    onChange={(e) => setSelectedExam({...selectedExam, date: e.target.value})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Time</label>
                  <input
                    type="time"
                    value={selectedExam.time}
                    onChange={(e) => setSelectedExam({...selectedExam, time: e.target.value})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Venue</label>
                  <select
                    value={selectedExam.venue}
                    onChange={(e) => setSelectedExam({...selectedExam, venue: e.target.value})}
                    className="exam-form-select"
                  >
                    {venues.map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>
                <div className="exam-form-group">
                  <label className="exam-form-label">Invigilator</label>
                  <input
                    type="text"
                    value={selectedExam.invigilator}
                    onChange={(e) => setSelectedExam({...selectedExam, invigilator: e.target.value})}
                    className="exam-form-input"
                  />
                </div>
                <div className="exam-form-group full-width">
                  <label className="exam-form-label">Instructions</label>
                  <textarea
                    value={selectedExam.instructions}
                    onChange={(e) => setSelectedExam({...selectedExam, instructions: e.target.value})}
                    className="exam-form-textarea"
                  />
                </div>
              </div>
            </div>
            
            <div className="exam-modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="exam-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleEditExam}
                className="exam-modal-btn submit"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Examinations;