import React, { useState } from 'react';
import '../styles/StudentManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faUpload,
  faEye,
  faTimes,
  faUserGraduate,
  faChartLine,
  faStar,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faCalendarAlt,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      rollNo: 'ST001',
      class: '10-A',
      section: 'A',
      grade: '10',
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
      performanceScore: 88.5,
      subjects: ['Math', 'Science', 'English', 'Hindi', 'Social Studies']
    },
    {
      id: 2,
      name: 'Priya Patel',
      rollNo: 'ST002',
      class: '10-A',
      section: 'A',
      grade: '10',
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
      performanceScore: 94.2,
      subjects: ['Math', 'Science', 'English', 'Hindi', 'Social Studies']
    },
    {
      id: 3,
      name: 'Rohan Kumar',
      rollNo: 'ST003',
      class: '9-A',
      section: 'A',
      grade: '9',
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
      performanceScore: 82.7,
      subjects: ['Math', 'Science', 'English', 'Hindi', 'Social Studies']
    },
    {
      id: 4,
      name: 'Ananya Singh',
      rollNo: 'ST004',
      class: '12-A',
      section: 'A',
      grade: '12',
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
      performanceScore: 91.3,
      subjects: ['Physics', 'Chemistry', 'Math', 'English']
    },
    {
      id: 5,
      name: 'Kavya Reddy',
      rollNo: 'ST005',
      class: '11-B',
      section: 'B',
      grade: '11',
      email: 'kavya.reddy@email.com',
      phone: '+91 9876543218',
      dateOfBirth: '2007-07-14',
      address: '567 Tech Park, Hyderabad',
      parentName: 'Ramesh Reddy',
      parentPhone: '+91 9876543219',
      admissionDate: '2022-04-05',
      status: 'active',
      overallGrade: 'A-',
      attendance: 90,
      performanceScore: 86.8,
      subjects: ['Physics', 'Chemistry', 'Math', 'English']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    class: '',
    section: '',
    grade: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    parentName: '',
    parentPhone: '',
    admissionDate: '',
    subjects: []
  });

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const grades = ['9', '10', '11', '12'];
  const allSubjects = ['Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Physics', 'Chemistry', 'Biology'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || student.class === filterClass;
    const matchesSection = filterSection === '' || student.section === filterSection;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    return matchesSearch && matchesClass && matchesSection && matchesStatus;
  });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.rollNo && newStudent.class) {
      const newId = Math.max(...students.map(s => s.id)) + 1;
      setStudents([...students, { 
        ...newStudent, 
        id: newId, 
        status: 'active',
        overallGrade: 'B',
        attendance: 90,
        performanceScore: 85.0
      }]);
      setNewStudent({
        name: '',
        rollNo: '',
        class: '',
        section: '',
        grade: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        parentName: '',
        parentPhone: '',
        admissionDate: '',
        subjects: []
      });
      setShowAddModal(false);
    }
  };

  const handleEditStudent = () => {
    if (selectedStudent) {
      setStudents(students.map(student => 
        student.id === selectedStudent.id ? selectedStudent : student
      ));
      setShowEditModal(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudentModal = (student) => {
    setSelectedStudent({...student});
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

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'A+': return 'student-grade-badge a-plus';
      case 'A': return 'student-grade-badge a';
      case 'A-': return 'student-grade-badge a-minus';
      case 'B+': return 'student-grade-badge b-plus';
      case 'B': return 'student-grade-badge b';
      default: return 'student-grade-badge';
    }
  };

  const getAttendanceClass = (attendance) => {
    if (attendance >= 95) return 'student-attendance excellent';
    if (attendance >= 85) return 'student-attendance good';
    if (attendance >= 75) return 'student-attendance average';
    return 'student-attendance poor';
  };

  return (
    <div className="student-management">
      {/* Header */}
      <div className="student-header">
        <div className="student-header-content">
          <div className="student-title-section">
            <h1>Student Management</h1>
            <p>Manage student records and academic information</p>
          </div>
          <div className="student-actions">
            <button
              onClick={() => setShowBulkModal(true)}
              className="student-btn success"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Students</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="student-btn primary"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="student-search-filters">
        <div className="student-filters-container">
          <div className="student-search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="student-search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="student-search-input"
            />
          </div>
          <div className="student-filter-controls">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="student-filter-select"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="student-filter-select"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="student-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-table-container">
        <div className="students-table-wrapper">
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
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {student.name.charAt(0)}
                      </div>
                      <div className="student-details">
                        <h4 className="student-name">{student.name}</h4>
                        <p className="student-email">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="student-roll-no">{student.rollNo}</span>
                  </td>
                  <td>
                    <span className="student-class">{student.class}</span>
                  </td>
                  <td>
                    <div className="student-performance">
                      <FontAwesomeIcon icon={faChartLine} className="student-performance-icon" />
                      <span>{student.performanceScore}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={getAttendanceClass(student.attendance)}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td>
                    <span className={getGradeClass(student.overallGrade)}>
                      {student.overallGrade}
                    </span>
                  </td>
                  <td>
                    <span className={`student-status-badge ${student.status}`}>
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="student-actions-cell">
                    <div className="student-action-buttons">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="student-action-btn view"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleEditStudentModal(student)}
                        className="student-action-btn edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="student-action-btn delete"
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

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="student-modal-overlay">
          <div className="student-modal medium">
            <div className="student-modal-header">
              <h2 className="student-modal-title">Add New Student</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="student-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="student-modal-body">
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label className="student-form-label">Full Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="student-form-input"
                    placeholder="Student name"
                  />
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                    className="student-form-input"
                    placeholder="e.g., ST001"
                  />
                </div>
              </div>
              <div className="student-form-grid three-cols">
                <div className="student-form-group">
                  <label className="student-form-label">Grade</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="student-form-select"
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Section</label>
                  <select
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
                    className="student-form-select"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Class</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                    className="student-form-select"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label className="student-form-label">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="student-form-input"
                    placeholder="student@email.com"
                  />
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Phone</label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                    className="student-form-input"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              <div className="student-form-group full-width">
                <label className="student-form-label">Date of Birth</label>
                <input
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
                  className="student-form-input"
                />
              </div>
              <div className="student-form-group full-width">
                <label className="student-form-label">Address</label>
                <textarea
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                  className="student-form-textarea"
                  placeholder="Student address"
                />
              </div>
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label className="student-form-label">Parent Name</label>
                  <input
                    type="text"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                    className="student-form-input"
                    placeholder="Parent/Guardian name"
                  />
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Parent Phone</label>
                  <input
                    type="tel"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                    className="student-form-input"
                    placeholder="+91 9876543211"
                  />
                </div>
              </div>
              <div className="student-form-group full-width">
                <label className="student-form-label">Admission Date</label>
                <input
                  type="date"
                  value={newStudent.admissionDate}
                  onChange={(e) => setNewStudent({...newStudent, admissionDate: e.target.value})}
                  className="student-form-input"
                />
              </div>
            </div>
            <div className="student-modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="student-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="student-modal-btn submit"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="student-modal-overlay">
          <div className="student-modal medium">
            <div className="student-modal-header">
              <h2 className="student-modal-title">Bulk Add Students</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="student-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="student-modal-body">
              <div className="student-form-group full-width">
                <label className="student-form-label">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="student-form-input"
                />
                <p className="bulk-upload-description">
                  Upload a CSV file with columns: name, rollNo, class, section, grade, email, phone, dateOfBirth, address, parentName, parentPhone, admissionDate
                </p>
              </div>
            </div>
            <div className="student-modal-footer">
              <button
                onClick={() => setShowBulkModal(false)}
                className="student-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile}
                className="student-modal-btn submit"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="student-modal-overlay">
          <div className="student-modal">
            <div className="student-modal-header">
              <h2 className="student-modal-title">Student Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="student-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="student-modal-body">
              <div className="student-profile-header">
                <div className="student-profile-avatar">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="student-profile-info">
                  <h3>{selectedStudent.name}</h3>
                  <p className="student-profile-meta">{selectedStudent.rollNo} • {selectedStudent.class}</p>
                  <div className="student-profile-badges">
                    <span className={getGradeClass(selectedStudent.overallGrade)}>
                      Grade: {selectedStudent.overallGrade}
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-info-grid">
                {/* Personal Information */}
                <div className="student-info-section">
                  <h4 className="student-section-title">
                    <FontAwesomeIcon icon={faUserGraduate} className="student-section-icon blue" />
                    Personal Information
                  </h4>
                  <div className="student-info-row">
                    <FontAwesomeIcon icon={faEnvelope} className="student-info-icon" />
                    <span className="student-info-label">Email:</span>
                    <span className="student-info-value">{selectedStudent.email}</span>
                  </div>
                  <div className="student-info-row">
                    <FontAwesomeIcon icon={faPhone} className="student-info-icon" />
                    <span className="student-info-label">Phone:</span>
                    <span className="student-info-value">{selectedStudent.phone}</span>
                  </div>
                  <div className="student-info-row">
                    <FontAwesomeIcon icon={faCalendarAlt} className="student-info-icon" />
                    <span className="student-info-label">DOB:</span>
                    <span className="student-info-value">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="student-info-row">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="student-info-icon" />
                    <span className="student-info-label">Address:</span>
                    <span className="student-info-value">{selectedStudent.address}</span>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="student-info-section">
                  <h4 className="student-section-title">
                    <FontAwesomeIcon icon={faGraduationCap} className="student-section-icon green" />
                    Academic Information
                  </h4>
                  <div className="student-info-row">
                    <span className="student-info-label">Class:</span>
                    <span className="student-info-value">{selectedStudent.class}</span>
                  </div>
                  <div className="student-info-row">
                    <span className="student-info-label">Performance:</span>
                    <span className="student-info-value">{selectedStudent.performanceScore}%</span>
                  </div>
                  <div className="student-info-row">
                    <span className="student-info-label">Attendance:</span>
                    <span className="student-info-value">{selectedStudent.attendance}%</span>
                  </div>
                  <div className="student-info-row">
                    <span className="student-info-label">Admission Date:</span>
                    <span className="student-info-value">{new Date(selectedStudent.admissionDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="student-info-label">Subjects:</span>
                    <div className="student-subjects-list">
                      {selectedStudent.subjects.map(subject => (
                        <span key={subject} className="student-subject-tag">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="student-info-section full-width">
                  <h4 className="student-section-title">
                    <FontAwesomeIcon icon={faUsers} className="student-section-icon purple" />
                    Parent/Guardian Information
                  </h4>
                  <div className="student-form-grid">
                    <div className="student-info-row">
                      <span className="student-info-label">Name:</span>
                      <span className="student-info-value">{selectedStudent.parentName}</span>
                    </div>
                    <div className="student-info-row">
                      <FontAwesomeIcon icon={faPhone} className="student-info-icon" />
                      <span className="student-info-label">Phone:</span>
                      <span className="student-info-value">{selectedStudent.parentPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="student-modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="student-modal-btn cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="student-modal-overlay">
          <div className="student-modal medium">
            <div className="student-modal-header">
              <h2 className="student-modal-title">Edit Student</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="student-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="student-modal-body">
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label className="student-form-label">Full Name</label>
                  <input
                    type="text"
                    value={selectedStudent.name}
                    onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                    className="student-form-input"
                  />
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Roll Number</label>
                  <input
                    type="text"
                    value={selectedStudent.rollNo}
                    onChange={(e) => setSelectedStudent({...selectedStudent, rollNo: e.target.value})}
                    className="student-form-input"
                  />
                </div>
              </div>
              <div className="student-form-grid three-cols">
                <div className="student-form-group">
                  <label className="student-form-label">Grade</label>
                  <select
                    value={selectedStudent.grade}
                    onChange={(e) => setSelectedStudent({...selectedStudent, grade: e.target.value})}
                    className="student-form-select"
                  >
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Section</label>
                  <select
                    value={selectedStudent.section}
                    onChange={(e) => setSelectedStudent({...selectedStudent, section: e.target.value})}
                    className="student-form-select"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Class</label>
                  <select
                    value={selectedStudent.class}
                    onChange={(e) => setSelectedStudent({...selectedStudent, class: e.target.value})}
                    className="student-form-select"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label className="student-form-label">Email</label>
                  <input
                    type="email"
                    value={selectedStudent.email}
                    onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
                    className="student-form-input"
                  />
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Phone</label>
                  <input
                    type="tel"
                    value={selectedStudent.phone}
                    onChange={(e) => setSelectedStudent({...selectedStudent, phone: e.target.value})}
                    className="student-form-input"
                  />
                </div>
              </div>
              <div className="student-form-group full-width">
                <label className="student-form-label">Address</label>
                <textarea
                  value={selectedStudent.address}
                  onChange={(e) => setSelectedStudent({...selectedStudent, address: e.target.value})}
                  className="student-form-textarea"
                />
              </div>
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label className="student-form-label">Parent Name</label>
                  <input
                    type="text"
                    value={selectedStudent.parentName}
                    onChange={(e) => setSelectedStudent({...selectedStudent, parentName: e.target.value})}
                    className="student-form-input"
                  />
                </div>
                <div className="student-form-group">
                  <label className="student-form-label">Parent Phone</label>
                  <input
                    type="tel"
                    value={selectedStudent.parentPhone}
                    onChange={(e) => setSelectedStudent({...selectedStudent, parentPhone: e.target.value})}
                    className="student-form-input"
                  />
                </div>
              </div>
            </div>
            <div className="student-modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="student-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStudent}
                className="student-modal-btn submit"
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

export default StudentManagement;