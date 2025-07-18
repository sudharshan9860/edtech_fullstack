// Complete Updated EnhancedTeacherDash.jsx with Class Analysis Sub-Tabs - Fixed Syntax

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
    name: "Class 12th",
    students: [
      { id: 1, name: "Vikram Singh", class: "12th", efficiency: 88 },
      { id: 2, name: "Meera Patel", class: "12th", efficiency: 92 },
      { id: 3, name: "Sanjay Kumar", class: "12th", efficiency: 78 },
      { id: 4, name: "Priya Sharma", class: "12th", efficiency: 73 },
      { id: 5, name: "Ahmed Khan", class: "12th", efficiency: 85 },
      { id: 6, name: "Rahul Verma", class: "12th", efficiency: 55 }
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
        { student: 'Rahul Verma', efficiencyImprovement: 10.7, regularScoreImprovement: -13.5, currentEfficiency: 82 },
        { student: 'Ahmed Khan', efficiencyImprovement: 14.5, regularScoreImprovement: 0, currentEfficiency: 85 },
        { student: 'Sanjay Kumar', efficiencyImprovement: 13.5, regularScoreImprovement: -0.5, currentEfficiency: 78 },
        { student: 'Priya Sharma', efficiencyImprovement: 7.8, regularScoreImprovement: -1.6, currentEfficiency: 73 },
        { student: 'Meera Patel', efficiencyImprovement: 9.2, regularScoreImprovement: -1.8, currentEfficiency: 71 },
        { student: 'Vikram Singh', efficiencyImprovement: 16.0, regularScoreImprovement: 0, currentEfficiency: 88 }
      ],
      learningGapAnalysis: [
        { topic: 'Algebraic Expressions', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 35, 'Students with No Gap': 25 },
        { topic: 'Linear Equations', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25 },
        { topic: 'Quadratic Functions', 'Students with High Gap': 25, 'Students with Medium Gap': 35, 'Students with Low Gap': 20, 'Students with No Gap': 20 },
        { topic: 'Matrices', 'Students with High Gap': 10, 'Students with Medium Gap': 20, 'Students with Low Gap': 40, 'Students with No Gap': 30 },
        { topic: 'Trigonometry', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20 }
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
    { 
      className: '10HPS17', 
      homeworkAverage: 12, 
      classworkAverage: 20 
    },
    { 
      className: '10HPS18', 
      homeworkAverage: 18, 
      classworkAverage: 18 
    },
    { 
      className: '10HPS19', 
      homeworkAverage: 28, 
      classworkAverage: 65 
    }
  ];

  const overallStatsData = [
    { type: 'Homework', average: 19 },
    { type: 'Classwork', average: 30 }
  ];

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const response = await axiosInstance.get('/teacher-dashboard/');
      console.log('teacher-data', response.data);
      setTeacherData(response.data);
      
      if (response.data.students && response.data.students.length > 0) {
        setSelectedClass({
          id: 1,
          name: "Class 12th",
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
    // Return mock data if selectedClass doesn't have analytics or if it's incomplete
    if (!selectedClass.analytics || !selectedClass.analytics.learningGapAnalysis) {
      return {
        weeklyEfficiency: progressTrendsData,
        studentProgressComparison: selectedClass.students ? selectedClass.students.map(student => ({
          student: student.name,
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

  // Generate student data function (for student analysis)
  const generateStudentData = (studentName, classId) => {
    const baseEfficiency = Math.floor(Math.random() * 30) + 60; // 60-90%
    
    return {
      // Weekly Efficiency Progress
      weeklyEfficiency: [
        { week: 'May 01 - May 01', efficiency: baseEfficiency - 5 + Math.random() * 10 },
        { week: 'May 08 - May 08', efficiency: baseEfficiency - 3 + Math.random() * 10 },
        { week: 'May 15 - May 15', efficiency: baseEfficiency + Math.random() * 10 },
        { week: 'May 22 - May 22', efficiency: baseEfficiency - 2 + Math.random() * 10 },
        { week: 'May 29 - May 29', efficiency: baseEfficiency + 2 + Math.random() * 8 }
      ],
      
      // Error Type Analysis
      errorAnalysis: [
        { week: 'May 01 - May 01', Conceptual: 80, Computational: 15, Careless: 5, 'No Error': 20 },
        { week: 'May 08 - May 08', Conceptual: 75, Computational: 18, Careless: 7, 'No Error': 25 },
        { week: 'May 15 - May 15', Conceptual: 60, Computational: 20, Careless: 5, 'No Error': 40 },
        { week: 'May 22 - May 22', Conceptual: 85, Computational: 10, Careless: 5, 'No Error': 18 },
        { week: 'May 29 - May 29', Conceptual: 70, Computational: 15, Careless: 8, 'No Error': 38 }
      ],
      
      // Chapter-wise Performance Over Time
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
    const data = generateStudentData(student.name, selectedClass.id);
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
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#374151' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '14px' }}>
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '0'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 20px'
        }}>
          <button
            onClick={() => setClassAnalysisTab('overview')}
            style={{
              padding: '16px 24px',
              backgroundColor: classAnalysisTab === 'overview' ? '#f0f9ff' : 'transparent',
              color: classAnalysisTab === 'overview' ? '#0369a1' : '#6b7280',
              border: 'none',
              borderRadius: '0',
              borderBottom: classAnalysisTab === 'overview' ? '3px solid #0369a1' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 Class Overview
          </button>
          <button
            onClick={() => setClassAnalysisTab('trends')}
            style={{
              padding: '16px 24px',
              backgroundColor: classAnalysisTab === 'trends' ? '#f0f9ff' : 'transparent',
              color: classAnalysisTab === 'trends' ? '#0369a1' : '#6b7280',
              border: 'none',
              borderRadius: '0',
              borderBottom: classAnalysisTab === 'trends' ? '3px solid #0369a1' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📈 Class Progress Trends
          </button>
          <button
            onClick={() => setClassAnalysisTab('topics')}
            style={{
              padding: '16px 24px',
              backgroundColor: classAnalysisTab === 'topics' ? '#f0f9ff' : 'transparent',
              color: classAnalysisTab === 'topics' ? '#0369a1' : '#6b7280',
              border: 'none',
              borderRadius: '0',
              borderBottom: classAnalysisTab === 'topics' ? '3px solid #0369a1' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🎯 Topic Analysis
          </button>
          <button
            onClick={() => setClassAnalysisTab('summary')}
            style={{
              padding: '16px 24px',
              backgroundColor: classAnalysisTab === 'summary' ? '#f0f9ff' : 'transparent',
              color: classAnalysisTab === 'summary' ? '#0369a1' : '#6b7280',
              border: 'none',
              borderRadius: '0',
              borderBottom: classAnalysisTab === 'summary' ? '3px solid #0369a1' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📋 Summary
          </button>
        </div>
      </div>
    );
  };

  // Class Overview Content (matching your image)
  const renderClassOverview = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 12px 12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#1f2937'
            }}>
              📊 Class Overview Dashboard
            </h3>
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
              Comprehensive performance analysis for all classes
            </p>
          </div>

          {/* Two-column layout matching your image */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '32px',
            marginTop: '24px'
          }}>
            
            {/* Student Performance Comparison */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '16px' 
              }}>
                Student Performance Comparison
              </h4>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={classPerformanceData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="className" 
                      fontSize={12}
                      color="#6b7280"
                    />
                    <YAxis 
                      fontSize={12}
                      color="#6b7280"
                      domain={[0, 80]}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'homeworkAverage' ? 'Homework Average' : 'Classwork Average']}
                      labelFormatter={(label) => `Class: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="homeworkAverage" 
                      fill="#3b82f6" 
                      name="Homework Average"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="classworkAverage" 
                      fill="#a855f7" 
                      name="Classwork Average"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overall Class Statistics and Performance Comparison */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '16px' 
              }}>
                Overall Class Statistics and Performance Comparison
              </h4>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={overallStatsData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="type" 
                      fontSize={12}
                      color="#6b7280"
                    />
                    <YAxis 
                      fontSize={12}
                      color="#6b7280"
                      domain={[0, 70]}
                    />
                    <Tooltip 
                      formatter={(value) => [value, 'Average Score']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="average" 
                      fill="#06b6d4"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '32px'
          }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #e0f2fe'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>
                19%
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                Overall Homework Average
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #dcfce7'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                30%
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                Overall Classwork Average
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fef7cd',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #fde047'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                3
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                Total Classes
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fdf2f8',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #f9a8d4'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#be185d' }}>
                11%
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                Performance Gap
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Class Progress Trends Content
  const renderClassProgressTrends = () => {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0 0 12px 12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Class Progress Trends
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Assignment Progress and Top Performers
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {['10', '50', '100', '150', '1M', 'MAX'].map((filter) => (
            <button
              key={filter}
              style={{
                padding: '6px 12px',
                backgroundColor: filter === '1M' ? '#3b82f6' : '#f1f5f9',
                color: filter === '1M' ? 'white' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '32px',
          marginTop: '24px'
        }}>
          
          {/* Assignment-wise Class Average */}
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '16px' 
            }}>
              Assignment-wise Class Average
            </h4>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={progressTrendsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    color="#6b7280"
                  />
                  <YAxis 
                    fontSize={12}
                    color="#6b7280"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hwAverage" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    name="HW Class Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cwAverage" 
                    stroke="#e11d48" 
                    strokeWidth={3}
                    dot={{ fill: '#e11d48', strokeWidth: 2, r: 6 }}
                    name="CW Class Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '16px' 
            }}>
              Top Performers
            </h4>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={topPerformersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="student" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                  />
                  <YAxis 
                    fontSize={12}
                    domain={[0, 70]}
                  />
                  <Tooltip 
                    formatter={(value) => [value + '%', 'Overall Average']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="average" 
                    fill="#fbbf24"
                    radius={[4, 4, 0, 0]}
                  />
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
    // Ensure data is available, use fallback if needed
    const safeStrugglingTopicsData = strugglingTopicsData || [];
    const safeExcellingTopicsData = excellingTopicsData || [];
    const safeTopicComparisonData = topicComparisonData || [];
    const safeTopicPerformanceDistribution = topicPerformanceDistribution || [];
    const safeDetailedTopicStats = detailedTopicStats || [];

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0 0 12px 12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 Class Topic Analysis
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Across All Students
          </p>
        </div>

        {/* First Row: Struggling vs Excelling Topics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          
          {/* Topics Class Struggles With Most */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Topics Class Struggles With Most
              </h4>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Topic Statistics<br/>
                Class Average: 56.4%<br/>
                Submissions: 30
              </div>
            </div>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={safeStrugglingTopicsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="topic" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={12}
                    domain={[0, 70]}
                  />
                  <Tooltip 
                    formatter={(value) => [value + '%', 'Average Score']}
                    labelFormatter={(label, payload) => {
                      const item = safeStrugglingTopicsData.find(d => d.topic === label);
                      return item ? item.fullName || item.topic : label;
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topics Class Excels In */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Topics Class Excels In
              </h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
                  Struggling Topics
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div>
                  Excelling Topics
                </div>
              </div>
            </div>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={safeExcellingTopicsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="topic" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={12}
                    domain={[0, 80]}
                  />
                  <Tooltip 
                    formatter={(value) => [value + '%', 'Average Score']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Second Row: HW vs CW Comparison and Performance Distribution */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          
          {/* Topic-wise HW vs CW Comparison */}
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '16px' 
            }}>
              Topic-wise HW vs CW Comparison
            </h4>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={safeTopicComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="topic" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value + '%', name === 'hw' ? 'Homework' : 'Classwork']}
                    labelFormatter={(label, payload) => {
                      const item = safeTopicComparisonData.find(d => d.topic === label);
                      return item ? item.fullName || item.topic : label;
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="hw" 
                    fill="#06b6d4"
                    name="Homework"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="cw" 
                    fill="#a855f7"
                    name="Classwork"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Performance Distribution */}
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '16px' 
            }}>
              Topic Performance Distribution
            </h4>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={safeTopicPerformanceDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="topic" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value + '%', 'Performance Range']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="q3" 
                    fill="#fbbf24"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Topic Statistics Table */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Detailed Topic Statistics
          </h4>
          <div style={{
            overflow: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Topic</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Overall Avg (%)</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>HW Avg (%)</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>CW Avg (%)</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Total Questions</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Std Deviation</th>
                </tr>
              </thead>
              <tbody>
                {safeDetailedTopicStats.map((row, index) => (
                  <tr key={row.id || index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '20px', 
                        textAlign: 'center', 
                        marginRight: '8px',
                        color: '#6b7280',
                        fontSize: '12px'
                      }}>
                        {row.id}
                      </span>
                      {row.topic}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.overallAvg}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.hwAvg}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.cwAvg}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.totalQuestions}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.stdDev}</td>
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0 0 12px 12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#1f2937'
          }}>
            📋 CLASSROOM PERFORMANCE SUMMARY
          </h3>
        </div>

        {/* Class Overview Section */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👥 Class Overview: ↗️
          </h4>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '20px', 
            color: '#4b5563',
            lineHeight: '1.6'
          }}>
            <li><strong>Total Students:</strong> 5</li>
            <li><strong>Students with Homework Data:</strong> 5</li>
            <li><strong>Students with Classwork Data:</strong> 5</li>
            <li><strong>Total Assignments Analyzed:</strong> 60</li>
          </ul>
        </div>

        {/* Performance Statistics */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Performance Statistics:
          </h4>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '20px', 
            color: '#4b5563',
            lineHeight: '1.6'
          }}>
            <li><strong>Overall Class Average:</strong> 56.5%</li>
            <li><strong>Homework Class Average:</strong> 61.6%</li>
            <li><strong>Classwork Class Average:</strong> 51.4%</li>
            <li><strong>Performance Gap (CW - HW):</strong> -10.2%</li>
          </ul>
        </div>

        {/* Grade Distribution */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 Grade Distribution:
          </h4>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              ★★F (&lt;60%):★★ 27 assignments (45.0%)
            </div>
          </div>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '20px', 
            color: '#4b5563',
            lineHeight: '1.6'
          }}>
            <li><strong>C (70-79%):</strong> 13 assignments (21.7%)</li>
            <li><strong>B (80-89%):</strong> 13 assignments (21.7%)</li>
            <li><strong>A (90-100%):</strong> 1 assignments (1.7%)</li>
            <li><strong>D (60-69%):</strong> 6 assignments (10.0%)</li>
          </ul>
        </div>

        {/* Top Performers */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏆 Top Performers: ↗️
          </h4>
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              color: '#1e40af',
              fontWeight: 'bold'
            }}>
              1. ★★10HPS21:★★ 69.0%
            </div>
          </div>
          <ul style={{ 
            listStyle: 'none', 
            paddingLeft: '0', 
            color: '#4b5563',
            lineHeight: '1.6'
          }}>
            <li>2. <strong>10HPS19:</strong> 66.8% 3. <strong>10HPS20:</strong> 52.2%</li>
          </ul>
          
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #fbbf24',
            marginTop: '16px'
          }}>
            <div style={{ 
              fontSize: '14px',
              color: '#92400e'
            }}>
              ### 📚 ★★Students Needing Support:★★
            </div>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              color: '#92400e',
              marginTop: '8px'
            }}>
              1. ★★10HPS18:★★ 44.0%
            </div>
          </div>
          <ul style={{ 
            listStyle: 'none', 
            paddingLeft: '0', 
            color: '#4b5563',
            lineHeight: '1.6',
            marginTop: '8px'
          }}>
            <li>2. <strong>10HPS17:</strong> 50.1% 3. <strong>10HPS20:</strong> 52.2%</li>
          </ul>
        </div>

        {/* Strongest Topics */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💪 Strongest Topics:
          </h4>
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              color: '#15803d',
              fontWeight: 'bold'
            }}>
              1. ★★Coordinate Geometry:★★ 71.4%
            </div>
          </div>
          <div style={{ 
            color: '#4b5563',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            2. <strong>Algebra - Rational Functions:</strong> 64.0% 3. <strong>Probability:</strong> 60.8%
          </div>
        </div>

        {/* Topics Needing Attention */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔍 Topics Needing Attention:
          </h4>
          <div style={{
            backgroundColor: '#fef2f2',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              color: '#dc2626',
              fontWeight: 'bold'
            }}>
              1. ★★Algebra - Linear Equations:★★ 46.7%
            </div>
          </div>
          <div style={{ 
            color: '#4b5563',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            2. <strong>Calculus - Derivatives:</strong> 52.2% 3. <strong>Statistics:</strong> 56.4%
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💡 Recommendations:
          </h4>
          
          <div style={{
            backgroundColor: '#e0f2fe',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #0ea5e9',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontSize: '14px',
              color: '#0c4a6e'
            }}>
              - 📝 ★★Focus on Classwork:★★ Class performs 10.2% better on homework. Consider reinforcing classwork concepts.
            </div>
          </div>

          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '20px', 
            color: '#4b5563',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
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
    
    // Ensure learningGapAnalysis exists
    if (!analyticsData || !analyticsData.learningGapAnalysis) {
      return (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Learning Gap Analysis</h3>
          <p>No data available for learning gap analysis.</p>
        </div>
      );
    }
    
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 Class-wide Learning Gap Analysis
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Percentage of Students with Learning Gaps by Topic - {selectedClass.name}
          </p>
        </div>
        <div style={{height: '600px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={analyticsData.learningGapAnalysis}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="topic" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'Percentage of Students (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                labelFormatter={(label) => `Topic: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="Students with High Gap" 
                stackId="a" 
                fill="#dc2626" 
                name="High Gap (Critical)"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Students with Medium Gap" 
                stackId="a" 
                fill="#f59e0b" 
                name="Medium Gap (Moderate)"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Students with Low Gap" 
                stackId="a" 
                fill="#eab308" 
                name="Low Gap (Minor)"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Students with No Gap" 
                stackId="a" 
                fill="#22c55e" 
                name="No Gap (Proficient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Learning Gap Analysis Legend */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#dc2626', borderRadius: '2px' }}></div>
              <span><strong>High Gap (Critical)</strong> - Needs immediate attention</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
              <span><strong>Medium Gap (Moderate)</strong> - Requires support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#eab308', borderRadius: '2px' }}></div>
              <span><strong>Low Gap (Minor)</strong> - Monitor progress</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div>
              <span><strong>No Gap (Proficient)</strong> - On track</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render class sidebar (existing function - keep as is)
  const renderClassSidebar = () => {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
          Select Class
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(classesData).map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => setSelectedClass(classItem)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedClass.id === classItem.id ? '#e0f2fe' : '#f8fafc',
                border: selectedClass.id === classItem.id ? '2px solid #0277bd' : '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                transform: selectedClass.id === classItem.id ? 'translateY(-2px)' : 'none',
                boxShadow: selectedClass.id === classItem.id ? '0 4px 8px rgba(2,119,189,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
                {classItem.name}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {classItem.students.length} students
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render student list (for Student Analysis tab)
  const renderStudentList = () => {
    const filteredStudents = selectedClass.students?.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
          Select Student
        </h4>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}
        />
        
        {/* Student List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => handleStudentSelect(student)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedStudent?.id === student.id ? '#e0f2fe' : '#f8fafc',
                border: selectedStudent?.id === student.id ? '2px solid #0277bd' : '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
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
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
                  {student.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {student.class} - {student.efficiency}% efficiency
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render student analysis (for Student Analysis tab)
  const renderStudentAnalysis = () => {
    if (!selectedStudent) {
      return (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Select a Student</h3>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Choose a student from {selectedClass.name} to view their detailed analysis and performance metrics
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Student Info Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Student Analysis: {selectedStudent.name}
            </h3>
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
              Individual performance metrics for {selectedClass.name}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #e0f2fe'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0369a1' }}>
                {selectedStudent.efficiency}%
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Current Efficiency</div>
            </div>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #dcfce7'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                {selectedClass.name}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Class Level</div>
            </div>
          </div>
        </div>

        {/* Weekly Efficiency Progress */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
            Weekly Efficiency Progress
          </h4>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={studentData?.weeklyEfficiency || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Updated main Class Analysis render function
  const renderClassAnalysisContent = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', maxWidth: '100%' }}>
        {/* Left Sidebar - Classes */}
        <div>
          {renderClassSidebar()}
        </div>

        {/* Main Content Area with Sub-Tabs */}
        <div>
          {/* Sub-Tab Navigation */}
          {renderClassAnalysisSubTabs()}
          
          {/* Sub-Tab Content */}
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

  // Main render function
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
            Enhanced Teacher Dashboard
          </h2>
          
          {/* Main Tab Navigation */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '20px' }}>
            <button 
              onClick={() => setActiveTab('class')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'class' ? '#3b82f6' : 'transparent',
                color: activeTab === 'class' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'class' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Class Analysis
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'student' ? '#3b82f6' : 'transparent',
                color: activeTab === 'student' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'student' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Student Analysis
            </button>
            <button 
              onClick={() => setActiveTab('homework')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'homework' ? '#3b82f6' : 'transparent',
                color: activeTab === 'homework' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'homework' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Worksheets
            </button>
            <button 
              onClick={() => setActiveTab('exercise')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'exercise' ? '#3b82f6' : 'transparent',
                color: activeTab === 'exercise' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'exercise' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Homework
            </button>
            <button 
              onClick={() => setActiveTab('classwork')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'classwork' ? '#3b82f6' : 'transparent',
                color: activeTab === 'classwork' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'classwork' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Classwork
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '20px' }}>
          {activeTab === 'class' ? (
            renderClassAnalysisContent()
          ) : activeTab === 'student' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', maxWidth: '100%' }}>
              {/* Left Sidebar - Student Selection */}
              <div>
                {renderStudentList()}
              </div>
              
              {/* Main Content Area - Student Analysis */}
              <div>
                {renderStudentAnalysis()}
              </div>
            </div>
          ) : activeTab === 'classwork' ? (
            <QuickExerciseComponent onCreateHomework={(assignment) => handleAssignmentSubmit(assignment, "classwork")} mode="classwork" />
          ) : activeTab === 'exercise' ? (
            <TeacherDashboard 
              user={selectedClass}
              assignments={assignments}
              submissions={submissions}
              onAssignmentSubmit={(assignment) => handleAssignmentSubmit(assignment, "homework")}
            />
          ) : (
            <QuickExerciseComponent onCreateHomework={(assignment) => handleAssignmentSubmit(assignment, "quiz")} />
          )}
        </div>
      </div>
    </div>
  ); 
};

export default EnhancedTeacherDash;