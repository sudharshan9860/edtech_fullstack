// src/components/admin/AcademicRecords.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faDownload,
  faEye,
  faGraduationCap,
  faAward,
  faTrophy,
  faCalendar,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const AcademicRecords = () => {
  const [academicRecords, setAcademicRecords] = useState([
    {
      id: 1,
      studentName: 'Aarav Sharma',
      rollNo: 'ST001',
      class: '10-A',
      subjects: {
        mathematics: { unitTest1: 88, unitTest2: 92, halfYearly: 85, final: 90, overall: 88.75 },
        science: { unitTest1: 85, unitTest2: 88, halfYearly: 82, final: 87, overall: 85.5 },
        english: { unitTest1: 92, unitTest2: 89, halfYearly: 91, final: 88, overall: 90 },
        hindi: { unitTest1: 78, unitTest2: 82, halfYearly: 80, final: 85, overall: 81.25 },
        socialStudies: { unitTest1: 86, unitTest2: 84, halfYearly: 88, final: 89, overall: 86.75 }
      },
      overallGrade: 'A',
      gpa: 8.6,
      attendance: 92,
      rank: 5
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      rollNo: 'ST002',
      class: '10-A',
      subjects: {
        mathematics: { unitTest1: 95, unitTest2: 98, halfYearly: 94, final: 96, overall: 95.75 },
        science: { unitTest1: 92, unitTest2: 95, halfYearly: 91, final: 94, overall: 93 },
        english: { unitTest1: 96, unitTest2: 94, halfYearly: 95, final: 97, overall: 95.5 },
        hindi: { unitTest1: 88, unitTest2: 90, halfYearly: 89, final: 91, overall: 89.5 },
        socialStudies: { unitTest1: 93, unitTest2: 91, halfYearly: 94, final: 95, overall: 93.25 }
      },
      overallGrade: 'A+',
      gpa: 9.3,
      attendance: 96,
      rank: 1
    },
    {
      id: 3,
      studentName: 'Rohan Kumar',
      rollNo: 'ST003',
      class: '9-A',
      subjects: {
        mathematics: { unitTest1: 75, unitTest2: 78, halfYearly: 72, final: 80, overall: 76.25 },
        science: { unitTest1: 82, unitTest2: 80, halfYearly: 85, final: 83, overall: 82.5 },
        english: { unitTest1: 88, unitTest2: 85, halfYearly: 87, final: 86, overall: 86.5 },
        hindi: { unitTest1: 90, unitTest2: 88, halfYearly: 92, final: 89, overall: 89.75 },
        socialStudies: { unitTest1: 78, unitTest2: 82, halfYearly: 80, final: 84, overall: 81 }
      },
      overallGrade: 'B+',
      gpa: 7.8,
      attendance: 88,
      rank: 12
    }
  ]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredRecords = academicRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || record.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'grade-a-plus';
      case 'A': return 'grade-a';
      case 'B+': return 'grade-b-plus';
      case 'B': return 'grade-b';
      case 'C+': return 'grade-c-plus';
      default: return 'grade-default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  const calculateClassAverage = (subject) => {
    const scores = filteredRecords.map(record => record.subjects[subject]?.overall || 0);
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  };

  const subjects = ['mathematics', 'science', 'english', 'hindi', 'socialStudies'];
  const subjectNames = {
    mathematics: 'Mathematics',
    science: 'Science',
    english: 'English',
    hindi: 'Hindi',
    socialStudies: 'Social Studies'
  };

  return (
    <div className="academic-records">
      <div className="page-header">
        <div className="header-content">
          <h1>Academic Records</h1>
          <p>Track student performance and academic progress</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} />
            Add Record
          </button>
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faDownload} />
            Export Records
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
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
          >
            <option value="">All Classes</option>
            <option value="9-A">Class 9-A</option>
            <option value="10-A">Class 10-A</option>
            <option value="11-A">Class 11-A</option>
            <option value="12-A">Class 12-A</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subjectNames[subject]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Academic Records Table */}
      <div className="academic-table-container">
        <table className="academic-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Class</th>
              <th>Mathematics</th>
              <th>Science</th>
              <th>English</th>
              <th>Overall Grade</th>
              <th>GPA</th>
              <th>Rank</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              <tr key={record.id}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">
                      {record.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-details">
                      <div className="student-name">{record.studentName}</div>
                    </div>
                  </div>
                </td>
                <td className="roll-no">{record.rollNo}</td>
                <td className="class-name">{record.class}</td>
                <td>
                  <span className={`score-badge ${getScoreColor(record.subjects.mathematics.overall)}`}>
                    {record.subjects.mathematics.overall}%
                  </span>
                </td>
                <td>
                  <span className={`score-badge ${getScoreColor(record.subjects.science.overall)}`}>
                    {record.subjects.science.overall}%
                  </span>
                </td>
                <td>
                  <span className={`score-badge ${getScoreColor(record.subjects.english.overall)}`}>
                    {record.subjects.english.overall}%
                  </span>
                </td>
                <td>
                  <span className={`grade-badge ${getGradeColor(record.overallGrade)}`}>
                    {record.overallGrade}
                  </span>
                </td>
                <td className="gpa-score">{record.gpa}</td>
                <td className="rank">
                  <FontAwesomeIcon icon={faTrophy} className="rank-icon" />
                  #{record.rank}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewDetails(record)}
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="action-btn edit" title="Edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subject Performance Overview */}
      <div className="subject-performance-grid">
        <h3>Subject Performance Overview</h3>
        <div className="subject-cards">
          {subjects.map(subject => (
            <div key={subject} className="subject-card">
              <div className="subject-header">
                <h4>{subjectNames[subject]}</h4>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className="subject-stats">
                <div className="stat-item">
                  <span className="stat-label">Class Average</span>
                  <span className={`stat-value ${getScoreColor(calculateClassAverage(subject))}`}>
                    {calculateClassAverage(subject)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Top Score</span>
                  <span className="stat-value excellent">
                    {Math.max(...filteredRecords.map(r => r.subjects[subject]?.overall || 0))}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Students</span>
                  <span className="stat-value">
                    {filteredRecords.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="summary-content">
            <h4>Total Students</h4>
            <span className="summary-value">{academicRecords.length}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faAward} />
          </div>
          <div className="summary-content">
            <h4>A+ Students</h4>
            <span className="summary-value">
              {academicRecords.filter(r => r.overallGrade === 'A+').length}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <div className="summary-content">
            <h4>Top Performers</h4>
            <span className="summary-value">
              {academicRecords.filter(r => r.gpa >= 9.0).length}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="summary-content">
            <h4>Avg GPA</h4>
            <span className="summary-value">
              {(academicRecords.reduce((sum, r) => sum + r.gpa, 0) / academicRecords.length).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Student Academic Details Modal */}
      {showDetails && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Academic Details - {selectedRecord.studentName}</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="academic-detail-grid">
                <div className="detail-section">
                  <h3>Overall Performance</h3>
                  <div className="detail-item">
                    <label>Overall Grade:</label>
                    <span className={`grade-badge ${getGradeColor(selectedRecord.overallGrade)}`}>
                      {selectedRecord.overallGrade}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>GPA:</label>
                    <span className="gpa-display">{selectedRecord.gpa}</span>
                  </div>
                  <div className="detail-item">
                    <label>Class Rank:</label>
                    <span className="rank-display">#{selectedRecord.rank}</span>
                  </div>
                  <div className="detail-item">
                    <label>Attendance:</label>
                    <span className="attendance-display">{selectedRecord.attendance}%</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Subject-wise Performance</h3>
                  {Object.entries(selectedRecord.subjects).map(([subject, scores]) => (
                    <div key={subject} className="subject-detail">
                      <h4>{subjectNames[subject]}</h4>
                      <div className="score-breakdown">
                        <div className="score-item">
                          <span>Unit Test 1:</span>
                          <span>{scores.unitTest1}%</span>
                        </div>
                        <div className="score-item">
                          <span>Unit Test 2:</span>
                          <span>{scores.unitTest2}%</span>
                        </div>
                        <div className="score-item">
                          <span>Half Yearly:</span>
                          <span>{scores.halfYearly}%</span>
                        </div>
                        <div className="score-item">
                          <span>Final:</span>
                          <span>{scores.final}%</span>
                        </div>
                        <div className="score-item overall">
                          <span>Overall:</span>
                          <span className={`score-badge ${getScoreColor(scores.overall)}`}>
                            {scores.overall}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicRecords;