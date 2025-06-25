import React, { useState } from 'react';
import '../styles/TeacherManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faUpload,
  faEye,
  faUsers,
  faBook,
  faCalendar,
  faStar,
  faAward,
  faTimes,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faGraduationCap,
  faBriefcase,
  faIdBadge
} from '@fortawesome/free-solid-svg-icons';

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
      studentsUnder: 85,
      address: '123 Teacher Colony, Delhi',
      salary: 65000,
      level: 'Senior'
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
      studentsUnder: 78,
      address: '456 Science Park, Mumbai',
      salary: 55000,
      level: 'Experienced'
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
      studentsUnder: 92,
      address: '789 Literary Avenue, Bangalore',
      salary: 48000,
      level: 'Experienced'
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
      studentsUnder: 65,
      address: '321 Bio-Tech City, Chennai',
      salary: 75000,
      level: 'Senior'
    },
    {
      id: 5,
      name: 'Mrs. Deepika Rao',
      employeeId: 'T005',
      email: 'deepika.rao@school.edu',
      phone: '+91 9876543214',
      department: 'Social Studies',
      subjects: ['History', 'Geography', 'Civics'],
      classes: ['9-C', '10-C', '11-C'],
      qualification: 'M.A History, B.Ed',
      experience: 10,
      joiningDate: '2014-08-15',
      status: 'on-leave',
      performance: 89.3,
      classesAssigned: 3,
      studentsUnder: 88,
      address: '567 Heritage Lane, Hyderabad',
      salary: 52000,
      level: 'Experienced'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    subjects: [],
    classes: [],
    qualification: '',
    experience: 0,
    joiningDate: '',
    address: '',
    salary: 0,
    level: 'Junior'
  });

  const departments = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Arts', 'Physical Education'];
  const allSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature', 'English Grammar', 'Hindi', 'History', 'Geography', 'Civics', 'Computer Science'];
  const allClasses = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const levels = ['Junior', 'Experienced', 'Senior'];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '' || teacher.department === filterDepartment;
    const matchesStatus = filterStatus === '' || teacher.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.employeeId && newTeacher.email) {
      const newId = Math.max(...teachers.map(t => t.id)) + 1;
      setTeachers([...teachers, { 
        ...newTeacher, 
        id: newId, 
        status: 'active',
        performance: 85.0,
        classesAssigned: newTeacher.classes.length,
        studentsUnder: newTeacher.classes.length * 30
      }]);
      setNewTeacher({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        subjects: [],
        classes: [],
        qualification: '',
        experience: 0,
        joiningDate: '',
        address: '',
        salary: 0,
        level: 'Junior'
      });
      setShowAddModal(false);
    }
  };

  const handleEditTeacher = () => {
    if (selectedTeacher) {
      setTeachers(teachers.map(teacher => 
        teacher.id === selectedTeacher.id ? {
          ...selectedTeacher,
          classesAssigned: selectedTeacher.classes.length,
          studentsUnder: selectedTeacher.classes.length * 30
        } : teacher
      ));
      setShowEditModal(false);
      setSelectedTeacher(null);
    }
  };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    }
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const handleEditTeacherModal = (teacher) => {
    setSelectedTeacher({...teacher});
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

  const getPerformanceClass = (performance) => {
    if (performance >= 95) return 'teacher-stat-value green';
    if (performance >= 90) return 'teacher-stat-value blue';
    if (performance >= 85) return 'teacher-stat-value yellow';
    return 'teacher-stat-value red';
  };

  const getStatusClass = (status) => {
    return `teacher-status-badge ${status}`;
  };

  const getLevelClass = (level) => {
    return `teacher-level-badge ${level.toLowerCase()}`;
  };

  const handleSubjectToggle = (subject, isNewTeacher = true) => {
    if (isNewTeacher) {
      const updatedSubjects = newTeacher.subjects.includes(subject)
        ? newTeacher.subjects.filter(s => s !== subject)
        : [...newTeacher.subjects, subject];
      setNewTeacher({ ...newTeacher, subjects: updatedSubjects });
    } else {
      const updatedSubjects = selectedTeacher.subjects.includes(subject)
        ? selectedTeacher.subjects.filter(s => s !== subject)
        : [...selectedTeacher.subjects, subject];
      setSelectedTeacher({ ...selectedTeacher, subjects: updatedSubjects });
    }
  };

  const handleClassToggle = (cls, isNewTeacher = true) => {
    if (isNewTeacher) {
      const updatedClasses = newTeacher.classes.includes(cls)
        ? newTeacher.classes.filter(c => c !== cls)
        : [...newTeacher.classes, cls];
      setNewTeacher({ ...newTeacher, classes: updatedClasses });
    } else {
      const updatedClasses = selectedTeacher.classes.includes(cls)
        ? selectedTeacher.classes.filter(c => c !== cls)
        : [...selectedTeacher.classes, cls];
      setSelectedTeacher({ ...selectedTeacher, classes: updatedClasses });
    }
  };

  return (
    <div className="teacher-management">
      {/* Header */}
      <div className="teacher-header">
        <div className="teacher-header-content">
          <div className="teacher-title-section">
            <h1>Teacher Management</h1>
            <p>Manage teacher assignments and performance</p>
          </div>
          <div className="teacher-actions">
            <button
              onClick={() => setShowBulkModal(true)}
              className="teacher-btn success"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Teachers</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="teacher-btn primary"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Teacher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="teacher-search-filters">
        <div className="teacher-filters-container">
          <div className="teacher-search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="teacher-search-icon" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="teacher-search-input"
            />
          </div>
          <div className="teacher-filter-controls">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="teacher-filter-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="teacher-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="teachers-grid">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-card-content">
              <div className="teacher-card-header">
                <div className="teacher-info-section">
                  <div className="teacher-avatar">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="teacher-basic-info">
                    <h3>{teacher.name}</h3>
                    <p className="teacher-employee-id">{teacher.employeeId}</p>
                    <p className="teacher-department">{teacher.department}</p>
                  </div>
                </div>
                <div className="teacher-card-actions">
                  <button
                    onClick={() => handleEditTeacherModal(teacher)}
                    className="teacher-action-btn edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="teacher-action-btn delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="teacher-stats">
                <div className="teacher-stat-item">
                  <span className="teacher-stat-label">Students</span>
                  <span className="teacher-stat-value blue">{teacher.studentsUnder}</span>
                </div>
                <div className="teacher-stat-item">
                  <span className="teacher-stat-label">Subjects</span>
                  <span className="teacher-stat-value">{teacher.subjects.length}</span>
                </div>
                <div className="teacher-stat-item">
                  <span className="teacher-stat-label">Experience</span>
                  <span className="teacher-stat-value">{teacher.experience}y</span>
                </div>
                <div className="teacher-stat-item">
                  <span className="teacher-stat-label">Performance</span>
                  <span className={getPerformanceClass(teacher.performance)}>
                    {teacher.performance}%
                  </span>
                </div>
              </div>

              <div className="teacher-badges">
                <span className={getLevelClass(teacher.level)}>
                  {teacher.level}
                </span>
                <span className={getStatusClass(teacher.status)}>
                  {teacher.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="teacher-subjects-info">
                <FontAwesomeIcon icon={faBook} className="teacher-subjects-icon" />
                {teacher.subjects.slice(0, 2).join(', ')}
                {teacher.subjects.length > 2 && ` +${teacher.subjects.length - 2} more`}
              </div>
              <div className="teacher-classes-info">
                <FontAwesomeIcon icon={faUsers} className="teacher-classes-icon" />
                Classes: {teacher.classes.slice(0, 3).join(', ')}
                {teacher.classes.length > 3 && ` +${teacher.classes.length - 3}`}
              </div>

              <button
                onClick={() => handleViewTeacher(teacher)}
                className="teacher-view-btn"
              >
                <FontAwesomeIcon icon={faEye} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="teacher-modal-overlay">
          <div className="teacher-modal">
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">Add New Teacher</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="teacher-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="teacher-modal-body">
              <div className="teacher-form-grid">
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Full Name</label>
                  <input
                    type="text"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                    className="teacher-form-input"
                    placeholder="Teacher name"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Employee ID</label>
                  <input
                    type="text"
                    value={newTeacher.employeeId}
                    onChange={(e) => setNewTeacher({...newTeacher, employeeId: e.target.value})}
                    className="teacher-form-input"
                    placeholder="e.g., T001"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Email</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    className="teacher-form-input"
                    placeholder="teacher@school.edu"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Phone</label>
                  <input
                    type="tel"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                    className="teacher-form-input"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Department</label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                    className="teacher-form-select"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Level</label>
                  <select
                    value={newTeacher.level}
                    onChange={(e) => setNewTeacher({...newTeacher, level: e.target.value})}
                    className="teacher-form-select"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Qualification</label>
                  <input
                    type="text"
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                    className="teacher-form-input"
                    placeholder="e.g., M.Sc, B.Ed"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Experience (Years)</label>
                  <input
                    type="number"
                    value={newTeacher.experience}
                    onChange={(e) => setNewTeacher({...newTeacher, experience: parseInt(e.target.value)})}
                    className="teacher-form-input"
                    placeholder="0"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Joining Date</label>
                  <input
                    type="date"
                    value={newTeacher.joiningDate}
                    onChange={(e) => setNewTeacher({...newTeacher, joiningDate: e.target.value})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Salary</label>
                  <input
                    type="number"
                    value={newTeacher.salary}
                    onChange={(e) => setNewTeacher({...newTeacher, salary: parseInt(e.target.value)})}
                    className="teacher-form-input"
                    placeholder="50000"
                  />
                </div>
                <div className="teacher-form-group full-width">
                  <label className="teacher-form-label">Address</label>
                  <textarea
                    value={newTeacher.address}
                    onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                    className="teacher-form-textarea"
                    placeholder="Teacher address"
                  />
                </div>
                <div className="teacher-form-group full-width">
                  <label className="teacher-form-label">Subjects</label>
                  <div className="teacher-checkbox-grid">
                    {allSubjects.map(subject => (
                      <div key={subject} className="teacher-checkbox-item">
                        <input
                          type="checkbox"
                          checked={newTeacher.subjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject, true)}
                          className="teacher-checkbox"
                        />
                        <label className="teacher-checkbox-label">{subject}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="teacher-form-group full-width">
                  <label className="teacher-form-label">Classes</label>
                  <div className="teacher-checkbox-grid classes">
                    {allClasses.map(cls => (
                      <div key={cls} className="teacher-checkbox-item">
                        <input
                          type="checkbox"
                          checked={newTeacher.classes.includes(cls)}
                          onChange={() => handleClassToggle(cls, true)}
                          className="teacher-checkbox"
                        />
                        <label className="teacher-checkbox-label">{cls}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="teacher-modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="teacher-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                className="teacher-modal-btn submit"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="teacher-modal-overlay">
          <div className="teacher-modal medium">
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">Bulk Add Teachers</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="teacher-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="teacher-modal-body">
              <div className="teacher-form-group full-width">
                <label className="teacher-form-label">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="teacher-form-input"
                />
                <p className="bulk-upload-description">
                  Upload a CSV file with columns: name, employeeId, email, phone, department, subjects, classes, qualification, experience, joiningDate, address, salary, level
                </p>
              </div>
            </div>
            <div className="teacher-modal-footer">
              <button
                onClick={() => setShowBulkModal(false)}
                className="teacher-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile}
                className="teacher-modal-btn submit"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="teacher-modal-overlay">
          <div className="teacher-modal">
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">Teacher Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="teacher-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="teacher-modal-body">
              <div className="teacher-profile-header">
                <div className="teacher-profile-avatar">
                  {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="teacher-profile-info">
                  <h3>{selectedTeacher.name}</h3>
                  <p className="teacher-profile-meta">{selectedTeacher.employeeId} • {selectedTeacher.department}</p>
                  <div className="teacher-profile-badges">
                    <span className={getLevelClass(selectedTeacher.level)}>
                      {selectedTeacher.level}
                    </span>
                    <span className={getStatusClass(selectedTeacher.status)}>
                      {selectedTeacher.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="teacher-info-grid">
                {/* Personal Information */}
                <div className="teacher-info-section">
                  <h4 className="teacher-section-title">
                    <FontAwesomeIcon icon={faIdBadge} className="teacher-section-icon blue" />
                    Personal Information
                  </h4>
                  <div className="teacher-info-row">
                    <FontAwesomeIcon icon={faEnvelope} className="teacher-info-icon" />
                    <span className="teacher-info-label">Email:</span>
                    <span className="teacher-info-value">{selectedTeacher.email}</span>
                  </div>
                  <div className="teacher-info-row">
                    <FontAwesomeIcon icon={faPhone} className="teacher-info-icon" />
                    <span className="teacher-info-label">Phone:</span>
                    <span className="teacher-info-value">{selectedTeacher.phone}</span>
                  </div>
                  <div className="teacher-info-row">
                    <FontAwesomeIcon icon={faCalendar} className="teacher-info-icon" />
                    <span className="teacher-info-label">Joined:</span>
                    <span className="teacher-info-value">{new Date(selectedTeacher.joiningDate).toLocaleDateString()}</span>
                  </div>
                  <div className="teacher-info-row">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="teacher-info-icon" />
                    <span className="teacher-info-label">Address:</span>
                    <span className="teacher-info-value">{selectedTeacher.address}</span>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="teacher-info-section">
                  <h4 className="teacher-section-title">
                    <FontAwesomeIcon icon={faGraduationCap} className="teacher-section-icon green" />
                    Professional Information
                  </h4>
                  <div className="teacher-detail-grid">
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Department:</span>
                      <span className="teacher-detail-value">{selectedTeacher.department}</span>
                    </div>
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Qualification:</span>
                      <span className="teacher-detail-value">{selectedTeacher.qualification}</span>
                    </div>
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Experience:</span>
                      <span className="teacher-detail-value">{selectedTeacher.experience} years</span>
                    </div>
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Performance:</span>
                      <span className="teacher-info-value performance excellent">
                        {selectedTeacher.performance}%
                      </span>
                    </div>
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Salary:</span>
                      <span className="teacher-detail-value">₹{selectedTeacher.salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Teaching Information */}
                <div className="teacher-info-section full-width">
                  <h4 className="teacher-section-title">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="teacher-section-icon purple" />
                    Teaching Information
                  </h4>
                  <div className="teacher-detail-grid">
                    <div>
                      <span className="teacher-info-label">Subjects:</span>
                      <div className="teacher-subjects-list">
                        {selectedTeacher.subjects.map(subject => (
                          <span key={subject} className="teacher-subject-tag">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="teacher-info-label">Classes:</span>
                      <div className="teacher-classes-list">
                        {selectedTeacher.classes.map(cls => (
                          <span key={cls} className="teacher-class-tag">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Students Under:</span>
                      <span className="teacher-detail-value">{selectedTeacher.studentsUnder}</span>
                    </div>
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-label">Classes Assigned:</span>
                      <span className="teacher-detail-value">{selectedTeacher.classesAssigned}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="teacher-modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="teacher-modal-btn cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="teacher-modal-overlay">
          <div className="teacher-modal">
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">Edit Teacher</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="teacher-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="teacher-modal-body">
              <div className="teacher-form-grid">
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Full Name</label>
                  <input
                    type="text"
                    value={selectedTeacher.name}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, name: e.target.value})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Employee ID</label>
                  <input
                    type="text"
                    value={selectedTeacher.employeeId}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, employeeId: e.target.value})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Email</label>
                  <input
                    type="email"
                    value={selectedTeacher.email}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, email: e.target.value})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Phone</label>
                  <input
                    type="tel"
                    value={selectedTeacher.phone}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, phone: e.target.value})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Department</label>
                  <select
                    value={selectedTeacher.department}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, department: e.target.value})}
                    className="teacher-form-select"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Level</label>
                  <select
                    value={selectedTeacher.level}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, level: e.target.value})}
                    className="teacher-form-select"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Status</label>
                  <select
                    value={selectedTeacher.status}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, status: e.target.value})}
                    className="teacher-form-select"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Qualification</label>
                  <input
                    type="text"
                    value={selectedTeacher.qualification}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, qualification: e.target.value})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Experience (Years)</label>
                  <input
                    type="number"
                    value={selectedTeacher.experience}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, experience: parseInt(e.target.value)})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group">
                  <label className="teacher-form-label">Salary</label>
                  <input
                    type="number"
                    value={selectedTeacher.salary}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, salary: parseInt(e.target.value)})}
                    className="teacher-form-input"
                  />
                </div>
                <div className="teacher-form-group full-width">
                  <label className="teacher-form-label">Address</label>
                  <textarea
                    value={selectedTeacher.address}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, address: e.target.value})}
                    className="teacher-form-textarea"
                  />
                </div>
                <div className="teacher-form-group full-width">
                  <label className="teacher-form-label">Subjects</label>
                  <div className="teacher-checkbox-grid">
                    {allSubjects.map(subject => (
                      <div key={subject} className="teacher-checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedTeacher.subjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject, false)}
                          className="teacher-checkbox"
                        />
                        <label className="teacher-checkbox-label">{subject}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="teacher-form-group full-width">
                  <label className="teacher-form-label">Classes</label>
                  <div className="teacher-checkbox-grid classes">
                    {allClasses.map(cls => (
                      <div key={cls} className="teacher-checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedTeacher.classes.includes(cls)}
                          onChange={() => handleClassToggle(cls, false)}
                          className="teacher-checkbox"
                        />
                        <label className="teacher-checkbox-label">{cls}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="teacher-modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="teacher-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTeacher}
                className="teacher-modal-btn submit"
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

export default TeacherManagement;