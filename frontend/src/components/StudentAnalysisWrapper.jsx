import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
import StudentAnalysis from './StudentAnalysis';
import { AuthContext } from './AuthContext';
import './StudentAnalysis.css';

const StudentAnalysisWrapper = () => {
  const { username, role } = useContext(AuthContext);
  const navigate = useNavigate(); // ADD THIS LINE
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Complete student data mapping
    const ALL_STUDENTS = {
    '6HPS17': { id: '6HPS17', name: 'Ram', rollNo: '6HPS17', class: '6th', baseEfficiency: 78 },
    '6HPS18': { id: '6HPS18', name: 'Bhem', rollNo: '6HPS18', class: '6th', baseEfficiency: 82 },
    '6HPS19': { id: '6HPS19', name: 'Shubam', rollNo: '6HPS19', class: '6th', baseEfficiency: 75 },
    '7HPS17': { id: '7HPS17', name: 'Vasu', rollNo: '7HPS17', class: '7th', baseEfficiency: 85 },
    '7HPS18': { id: '7HPS18', name: 'Bhanu', rollNo: '7HPS18', class: '7th', baseEfficiency: 72 },
    '7HPS19': { id: '7HPS19', name: 'Sreenu', rollNo: '7HPS19', class: '7th', baseEfficiency: 89 },
    '8HPS17': { id: '8HPS17', name: 'Gupta', rollNo: '8HPS17', class: '8th', baseEfficiency: 91 },
    '8HPS18': { id: '8HPS18', name: 'Pranja', rollNo: '8HPS18', class: '8th', baseEfficiency: 68 },
    '8HPS19': { id: '8HPS19', name: 'Srenija', rollNo: '8HPS19', class: '8th', baseEfficiency: 84 },
    '9HPS17': { id: '9HPS17', name: 'Viswa', rollNo: '9HPS17', class: '9th', baseEfficiency: 76 },
    '9HPS18': { id: '9HPS18', name: 'Sana', rollNo: '9HPS18', class: '9th', baseEfficiency: 88 },
    '9HPS19': { id: '9HPS19', name: 'Yaseen', rollNo: '9HPS19', class: '9th', baseEfficiency: 79 },
    '10HPS17': { id: '10HPS17', name: 'Pushpa', rollNo: '10HPS17', class: '10th', baseEfficiency: 93 },
    '10HPS18': { id: '10HPS18', name: 'Arya', rollNo: '10HPS18', class: '10th', baseEfficiency: 87 },
    '10HPS19': { id: '10HPS19', name: 'Bunny', rollNo: '10HPS19', class: '10th', baseEfficiency: 71 },
    '11HPS17': { id: '11HPS17', name: 'Virat', rollNo: '11HPS17', class: '11th', baseEfficiency: 95 },
    '11HPS18': { id: '11HPS18', name: 'Rohit', rollNo: '11HPS18', class: '11th', baseEfficiency: 92 },
    '11HPS19': { id: '11HPS19', name: 'Dhoni', rollNo: '11HPS19', class: '11th', baseEfficiency: 98 },
    '12HPS17': { id: '12HPS17', name: 'Udham', rollNo: '12HPS17', class: '12th', baseEfficiency: 86 },
    '12HPS18': { id: '12HPS18', name: 'Mamatha', rollNo: '12HPS18', class: '12th', baseEfficiency: 90 },
    '12HPS19': { id: '12HPS19', name: 'Vikram', rollNo: '12HPS19', class: '12th', baseEfficiency: 83 }
  };

  // Add this at the beginning of StudentAnalysisWrapper component
useEffect(() => {
  // Verify that the logged-in user is actually a student
  if (role !== 'student') {
    console.error('Unauthorized access to student analysis');
    navigate('/login');
    return;
  }
}, [role, navigate]);

  // Get student info based on username (which is the roll number)
  const getStudentInfo = () => {
    // Username is the roll number (e.g., '10HPS18')
    const studentData = ALL_STUDENTS[username];
    
    if (studentData) {
      return studentData;
    }
    
    // Fallback if username doesn't match any roll number
    console.warn(`No student found for username: ${username}`);
    return { 
      id: username, 
      name: username, 
      rollNo: username, 
      class: '10th', 
      baseEfficiency: 75 
    };
  };

  useEffect(() => {
    const studentInfo = getStudentInfo();
    setSelectedStudent(studentInfo);
    
    // Set class based on student's class
    const classMap = {
      '6th': { id: 1, name: 'Class 6th' },
      '7th': { id: 2, name: 'Class 7th' },
      '8th': { id: 3, name: 'Class 8th' },
      '9th': { id: 4, name: 'Class 9th' },
      '10th': { id: 5, name: 'Class 10th' },
      '11th': { id: 6, name: 'Class 11th' },
      '12th': { id: 7, name: 'Class 12th' },
    };
    
    setSelectedClass(classMap[studentInfo.class] || { id: 5, name: 'Class 10th' });
  }, [username]);

   // Optional: Add authentication check
  useEffect(() => {
    // Comment out or remove this check if it's causing issues
    // You can also modify it based on your authentication logic
    /*
    if (role && role !== 'student') {
      console.error('Unauthorized access to student analysis');
      navigate('/login');
      return;
    }
    */
  }, [role, navigate]);

  // Create classes data with only the current student
  const classesData = selectedClass && selectedStudent ? {
    [selectedClass.id]: {
      id: selectedClass.id,
      name: selectedClass.name,
      students: [selectedStudent] // Only include the current student
    }
  } : {};

  return (
    <div className="student-analysis-page">
      <div className="student-analysis-container">
        <div className="page-header">
          <h1 className="page-title">📊 My Performance Analysis</h1>
        </div>
        
        <div className="student-info-banner">
          <div className="student-info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{selectedStudent?.name || username}</span>
          </div>
          <div className="student-info-item">
            <span className="info-label">Roll No:</span>
            <span className="info-value">{selectedStudent?.rollNo || username}</span>
          </div>
          <div className="student-info-item">
            <span className="info-label">Class:</span>
            <span className="info-value">{selectedClass?.name || 'Class 10th'}</span>
          </div>
        </div>

        {selectedStudent && selectedClass && (
          <StudentAnalysis
            selectedClass={selectedClass}
            selectedStudent={selectedStudent}
            onStudentSelect={() => {}} // No-op function
            classesData={classesData}
            onClassChange={() => {}} // No-op function
            isStudentView={true} // This will hide dropdowns
            readOnly={true} // Add this prop for extra safety
          />
        )}
      </div>
    </div>
  );
};

export default StudentAnalysisWrapper;