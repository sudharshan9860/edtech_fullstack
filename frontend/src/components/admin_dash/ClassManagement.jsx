// src/components/admin/ClassManagement.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faPlus,
  faEdit,
  faTrash,
  faUsers,
  faChalkboardTeacher,
  faSearch,
  faFilter,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const ClassManagement = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      className: 'Class 10-A',
      grade: '10',
      section: 'A',
      totalStudents: 35,
      classTeacher: 'Mrs. Priya Sharma',
      subjects: ['Math', 'Science', 'English', 'Hindi', 'Social Studies'],
      schedule: 'Morning (8:00 AM - 2:00 PM)',
      status: 'active'
    },
    {
      id: 2,
      className: 'Class 10-B',
      grade: '10',
      section: 'B',
      totalStudents: 32,
      classTeacher: 'Mr. Rajesh Kumar',
      subjects: ['Math', 'Science', 'English', 'Hindi', 'Social Studies'],
      schedule: 'Morning (8:00 AM - 2:00 PM)',
      status: 'active'
    },
    {
      id: 3,
      className: 'Class 9-A',
      grade: '9',
      section: 'A',
      totalStudents: 38,
      classTeacher: 'Ms. Anita Singh',
      subjects: ['Math', 'Science', 'English', 'Hindi', 'Social Studies'],
      schedule: 'Morning (8:00 AM - 2:00 PM)',
      status: 'active'
    },
    {
      id: 4,
      className: 'Class 12-A',
      grade: '12',
      section: 'A',
      totalStudents: 28,
      classTeacher: 'Dr. Vikram Patel',
      subjects: ['Physics', 'Chemistry', 'Math', 'English'],
      schedule: 'Morning (8:00 AM - 2:00 PM)',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === '' || cls.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(cls => cls.id !== classId));
    }
  };

  return (
    <div className="class-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Class Management</h1>
          <p>Organize and manage school classes efficiently</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Class
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
            placeholder="Search classes or teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="filter-select"
          >
            <option value="">All Grades</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {filteredClasses.map(classItem => (
          <div key={classItem.id} className="class-card">
            <div className="class-header">
              <div className="class-info">
                <h3 className="class-name">{classItem.className}</h3>
                <span className={`status-badge ${classItem.status}`}>
                  {classItem.status.toUpperCase()}
                </span>
              </div>
              <div className="class-actions">
                <button className="action-btn edit">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteClass(classItem.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            <div className="class-body">
              <div className="class-stats">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{classItem.totalStudents}</span>
                    <span className="stat-label">Students</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{classItem.subjects.length}</span>
                    <span className="stat-label">Subjects</span>
                  </div>
                </div>
              </div>

              <div className="class-details">
                <div className="detail-row">
                  <strong>Class Teacher:</strong>
                  <span>{classItem.classTeacher}</span>
                </div>
                <div className="detail-row">
                  <strong>Schedule:</strong>
                  <span>{classItem.schedule}</span>
                </div>
                <div className="detail-row">
                  <strong>Subjects:</strong>
                  <div className="subjects-list">
                    {classItem.subjects.map(subject => (
                      <span key={subject} className="subject-tag">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="class-footer">
              <button className="btn btn-sm btn-primary">View Details</button>
              <button className="btn btn-sm btn-outline">Manage Students</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faSchool} />
          </div>
          <div className="summary-content">
            <h4>Total Classes</h4>
            <span className="summary-value">{classes.length}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="summary-content">
            <h4>Total Students</h4>
            <span className="summary-value">
              {classes.reduce((sum, cls) => sum + cls.totalStudents, 0)}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faChalkboardTeacher} />
          </div>
          <div className="summary-content">
            <h4>Active Teachers</h4>
            <span className="summary-value">{new Set(classes.map(cls => cls.classTeacher)).size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;