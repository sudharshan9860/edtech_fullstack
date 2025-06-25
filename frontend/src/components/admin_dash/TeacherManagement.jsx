// src/components/admin/TeacherManagement.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faDownload,
  faEye,
  faUsers,
  faBook,
  faCalendar,
  faStar,
  faAward
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      employeeId: 'T001',
      email: 'priya.sharma@school.edu',
      phone: '+91 9876543210',
      department: 'Mathematics',
      subjects: ['Mathematics', 'Statistics'],
      classes: ['10-A', '11-A', '12-A'],
      qualification: 'Ph.D in Mathematics',
      experience: 12,
      joiningDate: '2012-06-15',
      status: 'active',
      performance: 94.5,
      classesAssigned: 3,
      studentsUnder: 85
    },
    {
      id: 2,
      name: 'Mr. Rajesh Kumar',
      employeeId: 'T002',
      email: 'rajesh.kumar@school.edu',
      phone: '+91 9876543211',
      department: 'Science',
      subjects: ['Physics', 'Chemistry'],
      classes: ['9-B', '10-B', '11-B'],
      qualification: 'M.Sc Physics, B.Ed',
      experience: 8,
      joiningDate: '2016-04-10',
      status: 'active',
      performance: 91.2,
      classesAssigned: 3,
      studentsUnder: 78
    },
    {
      id: 3,
      name: 'Ms. Anita Singh',
      employeeId: 'T003',
      email: 'anita.singh@school.edu',
      phone: '+91 9876543212',
      department: 'English',
      subjects: ['English Literature', 'English Grammar'],
      classes: ['8-A', '9-A', '10-A'],
      qualification: 'M.A English, B.Ed',
      experience: 6,
      joiningDate: '2018-07-22',
      status: 'active',
      performance: 88.7,
      classesAssigned: 3,
      studentsUnder: 92
    },
    {
      id: 4,
      name: 'Dr. Vikram Patel',
      employeeId: 'T004',
      email: 'vikram.patel@school.edu',
      phone: '+91 9876543213',
      department: 'Science',
      subjects: ['Biology', 'Environmental Science'],
      classes: ['11-A', '12-A'],
      qualification: 'Ph.D Biology',
      experience: 15,
      joiningDate: '2009-03-01',
      status: 'active',
      performance: 96.8,
      classesAssigned: 2,
      studentsUnder: 65
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '' || teacher.department === filterDepartment;
    const matchesStatus = filterStatus === '' || teacher.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    }
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetails(true);
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 95) return 'excellent';
    if (performance >= 85) return 'good';
    if (performance >= 75) return 'average';
    return 'poor';
  };

  const getExperienceLevel = (years) => {
    if (years >= 10) return 'Senior';
    if (years >= 5) return 'Experienced';
    return 'Junior';
  };

  return (
    <div className="teacher-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Teacher Management</h1>
          <p>Manage teacher assignments and performance</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} />
            Add New Teacher
          </button>
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faDownload} />
            Export Data
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Social Studies">Social Studies</option>
            <option value="Hindi">Hindi</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="teachers-grid">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-header">
              <div className="teacher-avatar">
                {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="teacher-basic-info">
                <h3 className="teacher-name">{teacher.name}</h3>
                <p className="teacher-id">ID: {teacher.employeeId}</p>
                <p className="teacher-department">{teacher.department}</p>
              </div>
              <div className="teacher-status">
                <span className={`status-badge ${teacher.status}`}>
                  {teacher.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="teacher-body">
              <div className="teacher-stats">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{teacher.studentsUnder}</span>
                    <span className="stat-label">Students</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faBook} className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{teacher.subjects.length}</span>
                    <span className="stat-label">Subjects</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faCalendar} className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{teacher.experience}y</span>
                    <span className="stat-label">Experience</span>
                  </div>
                </div>
              </div>

              <div className="teacher-details">
                <div className="detail-row">
                  <strong>Classes:</strong>
                  <div className="classes-list">
                    {teacher.classes.map(cls => (
                      <span key={cls} className="class-tag">{cls}</span>
                    ))}
                  </div>
                </div>
                <div className="detail-row">
                  <strong>Subjects:</strong>
                  <div className="subjects-list">
                    {teacher.subjects.map(subject => (
                      <span key={subject} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                </div>
                <div className="detail-row">
                  <strong>Performance:</strong>
                  <span className={`performance-badge ${getPerformanceColor(teacher.performance)}`}>
                    {teacher.performance}%
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Level:</strong>
                  <span className="experience-level">
                    {getExperienceLevel(teacher.experience)}
                  </span>
                </div>
              </div>
            </div>

            <div className="teacher-footer">
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleViewDetails(teacher)}
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
                onClick={() => handleDeleteTeacher(teacher.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faChalkboardTeacher} />
          </div>
          <div className="summary-content">
            <h4>Total Teachers</h4>
            <span className="summary-value">{teachers.length}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="summary-content">
            <h4>Active Teachers</h4>
            <span className="summary-value">
              {teachers.filter(t => t.status === 'active').length}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="summary-content">
            <h4>Top Performers</h4>
            <span className="summary-value">
              {teachers.filter(t => t.performance >= 95).length}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faAward} />
          </div>
          <div className="summary-content">
            <h4>Avg Performance</h4>
            <span className="summary-value">
              {(teachers.reduce((sum, t) => sum + t.performance, 0) / teachers.length).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Teacher Details Modal */}
      {showDetails && selectedTeacher && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Teacher Details - {selectedTeacher.name}</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="teacher-detail-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedTeacher.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Employee ID:</label>
                    <span>{selectedTeacher.employeeId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedTeacher.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedTeacher.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Joining Date:</label>
                    <span>{selectedTeacher.joiningDate}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Professional Information</h3>
                  <div className="detail-item">
                    <label>Department:</label>
                    <span>{selectedTeacher.department}</span>
                  </div>
                  <div className="detail-item">
                    <label>Qualification:</label>
                    <span>{selectedTeacher.qualification}</span>
                  </div>
                  <div className="detail-item">
                    <label>Experience:</label>
                    <span>{selectedTeacher.experience} years</span>
                  </div>
                  <div className="detail-item">
                    <label>Performance:</label>
                    <span className={`performance-badge ${getPerformanceColor(selectedTeacher.performance)}`}>
                      {selectedTeacher.performance}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Students Under:</label>
                    <span>{selectedTeacher.studentsUnder}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;