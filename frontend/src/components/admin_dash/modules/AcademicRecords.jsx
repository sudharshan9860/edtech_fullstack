import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/AcademicRecords.css'; 

import {
  faClipboardList,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faUpload,
  faEye,
  faTrophy,
  faChartLine,
  faTimes,
  faUser,
  faGraduationCap,
  faPercentage,
  faCalendarAlt,
  faAward,
  faStar
} from '@fortawesome/free-solid-svg-icons';

const AcademicRecords = () => {
  const [academicRecords, setAcademicRecords] = useState([
    {
      id: 1,
      studentName: 'Aarav Sharma',
      rollNo: 'ST001',
      class: '10-A',
      section: 'A',
      grade: '10',
      subjects: {
        mathematics: { unitTest1: 85, unitTest2: 88, halfYearly: 86, final: 90, overall: 87.5 },
        science: { unitTest1: 82, unitTest2: 85, halfYearly: 84, final: 86, overall: 84.25 },
        english: { unitTest1: 90, unitTest2: 88, halfYearly: 89, final: 91, overall: 89.5 },
        hindi: { unitTest1: 78, unitTest2: 82, halfYearly: 80, final: 85, overall: 81.25 },
        socialStudies: { unitTest1: 88, unitTest2: 86, halfYearly: 87, final: 89, overall: 87.5 }
      },
      overallGrade: 'A',
      gpa: 8.6,
      attendance: 92,
      rank: 5,
      academicYear: '2024-25'
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      rollNo: 'ST002',
      class: '10-A',
      section: 'A',
      grade: '10',
      subjects: {
        mathematics: { unitTest1: 92, unitTest2: 94, halfYearly: 93, final: 95, overall: 93.5 },
        science: { unitTest1: 90, unitTest2: 92, halfYearly: 91, final: 94, overall: 91.75 },
        english: { unitTest1: 95, unitTest2: 93, halfYearly: 94, final: 96, overall: 94.5 },
        hindi: { unitTest1: 88, unitTest2: 90, halfYearly: 89, final: 92, overall: 89.75 },
        socialStudies: { unitTest1: 91, unitTest2: 89, halfYearly: 90, final: 93, overall: 90.75 }
      },
      overallGrade: 'A+',
      gpa: 9.3,
      attendance: 96,
      rank: 1,
      academicYear: '2024-25'
    },
    {
      id: 3,
      studentName: 'Rohan Kumar',
      rollNo: 'ST003',
      class: '9-A',
      section: 'A',
      grade: '9',
      subjects: {
        mathematics: { unitTest1: 75, unitTest2: 78, halfYearly: 76, final: 80, overall: 77.25 },
        science: { unitTest1: 80, unitTest2: 82, halfYearly: 81, final: 84, overall: 81.75 },
        english: { unitTest1: 85, unitTest2: 83, halfYearly: 84, final: 87, overall: 84.75 },
        hindi: { unitTest1: 82, unitTest2: 84, halfYearly: 83, final: 86, overall: 83.75 },
        socialStudies: { unitTest1: 78, unitTest2: 80, halfYearly: 79, final: 82, overall: 79.75 }
      },
      overallGrade: 'B+',
      gpa: 7.8,
      attendance: 88,
      rank: 12,
      academicYear: '2024-25'
    },
    {
      id: 4,
      studentName: 'Ananya Singh',
      rollNo: 'ST004',
      class: '12-A',
      section: 'A',
      grade: '12',
      subjects: {
        physics: { unitTest1: 88, unitTest2: 90, halfYearly: 89, final: 92, overall: 89.75 },
        chemistry: { unitTest1: 85, unitTest2: 87, halfYearly: 86, final: 89, overall: 86.75 },
        mathematics: { unitTest1: 93, unitTest2: 91, halfYearly: 92, final: 95, overall: 92.75 },
        english: { unitTest1: 90, unitTest2: 88, halfYearly: 89, final: 91, overall: 89.5 }
      },
      overallGrade: 'A',
      gpa: 8.9,
      attendance: 94,
      rank: 3,
      academicYear: '2024-25'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

  const [newRecord, setNewRecord] = useState({
    studentName: '',
    rollNo: '',
    class: '',
    section: '',
    grade: '',
    subjects: {},
    academicYear: '2024-25'
  });

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const grades = ['9', '10', '11', '12'];
  const allSubjects = ['mathematics', 'science', 'english', 'hindi', 'socialStudies', 'physics', 'chemistry', 'biology'];
  const subjectNames = {
    mathematics: 'Mathematics',
    science: 'Science',
    english: 'English',
    hindi: 'Hindi',
    socialStudies: 'Social Studies',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology'
  };

  const filteredRecords = academicRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || record.class === filterClass;
    const matchesSection = filterSection === '' || record.section === filterSection;
    const matchesSubject = filterSubject === '' || record.subjects[filterSubject];
    return matchesSearch && matchesClass && matchesSection && matchesSubject;
  });

  const handleAddRecord = () => {
    if (newRecord.studentName && newRecord.rollNo && newRecord.class) {
      const newId = Math.max(...academicRecords.map(r => r.id)) + 1;
      const calculatedGPA = calculateGPA(newRecord.subjects);
      const overallGrade = getGradeFromGPA(calculatedGPA);
      
      setAcademicRecords([...academicRecords, { 
        ...newRecord, 
        id: newId,
        gpa: calculatedGPA,
        overallGrade: overallGrade,
        attendance: 90,
        rank: academicRecords.length + 1
      }]);
      setNewRecord({
        studentName: '',
        rollNo: '',
        class: '',
        section: '',
        grade: '',
        subjects: {},
        academicYear: '2024-25'
      });
      setShowAddModal(false);
    }
  };

  const handleEditRecord = () => {
    if (selectedRecord) {
      const calculatedGPA = calculateGPA(selectedRecord.subjects);
      const overallGrade = getGradeFromGPA(calculatedGPA);
      
      setAcademicRecords(academicRecords.map(record => 
        record.id === selectedRecord.id ? {
          ...selectedRecord,
          gpa: calculatedGPA,
          overallGrade: overallGrade
        } : record
      ));
      setShowEditModal(false);
      setSelectedRecord(null);
    }
  };

  const handleDeleteRecord = (recordId) => {
    if (window.confirm('Are you sure you want to delete this academic record?')) {
      setAcademicRecords(academicRecords.filter(record => record.id !== recordId));
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleEditRecordModal = (record) => {
    setSelectedRecord({...record});
    setShowEditModal(true);
  };

  const handleBulkUpload = () => {
    if (bulkFile) {
      console.log('Processing bulk upload:', bulkFile.name);
      alert('Bulk upload functionality would process the CSV file and send data to backend');
      setBulkFile(null);
      setShowBulkModal(false);
    }
  };

  const calculateGPA = (subjects) => {
    const subjectGPAs = Object.values(subjects).map(subject => 
      subject.overall ? (subject.overall / 10) : 0
    );
    return subjectGPAs.length > 0 
      ? (subjectGPAs.reduce((sum, gpa) => sum + gpa, 0) / subjectGPAs.length).toFixed(1)
      : 0;
  };

  const getGradeFromGPA = (gpa) => {
    if (gpa >= 9.0) return 'A+';
    if (gpa >= 8.0) return 'A';
    if (gpa >= 7.0) return 'B+';
    if (gpa >= 6.0) return 'B';
    if (gpa >= 5.0) return 'C+';
    return 'C';
  };

  const getGradeClass = (grade) => {
    const gradeKey = grade.toLowerCase().replace('+', '-plus').replace('-', '-minus');
    return `academic-grade-badge ${gradeKey}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'academic-rank gold';
    if (rank <= 3) return 'academic-rank silver';
    if (rank <= 10) return 'academic-rank bronze';
    return 'academic-rank default';
  };

  const getAttendanceClass = (attendance) => {
    if (attendance >= 95) return 'academic-attendance excellent';
    if (attendance >= 85) return 'academic-attendance good';
    if (attendance >= 75) return 'academic-attendance average';
    return 'academic-attendance poor';
  };

  const updateSubjectScore = (subject, test, value, isNewRecord = true) => {
    const record = isNewRecord ? newRecord : selectedRecord;
    const updatedSubjects = {
      ...record.subjects,
      [subject]: {
        ...record.subjects[subject],
        [test]: parseFloat(value) || 0
      }
    };
    
    // Calculate overall for this subject
    const subjectScores = updatedSubjects[subject];
    const overall = ((subjectScores.unitTest1 || 0) + (subjectScores.unitTest2 || 0) + 
                    (subjectScores.halfYearly || 0) + (subjectScores.final || 0)) / 4;
    updatedSubjects[subject].overall = parseFloat(overall.toFixed(2));

    if (isNewRecord) {
      setNewRecord({ ...record, subjects: updatedSubjects });
    } else {
      setSelectedRecord({ ...record, subjects: updatedSubjects });
    }
  };

  return (
    <div className="academic-records">
      {/* Header */}
      <div className="academic-header">
        <div className="academic-header-content">
          <div className="academic-title-section">
            <h1>Academic Records</h1>
            <p>Track student performance and academic progress</p>
          </div>
          <div className="academic-actions">
            <button
              onClick={() => setShowBulkModal(true)}
              className="academic-btn success"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Records</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="academic-btn primary"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="academic-search-filters">
        <div className="academic-filters-container">
          <div className="academic-search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="academic-search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="academic-search-input"
            />
          </div>
          <div className="academic-filter-controls">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="academic-filter-select"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="academic-filter-select"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="academic-filter-select"
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subjectNames[subject]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Academic Records Table */}
      <div className="academic-table-container">
        <div className="academic-table-wrapper">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Overall Grade</th>
                <th>GPA</th>
                <th>Rank</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {record.studentName.charAt(0)}
                      </div>
                      <div className="student-details">
                        <div className="student-name">{record.studentName}</div>
                        <div className="student-roll-number">{record.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="academic-class">{record.class}</span>
                  </td>
                  <td>
                    <span className={getGradeClass(record.overallGrade)}>
                      {record.overallGrade}
                    </span>
                  </td>
                  <td>
                    <div className="academic-gpa">
                      <FontAwesomeIcon icon={faChartLine} className="academic-gpa-icon" />
                      <span>{record.gpa}</span>
                    </div>
                  </td>
                  <td>
                    <div className={getRankClass(record.rank)}>
                      <FontAwesomeIcon 
                        icon={record.rank === 1 ? faTrophy : faAward} 
                        className="academic-rank-icon" 
                      />
                      <span>#{record.rank}</span>
                    </div>
                  </td>
                  <td>
                    <span className={getAttendanceClass(record.attendance)}>
                      {record.attendance}%
                    </span>
                  </td>
                  <td className="academic-actions-cell">
                    <div className="academic-action-buttons">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="academic-action-btn view"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleEditRecordModal(record)}
                        className="academic-action-btn edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="academic-action-btn delete"
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
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="academic-modal-overlay">
          <div className="academic-modal">
            <div className="academic-modal-header">
              <h2 className="academic-modal-title">Add Academic Record</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="academic-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="academic-modal-body">
              <div className="academic-form-grid">
                <div className="academic-form-group">
                  <label className="academic-form-label">Student Name</label>
                  <input
                    type="text"
                    value={newRecord.studentName}
                    onChange={(e) => setNewRecord({...newRecord, studentName: e.target.value})}
                    className="academic-form-input"
                    placeholder="Student name"
                  />
                </div>
                <div className="academic-form-group">
                  <label className="academic-form-label">Roll Number</label>
                  <input
                    type="text"
                    value={newRecord.rollNo}
                    onChange={(e) => setNewRecord({...newRecord, rollNo: e.target.value})}
                    className="academic-form-input"
                    placeholder="e.g., ST001"
                  />
                </div>
                <div className="academic-form-group">
                  <label className="academic-form-label">Class</label>
                  <select
                    value={newRecord.class}
                    onChange={(e) => setNewRecord({...newRecord, class: e.target.value})}
                    className="academic-form-select"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="subjects-section">
                <h3>Subject Scores</h3>
                <div className="subjects-list">
                  {['mathematics', 'science', 'english', 'hindi', 'socialStudies'].map(subject => (
                    <div key={subject} className="subject-card">
                      <h4 className="subject-header">{subjectNames[subject]}</h4>
                      <div className="subject-scores-grid">
                        <div className="score-input-group">
                          <label className="score-label">Unit Test 1</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newRecord.subjects[subject]?.unitTest1 || ''}
                            onChange={(e) => updateSubjectScore(subject, 'unitTest1', e.target.value, true)}
                            className="score-input"
                            placeholder="0-100"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Unit Test 2</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newRecord.subjects[subject]?.unitTest2 || ''}
                            onChange={(e) => updateSubjectScore(subject, 'unitTest2', e.target.value, true)}
                            className="score-input"
                            placeholder="0-100"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Half Yearly</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newRecord.subjects[subject]?.halfYearly || ''}
                            onChange={(e) => updateSubjectScore(subject, 'halfYearly', e.target.value, true)}
                            className="score-input"
                            placeholder="0-100"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Final</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newRecord.subjects[subject]?.final || ''}
                            onChange={(e) => updateSubjectScore(subject, 'final', e.target.value, true)}
                            className="score-input"
                            placeholder="0-100"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Overall</label>
                          <div className="score-display">
                            {newRecord.subjects[subject]?.overall?.toFixed(1) || '0.0'}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="academic-modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="academic-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                className="academic-modal-btn submit"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="academic-modal-overlay">
          <div className="academic-modal medium">
            <div className="academic-modal-header">
              <h2 className="academic-modal-title">Bulk Add Records</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="academic-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="academic-modal-body">
              <div className="academic-form-group">
                <label className="academic-form-label">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="academic-form-input"
                />
                <p className="bulk-upload-description">
                  Upload a CSV file with student academic records including all subject scores
                </p>
              </div>
            </div>
            <div className="academic-modal-footer">
              <button
                onClick={() => setShowBulkModal(false)}
                className="academic-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile}
                className="academic-modal-btn submit"
                style={{opacity: bulkFile ? 1 : 0.5}}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {showViewModal && selectedRecord && (
        <div className="academic-modal-overlay">
          <div className="academic-modal">
            <div className="academic-modal-header">
              <h2 className="academic-modal-title">Academic Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="academic-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="academic-modal-body">
              <div className="academic-profile-header">
                <div className="academic-profile-content">
                  <div className="academic-profile-avatar">
                    {selectedRecord.studentName.charAt(0)}
                  </div>
                  <div className="academic-profile-info">
                    <h3>{selectedRecord.studentName}</h3>
                    <p className="academic-profile-meta">{selectedRecord.rollNo} • {selectedRecord.class}</p>
                    <div className="academic-profile-badges">
                      <span className="academic-profile-badge">
                        Grade: {selectedRecord.overallGrade}
                      </span>
                      <span className="academic-profile-badge">
                        GPA: {selectedRecord.gpa}
                      </span>
                      <span className="academic-profile-badge">
                        Rank: #{selectedRecord.rank}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="academic-info-grid">
                {/* Overall Performance */}
                <div className="academic-info-section">
                  <h4 className="academic-section-title">
                    <FontAwesomeIcon icon={faChartLine} className="academic-section-icon blue" />
                    Overall Performance
                  </h4>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Overall Grade:</span>
                    <span className="academic-info-value blue">{selectedRecord.overallGrade}</span>
                  </div>
                  <div className="academic-info-row">
                    <span className="academic-info-label">GPA:</span>
                    <span className="academic-info-value blue">{selectedRecord.gpa}</span>
                  </div>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Class Rank:</span>
                    <span className="academic-info-value yellow">#{selectedRecord.rank}</span>
                  </div>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Attendance:</span>
                    <span className="academic-info-value green">{selectedRecord.attendance}%</span>
                  </div>
                </div>

                {/* Academic Year */}
                <div className="academic-info-section">
                  <h4 className="academic-section-title">
                    <FontAwesomeIcon icon={faCalendarAlt} className="academic-section-icon green" />
                    Academic Information
                  </h4>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Academic Year:</span>
                    <span className="academic-info-value">{selectedRecord.academicYear}</span>
                  </div>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Class:</span>
                    <span className="academic-info-value">{selectedRecord.class}</span>
                  </div>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Section:</span>
                    <span className="academic-info-value">{selectedRecord.section}</span>
                  </div>
                  <div className="academic-info-row">
                    <span className="academic-info-label">Grade:</span>
                    <span className="academic-info-value">{selectedRecord.grade}</span>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance */}
              <div className="subject-performance-section">
                <h4>
                  <FontAwesomeIcon icon={faGraduationCap} className="academic-section-icon purple" />
                  Subject-wise Performance
                </h4>
                <div className="subject-performance-list">
                  {Object.entries(selectedRecord.subjects).map(([subject, scores]) => (
                    <div key={subject} className="subject-performance-card">
                      <div className="subject-performance-header">
                        <h5 className="subject-name">{subjectNames[subject]}</h5>
                        <span className="subject-overall-score">{scores.overall}%</span>
                      </div>
                      <div className="subject-scores-breakdown">
                        <div className="score-breakdown-item">
                          <p className="score-breakdown-label">Unit Test 1</p>
                          <p className="score-breakdown-value">{scores.unitTest1}%</p>
                        </div>
                        <div className="score-breakdown-item">
                          <p className="score-breakdown-label">Unit Test 2</p>
                          <p className="score-breakdown-value">{scores.unitTest2}%</p>
                        </div>
                        <div className="score-breakdown-item">
                          <p className="score-breakdown-label">Half Yearly</p>
                          <p className="score-breakdown-value">{scores.halfYearly}%</p>
                        </div>
                        <div className="score-breakdown-item">
                          <p className="score-breakdown-label">Final</p>
                          <p className="score-breakdown-value">{scores.final}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="academic-modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="academic-modal-btn cancel"
                style={{flex: 'none', width: '100%'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && selectedRecord && (
        <div className="academic-modal-overlay">
          <div className="academic-modal">
            <div className="academic-modal-header">
              <h2 className="academic-modal-title">Edit Academic Record</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="academic-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="academic-modal-body">
              <div className="academic-form-grid">
                <div className="academic-form-group">
                  <label className="academic-form-label">Student Name</label>
                  <input
                    type="text"
                    value={selectedRecord.studentName}
                    onChange={(e) => setSelectedRecord({...selectedRecord, studentName: e.target.value})}
                    className="academic-form-input"
                  />
                </div>
                <div className="academic-form-group">
                  <label className="academic-form-label">Roll Number</label>
                  <input
                    type="text"
                    value={selectedRecord.rollNo}
                    onChange={(e) => setSelectedRecord({...selectedRecord, rollNo: e.target.value})}
                    className="academic-form-input"
                  />
                </div>
                <div className="academic-form-group">
                  <label className="academic-form-label">Class</label>
                  <select
                    value={selectedRecord.class}
                    onChange={(e) => setSelectedRecord({...selectedRecord, class: e.target.value})}
                    className="academic-form-select"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="subjects-section">
                <h3>Subject Scores</h3>
                <div className="subjects-list">
                  {Object.entries(selectedRecord.subjects).map(([subject, scores]) => (
                    <div key={subject} className="subject-card">
                      <h4 className="subject-header">{subjectNames[subject]}</h4>
                      <div className="subject-scores-grid">
                        <div className="score-input-group">
                          <label className="score-label">Unit Test 1</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores.unitTest1}
                            onChange={(e) => updateSubjectScore(subject, 'unitTest1', e.target.value, false)}
                            className="score-input"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Unit Test 2</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores.unitTest2}
                            onChange={(e) => updateSubjectScore(subject, 'unitTest2', e.target.value, false)}
                            className="score-input"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Half Yearly</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores.halfYearly}
                            onChange={(e) => updateSubjectScore(subject, 'halfYearly', e.target.value, false)}
                            className="score-input"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Final</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores.final}
                            onChange={(e) => updateSubjectScore(subject, 'final', e.target.value, false)}
                            className="score-input"
                          />
                        </div>
                        <div className="score-input-group">
                          <label className="score-label">Overall</label>
                          <div className="score-display">
                            {scores.overall}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="academic-modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="academic-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRecord}
                className="academic-modal-btn submit"
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

export default AcademicRecords;