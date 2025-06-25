import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/ClassManagement.css'; // for ClassManagement.jsx
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
      // In a real application, you would process the CSV file here
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
            <p className="text-gray-600">Organize and manage school classes efficiently</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Classes</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Class</span>
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
              placeholder="Search classes or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
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
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
          <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{cls.className}</h3>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">
                    {cls.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditClassModal(cls)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-blue-600">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  <span className="font-semibold">{cls.totalStudents}</span>
                  <span className="text-gray-600 ml-1">Students</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                  <span>{cls.classTeacher}</span>
                </div>
                <div className="text-gray-600">
                  <FontAwesomeIcon icon={faBook} className="mr-2" />
                  <span className="text-sm">{cls.subjects.length} Subjects</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewClass(cls)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => alert(`Managing students for ${cls.className}`)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Class</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={newClass.className}
                  onChange={(e) => setNewClass({...newClass, className: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Class 10-A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <select
                    value={newClass.grade}
                    onChange={(e) => setNewClass({...newClass, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={newClass.section}
                    onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
                <input
                  type="text"
                  value={newClass.classTeacher}
                  onChange={(e) => setNewClass({...newClass, classTeacher: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teacher name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <div className="grid grid-cols-2 gap-2">
                  {allSubjects.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newClass.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, true)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Morning (8:00 AM - 2:00 PM)"
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
                onClick={handleAddClass}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Class
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
              <h2 className="text-xl font-bold text-gray-900">Bulk Add Classes</h2>
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
                  Upload a CSV file with columns: className, grade, section, classTeacher, subjects, schedule
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

      {/* View Modal */}
      {showViewModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Class Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Class Name</label>
                  <p className="text-gray-900 font-medium">{selectedClass.className}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade & Section</label>
                  <p className="text-gray-900 font-medium">Grade {selectedClass.grade} - Section {selectedClass.section}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Students</label>
                  <p className="text-gray-900 font-medium">{selectedClass.totalStudents}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {selectedClass.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Class Teacher</label>
                <p className="text-gray-900 font-medium">{selectedClass.classTeacher}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Schedule</label>
                <p className="text-gray-900 font-medium">{selectedClass.schedule}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subjects</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedClass.subjects.map(subject => (
                    <span key={subject} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {subject}
                    </span>
                  ))}
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

      {/* Edit Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Class</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={selectedClass.className}
                  onChange={(e) => setSelectedClass({...selectedClass, className: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <select
                    value={selectedClass.grade}
                    onChange={(e) => setSelectedClass({...selectedClass, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={selectedClass.section}
                    onChange={(e) => setSelectedClass({...selectedClass, section: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
                <input
                  type="text"
                  value={selectedClass.classTeacher}
                  onChange={(e) => setSelectedClass({...selectedClass, classTeacher: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <div className="grid grid-cols-2 gap-2">
                  {allSubjects.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedClass.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, false)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="text"
                  value={selectedClass.schedule}
                  onChange={(e) => setSelectedClass({...selectedClass, schedule: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                onClick={handleEditClass}
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

export default ClassManagement;