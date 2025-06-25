// src/components/admin/StudentManagement.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faDownload,
  faEye,
  faUserGraduate,
  faChartLine,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      rollNo: 'ST001',
      class: '10-A',
      email: 'aarav.sharma@email.com',
      phone: '+91 9876543210',
      dateOfBirth: '2008-05-15',
      address: '123 Main Street, Delhi',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91 9876543211',
      admissionDate: '2023-04-10',
      status: 'active',
      overallGrade: 'A',
      attendance: 92,
      performanceScore: 88.5
    },
    {
      id: 2,
      name: 'Priya Patel',
      rollNo: 'ST002',
      class: '10-A',
      email: 'priya.patel@email.com',
      phone: '+91 9876543212',
      dateOfBirth: '2008-08-22',
      address: '456 Park Avenue, Mumbai',
      parentName: 'Vikram Patel',
      parentPhone: '+91 9876543213',
      admissionDate: '2023-04-12',
      status: 'active',
      overallGrade: 'A+',
      attendance: 96,
      performanceScore: 94.2
    },
    {
      id: 3,
      name: 'Rohan Kumar',
      rollNo: 'ST003',
      class: '9-A',
      email: 'rohan.kumar@email.com',
      phone: '+91 9876543214',
      dateOfBirth: '2009-03-10',
      address: '789 Garden Road, Bangalore',
      parentName: 'Amit Kumar',
      parentPhone: '+91 9876543215',
      admissionDate: '2023-04-15',
      status: 'active',
      overallGrade: 'B+',
      attendance: 88,
      performanceScore: 82.7
    },
    {
      id: 4,
      name: 'Ananya Singh',
      rollNo: 'ST004',
      class: '12-A',
      email: 'ananya.singh@email.com',
      phone: '+91 9876543216',
      dateOfBirth: '2006-11-28',
      address: '321 Hill View, Chennai',
      parentName: 'Suresh Singh',
      parentPhone: '+91 9876543217',
      admissionDate: '2021-04-08',
      status: 'active',
      overallGrade: 'A',
      attendance: 94,
      performanceScore: 91.3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || student.class === filterClass;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'grade-a-plus';
      case 'A': return 'grade-a';
      case 'B+': return 'grade-b-plus';
      case 'B': return 'grade-b';
      default: return 'grade-default';
    }
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'excellent';
    if (attendance >= 85) return 'good';
    if (attendance >= 75) return 'average';
    return 'poor';
  };

  return (
    <div className="student-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Student Management</h1>
          <p>Manage student records and academic information</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} />
            Add New Student
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
            placeholder="Search students..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Class</th>
              <th>Performance</th>
              <th>Attendance</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-details">
                      <div className="student-name">{student.name}</div>
                      <div className="student-email">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="roll-no">{student.rollNo}</td>
                <td className="class-name">{student.class}</td>
                <td>
                  <div className="performance-score">
                    <FontAwesomeIcon icon={faChartLine} />
                    {student.performanceScore}%
                  </div>
                </td>
                <td>
                  <span className={`attendance-badge ${getAttendanceColor(student.attendance)}`}>
                    {student.attendance}%
                  </span>
                </td>
                <td>
                  <span className={`grade-badge ${getGradeColor(student.overallGrade)}`}>
                    {student.overallGrade}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${student.status}`}>
                    {student.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewDetails(student)}
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="action-btn edit" title="Edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteStudent(student.id)}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="summary-content">
            <h4>Total Students</h4>
            <span className="summary-value">{students.length}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faUserGraduate} />
          </div>
          <div className="summary-content">
            <h4>Active Students</h4>
            <span className="summary-value">
              {students.filter(s => s.status === 'active').length}
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
              {students.filter(s => s.overallGrade === 'A+').length}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="summary-content">
            <h4>Avg Performance</h4>
            <span className="summary-value">
              {(students.reduce((sum, s) => sum + s.performanceScore, 0) / students.length).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {showDetails && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-detail-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Roll No:</label>
                    <span>{selectedStudent.rollNo}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date of Birth:</label>
                    <span>{selectedStudent.dateOfBirth}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address:</label>
                    <span>{selectedStudent.address}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Academic Information</h3>
                  <div className="detail-item">
                    <label>Class:</label>
                    <span>{selectedStudent.class}</span>
                  </div>
                  <div className="detail-item">
                    <label>Overall Grade:</label>
                    <span className={`grade-badge ${getGradeColor(selectedStudent.overallGrade)}`}>
                      {selectedStudent.overallGrade}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Performance Score:</label>
                    <span>{selectedStudent.performanceScore}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Attendance:</label>
                    <span className={`attendance-badge ${getAttendanceColor(selectedStudent.attendance)}`}>
                      {selectedStudent.attendance}%
                    </span>
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

export default StudentManagement;