// StudentAnalysis.jsx - Enhanced Component with Smooth Animations and Extended Data - SYNTAX FIXED

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, ReferenceLine
} from 'recharts';

const StudentAnalysis = ({ selectedClass, selectedStudent, onStudentSelect, classesData, onClassChange }) => {
  // Main tab state
  const [studentAnalysisMainTab, setStudentAnalysisMainTab] = useState('progression');
  
  // Sub-tab states for Score Progression
  const [scoreProgressionSubTab, setScoreProgressionSubTab] = useState('datewise');
  const [scoreProgressionView, setScoreProgressionView] = useState('combined'); // 'combined', 'homework', 'classwork'
  
  // Sub-tab states for Topic Analysis
  const [topicAnalysisSubTab, setTopicAnalysisSubTab] = useState('datewise');
  const [topicAnalysisView, setTopicAnalysisView] = useState('combined'); // 'combined', 'homework', 'classwork'
  
  // Mistake Analysis states
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('All Chapters');
  const [selectedPerformanceFilter, setSelectedPerformanceFilter] = useState('All Percentages');
  const [showChapterExplorer, setShowChapterExplorer] = useState(false);

  // Animation states
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced data for Score Progression
  const studentHomeworkProgressionData = [
    { date: 'Jun 23', performance: 18, trend: 28, classRanking: 'Top 60%' },
    { date: 'Jun 25', performance: 35, trend: 42, classRanking: 'Top 60%' },
    { date: 'Jun 27', performance: 78, trend: 58, classRanking: 'Top 60%' },
    { date: 'Jun 29', performance: 80, trend: 68, classRanking: 'Top 60%' },
    { date: 'Jul 01', performance: 85, trend: 78, classRanking: 'Top 60%' },
    { date: 'Jul 03', performance: 92, trend: 88, classRanking: 'Top 60%' }
  ];

  const studentClassworkProgressionData = [
    { date: 'Jun 23', performance: 38, trend: 35, classRanking: 'Bottom 50%' },
    { date: 'Jun 25', performance: 20, trend: 32, classRanking: 'Bottom 50%' },
    { date: 'Jun 27', performance: 47, trend: 38, classRanking: 'Bottom 50%' },
    { date: 'Jun 29', performance: 28, trend: 35, classRanking: 'Bottom 50%' },
    { date: 'Jul 01', performance: 25, trend: 38, classRanking: 'Bottom 50%' },
    { date: 'Jul 03', performance: 44, trend: 42, classRanking: 'Bottom 50%' }
  ];

  const studentDateWiseComparisonData = [
    { date: 'Jun 23', homework: 6, classwork: 12 },
    { date: 'Jun 25', homework: 14, classwork: 7 },
    { date: 'Jun 27', homework: 27, classwork: 14 },
    { date: 'Jun 29', homework: 31, classwork: 10 },
    { date: 'Jul 01', homework: 31, classwork: 10 },
    { date: 'Jul 03', homework: 38, classwork: 16 }
  ];

  // Enhanced Topic-wise Performance Data (from image 2 & 7)
  const topicWisePerformanceData = [
    { topic: 'Calculus - Integration', homework: 100, classwork: 12 },
    { topic: 'Algebra - Linear Equations', homework: 75, classwork: 15 },
    { topic: 'Statistics', homework: 78, classwork: 20 },
    { topic: 'Algebra - Rational Functions', homework: 80, classwork: 32 },
    { topic: 'Probability', homework: 72, classwork: 35 },
    { topic: 'Trigonometry', homework: 79, classwork: 49 },
    { topic: 'Quadratic Applications', homework: 68, classwork: 40 },
    { topic: 'Calculus - Derivatives', homework: 59, classwork: 32 },
    { topic: 'Functions and Graphs', homework: 51, classwork: 58 },
    { topic: 'Coordinate Geometry', homework: 66, classwork: 93 }
  ];

  // Grouped Bar Chart Data (from image 6)
  const groupedBarData = [
    { date: 'Jun 23', homework: 18.2, classwork: 36.7 },
    { date: 'Jun 25', homework: 35.9, classwork: 20.0 },
    { date: 'Jun 27', homework: 79.4, classwork: 46.7 },
    { date: 'Jun 29', homework: 83.8, classwork: 25.5 },
    { date: 'Jul 01', homework: 86.1, classwork: 25.7 },
    { date: 'Jul 03', homework: 92.7, classwork: 44.4 }
  ];

  // Enhanced Comparison Summary Data (from images 3, 4, 8, 9)
  const detailedComparisonData = {
    overallPerformance: {
      homeworkAverage: 66.8,
      classworkAverage: 33.8,
      performanceGap: -33.0
    },
    scoreAnalysis: {
      homeworkAvgScore: 24.5,
      classworkAvgScore: 11.3,
      scoreDifference: -13.2
    },
    assignmentCount: {
      homeworkAssignments: 6,
      classworkAssignments: 6,
      commonTopics: 10
    },
    topicsWithImprovement: [
      { topic: 'Coordinate Geometry', improvement: 27.6 },
      { topic: 'Functions and Graphs', improvement: 7.9 }
    ],
    topicsWithDecline: [
      { topic: 'Calculus - Integration', decline: -90.3 },
      { topic: 'Algebra - Linear Equations', decline: -62.5 },
      { topic: 'Statistics', decline: -57.3 },
      { topic: 'Algebra - Rational Functions', decline: -50.0 },
      { topic: 'Probability', decline: -38.9 },
      { topic: 'Trigonometry', decline: -29.2 },
      { topic: 'Quadratic Applications', decline: -28.5 },
      { topic: 'Calculus - Derivatives', decline: -25.2 }
    ],
    detailedTopicComparison: [
      { topic: 'Trigonometry', hwAvg: 79.2, cwAvg: 50.0, gap: -29.2, status: 'HW Better' },
      { topic: 'Coordinate Geometry', hwAvg: 65.7, cwAvg: 93.3, gap: 27.6, status: 'CW Better' },
      { topic: 'Quadratic Applications', hwAvg: 67.5, cwAvg: 39.0, gap: -28.5, status: 'HW Better' },
      { topic: 'Calculus - Derivatives', hwAvg: 58.5, cwAvg: 33.3, gap: -25.2, status: 'HW Better' },
      { topic: 'Algebra - Rational Functions', hwAvg: 80.0, cwAvg: 30.0, gap: -50.0, status: 'HW Better' },
      { topic: 'Functions and Graphs', hwAvg: 50.8, cwAvg: 58.7, gap: 7.9, status: 'CW Better' },
      { topic: 'Calculus - Integration', hwAvg: 100.0, cwAvg: 9.7, gap: -90.3, status: 'HW Better' },
      { topic: 'Statistics', hwAvg: 77.5, cwAvg: 20.2, gap: -57.3, status: 'HW Better' },
      { topic: 'Probability', hwAvg: 72.2, cwAvg: 33.3, gap: -38.9, status: 'HW Better' },
      { topic: 'Algebra - Linear Equations', hwAvg: 75.0, cwAvg: 12.5, gap: -62.5, status: 'HW Better' }
    ]
  };

  // Chapter Explorer Data (from images 10-15)
  const chapterExplorerData = [
    { chapter: 'Algebra - Linear Equations', percentage: 75 },
    { chapter: 'Algebra - Rational Functions', percentage: 80 },
    { chapter: 'Calculus - Derivatives', percentage: 61 },
    { chapter: 'Calculus - Integration', percentage: 100 },
    { chapter: 'Coordinate Geometry', percentage: 64 },
    { chapter: 'Functions and Graphs', percentage: 43 },
    { chapter: 'Probability', percentage: 72 },
    { chapter: 'Quadratic Applications', percentage: 67 },
    { chapter: 'Statistics', percentage: 78 },
    { chapter: 'Trigonometry', percentage: 81 }
  ];

  const answerDistributionData = [
    { name: 'Correct', value: 13, percentage: 43.3, color: '#10b981' },
    { name: 'Partially-Correct', value: 3, percentage: 10, color: '#f59e0b' },
    { name: 'Numerical Error', value: 4, percentage: 13.3, color: '#ef4444' },
    { name: 'Irrelevant', value: 7, percentage: 23.3, color: '#8b5cf6' },
    { name: 'Unattempted', value: 3, percentage: 10, color: '#6b7280' }
  ];

  const questionDetailsData = [
    { id: 'Q1', chapter: 'Quadratic Applications', date: '2025-06-23', question: 'Find the shortest distance of the point (5,1) from the parab...', score: '0/20', performance: '0.0%', status: 'Irrelevant', mistake: 'Irrelevant formula application' },
    { id: 'Q2', chapter: 'Quadratic Applications', date: '2025-06-25', question: 'Find the vertex of the parabola y = 3x² - 6x + 1', score: '0/8', performance: '0.0%', status: 'No attempt', mistake: 'f*g = 5' },
    { id: 'Q3', chapter: 'Algebra - Linear Equations', date: '2025-06-23', question: 'Solve the system: 2x + 3y = 7, x - y = 1', score: '3/6', performance: '50.0%', status: 'Numerical Error', mistake: '5y = 6' },
    { id: 'Q4', chapter: 'Coordinate Geometry', date: '2025-06-23', question: 'Find the equation of line passing through (2,3) with slope m...', score: '1/5', performance: '20.0%', status: 'Conceptual error', mistake: 'Area = ½ × base × height' },
    { id: 'Q5', chapter: 'Coordinate Geometry', date: '2025-06-25', question: 'Evaluate sin(30°) × cos(60°)', score: '2/4', performance: '50.0%', status: 'Value error', mistake: 'cos(60°) = 0.5' }
  ];

  const performanceRanges = [
    'All Percentages',
    '0-19% (Needs Practice! 🔴)',
    '20-39% (Keep Trying! 💪)',
    '40-59% (Good Work! 😊)',
    '60-79% (Great Job! 👍)',
    '80-100% (Amazing! 🌟)'
  ];

  const chaptersList = [
    'All Chapters',
    'Algebra - Linear Equations',
    'Algebra - Rational Functions',
    'Calculus - Derivatives',
    'Calculus - Integration',
    'Coordinate Geometry',
    'Functions and Graphs',
    'Probability',
    'Quadratic Applications',
    'Statistics',
    'Trigonometry'
  ];

  // Animation handlers
  const handleViewTransition = (newView, setViewFunction) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewFunction(newView);
      setIsTransitioning(false);
    }, 300);
  };

  const handleScoreLineClick = (dataKey) => {
    if (dataKey === 'homework') {
      handleViewTransition('homework', setScoreProgressionView);
    } else if (dataKey === 'classwork') {
      handleViewTransition('classwork', setScoreProgressionView);
    }
  };

  const handleTopicLineClick = (dataKey) => {
    if (dataKey === 'homework') {
      handleViewTransition('homework', setTopicAnalysisView);
    } else if (dataKey === 'classwork') {
      handleViewTransition('classwork', setTopicAnalysisView);
    }
  };

  const handleScoreSubTabChange = (tab) => {
    setScoreProgressionSubTab(tab);
    setScoreProgressionView('combined');
  };

  const handleTopicSubTabChange = (tab) => {
    setTopicAnalysisSubTab(tab);
    setTopicAnalysisView('combined');
  };

  // Get students for the selected class
  const getStudentsForClass = () => {
    const sampleStudents = [
      { id: 1, name: 'Sanjay Kumar', rollNo: '10HPS01', class: 'Class 12th', efficiency: 78 },
      { id: 2, name: 'Priya Sharma', rollNo: '10HPS02', class: 'Class 12th', efficiency: 73 },
      { id: 3, name: 'Ahmed Khan', rollNo: '10HPS03', class: 'Class 12th', efficiency: 85 },
      { id: 4, name: 'Rahul Verma', rollNo: '10HPS04', class: 'Class 12th', efficiency: 58 },
      { id: 5, name: 'Anita Singh', rollNo: '11HPS01', class: 'Class 11th', efficiency: 92 },
      { id: 6, name: 'Vikas Gupta', rollNo: '11HPS02', class: 'Class 11th', efficiency: 67 },
      { id: 7, name: 'Neha Patel', rollNo: '10HPS01', class: 'Class 10th', efficiency: 89 },
      { id: 8, name: 'Rohit Sharma', rollNo: '10HPS02', class: 'Class 10th', efficiency: 74 },
      { id: 9, name: 'Kavya Reddy', rollNo: '09HPS01', class: 'Class 9th', efficiency: 81 },
      { id: 10, name: 'Arjun Kumar', rollNo: '09HPS02', class: 'Class 9th', efficiency: 76 }
    ];
    
    return sampleStudents.filter(student => student.class === selectedClass.name);
  };

  const availableStudents = getStudentsForClass();

  const renderNoStudentSelected = () => {
    return (
      <div className="empty-state">
        <div>
          <div className="empty-state-icon">👤</div>
          <h3 className="empty-state-title">Select a Student</h3>
          <p className="empty-state-text">
            Choose a student from {selectedClass.name} using the dropdown above to view their detailed analysis and performance metrics
          </p>
        </div>
      </div>
    );
  };

  // Enhanced Score Progression Tab with smooth animations
  const renderScoreProgressionTab = () => {
    return (
      <div className="tab-content" style={{ opacity: isTransitioning ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
        {/* Fixed Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px', 
          marginBottom: '30px',
          transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>66.8%</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Homework Average</div>
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>33.8%</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Classwork Average</div>
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>15.07%</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>HW Improvement Rate</div>
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>-33.0%</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Performance Gap</div>
          </div>
        </div>

        {/* Enhanced Sub Navigation Tabs */}
        <div style={{ 
          marginBottom: '30px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}>
            {[
              { key: 'datewise', icon: '📅', label: 'Date-wise Comparison' },
              { key: 'chapterwise', icon: '🎯', label: 'Chapter-wise Comparison' },
              { key: 'summary', icon: '📊', label: 'Comparison Summary' }
            ].map((tab, index) => (
              <button 
                key={tab.key}
                onClick={() => handleScoreSubTabChange(tab.key)}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: 'none',
                  backgroundColor: scoreProgressionSubTab === tab.key ? '#3b82f6' : 'transparent',
                  color: scoreProgressionSubTab === tab.key ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  borderRight: index < 2 ? '1px solid #e2e8f0' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Sub Tab Content */}
        {scoreProgressionSubTab === 'datewise' && (
          <div style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateX(-20px)' : 'translateX(0)',
            transition: 'all 0.3s ease'
          }}>
            {scoreProgressionView === 'combined' && (
              <>
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px', 
                    color: '#1f2937',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    📅 Homework vs Classwork: Date-wise Performance Analysis
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '16px' }}>Score Comparison Over Time with All Submission Dates</p>
                </div>
                
                {/* Enhanced Summary Cards */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '16px', 
                  marginBottom: '30px',
                  animation: 'slideUp 0.6s ease-out'
                }}>
                  {[
                    { value: '6', label: 'Total Dates', color: '#3b82f6', bg: '#dbeafe' },
                    { value: '532%', label: 'HW Growth Rate', color: '#22c55e', bg: '#dcfce7' },
                    { value: '33%', label: 'CW Growth Rate', color: '#f59e0b', bg: '#fef3c7' },
                    { value: '26 pts', label: 'Max Gap (HW-CW)', color: '#ec4899', bg: '#fce7f3' }
                  ].map((card, index) => (
                    <div key={index} style={{ 
                      padding: '20px', 
                      borderRadius: '12px', 
                      backgroundColor: card.bg, 
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(0)',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>{card.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={studentDateWiseComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="homework" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        onClick={() => handleScoreLineClick('homework')}
                        style={{ cursor: 'pointer' }}
                        name="Homework Scores"
                        dot={{ fill: '#3b82f6', strokeWidth: 3, r: 8, cursor: 'pointer' }}
                        activeDot={{ r: 12, stroke: '#3b82f6', strokeWidth: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="classwork" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        onClick={() => handleScoreLineClick('classwork')}
                        style={{ cursor: 'pointer' }}
                        name="Classwork Scores"
                        dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 8, cursor: 'pointer' }}
                        activeDot={{ r: 12, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '20px', 
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '12px',
                  border: '1px solid #bae6fd'
                }}>
                  <p style={{ 
                    color: '#0369a1', 
                    fontSize: '15px', 
                    fontWeight: '600',
                    margin: 0
                  }}>
                    💡 Click on the lines to view detailed performance progression with class ranking
                  </p>
                </div>
              </>
            )}

            {scoreProgressionView === 'homework' && (
              <div style={{ 
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '24px',
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    margin: 0
                  }}>
                    📝 Homework Performance Progression with Class Ranking
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Filter Buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                        <button 
                          key={filter} 
                          style={{
                            padding: '8px 12px',
                            border: filter === 'MAX' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                            backgroundColor: filter === 'MAX' ? '#3b82f6' : 'white',
                            color: filter === 'MAX' ? 'white' : '#64748b',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (filter !== 'MAX') {
                              e.target.style.backgroundColor = '#f1f5f9';
                              e.target.style.borderColor = '#cbd5e1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (filter !== 'MAX') {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.borderColor = '#e2e8f0';
                            }
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleViewTransition('combined', setScoreProgressionView)}
                      style={{ 
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px 18px', 
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      ← Back to Comparison
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                  color: 'white', 
                  padding: '16px 24px', 
                  borderRadius: '12px', 
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  🏆 YOU ARE AMONG TOP 60% STUDENTS - Your Score: 66.8% | Class Avg: 62.2%
                </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={studentHomeworkProgressionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis domain={[0, 100]} fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="performance" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        name="Homework Performance (%)"
                        dot={{ fill: '#3b82f6', strokeWidth: 3, r: 8 }}
                        activeDot={{ r: 12, stroke: '#3b82f6', strokeWidth: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="trend" 
                        stroke="#fbbf24" 
                        strokeWidth={3}
                        strokeDasharray="8 8"
                        name="Trend Line"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ 
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                  color: 'white', 
                  padding: '12px 20px', 
                  borderRadius: '10px', 
                  display: 'inline-block',
                  marginTop: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                }}>
                  📈 Improvement Trend: 15.07% per assignment
                </div>
              </div>
            )}

            {scoreProgressionView === 'classwork' && (
              <div style={{ 
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '24px',
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    margin: 0
                  }}>
                    📝 Classwork Performance Progression with Class Ranking
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Filter Buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                        <button 
                          key={filter} 
                          style={{
                            padding: '8px 12px',
                            border: filter === 'MAX' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                            backgroundColor: filter === 'MAX' ? '#8b5cf6' : 'white',
                            color: filter === 'MAX' ? 'white' : '#64748b',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleViewTransition('combined', setScoreProgressionView)}
                      style={{ 
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px 18px', 
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ← Back to Comparison
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                  color: 'white', 
                  padding: '16px 24px', 
                  borderRadius: '12px', 
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  ⚠️ YOU ARE AMONG BOTTOM 50% STUDENTS - Your Score: 33.8% | Class Avg: 51.5%
                </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={studentClassworkProgressionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis domain={[0, 60]} fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="performance" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        name="Classwork Performance (%)"
                        dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 8 }}
                        activeDot={{ r: 12, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="trend" 
                        stroke="#fbbf24" 
                        strokeWidth={3}
                        strokeDasharray="8 8"
                        name="Trend Line"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ 
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                  color: 'white', 
                  padding: '12px 20px', 
                  borderRadius: '10px', 
                  display: 'inline-block',
                  marginTop: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                }}>
                  📉 Improvement Trend: -1.02% per assignment
                </div>
              </div>
            )}
          </div>
        )}

        {scoreProgressionSubTab === 'chapterwise' && (
          <div style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.4s ease'
          }}>
            {scoreProgressionView === 'combined' && (
              <>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  marginBottom: '24px', 
                  color: '#1f2937',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🎯 Homework vs Classwork: Topic-wise Performance Analysis
                </h3>
                
                <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '16px' }}>
                  Average Performance Comparison by TOPIC - Click on lines for detailed analysis
                </p>

                {/* Line Chart */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  marginBottom: '30px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={topicWisePerformanceData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={11} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="homework" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        onClick={() => handleScoreLineClick('homework')}
                        style={{ cursor: 'pointer' }}
                        name="Homework Average (Click to see timeline)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, cursor: 'pointer' }}
                        activeDot={{ r: 10, stroke: '#3b82f6', strokeWidth: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="classwork" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        onClick={() => handleScoreLineClick('classwork')}
                        style={{ cursor: 'pointer' }}
                        name="Classwork Average (Click to see timeline)"
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6, cursor: 'pointer' }}
                        activeDot={{ r: 10, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9'
                }}>
                  <h4 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                    📊 Grouped Bar Comparison View
                  </h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topicWisePerformanceData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={11} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="homework" fill="#3b82f6" name="Homework" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="classwork" fill="#8b5cf6" name="Classwork" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '16px', 
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    📈 Use buttons above to switch between comparison views and detailed timeline views
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {scoreProgressionSubTab === 'summary' && (
          <div style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '30px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                📊 HOMEWORK vs CLASSWORK COMPARISON
              </h3>
              <p style={{ opacity: 0.9, fontSize: '16px' }}>Comprehensive Performance Analysis & Insights</p>
            </div>

            {/* Mobile-style Cards */}
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Overall Performance Card */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📊
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Overall Performance
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#dbeafe', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>66.8%</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Homework Average</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>33.8%</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Classwork Average</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>-33.0%</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Performance Gap</div>
                  </div>
                </div>
              </div>

              {/* Score Analysis Card */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📈
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Score Analysis
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#dcfce7', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>24.5</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>HW Avg Score</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>11.3</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>CW Avg Score</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fce7f3', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#be185d' }}>-13.2</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Score Difference</div>
                  </div>
                </div>
              </div>

              {/* Topics Analysis */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🎯
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Topics Analysis
                  </h4>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#22c55e', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                    📈 Topics with Improvement (CW {'>='} HW):
                  </h5>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {detailedComparisonData.topicsWithImprovement.map((topic, index) => (
                      <div key={index} style={{ 
                        padding: '12px 16px', 
                        backgroundColor: '#f0fdf4', 
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ color: '#374151', fontWeight: '500' }}>{topic.topic}</span>
                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>+{topic.improvement}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                    📉 Topics with Decline (CW {'<'} HW):
                  </h5>
                  <div style={{ display: 'grid', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                    {detailedComparisonData.topicsWithDecline.slice(0, 6).map((topic, index) => (
                      <div key={index} style={{ 
                        padding: '10px 14px', 
                        backgroundColor: '#fef2f2', 
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>{topic.topic}</span>
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{topic.decline}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📋
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Detailed Topic Comparison
                  </h4>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Topic</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>HW Avg (%)</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>CW Avg (%)</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Gap</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedComparisonData.detailedTopicComparison.slice(0, 5).map((row, index) => (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.topic}</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.hwAvg}%</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.cwAvg}%</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: row.gap > 0 ? '#22c55e' : '#ef4444', borderBottom: '1px solid #f1f5f9' }}>
                            {row.gap > 0 ? '+' : ''}{row.gap}%
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: row.status === 'CW Better' ? '#dcfce7' : '#fee2e2',
                              color: row.status === 'CW Better' ? '#16a34a' : '#dc2626'
                            }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Topic Analysis Tab
  const renderTopicAnalysisTab = () => {
    return (
      <div className="tab-content" style={{ opacity: isTransitioning ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
        {/* Enhanced Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px', 
          marginBottom: '30px',
          transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>7</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Topics Analyzed</div>
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>66.7%</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Best Performance</div>
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Quadratic</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Most Active Topic</div>
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #ec4899, #be185d)', 
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>62.5%</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Latest Average</div>
          </div>
        </div>

        {/* Enhanced Sub Navigation */}
        <div style={{ 
          marginBottom: '30px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}>
            {[
              { key: 'datewise', icon: '📅', label: 'Date-wise Comparison' },
              { key: 'chapterwise', icon: '🎯', label: 'Chapter-wise Comparison' },
              { key: 'summary', icon: '📊', label: 'Comparison Summary' }
            ].map((tab, index) => (
              <button 
                key={tab.key}
                onClick={() => handleTopicSubTabChange(tab.key)}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: 'none',
                  backgroundColor: topicAnalysisSubTab === tab.key ? '#8b5cf6' : 'transparent',
                  color: topicAnalysisSubTab === tab.key ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  borderRight: index < 2 ? '1px solid #e2e8f0' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Sub Tab Content */}
        {topicAnalysisSubTab === 'datewise' && (
          <div style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateX(-20px)' : 'translateX(0)',
            transition: 'all 0.3s ease'
          }}>
            {topicAnalysisView === 'combined' && (
              <>
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px', 
                    color: '#1f2937',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    📅 Homework vs Classwork: Date-wise Performance Analysis
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '16px' }}>Score Comparison Over Time with All Submission Dates</p>
                </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9',
                  marginBottom: '20px'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={studentDateWiseComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="homework" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        onClick={() => handleTopicLineClick('homework')}
                        style={{ cursor: 'pointer' }}
                        name="Homework Scores"
                        dot={{ fill: '#3b82f6', strokeWidth: 3, r: 8, cursor: 'pointer' }}
                        activeDot={{ r: 12, stroke: '#3b82f6', strokeWidth: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="classwork" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        onClick={() => handleTopicLineClick('classwork')}
                        style={{ cursor: 'pointer' }}
                        name="Classwork Scores"
                        dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 8, cursor: 'pointer' }}
                        activeDot={{ r: 12, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Vertical Bar Chart (from image 6) */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9'
                }}>
                  <h4 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                    📊 Performance Comparison (Grouped Bar Chart)
                  </h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={groupedBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="homework" fill="#3b82f6" name="Homework Performance" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="classwork" fill="#8b5cf6" name="Classwork Performance" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <p style={{ 
                      color: '#0369a1', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      margin: 0
                    }}>
                      💡 Blue bars = Homework Performance, Purple bars = Classwork Performance - paired chronologically by dates: Jun 23, Jun 24, Jun 25, Jun 27, Jun 29, etc.
                    </p>
                  </div>
                </div>

                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '20px', 
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '12px',
                  border: '1px solid #bae6fd'
                }}>
                  <p style={{ 
                    color: '#0369a1', 
                    fontSize: '15px', 
                    fontWeight: '600',
                    margin: 0
                  }}>
                    💡 Click on the lines in the first chart to view topic-specific performance analysis
                  </p>
                </div>
              </>
            )}

            {topicAnalysisView === 'homework' && (
              <div style={{ 
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <button 
                    onClick={() => handleViewTransition('combined', setTopicAnalysisView)}
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '12px 18px', 
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ← Back to Comparison
                  </button>
                </div>
                
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '20px'
                }}>
                  📚 Homework Topic Performance Analysis
                </h3>
                
                <p style={{ marginBottom: '20px', color: '#64748b' }}>Performance by Topic Over Time</p>
                
                {/* Filter Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                    <button 
                      key={filter} 
                      style={{
                        padding: '8px 16px',
                        border: filter === 'MAX' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                        backgroundColor: filter === 'MAX' ? '#8b5cf6' : 'white',
                        color: filter === 'MAX' ? 'white' : '#64748b',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={[
                      { date: 'Jun 23', performance: 5 },
                      { date: 'Jun 25', performance: 50 },
                      { date: 'Jun 27', performance: 75 },
                      { date: 'Jun 29', performance: 100 },
                      { date: 'Jul 01', performance: 80 },
                      { date: 'Jul 03', performance: 100 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis domain={[0, 100]} fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                      <Line 
                        type="monotone" 
                        dataKey="performance" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        name="Quadratic Applications Average"
                        dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 8 }}
                        activeDot={{ r: 12, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>📊 Performance Summary:</div>
                  <div><strong>Topic:</strong> Quadratic Applications</div>
                  <div><strong>Date:</strong> Jul 04</div>
                  <div><strong>Average Performance:</strong> 62.5%</div>
                </div>
              </div>
            )}

            {topicAnalysisView === 'classwork' && (
              <div style={{ 
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <button 
                    onClick={() => handleViewTransition('combined', setTopicAnalysisView)}
                    style={{ 
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '12px 18px', 
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ← Back to Comparison
                  </button>
                </div>
                
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '20px'
                }}>
                  📚 Classwork Topic Performance Analysis
                </h3>
                
                <p style={{ marginBottom: '20px', color: '#64748b' }}>Performance by Topic Over Time</p>
                
                {/* Filter Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                    <button 
                      key={filter} 
                      style={{
                        padding: '8px 16px',
                        border: filter === 'MAX' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                        backgroundColor: filter === 'MAX' ? '#8b5cf6' : 'white',
                        color: filter === 'MAX' ? 'white' : '#64748b',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={[
                      { date: 'Jun 25', performance: 25 },
                      { date: 'Jun 27', performance: 66.7 },
                      { date: 'Jun 29', performance: 30 },
                      { date: 'Jul 01', performance: 25 },
                      { date: 'Jul 03', performance: 62.5 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={13} tick={{ fill: '#64748b' }} />
                      <YAxis domain={[0, 80]} fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                      <Line 
                        type="monotone" 
                        dataKey="performance" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        name="Quadratic Applications Average"
                        dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 8 }}
                        activeDot={{ r: 12, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>📊 Performance Summary:</div>
                  <div><strong>Topic:</strong> Quadratic Applications</div>
                  <div><strong>Date:</strong> Jul 04</div>
                  <div><strong>Average Performance:</strong> 62.5%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {topicAnalysisSubTab === 'chapterwise' && (
          <div style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.4s ease'
          }}>
            {topicAnalysisView === 'combined' && (
              <>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  marginBottom: '24px', 
                  color: '#1f2937',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🎯 Homework vs Classwork: Interactive Topic Analysis
                </h3>
                
                <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '16px' }}>
                  Click buttons above to see detailed timelines for each data type
                </p>

                {/* Interactive Line Chart */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  marginBottom: '30px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9'
                }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={topicWisePerformanceData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={11} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="homework" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        onClick={() => handleTopicLineClick('homework')}
                        style={{ cursor: 'pointer' }}
                        name="Homework Average (Click to see timeline)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, cursor: 'pointer' }}
                        activeDot={{ r: 10, stroke: '#3b82f6', strokeWidth: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="classwork" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        onClick={() => handleTopicLineClick('classwork')}
                        style={{ cursor: 'pointer' }}
                        name="Classwork Average (Click to see timeline)"
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6, cursor: 'pointer' }}
                        activeDot={{ r: 10, stroke: '#8b5cf6', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9'
                }}>
                  <h4 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                    💡 Use buttons above to switch between comparison views and detailed timeline views
                  </h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topicWisePerformanceData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={11} tick={{ fill: '#64748b' }} />
                      <YAxis fontSize={13} tick={{ fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="homework" fill="#3b82f6" name="Homework" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="classwork" fill="#8b5cf6" name="Classwork" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        )}

        {topicAnalysisSubTab === 'summary' && (
          <div style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.4s ease'
          }}>
            {/* Same enhanced summary content as score progression but for topics */}
            <div style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '30px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                📊 TOPIC ANALYSIS COMPARISON SUMMARY
              </h3>
              <p style={{ opacity: 0.9, fontSize: '16px' }}>Comprehensive Topic Performance Analysis & Insights</p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🏆
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Best Performing Topics
                  </h4>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>Calculus - Integration</div>
                    <div style={{ color: '#374151', fontSize: '14px' }}>100% (Homework) - Outstanding performance</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>Coordinate Geometry</div>
                    <div style={{ color: '#374151', fontSize: '14px' }}>93% (Classwork) - Excellent classwork performance</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>Algebra - Rational Functions</div>
                    <div style={{ color: '#374151', fontSize: '14px' }}>80% (Homework) - Strong homework performance</div>
                  </div>
                </div>
              </div>

              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    ⚠️
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Topics Needing Attention
                  </h4>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>Calculus - Integration (Classwork)</div>
                    <div style={{ color: '#374151', fontSize: '14px' }}>9% - Major performance gap needs immediate attention</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>Algebra - Linear Equations (Classwork)</div>
                    <div style={{ color: '#374151', fontSize: '14px' }}>13% - Significant gap requiring focused practice</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>Statistics (Classwork)</div>
                    <div style={{ color: '#374151', fontSize: '14px' }}>20% - Needs improvement and additional support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Mistake Progress Analysis Tab
  const renderMistakeProgressAnalysisTab = () => {
    return (
      <div className="tab-content">
        {/* Chapter Explorer Header (from image 10) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #fbbf24 0%, #ec4899 100%)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '30px',
          color: 'white',
          boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍 Quick Chapter Explorer</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>📚 Explore Questions by Chapter! 📊</div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
            Choose any chapter below to instantly see all your questions from that topic!
          </div>
        </div>

        {/* Chapter Explorer Grid (from image 10) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {chapterExplorerData.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setSelectedChapterFilter(chapter.chapter)}
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                  e.target.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    📚 {chapter.chapter}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: chapter.percentage >= 70 ? '#22c55e' : chapter.percentage >= 40 ? '#f59e0b' : '#ef4444'
                }}>
                  ({chapter.percentage}%)
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Answer Distribution (Enhanced from image 11) */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: '#1f2937',
            textAlign: 'center'
          }}>
            📊 How Well Did I Do? (Answer Categories)
          </h3>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={answerDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {answerDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Questions`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>Total</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>30</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Questions</div>
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {answerDistributionData.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${item.color}`
                    }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        backgroundColor: item.color, 
                        borderRadius: '50%',
                        marginRight: '12px'
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#374151' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.value} questions</div>
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: item.color 
                      }}>
                        {item.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Explorer (from images 12-15) */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: '#1f2937'
          }}>
            🔍 Explore Your Questions In Different Ways
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px', 
            marginBottom: '30px' 
          }}>
            {/* Filter By Performance Percentage */}
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '20px' }}>📊</div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151', margin: 0 }}>
                  Filter By Performance Percentage
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                Choose A Performance Range:
              </p>
              
              <select
                value={selectedPerformanceFilter}
                onChange={(e) => setSelectedPerformanceFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                {performanceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Filter By Chapter */}
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '20px' }}>📚</div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151', margin: 0 }}>
                  Filter By Chapter
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                Choose A Chapter:
              </p>
              
              <select
                value={selectedChapterFilter}
                onChange={(e) => setSelectedChapterFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                {chaptersList.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtered Results Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '20px' }}>📋</div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', margin: 0 }}>
              Filtered Results - 30 Questions Found
            </h4>
          </div>
          
          {/* Summary of Filtered Results */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '16px', 
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Performance</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>66.8%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Room for Improvement</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>33.2%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Chapters Covered</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>10 Chapters</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Questions Found</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>30 Questions</div>
            </div>
          </div>

          {/* Question Details Table */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Question ID</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Chapter</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Date</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Question</th>
                    <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>My Score</th>
                    <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Performance</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Mistake Tracker</th>
                    <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Current Status</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Student Mistake</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Correct Approach</th>
                  </tr>
                </thead>
                <tbody>
                  {questionDetailsData.map((row, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.id}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.chapter}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.date}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9', maxWidth: '200px' }}>{row.question}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>{row.score}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>{row.performance}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>First submission, no prior mistakes</td>
                      <td style={{ padding: '12px', fontSize: '13px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor: row.status === 'Irrelevant' ? '#fee2e2' : row.status === 'Numerical Error' ? '#fef3c7' : '#f1f5f9',
                          color: row.status === 'Irrelevant' ? '#dc2626' : row.status === 'Numerical Error' ? '#d97706' : '#6b7280'
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>{row.mistake}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' }}>Minimize the distance function using calculus</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentAnalysisContent = () => {
    return (
      <div>
        {/* Enhanced Student Analysis Main Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '30px', 
          backgroundColor: '#f8fafc',
          padding: '6px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {[
            { key: 'progression', icon: '📈', label: 'Score Progression', color: '#3b82f6' },
            { key: 'topics', icon: '⏱️', label: 'Topic Analysis', color: '#8b5cf6' },
            { key: 'mistakes', icon: '🔍', label: 'Mistake-Progress-Analysis', color: '#ef4444' },
            { key: 'summary', icon: '📋', label: 'Summary', color: '#22c55e' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStudentAnalysisMainTab(tab.key)}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                backgroundColor: studentAnalysisMainTab === tab.key ? tab.color : 'transparent',
                color: studentAnalysisMainTab === tab.key ? 'white' : '#64748b',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                boxShadow: studentAnalysisMainTab === tab.key ? `0 4px 16px ${tab.color}40` : 'none',
                transform: studentAnalysisMainTab === tab.key ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Enhanced Content Area with animations */}
        <div style={{ 
          minHeight: '500px',
          opacity: isTransitioning ? 0.8 : 1,
          transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          {studentAnalysisMainTab === 'progression' && renderScoreProgressionTab()}
          {studentAnalysisMainTab === 'topics' && renderTopicAnalysisTab()}
          {studentAnalysisMainTab === 'mistakes' && renderMistakeProgressAnalysisTab()}
          {studentAnalysisMainTab === 'summary' && (
            <div className="tab-content" style={{ 
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>📋 Student Performance Summary</h3>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>🎯 Overall Performance</h4>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>The student shows strong performance in homework assignments but struggles with classwork. This suggests good preparation and understanding when given time, but difficulties with time-constrained assessments.</p>
                </div>
                
                <div style={{ padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>📊 Key Metrics</h4>
                  <ul style={{ color: '#6b7280', listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li><strong>Homework Average:</strong> 66.8% (Above class average of 62.2%)</li>
                    <li><strong>Classwork Average:</strong> 33.8% (Below class average of 51.5%)</li>
                    <li><strong>Performance Gap:</strong> -33.0% (Significant difference between HW and CW)</li>
                    <li><strong>Improvement Rate:</strong> 15.07% in homework assignments</li>
                  </ul>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>💡 Recommendations</h4>
                  <ul style={{ color: '#6b7280', listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Focus on time management skills for classwork</li>
                    <li>Practice more timed exercises</li>
                    <li>Reinforce conceptual understanding through targeted practice</li>
                    <li>Reduce careless errors through careful review processes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="class-analysis-main-content">
      <div className="class-analysis-header">
        <div className="class-header-top">
          <div className="class-header-info">
            <div className="class-header-icon">👤</div>
            <div>
              <h2 className="class-header-title">Student Analysis Dashboard</h2>
              <p className="class-header-subtitle">
                {selectedStudent ? 
                  `Detailed performance analysis for ${selectedStudent.rollNo} - ${selectedStudent.name || 'Unknown Student'}` : 
                  'Select a student to view detailed analysis'
                }
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Select Class */}
            <div className="class-selector-container">
              <span className="class-selector-label" style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Select Class</span>
              <select
                value={selectedClass.name}
                onChange={(e) => {
                  const classData = Object.values(classesData).find(cls => cls.name === e.target.value);
                  if (classData) {
                    onClassChange(classData);
                  }
                }}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '150px',
                  fontWeight: '500'
                }}
              >
                <option value="Class 6th">Class 6th 👥</option>
                <option value="Class 7th">Class 7th</option>
                <option value="Class 8th">Class 8th</option>
                <option value="Class 9th">Class 9th</option>
                <option value="Class 10th">Class 10th</option>
                <option value="Class 11th">Class 11th</option>
                <option value="Class 12th">Class 12th</option>
              </select>
            </div>

            {/* Select Student */}
            <div className="class-selector-container">
              <span className="class-selector-label" style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Select Student</span>
              <select
                value={selectedStudent?.rollNo || ''}
                onChange={(e) => {
                  const student = availableStudents.find(s => s.rollNo === e.target.value);
                  if (student) {
                    onStudentSelect(student);
                  } else {
                    onStudentSelect(null);
                  }
                }}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '180px',
                  fontWeight: '500'
                }}
              >
                <option value="">Choose Student 👤</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.rollNo}>
                    {student.rollNo} - {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Student Analysis Content without sidebar */}
      <div style={{ width: '100%', padding: '20px 0' }}>
        {selectedStudent ? renderStudentAnalysisContent() : renderNoStudentSelected()}
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .tab-content {
          animation: fadeIn 0.4s ease-out;
        }

        .summary-cards-grid {
          animation: slideUp 0.6s ease-out;
        }

        .chart-container {
          animation: scaleIn 0.5s ease-out;
        }

        .metric-card-blue,
        .metric-card-red,
        .metric-card-green,
        .metric-card-yellow,
        .metric-card-pink {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .metric-card-blue:hover,
        .metric-card-red:hover,
        .metric-card-green:hover,
        .metric-card-yellow:hover,
        .metric-card-pink:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .sub-tab-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sub-tab-button:hover {
          transform: translateY(-1px);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          animation: fadeIn 0.6s ease-out;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .empty-state-title {
          font-size: 24px;
          font-weight: bold;
          color: #374151;
          margin-bottom: 12px;
        }

        .empty-state-text {
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Enhanced button animations */
        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced table styling */
        table tr:hover {
          background-color: #f8fafc;
        }

        /* Enhanced card hover effects */
        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Smooth transitions for all elements */
        * {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        /* Enhanced loading states */
        .loading {
          opacity: 0.7;
          pointer-events: none;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .summary-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .class-header-top {
            flex-direction: column;
            gap: 16px;
          }
          
          .tab-content {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .summary-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentAnalysis;