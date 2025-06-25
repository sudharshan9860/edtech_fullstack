import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getExamTypeColor = (type) => {
    switch (type) {
      case 'Final': return 'bg-red-100 text-red-800';
      case 'Half Yearly': return 'bg-orange-100 text-orange-800';
      case 'Unit Test': return 'bg-blue-100 text-blue-800';
      case 'Practical': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Summary Statistics
  const totalExams = examinations.length;
  const scheduledExams = examinations.filter(e => e.status === 'scheduled').length;
  const completedExams = examinations.filter(e => e.status === 'completed').length;
  const inProgressExams = examinations.filter(e => e.status === 'in-progress').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
            <p className="text-gray-600">Schedule and manage school examinations</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
            </div>
            <FontAwesomeIcon icon={faClipboard} className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-600">{scheduledExams}</p>
            </div>
            <FontAwesomeIcon icon={faCalendar} className="text-yellow-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedExams}</p>
            </div>
            <FontAwesomeIcon icon={faCheck} className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressExams}</p>
            </div>
            <FontAwesomeIcon icon={faClock} className="text-blue-500 text-xl" />
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
              placeholder="Search examinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExaminations.map(exam => (
          <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{exam.examName}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExamTypeColor(exam.examType)}`}>
                      {exam.examType}
                    </span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-blue-600 font-medium">{exam.subject}</span>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(exam.status)} className="mr-1" />
                  {exam.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-400" />
                  <span>{new Date(exam.date).toLocaleDateString()} at {exam.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-green-400" />
                  <span>Class {exam.class} • {exam.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-400" />
                  <span>{exam.venue}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 text-purple-400" />
                  <span>{exam.invigilator}</span>
                </div>
              </div>

              <div className="border-t pt-3 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Total Marks</p>
                    <p className="font-semibold text-gray-900">{exam.totalMarks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Registered</p>
                    <p className="font-semibold text-blue-600">{exam.studentsRegistered}</p>
                  </div>
                </div>
              </div>

              {exam.status === 'completed' && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-gray-600">Average</p>
                      <p className="font-semibold text-green-600">{exam.averageScore}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Highest</p>
                      <p className="font-semibold text-blue-600">{exam.highestScore}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Lowest</p>
                      <p className="font-semibold text-red-600">{exam.lowestScore}%</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewExam(exam)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleEditExamModal(exam)}
                  className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Schedule New Exam</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  value={newExam.examName}
                  onChange={(e) => setNewExam({...newExam, examName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Unit Test 1 - Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={newExam.examType}
                  onChange={(e) => setNewExam({...newExam, examType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={newExam.subject}
                  onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={newExam.class}
                  onChange={(e) => setNewExam({...newExam, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={newExam.section}
                  onChange={(e) => setNewExam({...newExam, section: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newExam.time}
                  onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={newExam.duration}
                  onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={newExam.totalMarks}
                  onChange={(e) => setNewExam({...newExam, totalMarks: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
                <input
                  type="number"
                  value={newExam.passingMarks}
                  onChange={(e) => setNewExam({...newExam, passingMarks: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <select
                  value={newExam.venue}
                  onChange={(e) => setNewExam({...newExam, venue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Venue</option>
                  {venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invigilator</label>
                <input
                  type="text"
                  value={newExam.invigilator}
                  onChange={(e) => setNewExam({...newExam, invigilator: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teacher name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={newExam.instructions}
                  onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Special instructions for students"
                />
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
                onClick={handleAddExam}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Exam Modal */}
      {showViewModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Exam Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedExam.examName}</h3>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExamTypeColor(selectedExam.examType)}`}>
                    {selectedExam.examType}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedExam.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(selectedExam.status)} className="mr-1" />
                    {selectedExam.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Exam Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faClipboard} className="mr-2 text-blue-600" />
                    Exam Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subject:</span>
                      <span className="font-medium">{selectedExam.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">{selectedExam.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">{new Date(selectedExam.date).toLocaleDateString()} at {selectedExam.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedExam.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium">{selectedExam.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invigilator:</span>
                      <span className="font-medium">{selectedExam.invigilator}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faChartBar} className="mr-2 text-green-600" />
                    Marking Scheme
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="font-medium">{selectedExam.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passing Marks:</span>
                      <span className="font-medium">{selectedExam.passingMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pass Percentage:</span>
                      <span className="font-medium">{((selectedExam.passingMarks / selectedExam.totalMarks) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered Students:</span>
                      <span className="font-medium text-blue-600">{selectedExam.studentsRegistered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students Appeared:</span>
                      <span className="font-medium text-green-600">{selectedExam.studentsAppeared}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Statistics */}
              {selectedExam.status === 'completed' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faAward} className="mr-2 text-yellow-600" />
                    Performance Statistics
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{selectedExam.averageScore}%</p>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{selectedExam.highestScore}%</p>
                      <p className="text-sm text-gray-600">Highest Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{selectedExam.lowestScore}%</p>
                      <p className="text-sm text-gray-600">Lowest Score</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {selectedExam.instructions && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-purple-600" />
                    Instructions
                  </h4>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {selectedExam.instructions}
                  </p>
                </div>
              )}
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

      {/* Edit Exam Modal would be similar to Add Modal but with pre-filled data */}
      {showEditModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Exam</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  value={selectedExam.examName}
                  onChange={(e) => setSelectedExam({...selectedExam, examName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={selectedExam.examType}
                  onChange={(e) => setSelectedExam({...selectedExam, examType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedExam.status}
                  onChange={(e) => setSelectedExam({...selectedExam, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedExam.date}
                  onChange={(e) => setSelectedExam({...selectedExam, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={selectedExam.time}
                  onChange={(e) => setSelectedExam({...selectedExam, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <select
                  value={selectedExam.venue}
                  onChange={(e) => setSelectedExam({...selectedExam, venue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invigilator</label>
                <input
                  type="text"
                  value={selectedExam.invigilator}
                  onChange={(e) => setSelectedExam({...selectedExam, invigilator: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={selectedExam.instructions}
                  onChange={(e) => setSelectedExam({...selectedExam, instructions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
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
                onClick={handleEditExam}
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

export default Examinations;