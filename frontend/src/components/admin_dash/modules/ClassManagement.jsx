import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/ClassManagement.css';
import {
  faSchool,
  faPlus,
  faEdit,
  faTrash,
  faUsers,
  faChalkboardTeacher,
  faSearch,
  faFilter,
  faUpload,
  faEye,
  faUserFriends,
  faTimes,
  faCheck,
  faBook
} from '@fortawesome/free-solid-svg-icons';

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
    },
    {
      id: 5,
      className: 'Class 11-B',
      grade: '11',
      section: 'B',
      totalStudents: 30,
      classTeacher: 'Mrs. Deepika Rao',
      subjects: ['Physics', 'Chemistry', 'Math', 'English'],
      schedule: 'Morning (8:00 AM - 2:00 PM)',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

  const [newClass, setNewClass] = useState({
    className: '',
    grade: '',
    section: '',
    classTeacher: '',
    subjects: [],
    schedule: '',
    totalStudents: 0
  });

  const grades = ['6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const allSubjects = ['Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Physics', 'Chemistry', 'Biology'];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === '' || cls.grade === filterGrade;
    const matchesSection = filterSection === '' || cls.section === filterSection;
    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleAddClass = () => {
    if (newClass.className && newClass.grade && newClass.section) {
      const newId = Math.max(...classes.map(c => c.id)) + 1;
      setClasses([...classes, { ...newClass, id: newId, status: 'active' }]);
      setNewClass({
        className: '',
        grade: '',
        section: '',
        classTeacher: '',
        subjects: [],
        schedule: '',
        totalStudents: 0
      });
      setShowAddModal(false);
    }
  };

  const handleEditClass = () => {
    if (selectedClass) {
      setClasses(classes.map(cls => 
        cls.id === selectedClass.id ? selectedClass : cls
      ));
      setShowEditModal(false);
      setSelectedClass(null);
    }
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(cls => cls.id !== classId));
    }
  };

  const handleViewClass = (cls) => {
    setSelectedClass(cls);
    setShowViewModal(true);
  };

  const handleEditClassModal = (cls) => {
    setSelectedClass({...cls});
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

  const handleSubjectToggle = (subject, isNewClass = true) => {
    if (isNewClass) {
      const updatedSubjects = newClass.subjects.includes(subject)
        ? newClass.subjects.filter(s => s !== subject)
        : [...newClass.subjects, subject];
      setNewClass({ ...newClass, subjects: updatedSubjects });
    } else {
      const updatedSubjects = selectedClass.subjects.includes(subject)
        ? selectedClass.subjects.filter(s => s !== subject)
        : [...selectedClass.subjects, subject];
      setSelectedClass({ ...selectedClass, subjects: updatedSubjects });
    }
  };

  return (
    <div className="class-management">
      {/* Header */}
      <div className="class-header">
        <div className="class-header-content">
          <div className="class-title-section">
            <h1>Class Management</h1>
            <p>Organize and manage school classes efficiently</p>
          </div>
          <div className="class-actions">
            <button
              onClick={() => setShowBulkModal(true)}
              className="class-btn success"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Classes</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="class-btn primary"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Class</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="class-search-filters">
        <div className="class-filters-container">
          <div className="class-search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="class-search-icon" />
            <input
              type="text"
              placeholder="Search classes or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="class-search-input"
            />
          </div>
          <div className="class-filter-controls">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="class-filter-select"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="class-filter-select"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {filteredClasses.map(cls => (
          <div key={cls.id} className="class-card">
            <div className="class-card-content">
              <div className="class-card-header">
                <div className="class-info">
                  <h3>{cls.className}</h3>
                  <span className={`class-status-badge ${cls.status}`}>
                    {cls.status.toUpperCase()}
                  </span>
                </div>
                <div className="class-card-actions">
                  <button
                    onClick={() => handleEditClassModal(cls)}
                    className="class-action-btn edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="class-action-btn delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="class-details">
                <div className="class-stat-row">
                  <FontAwesomeIcon icon={faUsers} className="class-stat-icon blue" />
                  <span className="class-stat-value">{cls.totalStudents}</span>
                  <span className="class-stat-label">Students</span>
                </div>
                <div className="class-stat-row">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="class-stat-icon gray" />
                  <span>{cls.classTeacher}</span>
                </div>
                <div className="class-stat-row">
                  <FontAwesomeIcon icon={faBook} className="class-stat-icon gray" />
                  <span className="class-stat-label">{cls.subjects.length} Subjects</span>
                </div>
              </div>

              <div className="class-card-footer">
                <button
                  onClick={() => handleViewClass(cls)}
                  className="class-footer-btn primary"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => alert(`Managing students for ${cls.className}`)}
                  className="class-footer-btn secondary"
                >
                  <FontAwesomeIcon icon={faUserFriends} />
                  <span>Manage Students</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="class-modal-overlay">
          <div className="class-modal">
            <div className="class-modal-header">
              <h2 className="class-modal-title">Add New Class</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="class-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="class-modal-body">
              <div className="class-form-group full-width">
                <label className="class-form-label">Class Name</label>
                <input
                  type="text"
                  value={newClass.className}
                  onChange={(e) => setNewClass({...newClass, className: e.target.value})}
                  className="class-form-input"
                  placeholder="e.g., Class 10-A"
                />
              </div>
              <div className="class-form-grid">
                <div className="class-form-group">
                  <label className="class-form-label">Grade</label>
                  <select
                    value={newClass.grade}
                    onChange={(e) => setNewClass({...newClass, grade: e.target.value})}
                    className="class-form-select"
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div className="class-form-group">
                  <label className="class-form-label">Section</label>
                  <select
                    value={newClass.section}
                    onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                    className="class-form-select"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="class-form-group full-width">
                <label className="class-form-label">Class Teacher</label>
                <input
                  type="text"
                  value={newClass.classTeacher}
                  onChange={(e) => setNewClass({...newClass, classTeacher: e.target.value})}
                  className="class-form-input"
                  placeholder="Teacher name"
                />
              </div>
              <div className="class-form-group full-width">
                <label className="class-form-label">Subjects</label>
                <div className="class-checkbox-grid">
                  {allSubjects.map(subject => (
                    <div key={subject} className="class-checkbox-item">
                      <input
                        type="checkbox"
                        checked={newClass.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, true)}
                        className="class-checkbox"
                      />
                      <label className="class-checkbox-label">{subject}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="class-form-group full-width">
                <label className="class-form-label">Schedule</label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                  className="class-form-input"
                  placeholder="e.g., Morning (8:00 AM - 2:00 PM)"
                />
              </div>
            </div>
            <div className="class-modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="class-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                className="class-modal-btn submit"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="class-modal-overlay">
          <div className="class-modal">
            <div className="class-modal-header">
              <h2 className="class-modal-title">Bulk Add Classes</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="class-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="class-modal-body">
              <div className="class-form-group full-width">
                <label className="class-form-label">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="class-form-input"
                />
                <p className="bulk-upload-description">
                  Upload a CSV file with columns: className, grade, section, classTeacher, subjects, schedule
                </p>
              </div>
            </div>
            <div className="class-modal-footer">
              <button
                onClick={() => setShowBulkModal(false)}
                className="class-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile}
                className="class-modal-btn submit"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedClass && (
        <div className="class-modal-overlay">
          <div className="class-modal large">
            <div className="class-modal-header">
              <h2 className="class-modal-title">Class Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="class-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="class-modal-body">
              <div className="class-view-grid">
                <div className="class-view-item">
                  <label className="class-view-label">Class Name</label>
                  <p className="class-view-value">{selectedClass.className}</p>
                </div>
                <div className="class-view-item">
                  <label className="class-view-label">Grade & Section</label>
                  <p className="class-view-value">Grade {selectedClass.grade} - Section {selectedClass.section}</p>
                </div>
                <div className="class-view-item">
                  <label className="class-view-label">Total Students</label>
                  <p className="class-view-value">{selectedClass.totalStudents}</p>
                </div>
                <div className="class-view-item">
                  <label className="class-view-label">Status</label>
                  <span className={`class-status-badge ${selectedClass.status}`}>
                    {selectedClass.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="class-view-item">
                <label className="class-view-label">Class Teacher</label>
                <p className="class-view-value">{selectedClass.classTeacher}</p>
              </div>
              <div className="class-view-item">
                <label className="class-view-label">Schedule</label>
                <p className="class-view-value">{selectedClass.schedule}</p>
              </div>
              <div className="class-view-item">
                <label className="class-view-label">Subjects</label>
                <div className="class-subjects-list">
                  {selectedClass.subjects.map(subject => (
                    <span key={subject} className="class-subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="class-modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="class-modal-btn cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedClass && (
        <div className="class-modal-overlay">
          <div className="class-modal">
            <div className="class-modal-header">
              <h2 className="class-modal-title">Edit Class</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="class-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="class-modal-body">
              <div className="class-form-group full-width">
                <label className="class-form-label">Class Name</label>
                <input
                  type="text"
                  value={selectedClass.className}
                  onChange={(e) => setSelectedClass({...selectedClass, className: e.target.value})}
                  className="class-form-input"
                />
              </div>
              <div className="class-form-grid">
                <div className="class-form-group">
                  <label className="class-form-label">Grade</label>
                  <select
                    value={selectedClass.grade}
                    onChange={(e) => setSelectedClass({...selectedClass, grade: e.target.value})}
                    className="class-form-select"
                  >
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div className="class-form-group">
                  <label className="class-form-label">Section</label>
                  <select
                    value={selectedClass.section}
                    onChange={(e) => setSelectedClass({...selectedClass, section: e.target.value})}
                    className="class-form-select"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="class-form-group full-width">
                <label className="class-form-label">Class Teacher</label>
                <input
                  type="text"
                  value={selectedClass.classTeacher}
                  onChange={(e) => setSelectedClass({...selectedClass, classTeacher: e.target.value})}
                  className="class-form-input"
                />
              </div>
              <div className="class-form-group full-width">
                <label className="class-form-label">Subjects</label>
                <div className="class-checkbox-grid">
                  {allSubjects.map(subject => (
                    <div key={subject} className="class-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedClass.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, false)}
                        className="class-checkbox"
                      />
                      <label className="class-checkbox-label">{subject}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="class-form-group full-width">
                <label className="class-form-label">Schedule</label>
                <input
                  type="text"
                  value={selectedClass.schedule}
                  onChange={(e) => setSelectedClass({...selectedClass, schedule: e.target.value})}
                  className="class-form-input"
                />
              </div>
            </div>
            <div className="class-modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="class-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleEditClass}
                className="class-modal-btn submit"
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

export default ClassManagement;