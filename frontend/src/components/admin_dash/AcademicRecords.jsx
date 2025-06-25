import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-100 text-green-700';
      case 'A-': return 'bg-green-100 text-green-600';
      case 'B+': return 'bg-blue-100 text-blue-800';
      case 'B': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank <= 3) return 'text-gray-500';
    if (rank <= 10) return 'text-blue-600';
    return 'text-gray-400';
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Records</h1>
            <p className="text-gray-600">Track student performance and academic progress</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Bulk Add Records</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Record</span>
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
              placeholder="Search students..."
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
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subjectNames[subject]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Academic Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                          {record.studentName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                        <div className="text-sm text-gray-500">{record.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(record.overallGrade)}`}>
                      {record.overallGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faChartLine} className="text-blue-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{record.gpa}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon 
                        icon={record.rank === 1 ? faTrophy : faAward} 
                        className={`mr-2 ${getRankColor(record.rank)}`} 
                      />
                      <span className={`text-sm font-medium ${getRankColor(record.rank)}`}>
                        #{record.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">{record.attendance}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded transition-colors"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleEditRecordModal(record)}
                      className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-100 rounded transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Academic Record</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={newRecord.studentName}
                  onChange={(e) => setNewRecord({...newRecord, studentName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={newRecord.rollNo}
                  onChange={(e) => setNewRecord({...newRecord, rollNo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ST001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={newRecord.class}
                  onChange={(e) => setNewRecord({...newRecord, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject Scores</h3>
              <div className="space-y-4">
                {['mathematics', 'science', 'english', 'hindi', 'socialStudies'].map(subject => (
                  <div key={subject} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{subjectNames[subject]}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Test 1</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newRecord.subjects[subject]?.unitTest1 || ''}
                          onChange={(e) => updateSubjectScore(subject, 'unitTest1', e.target.value, true)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Test 2</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newRecord.subjects[subject]?.unitTest2 || ''}
                          onChange={(e) => updateSubjectScore(subject, 'unitTest2', e.target.value, true)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Half Yearly</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newRecord.subjects[subject]?.halfYearly || ''}
                          onChange={(e) => updateSubjectScore(subject, 'halfYearly', e.target.value, true)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Final</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newRecord.subjects[subject]?.final || ''}
                          onChange={(e) => updateSubjectScore(subject, 'final', e.target.value, true)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Overall</label>
                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600">
                          {newRecord.subjects[subject]?.overall?.toFixed(1) || '0.0'}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                onClick={handleAddRecord}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Record
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
              <h2 className="text-xl font-bold text-gray-900">Bulk Add Records</h2>
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
                  Upload a CSV file with student academic records including all subject scores
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

      {/* View Record Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Academic Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                {selectedRecord.studentName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedRecord.studentName}</h3>
                <p className="text-gray-600">{selectedRecord.rollNo} • {selectedRecord.class}</p>
                <div className="flex space-x-2 mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(selectedRecord.overallGrade)}`}>
                    Grade: {selectedRecord.overallGrade}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    GPA: {selectedRecord.gpa}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Rank: #{selectedRecord.rank}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Performance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-600" />
                  Overall Performance
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overall Grade:</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${getGradeColor(selectedRecord.overallGrade).replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                      {selectedRecord.overallGrade}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GPA:</span>
                    <span className="font-medium text-blue-600">{selectedRecord.gpa}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Class Rank:</span>
                    <span className={`font-medium ${getRankColor(selectedRecord.rank)}`}>#{selectedRecord.rank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-medium text-green-600">{selectedRecord.attendance}%</span>
                  </div>
                </div>
              </div>

              {/* Academic Year */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-600" />
                  Academic Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Academic Year:</span>
                    <span className="font-medium text-gray-900">{selectedRecord.academicYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium text-gray-900">{selectedRecord.class}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Section:</span>
                    <span className="font-medium text-gray-900">{selectedRecord.section}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium text-gray-900">{selectedRecord.grade}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise Performance */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-purple-600" />
                Subject-wise Performance
              </h4>
              <div className="space-y-4">
                {Object.entries(selectedRecord.subjects).map(([subject, scores]) => (
                  <div key={subject} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-900">{subjectNames[subject]}</h5>
                      <span className="text-lg font-bold text-blue-600">{scores.overall}%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Unit Test 1</p>
                        <p className="text-sm font-medium">{scores.unitTest1}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Unit Test 2</p>
                        <p className="text-sm font-medium">{scores.unitTest2}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Half Yearly</p>
                        <p className="text-sm font-medium">{scores.halfYearly}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Final</p>
                        <p className="text-sm font-medium">{scores.final}%</p>
                      </div>
                    </div>
                  </div>
                ))}
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

      {/* Edit Record Modal would be similar to Add Modal but with pre-filled data */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Academic Record</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={selectedRecord.studentName}
                  onChange={(e) => setSelectedRecord({...selectedRecord, studentName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={selectedRecord.rollNo}
                  onChange={(e) => setSelectedRecord({...selectedRecord, rollNo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={selectedRecord.class}
                  onChange={(e) => setSelectedRecord({...selectedRecord, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject Scores</h3>
              <div className="space-y-4">
                {Object.entries(selectedRecord.subjects).map(([subject, scores]) => (
                  <div key={subject} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{subjectNames[subject]}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Test 1</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scores.unitTest1}
                          onChange={(e) => updateSubjectScore(subject, 'unitTest1', e.target.value, false)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Test 2</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scores.unitTest2}
                          onChange={(e) => updateSubjectScore(subject, 'unitTest2', e.target.value, false)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Half Yearly</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scores.halfYearly}
                          onChange={(e) => updateSubjectScore(subject, 'halfYearly', e.target.value, false)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Final</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scores.final}
                          onChange={(e) => updateSubjectScore(subject, 'final', e.target.value, false)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Overall</label>
                        <div className="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600">
                          {scores.overall}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                onClick={handleEditRecord}
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

export default AcademicRecords;