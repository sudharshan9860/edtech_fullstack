import React, { useState } from 'react';
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
        studentsUnder: newTeacher.classes.length * 30 // Approximate calculation
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

  const getPerformanceColor = (performance) => {
    if (performance >= 95) return 'text-green-600';
    if (performance >= 90) return 'text-blue-600';
    if (performance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Senior': return 'bg-purple-100 text-purple-800';
      case 'Experienced': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
            <p className="text-gray-600">Manage teacher assignments and performance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Teachers</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Teacher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1 max-w-md">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                    <p className="text-sm text-gray-600">{teacher.employeeId}</p>
                    <p className="text-sm text-blue-600">{teacher.department}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditTeacherModal(teacher)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-semibold text-blue-600">{teacher.studentsUnder}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subjects</span>
                  <span className="font-semibold text-gray-900">{teacher.subjects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-semibold text-gray-900">{teacher.experience}y</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance</span>
                  <span className={`font-semibold ${getPerformanceColor(teacher.performance)}`}>
                    {teacher.performance}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(teacher.level)}`}>
                  {teacher.level}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                  {teacher.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  <FontAwesomeIcon icon={faBook} className="mr-1" />
                  {teacher.subjects.slice(0, 2).join(', ')}
                  {teacher.subjects.length > 2 && ` +${teacher.subjects.length - 2} more`}
                </div>
                <div className="text-xs text-gray-500">
                  <FontAwesomeIcon icon={faUsers} className="mr-1" />
                  Classes: {teacher.classes.slice(0, 3).join(', ')}
                  {teacher.classes.length > 3 && ` +${teacher.classes.length - 3}`}
                </div>
              </div>

              <button
                onClick={() => handleViewTeacher(teacher)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Teacher</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teacher name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={newTeacher.employeeId}
                  onChange={(e) => setNewTeacher({...newTeacher, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., T001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="teacher@school.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={newTeacher.department}
                  onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={newTeacher.level}
                  onChange={(e) => setNewTeacher({...newTeacher, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., M.Sc, B.Ed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher({...newTeacher, experience: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                <input
                  type="date"
                  value={newTeacher.joiningDate}
                  onChange={(e) => setNewTeacher({...newTeacher, joiningDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="number"
                  value={newTeacher.salary}
                  onChange={(e) => setNewTeacher({...newTeacher, salary: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newTeacher.address}
                  onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Teacher address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <div className="grid grid-cols-3 gap-2">
                  {allSubjects.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newTeacher.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, true)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
                <div className="grid grid-cols-4 gap-2">
                  {allClasses.map(cls => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newTeacher.classes.includes(cls)}
                        onChange={() => handleClassToggle(cls, true)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Bulk Add Teachers</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a CSV file with columns: name, employeeId, email, phone, department, subjects, classes, qualification, experience, joiningDate, address, salary, level
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Teacher Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedTeacher.name}</h3>
                <p className="text-gray-600">{selectedTeacher.employeeId} • {selectedTeacher.department}</p>
                <div className="flex space-x-2 mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(selectedTeacher.level)}`}>
                    {selectedTeacher.level}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTeacher.status)}`}>
                    {selectedTeacher.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faIdBadge} className="mr-2 text-blue-600" />
                  Personal Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-900">{selectedTeacher.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedTeacher.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Joined:</span>
                    <span className="ml-2 text-gray-900">{new Date(selectedTeacher.joiningDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="text-gray-900 mt-1">{selectedTeacher.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-green-600" />
                  Professional Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium text-gray-900">{selectedTeacher.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Qualification:</span>
                    <span className="font-medium text-gray-900">{selectedTeacher.qualification}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium text-gray-900">{selectedTeacher.experience} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Performance:</span>
                    <span className={`font-medium ${getPerformanceColor(selectedTeacher.performance)}`}>
                      {selectedTeacher.performance}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-medium text-gray-900">₹{selectedTeacher.salary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Teaching Information */}
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 text-purple-600" />
                  Teaching Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTeacher.subjects.map(subject => (
                        <span key={subject} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Classes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTeacher.classes.map(cls => (
                        <span key={cls} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students Under:</span>
                    <span className="font-medium text-gray-900">{selectedTeacher.studentsUnder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Classes Assigned:</span>
                    <span className="font-medium text-gray-900">{selectedTeacher.classesAssigned}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Teacher</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={selectedTeacher.name}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={selectedTeacher.employeeId}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedTeacher.email}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={selectedTeacher.phone}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={selectedTeacher.department}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={selectedTeacher.level}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedTeacher.status}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={selectedTeacher.qualification}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, qualification: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={selectedTeacher.experience}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, experience: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="number"
                  value={selectedTeacher.salary}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, salary: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={selectedTeacher.address}
                  onChange={(e) => setSelectedTeacher({...selectedTeacher, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <div className="grid grid-cols-3 gap-2">
                  {allSubjects.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTeacher.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, false)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
                <div className="grid grid-cols-4 gap-2">
                  {allClasses.map(cls => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTeacher.classes.includes(cls)}
                        onChange={() => handleClassToggle(cls, false)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTeacher}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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