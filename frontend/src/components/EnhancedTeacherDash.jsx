// Complete Enhanced Teacher Dashboard with Student Analysis - EnhancedTeacherDash.jsx

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Sector, LineChart, Line, Area, AreaChart, ReferenceLine
} from 'recharts';

import './EnhancedTeacherDash.css';
import axiosInstance from '../api/axiosInstance';
import TeacherDashboard from './TeacherDashboard';
import StudentDash from './StudentDash';
import QuickExerciseComponent from './QuickExerciseComponent';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const ERROR_COLORS = {
  Conceptual: '#ef4444',
  Computational: '#f97316', 
  Careless: '#eab308',
  'No Error': '#22c55e'
};

// Mock data for different classes (6th to 12th)
const classesData = {
  1: {
    id: 1,
    name: "Class 6th",
    students: [
      { id: 1, name: "Arjun Patel", class: "6th", efficiency: 78 },
      { id: 2, name: "Sneha Gupta", class: "6th", efficiency: 82 },
      { id: 3, name: "Rohit Sharma", class: "6th", efficiency: 75 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 76, tasksCompleted: 45, avgTime: 2.1 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 82, tasksCompleted: 52, avgTime: 1.8 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 84, tasksCompleted: 58, avgTime: 1.7 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 78, tasksCompleted: 48, avgTime: 2.2 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 74, tasksCompleted: 42, avgTime: 2.5 }
      ],
      studentProgressComparison: [
        { student: 'Arjun Patel', efficiencyImprovement: 10.7, regularScoreImprovement: -13.5, currentEfficiency: 78 },
        { student: 'Sneha Gupta', efficiencyImprovement: 14.5, regularScoreImprovement: 0, currentEfficiency: 82 },
        { student: 'Rohit Sharma', efficiencyImprovement: 13.5, regularScoreImprovement: -0.5, currentEfficiency: 75 }
      ],
      learningGapAnalysis: [
        { topic: 'Basic Arithmetic', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
        { topic: 'Fractions', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
        { topic: 'Geometry Basics', 'Students with High Gap': 25, 'Students with Medium Gap': 35, 'Students with Low Gap': 20, 'Students with No Gap': 20 },
        { topic: 'Decimals', 'Students with High Gap': 10, 'Students with Medium Gap': 20, 'Students with Low Gap': 40, 'Students with No Gap': 30 },
        { topic: 'Percentages', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20 }
      ]
    }
  },
  2: {
    id: 2,
    name: "Class 7th",
    students: [
      { id: 4, name: "Kavya Singh", class: "7th", efficiency: 85 },
      { id: 5, name: "Amit Kumar", class: "7th", efficiency: 79 },
      { id: 6, name: "Riya Jain", class: "7th", efficiency: 88 }
    ],
    analytics: {
      learningGapAnalysis: [
        { topic: 'Integers', 'Students with High Gap': 12, 'Students with Medium Gap': 28, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
        { topic: 'Algebra Introduction', 'Students with High Gap': 18, 'Students with Medium Gap': 32, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
        { topic: 'Ratios and Proportions', 'Students with High Gap': 22, 'Students with Medium Gap': 33, 'Students with Low Gap': 25, 'Students with No Gap': 20 }
      ]
    }
  },
  3: {
    id: 3,
    name: "Class 8th",
    students: [
      { id: 7, name: "Dev Agarwal", class: "8th", efficiency: 90 },
      { id: 8, name: "Ananya Reddy", class: "8th", efficiency: 83 },
      { id: 9, name: "Karan Mehta", class: "8th", efficiency: 77 }
    ],
    analytics: {
      learningGapAnalysis: [
        { topic: 'Linear Equations', 'Students with High Gap': 14, 'Students with Medium Gap': 26, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
        { topic: 'Mensuration', 'Students with High Gap': 19, 'Students with Medium Gap': 31, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
        { topic: 'Exponents', 'Students with High Gap': 21, 'Students with Medium Gap': 34, 'Students with Low Gap': 25, 'Students with No Gap': 20 }
      ]
    }
  },
  4: {
    id: 4,
    name: "Class 9th",
    students: [
      { id: 10, name: "Ishita Bansal", class: "9th", efficiency: 92 },
      { id: 11, name: "Varun Kapoor", class: "9th", efficiency: 86 },
      { id: 12, name: "Pooja Nair", class: "9th", efficiency: 81 }
    ],
    analytics: {
      learningGapAnalysis: [
        { topic: 'Polynomials', 'Students with High Gap': 16, 'Students with Medium Gap': 24, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
        { topic: 'Coordinate Geometry', 'Students with High Gap': 22, 'Students with Medium Gap': 28, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
        { topic: 'Statistics', 'Students with High Gap': 18, 'Students with Medium Gap': 32, 'Students with Low Gap': 30, 'Students with No Gap': 20 }
      ]
    }
  },
  5: {
    id: 5,
    name: "Class 10th",
    students: [
      { id: 13, name: "Aryan Shah", class: "10th", efficiency: 89 },
      { id: 14, name: "Sakshi Tiwari", class: "10th", efficiency: 94 },
      { id: 15, name: "Harsh Yadav", class: "10th", efficiency: 76 }
    ],
    analytics: {
      learningGapAnalysis: [
        { topic: 'Quadratic Equations', 'Students with High Gap': 20, 'Students with Medium Gap': 25, 'Students with Low Gap': 30, 'Students with No Gap': 25 },
        { topic: 'Trigonometry', 'Students with High Gap': 25, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 20 },
        { topic: 'Circles', 'Students with High Gap': 15, 'Students with Medium Gap': 35, 'Students with Low Gap': 30, 'Students with No Gap': 20 }
      ]
    }
  },
  6: {
    id: 6,
    name: "Class 11th",
    students: [
      { id: 16, name: "Nisha Chawla", class: "11th", efficiency: 87 },
      { id: 17, name: "Siddharth Roy", class: "11th", efficiency: 91 },
      { id: 18, name: "Deepika Sinha", class: "11th", efficiency: 84 }
    ],
    analytics: {
      learningGapAnalysis: [
        { topic: 'Sets and Functions', 'Students with High Gap': 18, 'Students with Medium Gap': 27, 'Students with Low Gap': 30, 'Students with No Gap': 25 },
        { topic: 'Limits and Derivatives', 'Students with High Gap': 28, 'Students with Medium Gap': 32, 'Students with Low Gap': 25, 'Students with No Gap': 15 },
        { topic: 'Permutations', 'Students with High Gap': 22, 'Students with Medium Gap': 28, 'Students with Low Gap': 30, 'Students with No Gap': 20 }
      ]
    }
  },
  7: {
    id: 7,
    name: "Class 12th",
    students: [
      { id: 19, name: "Vikram Singh", class: "12th", efficiency: 88 },
      { id: 20, name: "Meera Patel", class: "12th", efficiency: 92 },
      { id: 21, name: "Sanjay Kumar", class: "12th", efficiency: 78 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 76, tasksCompleted: 45, avgTime: 2.1 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 82, tasksCompleted: 52, avgTime: 1.8 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 84, tasksCompleted: 58, avgTime: 1.7 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 78, tasksCompleted: 48, avgTime: 2.2 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 74, tasksCompleted: 42, avgTime: 2.5 }
      ],
      studentProgressComparison: [
        { student: 'Vikram Singh', efficiencyImprovement: 16.0, regularScoreImprovement: 0, currentEfficiency: 88 },
        { student: 'Meera Patel', efficiencyImprovement: 9.2, regularScoreImprovement: -1.8, currentEfficiency: 92 },
        { student: 'Sanjay Kumar', efficiencyImprovement: 13.5, regularScoreImprovement: -0.5, currentEfficiency: 78 }
      ],
      learningGapAnalysis: [
        { topic: 'Calculus Applications', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
        { topic: 'Vector Algebra', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
        { topic: 'Probability', 'Students with High Gap': 25, 'Students with Medium Gap': 35, 'Students with Low Gap': 20, 'Students with No Gap': 20 },
        { topic: 'Matrices', 'Students with High Gap': 10, 'Students with Medium Gap': 20, 'Students with Low Gap': 40, 'Students with No Gap': 30 },
        { topic: 'Differential Equations', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20 }
      ]
    }
  }
};

const EnhancedTeacherDash = () => {
  const [selectedClass, setSelectedClass] = useState(classesData[1]);
  const [activeTab, setActiveTab] = useState('class');
  const [classAnalysisTab, setClassAnalysisTab] = useState('overview');
  const [showAIReport, setShowAIReport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState('Matrices');
  const [studentData, setStudentData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(1);
  const [studentDetails, setStudentDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New state for student analysis
  const [studentAnalysisType, setStudentAnalysisType] = useState('homework');
  const [studentAnalysisSubTab, setStudentAnalysisSubTab] = useState('progression');

  // Sample data matching the images provided
  const progressTrendsData = [
    { date: 'Jun 23', hwAverage: 20, cwAverage: 35, errorHw: 8, errorCw: 15 },
    { date: 'Jun 25', hwAverage: 32, cwAverage: 42, errorHw: 10, errorCw: 12 },
    { date: 'Jun 27', hwAverage: 72, cwAverage: 58, errorHw: 8, errorCw: 18 },
    { date: 'Jun 29', hwAverage: 78, cwAverage: 55, errorHw: 5, errorCw: 15 },
    { date: 'Jul 01', hwAverage: 80, cwAverage: 55, errorHw: 6, errorCw: 20 },
    { date: 'Jul 03', hwAverage: 82, cwAverage: 62, errorHw: 8, errorCw: 18 }
  ];

  const topPerformersData = [
    { student: '10HPS21', average: 58 },
    { student: '10HPS19', average: 52 },
    { student: '10HPS20', average: 48 },
    { student: '10HPS17', average: 46 },
    { student: '10HPS18', average: 42 }
  ];

  const strugglingTopicsData = [
    { topic: 'Algebra - Linear Equations', score: 47, fullName: 'Algebra - Linear Equations' },
    { topic: 'Calculus - Derivatives', score: 52, fullName: 'Calculus - Derivatives' },
    { topic: 'Statistics', score: 56, fullName: 'Statistics' },
    { topic: 'Trigonometry', score: 57, fullName: 'Trigonometry' },
    { topic: 'Functions and Graphs', score: 57, fullName: 'Functions and Graphs' }
  ];

  const excellingTopicsData = [
    { topic: 'Calculus - Integration', score: 58 },
    { topic: 'Quadratic Applications', score: 59 },
    { topic: 'Probability', score: 61 },
    { topic: 'Algebra - Rational Functions', score: 64 },
    { topic: 'Coordinate Geometry', score: 71 }
  ];

  const topicComparisonData = [
    { topic: 'Algebra - Linear Equations', hw: 58, cw: 40, fullName: 'Algebra - Linear Equations' },
    { topic: 'Calculus - Derivatives', hw: 55, cw: 47, fullName: 'Calculus - Derivatives' },
    { topic: 'Statistics', hw: 76, cw: 47, fullName: 'Statistics' },
    { topic: 'Trigonometry', hw: 64, cw: 35, fullName: 'Trigonometry' },
    { topic: 'Functions and Graphs', hw: 95, cw: 44, fullName: 'Functions and Graphs' },
    { topic: 'Calculus - Integration', hw: 97, cw: 45, fullName: 'Calculus - Integration' },
    { topic: 'Quadratic Applications', hw: 63, cw: 55, fullName: 'Quadratic Applications' },
    { topic: 'Probability', hw: 66, cw: 47, fullName: 'Probability' },
    { topic: 'Algebra - Rational Functions', hw: 84, cw: 54, fullName: 'Algebra - Rational Functions' },
    { topic: 'Coordinate Geometry', hw: 62, cw: 84, fullName: 'Coordinate Geometry' }
  ];

  const topicPerformanceDistribution = [
    { topic: 'Algebra - Linear Equations', q1: 15, q3: 70, median: 45, min: 5, max: 85 },
    { topic: 'Calculus - Derivatives', q1: 40, q3: 75, median: 60, min: 0, max: 95 },
    { topic: 'Statistics', q1: 35, q3: 85, median: 65, min: 0, max: 95 },
    { topic: 'Trigonometry', q1: 50, q3: 85, median: 70, min: 25, max: 100 },
    { topic: 'Functions and Graphs', q1: 35, q3: 85, median: 60, min: 0, max: 95 }
  ];

  const detailedTopicStats = [
    { id: 3, topic: 'Algebra - Linear Equations', overallAvg: 46.7, hwAvg: 58.3, cwAvg: 40.8, totalQuestions: 30, stdDev: 33.17 },
    { id: 0, topic: 'Calculus - Derivatives', overallAvg: 52.2, hwAvg: 55.1, cwAvg: 47.5, totalQuestions: 40, stdDev: 22.55 },
    { id: 4, topic: 'Statistics', overallAvg: 56.4, hwAvg: 76, cwAvg: 46.7, totalQuestions: 30, stdDev: 28.1 },
    { id: 8, topic: 'Trigonometry', overallAvg: 56.9, hwAvg: 64.2, cwAvg: 35, totalQuestions: 20, stdDev: 29.97 },
    { id: 5, topic: 'Functions and Graphs', overallAvg: 57, hwAvg: 51.7, cwAvg: 62.2, totalQuestions: 30, stdDev: 24.84 },
    { id: 2, topic: 'Calculus - Integration', overallAvg: 58.1, hwAvg: 96.7, cwAvg: 45.3, totalQuestions: 20, stdDev: 36.86 },
    { id: 6, topic: 'Quadratic Applications', overallAvg: 59, hwAvg: 62.8, cwAvg: 55.1, totalQuestions: 60, stdDev: 27.65 },
    { id: 9, topic: 'Probability', overallAvg: 60.8, hwAvg: 65.6, cwAvg: 46.7, totalQuestions: 20, stdDev: 23.73 },
    { id: 7, topic: 'Algebra - Rational Functions', overallAvg: 64, hwAvg: 84, cwAvg: 54, totalQuestions: 15, stdDev: 28.47 },
    { id: 1, topic: 'Coordinate Geometry', overallAvg: 71.4, hwAvg: 62.1, cwAvg: 83.7, totalQuestions: 35, stdDev: 31.83 }
  ];

  const classPerformanceData = [
    { className: '10HPS17', homeworkAverage: 12, classworkAverage: 20 },
    { className: '10HPS18', homeworkAverage: 18, classworkAverage: 18 },
    { className: '10HPS19', homeworkAverage: 28, classworkAverage: 65 }
  ];

  const overallStatsData = [
    { type: 'Homework', average: 19, color: '#3b82f6' },
    { type: 'Classwork', average: 30, color: '#a855f7' }
  ];

  // Enhanced Student Analysis Data
  const studentScoreProgressionData = [
    { date: 'Week 1', homework: 85, classwork: 78 },
    { date: 'Week 2', homework: 88, classwork: 82 },
    { date: 'Week 3', homework: 92, classwork: 85 },
    { date: 'Week 4', homework: 87, classwork: 88 },
    { date: 'Week 5', homework: 94, classwork: 91 },
    { date: 'Week 6', homework: 89, classwork: 87 }
  ];

  const studentQuestionPerformanceData = [
    { question: 'Q1', correct: 85, incorrect: 15, topic: 'Algebra' },
    { question: 'Q2', correct: 92, incorrect: 8, topic: 'Geometry' },
    { question: 'Q3', correct: 78, incorrect: 22, topic: 'Calculus' },
    { question: 'Q4', correct: 88, incorrect: 12, topic: 'Statistics' },
    { question: 'Q5', correct: 95, incorrect: 5, topic: 'Trigonometry' }
  ];

  const studentTopicAnalysisData = [
    { topic: 'Algebra', homework: 88, classwork: 85, average: 86.5 },
    { topic: 'Geometry', homework: 92, classwork: 89, average: 90.5 },
    { topic: 'Calculus', homework: 78, classwork: 82, average: 80 },
    { topic: 'Statistics', homework: 85, classwork: 87, average: 86 },
    { topic: 'Trigonometry', homework: 91, classwork: 88, average: 89.5 }
  ];

  const dateWiseComparisonData = [
    { date: '2024-01-15', homework: 85, classwork: 78, difference: 7 },
    { date: '2024-01-22', homework: 88, classwork: 82, difference: 6 },
    { date: '2024-01-29', homework: 92, classwork: 85, difference: 7 },
    { date: '2024-02-05', homework: 87, classwork: 88, difference: -1 },
    { date: '2024-02-12', homework: 94, classwork: 91, difference: 3 },
    { date: '2024-02-19', homework: 89, classwork: 87, difference: 2 }
  ];

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const response = await axiosInstance.get('/teacher-dashboard/');
      console.log('teacher-data', response.data);
      
      // Debug the student data structure
      if (response.data.students && response.data.students.length > 0) {
        console.log('📊 Student data structure debug:');
        console.log('Total students:', response.data.students.length);
        console.log('First student object:', response.data.students[0]);
        console.log('Available fields in first student:', Object.keys(response.data.students[0]));
        
        // Check if any students have undefined names
        const studentsWithoutNames = response.data.students.filter(student => !student.name && !student.username && !student.student_name);
        if (studentsWithoutNames.length > 0) {
          console.warn('⚠️ Students without name field:', studentsWithoutNames.length);
          console.log('Example student without name:', studentsWithoutNames[0]);
        }
      }
      
      setTeacherData(response.data);
      
      if (response.data.students && response.data.students.length > 0) {
        setSelectedClass({
          id: 1,
          name: "Class 6th",
          students: response.data.students
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setLoading(false);
    }
  };

  const getAnalyticsData = () => {
    if (!selectedClass.analytics || !selectedClass.analytics.learningGapAnalysis) {
      return {
        weeklyEfficiency: progressTrendsData,
        studentProgressComparison: selectedClass.students ? selectedClass.students.map(student => ({
          student: student.name || student.username || student.student_name || 'Unknown Student',
          efficiencyImprovement: Math.random() * 20 - 5,
          regularScoreImprovement: Math.random() * 10 - 5,
          currentEfficiency: student.efficiency || Math.random() * 40 + 60
        })) : [],
        learningGapAnalysis: [
          { topic: 'Algebraic Expressions', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
          { topic: 'Linear Equations', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
          { topic: 'Quadratic Functions', 'Students with High Gap': 25, 'Students with Medium Gap': 35, 'Students with Low Gap': 20, 'Students with No Gap': 20 },
          { topic: 'Matrices', 'Students with High Gap': 10, 'Students with Medium Gap': 20, 'Students with Low Gap': 40, 'Students with No Gap': 30 },
          { topic: 'Trigonometry', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20 }
        ]
      };
    }
    return selectedClass.analytics;
  };

  const generateStudentData = (studentName, classId) => {
    const baseEfficiency = Math.floor(Math.random() * 30) + 60;
    
    return {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', efficiency: baseEfficiency - 5 + Math.random() * 10 },
        { week: 'May 08 - May 08', efficiency: baseEfficiency - 3 + Math.random() * 10 },
        { week: 'May 15 - May 15', efficiency: baseEfficiency + Math.random() * 10 },
        { week: 'May 22 - May 22', efficiency: baseEfficiency - 2 + Math.random() * 10 },
        { week: 'May 29 - May 29', efficiency: baseEfficiency + 2 + Math.random() * 8 }
      ],
      errorAnalysis: [
        { week: 'May 01 - May 01', Conceptual: 80, Computational: 15, Careless: 5, 'No Error': 20 },
        { week: 'May 08 - May 08', Conceptual: 75, Computational: 18, Careless: 7, 'No Error': 25 },
        { week: 'May 15 - May 15', Conceptual: 60, Computational: 20, Careless: 5, 'No Error': 40 },
        { week: 'May 22 - May 22', Conceptual: 85, Computational: 10, Careless: 5, 'No Error': 18 },
        { week: 'May 29 - May 29', Conceptual: 70, Computational: 15, Careless: 8, 'No Error': 38 }
      ],
      chapterPerformance: [
        { week: 'Week 1', 'Chapter 1': 90, 'Chapter 2': 67, 'Chapter 3': 70, 'Chapter 4': 85, 'Chapter 5': 88, 'Chapter 6': 93, 'Chapter 7': 80, 'Chapter 8': 75, 'Chapter 9': 70, overallAverage: 78 },
        { week: 'Week 2', 'Chapter 1': 92, 'Chapter 2': 70, 'Chapter 3': 72, 'Chapter 4': 87, 'Chapter 5': 90, 'Chapter 6': 95, 'Chapter 7': 82, 'Chapter 8': 77, 'Chapter 9': 72, overallAverage: 80 },
        { week: 'Week 3', 'Chapter 1': 94, 'Chapter 2': 68, 'Chapter 3': 74, 'Chapter 4': 89, 'Chapter 5': 92, 'Chapter 6': 96, 'Chapter 7': 84, 'Chapter 8': 79, 'Chapter 9': 74, overallAverage: 82 },
        { week: 'Week 4', 'Chapter 1': 96, 'Chapter 2': 65, 'Chapter 3': 76, 'Chapter 4': 91, 'Chapter 5': 94, 'Chapter 6': 98, 'Chapter 7': 86, 'Chapter 8': 81, 'Chapter 9': 76, overallAverage: 84 },
        { week: 'Week 5', 'Chapter 1': 98, 'Chapter 2': 62, 'Chapter 3': 78, 'Chapter 4': 93, 'Chapter 5': 96, 'Chapter 6': 100, 'Chapter 7': 88, 'Chapter 8': 83, 'Chapter 9': 78, overallAverage: 86 }
      ]
    };
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const data = generateStudentData(student.name || student.username || student.student_name || 'Unknown Student', selectedClass.id);
    setStudentData(data);
  };

  const handleAssignmentSubmit = async (assignment, mode) => {
    try {
      const endpoint = mode === "classwork" ? "/classwork/" : "/homework/";
      const response = await axiosInstance.post(endpoint, assignment);
      
      if (response.status === 201) {
        console.log(`${mode} created successfully:`, response.data);
        
        if (mode === "homework") {
          setAssignments(prev => [...prev, response.data]);
        }
        
        alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} created successfully!`);
      }
    } catch (error) {
      console.error(`Error creating ${mode}:`, error);
      alert(`Failed to create ${mode}. Please try again.`);
    }
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-entry" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render Class Analysis Sub-Tabs
  const renderClassAnalysisSubTabs = () => {
    return (
      <div className="sub-tabs-container">
        <div className="sub-tabs">
          <button
            onClick={() => setClassAnalysisTab('overview')}
            className={`sub-tab-button ${classAnalysisTab === 'overview' ? 'active' : ''}`}
          >
            📊 Class Overview
          </button>
          <button
            onClick={() => setClassAnalysisTab('trends')}
            className={`sub-tab-button ${classAnalysisTab === 'trends' ? 'active' : ''}`}
          >
            📈 Class Progress Trends
          </button>
          <button
            onClick={() => setClassAnalysisTab('topics')}
            className={`sub-tab-button ${classAnalysisTab === 'topics' ? 'active' : ''}`}
          >
            🎯 Topic Analysis
          </button>
          <button
            onClick={() => setClassAnalysisTab('summary')}
            className={`sub-tab-button ${classAnalysisTab === 'summary' ? 'active' : ''}`}
          >
            📋 Summary
          </button>
        </div>
      </div>
    );
  };

  // Class Overview Content
  const renderClassOverview = () => {
    return (
      <div className="flex-column-gap">
        <div className="rounded-bottom-card">
          <div className="mb-20">
            <h3 className="section-title">📊 Class Overview Dashboard</h3>
            <p className="section-subtitle">Comprehensive performance analysis for {selectedClass.name}</p>
          </div>

          <div className="two-column-grid">
            <div>
              <h4 className="subsection-title">Student Performance Comparison</h4>
              <div className="chart-height-300">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformanceData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="className" fontSize={12} color="#6b7280" />
                    <YAxis fontSize={12} color="#6b7280" domain={[0, 80]} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'homeworkAverage' ? 'Homework Average' : 'Classwork Average']}
                      labelFormatter={(label) => `Class: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="homeworkAverage" fill="#3b82f6" name="Homework Average" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="classworkAverage" fill="#a855f7" name="Classwork Average" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="subsection-title">Overall Class Statistics and Performance Comparison</h4>
              <div className="chart-height-300">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overallStatsData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="type" fontSize={12} color="#6b7280" />
                    <YAxis fontSize={12} color="#6b7280" domain={[0, 70]} />
                    <Tooltip formatter={(value) => [value, 'Average Score']} />
                    <Bar dataKey="average" radius={[8, 8, 0, 0]}>
                      {overallStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="four-column-grid">
            <div className="metric-card-blue">
              <div className="metric-value-blue">19%</div>
              <div className="metric-label">Overall Homework Average</div>
            </div>
            
            <div className="metric-card-green">
              <div className="metric-value-green">30%</div>
              <div className="metric-label">Overall Classwork Average</div>
            </div>
            
            <div className="metric-card-yellow">
              <div className="metric-value-yellow">{selectedClass.students ? selectedClass.students.length : 0}</div>
              <div className="metric-label">Total Students</div>
            </div>
            
            <div className="metric-card-pink">
              <div className="metric-value-pink">11%</div>
              <div className="metric-label">Performance Gap</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Class Progress Trends Content
  const renderClassProgressTrends = () => {
    return (
      <div className="rounded-bottom-card">
        <div className="mb-20">
          <h3 className="section-title">📈 Class Progress Trends</h3>
          <p className="section-subtitle">Assignment Progress and Top Performers</p>
        </div>

        <div className="filter-buttons">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button key={filter} className={`filter-button ${filter === '1M' ? 'active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="two-column-grid">
          <div>
            <h4 className="subsection-title">Assignment-wise Class Average</h4>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} color="#6b7280" />
                  <YAxis fontSize={12} color="#6b7280" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hwAverage" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} name="HW Class Average" />
                  <Line type="monotone" dataKey="cwAverage" stroke="#e11d48" strokeWidth={3} dot={{ fill: '#e11d48', strokeWidth: 2, r: 6 }} name="CW Class Average" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="subsection-title">Top Performers</h4>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPerformersData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="student" angle={-45} textAnchor="end" height={60} fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 70]} />
                  <Tooltip formatter={(value) => [value + '%', 'Overall Average']} />
                  <Bar dataKey="average" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Topic Analysis Content  
  const renderTopicAnalysis = () => {
    const safeStrugglingTopicsData = strugglingTopicsData || [];
    const safeExcellingTopicsData = excellingTopicsData || [];
    const safeTopicComparisonData = topicComparisonData || [];
    const safeTopicPerformanceDistribution = topicPerformanceDistribution || [];
    const safeDetailedTopicStats = detailedTopicStats || [];

    return (
      <div className="rounded-bottom-card">
        <div className="mb-20">
          <h3 className="section-title">🎯 Class Topic Analysis</h3>
          <p className="section-subtitle">Across All Students</p>
        </div>

        <div className="two-column-grid mb-32">
          <div>
            <div className="mb-16">
              <h4 className="subsection-title">Topics Class Struggles With Most</h4>
              <div className="topic-stats-text">
                Topic Statistics<br/>
                Class Average: 56.4%<br/>
                Submissions: 30
              </div>
            </div>
            <div className="chart-height-250">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeStrugglingTopicsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 70]} />
                  <Tooltip formatter={(value) => [value + '%', 'Average Score']} labelFormatter={(label, payload) => {
                    const item = safeStrugglingTopicsData.find(d => d.topic === label);
                    return item ? item.fullName || item.topic : label;
                  }} />
                  <Bar dataKey="score" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="mb-16">
              <h4 className="subsection-title">Topics Class Excels In</h4>
              <div className="legend-flex">
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#ef4444' }}></div>
                  Struggling Topics
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#22c55e' }}></div>
                  Excelling Topics
                </div>
              </div>
            </div>
            <div className="chart-height-250">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeExcellingTopicsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 80]} />
                  <Tooltip formatter={(value) => [value + '%', 'Average Score']} />
                  <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="two-column-grid mb-32">
          <div>
            <h4 className="subsection-title">Topic-wise HW vs CW Comparison</h4>
            <div className="chart-height-350">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeTopicComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip formatter={(value, name) => [value + '%', name === 'hw' ? 'Homework' : 'Classwork']} labelFormatter={(label, payload) => {
                    const item = safeTopicComparisonData.find(d => d.topic === label);
                    return item ? item.fullName || item.topic : label;
                  }} />
                  <Legend />
                  <Bar dataKey="hw" fill="#06b6d4" name="Homework" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="cw" fill="#a855f7" name="Classwork" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="subsection-title">Topic Performance Distribution</h4>
            <div className="chart-height-350">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeTopicPerformanceDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip formatter={(value, name) => [value + '%', 'Performance Range']} />
                  <Bar dataKey="q3" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h4 className="subsection-title">📊 Detailed Topic Statistics</h4>
          <div className="data-table-container">
            <table className="enhanced-data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-enhanced">Topic</th>
                  <th className="table-header-enhanced table-header-center">Overall Avg (%)</th>
                  <th className="table-header-enhanced table-header-center">HW Avg (%)</th>
                  <th className="table-header-enhanced table-header-center">CW Avg (%)</th>
                  <th className="table-header-enhanced table-header-center">Total Questions</th>
                  <th className="table-header-enhanced table-header-center">Std Deviation</th>
                </tr>
              </thead>
              <tbody>
                {safeDetailedTopicStats.map((row, index) => (
                  <tr key={row.id || index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <td className="table-cell-enhanced">
                      <span className="table-id-cell">{row.id}</span>
                      {row.topic}
                    </td>
                    <td className="table-cell-enhanced table-cell-center">{row.overallAvg}</td>
                    <td className="table-cell-enhanced table-cell-center">{row.hwAvg}</td>
                    <td className="table-cell-enhanced table-cell-center">{row.cwAvg}</td>
                    <td className="table-cell-enhanced table-cell-center">{row.totalQuestions}</td>
                    <td className="table-cell-enhanced table-cell-center">{row.stdDev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Summary Content
  const renderSummary = () => {
    return (
      <div className="rounded-bottom-card">
        <div className="mb-20">
          <h3 className="section-title">📋 CLASSROOM PERFORMANCE SUMMARY</h3>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">👥 Class Overview: ↗️</h4>
          <ul className="summary-list">
            <li><strong>Total Students:</strong> {selectedClass.students ? selectedClass.students.length : 0}</li>
            <li><strong>Students with Homework Data:</strong> {selectedClass.students ? selectedClass.students.length : 0}</li>
            <li><strong>Students with Classwork Data:</strong> {selectedClass.students ? selectedClass.students.length : 0}</li>
            <li><strong>Total Assignments Analyzed:</strong> 60</li>
          </ul>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">📊 Performance Statistics:</h4>
          <ul className="summary-list">
            <li><strong>Overall Class Average:</strong> 56.5%</li>
            <li><strong>Homework Class Average:</strong> 61.6%</li>
            <li><strong>Classwork Class Average:</strong> 51.4%</li>
            <li><strong>Performance Gap (CW - HW):</strong> -10.2%</li>
          </ul>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">🎯 Grade Distribution:</h4>
          <div className="highlight-box highlight-box-blue">
            <div className="highlight-text-blue">★★F (&lt;60%):★★ 27 assignments (45.0%)</div>
          </div>
          <ul className="summary-list">
            <li><strong>C (70-79%):</strong> 13 assignments (21.7%)</li>
            <li><strong>B (80-89%):</strong> 13 assignments (21.7%)</li>
            <li><strong>A (90-100%):</strong> 1 assignments (1.7%)</li>
            <li><strong>D (60-69%):</strong> 6 assignments (10.0%)</li>
          </ul>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">🏆 Top Performers: ↗️</h4>
          <div className="highlight-box highlight-box-blue">
            <div className="highlight-text-blue">1. ★★10HPS21:★★ 69.0%</div>
          </div>
          <ul className="summary-list-none">
            <li>2. <strong>10HPS19:</strong> 66.8% 3. <strong>10HPS20:</strong> 52.2%</li>
          </ul>
          
          <div className="highlight-box highlight-box-yellow">
            <div className="highlight-text-yellow">### 📚 ★★Students Needing Support:★★</div>
            <div className="highlight-text-yellow">1. ★★10HPS18:★★ 44.0%</div>
          </div>
          <ul className="summary-list-none">
            <li>2. <strong>10HPS17:</strong> 50.1% 3. <strong>10HPS20:</strong> 52.2%</li>
          </ul>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">💪 Strongest Topics:</h4>
          <div className="highlight-box highlight-box-green">
            <div className="highlight-text-green">1. ★★Coordinate Geometry:★★ 71.4%</div>
          </div>
          <div className="topic-text">2. <strong>Algebra - Rational Functions:</strong> 64.0% 3. <strong>Probability:</strong> 60.8%</div>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">🔍 Topics Needing Attention:</h4>
          <div className="highlight-box highlight-box-red">
            <div className="highlight-text-red">1. ★★Algebra - Linear Equations:★★ 46.7%</div>
          </div>
          <div className="topic-text">2. <strong>Calculus - Derivatives:</strong> 52.2% 3. <strong>Statistics:</strong> 56.4%</div>
        </div>

        <div>
          <h4 className="subsection-title">💡 Recommendations:</h4>
          <div className="highlight-box highlight-box-cyan">
            <div className="highlight-text-cyan">- 📝 ★★Focus on Classwork:★★ Class performs 10.2% better on homework. Consider reinforcing classwork concepts.</div>
          </div>
          <ul className="summary-list">
            <li>🎯 <strong>Priority Topics:</strong> Focus additional instruction on Algebra - Linear Equations, Calculus - Derivatives, Statistics.</li>
            <li>⚠️ <strong>Support Needed:</strong> 33 assignments show grades D or F. Consider additional support strategies.</li>
          </ul>
        </div>
      </div>
    );
  };

  // Learning Gap Analysis (for backward compatibility)
  const renderLearningGapAnalysis = () => {
    const analyticsData = getAnalyticsData();
    
    if (!analyticsData || !analyticsData.learningGapAnalysis) {
      return (
        <div className="empty-state">
          <h3>Learning Gap Analysis</h3>
          <p>No data available for learning gap analysis.</p>
        </div>
      );
    }
    
    return (
      <div className="dashboard-card mb-24">
        <div className="mb-20">
          <h3 className="section-title">🎯 Class-wide Learning Gap Analysis</h3>
          <p className="section-subtitle">Percentage of Students with Learning Gaps by Topic - {selectedClass.name}</p>
        </div>
        <div className="chart-height-600">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.learningGapAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
              <YAxis label={{ value: 'Percentage of Students (%)', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
              <Tooltip formatter={(value, name) => [`${value}%`, name]} labelFormatter={(label) => `Topic: ${label}`} />
              <Legend />
              <Bar dataKey="Students with High Gap" stackId="a" fill="#dc2626" name="High Gap (Critical)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Students with Medium Gap" stackId="a" fill="#f59e0b" name="Medium Gap (Moderate)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Students with Low Gap" stackId="a" fill="#eab308" name="Low Gap (Minor)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Students with No Gap" stackId="a" fill="#22c55e" name="No Gap (Proficient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="legend-container">
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#dc2626' }}></div>
              <span><strong>High Gap (Critical)</strong> - Needs immediate attention</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></div>
              <span><strong>Medium Gap (Moderate)</strong> - Requires support</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#eab308' }}></div>
              <span><strong>Low Gap (Minor)</strong> - Monitor progress</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#22c55e' }}></div>
              <span><strong>No Gap (Proficient)</strong> - On track</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render class sidebar
  const renderClassSidebar = () => {
    return (
      <div className="sidebar-card">
        <h4 className="sidebar-title">Select Class</h4>
        <div className="sidebar-list">
          {Object.values(classesData).map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => setSelectedClass(classItem)}
              className={`class-item ${selectedClass.id === classItem.id ? 'active' : ''}`}
            >
              <div className="class-item-name">{classItem.name}</div>
              <div className="class-item-count">{classItem.students.length} students</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // FIXED: Render student list with class selection dropdown
  const renderStudentList = () => {
    // Get all students from the selected class for analysis
    const currentClassStudents = selectedClass.students || [];
    
    // Filter students based on search term
    const filteredStudents = currentClassStudents.filter(student => {
      const studentName = student.name || student.username || student.student_name || '';
      return studentName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sample student data for demonstration (replace with actual API data)
    const sampleStudents = [
      { id: 1, name: 'Sanjay Kumar', class: 'Class 12th', efficiency: 78 },
      { id: 2, name: 'Priya Sharma', class: 'Class 12th', efficiency: 73 },
      { id: 3, name: 'Ahmed Khan', class: 'Class 12th', efficiency: 85 },
      { id: 4, name: 'Rahul Verma', class: 'Class 12th', efficiency: 58 },
      { id: 5, name: 'Anita Singh', class: 'Class 11th', efficiency: 92 },
      { id: 6, name: 'Vikas Gupta', class: 'Class 11th', efficiency: 67 },
      { id: 7, name: 'Neha Patel', class: 'Class 10th', efficiency: 89 },
      { id: 8, name: 'Rohit Sharma', class: 'Class 10th', efficiency: 74 },
      { id: 9, name: 'Kavya Reddy', class: 'Class 9th', efficiency: 81 },
      { id: 10, name: 'Arjun Kumar', class: 'Class 9th', efficiency: 76 }
    ];

    // Filter sample students by selected class and search term
    const displayStudents = sampleStudents
      .filter(student => student.class === selectedClass.name)
      .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="sidebar-card">
        <h4 className="sidebar-title">Students List</h4>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
          Select a class and student to view detailed analysis
        </p>
        
        {/* Class Selection Dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
            Select Class:
          </label>
          <select
            value={selectedClass.name}
            onChange={(e) => {
              const classData = Object.values(classesData).find(cls => cls.name === e.target.value);
              if (classData) {
                setSelectedClass(classData);
                setSelectedStudent(null); // Reset selected student when class changes
              }
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="Class 6th">Class 6th</option>
            <option value="Class 7th">Class 7th</option>
            <option value="Class 8th">Class 8th</option>
            <option value="Class 9th">Class 9th</option>
            <option value="Class 10th">Class 10th</option>
            <option value="Class 11th">Class 11th</option>
            <option value="Class 12th">Class 12th</option>
          </select>
        </div>

        {/* Search Student Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
            Search Student:
          </label>
          <input
            type="text"
            placeholder="Type student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Students List */}
        <div className="sidebar-list-scrollable" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {displayStudents.length > 0 ? (
            displayStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className={`student-item-enhanced ${selectedStudent?.id === student.id ? 'active' : ''}`}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: selectedStudent?.id === student.id ? '#e0f2fe' : '#f8fafc',
                  borderColor: selectedStudent?.id === student.id ? '#0277bd' : '#e5e7eb',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#0284c7',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
                    {student.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {student.class}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Efficiency: {student.efficiency}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#666',
              fontSize: '14px'
            }}>
              {searchTerm ? 'No students found matching your search.' : `No students available in ${selectedClass.name}.`}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render student analysis (Enhanced with radio buttons and sub-tabs)
  const renderStudentAnalysis = () => {
    if (!selectedStudent) {
      return (
        <div className="empty-state">
          <div>
            <div className="empty-state-icon">👤</div>
            <h3 className="empty-state-title">Select a Student</h3>
            <p className="empty-state-text">
              Choose a student from {selectedClass.name} to view their detailed analysis and performance metrics
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-column-gap">
        {/* Student Info Card */}
        <div className="dashboard-card">
          <div className="mb-20">
            <h3 className="section-title">📊 Student Analysis: {selectedStudent.name || 'Unknown Student'}</h3>
            <p className="section-subtitle">Individual performance metrics for {selectedClass.name}</p>
          </div>
          <div className="two-column-grid">
            <div className="metric-card-blue">
              <div className="metric-value-blue">{selectedStudent.efficiency || 75}%</div>
              <div className="metric-label">Current Efficiency</div>
            </div>
            <div className="metric-card-green">
              <div className="metric-value-green">{selectedClass.name}</div>
              <div className="metric-label">Class Level</div>
            </div>
          </div>
        </div>

        {/* Analysis Type Selection */}
        <div className="dashboard-card">
          <div className="analysis-type-container">
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="analysisType"
                  value="homework"
                  checked={studentAnalysisType === 'homework'}
                  onChange={(e) => {
                    setStudentAnalysisType(e.target.value);
                    setStudentAnalysisSubTab('progression');
                  }}
                />
                <span className="radio-label">📝 Homework</span>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="analysisType"
                  value="classwork"
                  checked={studentAnalysisType === 'classwork'}
                  onChange={(e) => {
                    setStudentAnalysisType(e.target.value);
                    setStudentAnalysisSubTab('progression');
                  }}
                />
                <span className="radio-label">📚 Classwork</span>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="analysisType"
                  value="comparison"
                  checked={studentAnalysisType === 'comparison'}
                  onChange={(e) => {
                    setStudentAnalysisType(e.target.value);
                    setStudentAnalysisSubTab('datewise');
                  }}
                />
                <span className="radio-label">📊 HW vs CW Comparison</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sub-tabs based on analysis type */}
        <div className="sub-tabs-container">
          <div className="sub-tabs">
            {studentAnalysisType === 'homework' || studentAnalysisType === 'classwork' ? (
              <>
                <button
                  onClick={() => setStudentAnalysisSubTab('progression')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'progression' ? 'active' : ''}`}
                >
                  📈 Score Progression
                </button>
                <button
                  onClick={() => setStudentAnalysisSubTab('questions')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'questions' ? 'active' : ''}`}
                >
                  📋 Question Performance
                </button>
                <button
                  onClick={() => setStudentAnalysisSubTab('topics')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'topics' ? 'active' : ''}`}
                >
                  ⏱️ Topic Analysis
                </button>
                <button
                  onClick={() => setStudentAnalysisSubTab('summary')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'summary' ? 'active' : ''}`}
                >
                  📋 Summary
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStudentAnalysisSubTab('datewise')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'datewise' ? 'active' : ''}`}
                >
                  📅 Date-wise Comparison
                </button>
                <button
                  onClick={() => setStudentAnalysisSubTab('topicwise')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'topicwise' ? 'active' : ''}`}
                >
                  🎯 Topic-wise Comparison
                </button>
                <button
                  onClick={() => setStudentAnalysisSubTab('compsummary')}
                  className={`sub-tab-button ${studentAnalysisSubTab === 'compsummary' ? 'active' : ''}`}
                >
                  📊 Comparison Summary
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content based on selected sub-tab */}
        <div className="rounded-bottom-card">
          {renderStudentAnalysisContent()}
        </div>
      </div>
    );
  };

  // Render content based on selected analysis type and sub-tab
  const renderStudentAnalysisContent = () => {
    const analysisTitle = studentAnalysisType === 'homework' ? 'Homework' : 
                         studentAnalysisType === 'classwork' ? 'Classwork' : 'HW vs CW Comparison';

    if (studentAnalysisType === 'homework' || studentAnalysisType === 'classwork') {
      switch (studentAnalysisSubTab) {
        case 'progression':
          return (
            <div>
              <h4 className="subsection-title">📈 {analysisTitle} Score Progression</h4>
              <div className="chart-height-400">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentScoreProgressionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={studentAnalysisType} 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      name={`${analysisTitle} Score`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 'questions':
          return (
            <div>
              <h4 className="subsection-title">📋 {analysisTitle} Question Performance</h4>
              <div className="chart-height-400">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentQuestionPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="question" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="correct" fill="#22c55e" name="Correct %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="incorrect" fill="#ef4444" name="Incorrect %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 'topics':
          return (
            <div>
              <h4 className="subsection-title">⏱️ {analysisTitle} Topic Analysis</h4>
              <div className="chart-height-400">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentTopicAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="topic" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey={studentAnalysisType} 
                      fill="#3b82f6" 
                      name={`${analysisTitle} Performance`}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 'summary':
          return (
            <div>
              <h4 className="subsection-title">📋 {analysisTitle} Summary</h4>
              <div className="summary-cards-grid">
                <div className="metric-card-blue">
                  <div className="metric-value-blue">
                    {studentAnalysisType === 'homework' ? '87%' : '85%'}
                  </div>
                  <div className="metric-label">Average Score</div>
                </div>
                <div className="metric-card-green">
                  <div className="metric-value-green">
                    {studentAnalysisType === 'homework' ? '24' : '22'}
                  </div>
                  <div className="metric-label">Assignments Completed</div>
                </div>
                <div className="metric-card-yellow">
                  <div className="metric-value-yellow">
                    {studentAnalysisType === 'homework' ? '92%' : '89%'}
                  </div>
                  <div className="metric-label">Best Topic Score</div>
                </div>
                <div className="metric-card-pink">
                  <div className="metric-value-pink">
                    {studentAnalysisType === 'homework' ? '78%' : '82%'}
                  </div>
                  <div className="metric-label">Needs Improvement</div>
                </div>
              </div>
              
              <div className="mt-24">
                <h5 className="subsection-title">Performance Insights</h5>
                <ul className="summary-list">
                  <li><strong>Strongest Topic:</strong> {studentAnalysisType === 'homework' ? 'Geometry (92%)' : 'Algebra (89%)'}</li>
                  <li><strong>Needs Focus:</strong> {studentAnalysisType === 'homework' ? 'Calculus (78%)' : 'Statistics (82%)'}</li>
                  <li><strong>Consistency:</strong> {studentAnalysisType === 'homework' ? 'Good - steady improvement' : 'Very Good - stable performance'}</li>
                  <li><strong>Recommendation:</strong> {studentAnalysisType === 'homework' ? 'Focus on problem-solving techniques' : 'Maintain current pace'}</li>
                </ul>
              </div>
            </div>
          );

        default:
          return null;
      }
    } else {
      // Comparison analysis
      switch (studentAnalysisSubTab) {
        case 'datewise':
          return (
            <div>
              <h4 className="subsection-title">📅 Date-wise HW vs CW Comparison</h4>
              <div className="chart-height-400">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dateWiseComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="homework" stroke="#3b82f6" strokeWidth={3} name="Homework" />
                    <Line type="monotone" dataKey="classwork" stroke="#ef4444" strokeWidth={3} name="Classwork" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 'topicwise':
          return (
            <div>
              <h4 className="subsection-title">🎯 Topic-wise HW vs CW Comparison</h4>
              <div className="chart-height-400">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentTopicAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="topic" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="homework" fill="#3b82f6" name="Homework" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="classwork" fill="#ef4444" name="Classwork" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 'compsummary':
          return (
            <div>
              <h4 className="subsection-title">📊 HW vs CW Comparison Summary</h4>
              <div className="summary-cards-grid">
                <div className="metric-card-blue">
                  <div className="metric-value-blue">87%</div>
                  <div className="metric-label">Homework Average</div>
                </div>
                <div className="metric-card-green">
                  <div className="metric-value-green">85%</div>
                  <div className="metric-label">Classwork Average</div>
                </div>
                <div className="metric-card-yellow">
                  <div className="metric-value-yellow">+2%</div>
                  <div className="metric-label">HW Advantage</div>
                </div>
                <div className="metric-card-pink">
                  <div className="metric-value-pink">86%</div>
                  <div className="metric-label">Overall Average</div>
                </div>
              </div>
              
              <div className="mt-24">
                <h5 className="subsection-title">Comparison Insights</h5>
                <ul className="summary-list">
                  <li><strong>Overall Performance:</strong> Homework slightly better than Classwork</li>
                  <li><strong>Consistency:</strong> More consistent in Homework assignments</li>
                  <li><strong>Best HW Topic:</strong> Geometry (92%)</li>
                  <li><strong>Best CW Topic:</strong> Statistics (87%)</li>
                  <li><strong>Recommendation:</strong> Focus on improving classwork performance</li>
                </ul>
              </div>
            </div>
          );

        default:
          return null;
      }
    }
  };

  // Updated main Class Analysis render function
  const renderClassAnalysisContent = () => {
    return (
      <div className="grid-layout-main">
        <div>{renderClassSidebar()}</div>
        <div>
          {renderClassAnalysisSubTabs()}
          <div>
            {classAnalysisTab === 'overview' && renderClassOverview()}
            {classAnalysisTab === 'trends' && renderClassProgressTrends()}
            {classAnalysisTab === 'topics' && renderTopicAnalysis()}
            {classAnalysisTab === 'summary' && renderSummary()}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="empty-state">
            <div>
              <div className="empty-state-icon">⏳</div>
              <h3 className="empty-state-title">Loading Dashboard</h3>
              <p className="empty-state-text">Please wait while we fetch your data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render function
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="main-header">
          <h2 className="main-title">Enhanced Teacher Dashboard</h2>
          
          <div className="main-tabs">
            <button 
              onClick={() => setActiveTab('class')}
              className={`main-tab-button ${activeTab === 'class' ? 'active' : ''}`}
            >
              Class Analysis
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              className={`main-tab-button ${activeTab === 'student' ? 'active' : ''}`}
            >
              Student Analysis
            </button>
            <button 
              onClick={() => setActiveTab('homework')}
              className={`main-tab-button ${activeTab === 'homework' ? 'active' : ''}`}
            >
              Worksheets
            </button>
            <button 
              onClick={() => setActiveTab('exercise')}
              className={`main-tab-button ${activeTab === 'exercise' ? 'active' : ''}`}
            >
              Homework
            </button>
            <button 
              onClick={() => setActiveTab('classwork')}
              className={`main-tab-button ${activeTab === 'classwork' ? 'active' : ''}`}
            >
              Classwork
            </button>
          </div>
        </div>

        <div className="content-with-padding">
          {activeTab === 'class' ? (
            renderClassAnalysisContent()
          ) : activeTab === 'student' ? (
            <div className="grid-layout-student">
              <div>{renderStudentList()}</div>
              <div>{renderStudentAnalysis()}</div>
            </div>
          ) : activeTab === 'classwork' ? (
            <QuickExerciseComponent onCreateHomework={(assignment) => handleAssignmentSubmit(assignment, "classwork")} mode="classwork" />
          ) : activeTab === 'homework' ? (
            <TeacherDashboard 
              user={selectedClass}
              assignments={assignments}
              submissions={submissions}
              onAssignmentSubmit={(assignment) => handleAssignmentSubmit(assignment, "homework")}
            />
          ) : activeTab === 'exercise' ? (
            <QuickExerciseComponent onCreateHomework={(assignment) => handleAssignmentSubmit(assignment, "quiz")} />
          ) : null}
        </div>
      </div>
    </div>
  ); 
};

export default EnhancedTeacherDash;