// StudentAnalysis.jsx 

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, ReferenceLine
} from 'recharts';
import './StudentAnalysis.css';

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

  // Enhanced Topic-wise Performance Data
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

  // Grouped Bar Chart Data
  const groupedBarData = [
    { date: 'Jun 23', homework: 18.2, classwork: 36.7 },
    { date: 'Jun 25', homework: 35.9, classwork: 20.0 },
    { date: 'Jun 27', homework: 79.4, classwork: 46.7 },
    { date: 'Jun 29', homework: 83.8, classwork: 25.5 },
    { date: 'Jul 01', homework: 86.1, classwork: 25.7 },
    { date: 'Jul 03', homework: 92.7, classwork: 44.4 }
  ];

  // Enhanced Comparison Summary Data
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

  // Chapter Explorer Data
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

  // Enhanced Score Progression Tab
  const renderScoreProgressionTab = () => {
    return (
      <div className={`tab-content ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Summary Cards */}
        <div className={`summary-cards-grid ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="metric-card metric-card-blue">
            <div className="metric-value">66.8%</div>
            <div className="metric-label">Homework Average</div>
          </div>
          <div className="metric-card metric-card-red">
            <div className="metric-value">33.8%</div>
            <div className="metric-label">Classwork Average</div>
          </div>
          <div className="metric-card metric-card-green">
            <div className="metric-value">15.07%</div>
            <div className="metric-label">HW Improvement Rate</div>
          </div>
          <div className="metric-card metric-card-yellow">
            <div className="metric-value">-33.0%</div>
            <div className="metric-label">Performance Gap</div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="sub-nav-container">
          <div className="sub-nav-tabs">
            {[
              { key: 'datewise', icon: '📅', label: 'Date-wise Comparison' },
              { key: 'chapterwise', icon: '🎯', label: 'Chapter-wise Comparison' },
              { key: 'summary', icon: '📊', label: 'Comparison Summary' }
            ].map((tab, index) => (
              <button 
                key={tab.key}
                onClick={() => handleScoreSubTabChange(tab.key)}
                className={`sub-tab-button ${scoreProgressionSubTab === tab.key ? 'active' : ''}`}
              >
                <span className="sub-tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Tab Content */}
        {scoreProgressionSubTab === 'datewise' && (
          <div className={isTransitioning ? 'content-transitioning' : ''}>
            {scoreProgressionView === 'combined' && (
              <>
                <div className="section-header">
                  <h3 className="section-title">
                    📅 Homework vs Classwork: Date-wise Performance Analysis
                  </h3>
                  <p className="section-subtitle">Score Comparison Over Time with All Submission Dates</p>
                </div>
                
                {/* Small Metric Cards */}
                <div className="small-metric-cards">
                  <div className="small-metric-card" style={{ backgroundColor: '#dbeafe' }}>
                    <div className="small-metric-value" style={{ color: '#3b82f6' }}>6</div>
                    <div className="small-metric-label">Total Dates</div>
                  </div>
                  <div className="small-metric-card" style={{ backgroundColor: '#dcfce7' }}>
                    <div className="small-metric-value" style={{ color: '#22c55e' }}>532%</div>
                    <div className="small-metric-label">HW Growth Rate</div>
                  </div>
                  <div className="small-metric-card" style={{ backgroundColor: '#fef3c7' }}>
                    <div className="small-metric-value" style={{ color: '#f59e0b' }}>33%</div>
                    <div className="small-metric-label">CW Growth Rate</div>
                  </div>
                  <div className="small-metric-card" style={{ backgroundColor: '#fce7f3' }}>
                    <div className="small-metric-value" style={{ color: '#ec4899' }}>26 pts</div>
                    <div className="small-metric-label">Max Gap (HW-CW)</div>
                  </div>
                </div>

                <div className="chart-container">
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
                
                <div className="info-card">
                  <p className="info-text">
                    💡 Click on the lines to view detailed performance progression with class ranking
                  </p>
                </div>
              </>
            )}

            {scoreProgressionView === 'homework' && (
              <div className={isTransitioning ? 'content-scaling' : ''}>
                <div className="control-header">
                  <h3 className="control-title">
                    📝 Homework Performance Progression with Class Ranking
                  </h3>
                  
                  <div className="control-actions">
                    <div className="filter-buttons">
                      {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                        <button 
                          key={filter} 
                          className={`filter-button ${filter === 'MAX' ? 'active' : ''}`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleViewTransition('combined', setScoreProgressionView)}
                      className="back-button"
                    >
                      ← Back to Comparison
                    </button>
                  </div>
                </div>
                
                <div className="alert-banner alert-success">
                  🏆 YOU ARE AMONG TOP 60% STUDENTS - Your Score: 66.8% | Class Avg: 62.2%
                </div>

                <div className="chart-container-enhanced">
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
                
                <div className="improvement-trend">
                  📈 Improvement Trend: 15.07% per assignment
                </div>
              </div>
            )}

            {scoreProgressionView === 'classwork' && (
              <div className={isTransitioning ? 'content-scaling' : ''}>
                <div className="control-header">
                  <h3 className="control-title">
                    📝 Classwork Performance Progression with Class Ranking
                  </h3>
                  
                  <div className="control-actions">
                    <div className="filter-buttons">
                      {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                        <button 
                          key={filter} 
                          className={`filter-button topics ${filter === 'MAX' ? 'active' : ''}`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleViewTransition('combined', setScoreProgressionView)}
                      className="back-button topics"
                    >
                      ← Back to Comparison
                    </button>
                  </div>
                </div>
                
                <div className="alert-banner alert-warning">
                  ⚠ YOU ARE AMONG BOTTOM 50% STUDENTS - Your Score: 33.8% | Class Avg: 51.5%
                </div>

                <div className="chart-container-enhanced">
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
                
                <div className="improvement-trend">
                  📉 Improvement Trend: -1.02% per assignment
                </div>
              </div>
            )}
          </div>
        )}

        {scoreProgressionSubTab === 'chapterwise' && (
          <div className={isTransitioning ? 'content-sliding' : ''}>
            {scoreProgressionView === 'combined' && (
              <>
                <h3 className="section-title">
                  🎯 Homework vs Classwork: Topic-wise Performance Analysis
                </h3>
                
                <p className="section-subtitle">
                  Average Performance Comparison by TOPIC - Click on lines for detailed analysis
                </p>

                {/* Line Chart */}
                <div className="chart-container">
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
                <div className="chart-container">
                  <h4 className="section-subtitle">📊 Grouped Bar Comparison View</h4>
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
                  <div className="info-card">
                    <p className="info-text">
                      📈 Use buttons above to switch between comparison views and detailed timeline views
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {scoreProgressionSubTab === 'summary' && (
          <div className={isTransitioning ? 'content-sliding' : ''}>
            <div className="gradient-header">
              <h3 className="gradient-header-title">
                📊 HOMEWORK vs CLASSWORK COMPARISON
              </h3>
              <p className="gradient-header-subtitle">Comprehensive Performance Analysis & Insights</p>
            </div>

            {/* Analysis Cards */}
            <div className="analysis-cards-grid">
              {/* Overall Performance Card */}
              <div className="analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-card-icon blue">📊</div>
                  <h4 className="analysis-card-title">Overall Performance</h4>
                </div>
                <div className="analysis-card-content three-cols">
                  <div className="performance-metric blue">
                    <div className="performance-value">66.8%</div>
                    <div className="performance-label">Homework Average</div>
                  </div>
                  <div className="performance-metric red">
                    <div className="performance-value red">33.8%</div>
                    <div className="performance-label">Classwork Average</div>
                  </div>
                  <div className="performance-metric yellow">
                    <div className="performance-value yellow">-33.0%</div>
                    <div className="performance-label">Performance Gap</div>
                  </div>
                </div>
              </div>

              {/* Score Analysis Card */}
              <div className="analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-card-icon green">📈</div>
                  <h4 className="analysis-card-title">Score Analysis</h4>
                </div>
                <div className="analysis-card-content three-cols">
                  <div className="performance-metric green">
                    <div className="performance-value green">24.5</div>
                    <div className="performance-label">HW Avg Score</div>
                  </div>
                  <div className="performance-metric red">
                    <div className="performance-value red">11.3</div>
                    <div className="performance-label">CW Avg Score</div>
                  </div>
                  <div className="performance-metric pink">
                    <div className="performance-value pink">-13.2</div>
                    <div className="performance-label">Score Difference</div>
                  </div>
                </div>
              </div>

              {/* Topics Analysis */}
              <div className="analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-card-icon purple">🎯</div>
                  <h4 className="analysis-card-title">Topics Analysis</h4>
                </div>
                
                <div>
                  <h5 className="section-subtitle" style={{ color: '#22c55e', fontWeight: '600' }}>
                    📈 Topics with Improvement (CW {'>='} HW):
                  </h5>
                  <div className="topic-list">
                    {detailedComparisonData.topicsWithImprovement.map((topic, index) => (
                      <div key={index} className="topic-improvement-item">
                        <span className="topic-name">{topic.topic}</span>
                        <span className="topic-improvement">+{topic.improvement}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <h5 className="section-subtitle" style={{ color: '#ef4444', fontWeight: '600' }}>
                    📉 Topics with Decline (CW {'<'} HW):
                  </h5>
                  <div className="topic-list topic-list-scrollable">
                    {detailedComparisonData.topicsWithDecline.slice(0, 6).map((topic, index) => (
                      <div key={index} className="topic-decline-item">
                        <span className="topic-name small">{topic.topic}</span>
                        <span className="topic-decline small">{topic.decline}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-card-icon orange">📋</div>
                  <h4 className="analysis-card-title">Detailed Topic Comparison</h4>
                </div>
                
                <div className="detailed-table-container">
                  <table className="detailed-table">
                    <thead>
                      <tr>
                        <th>Topic</th>
                        <th className="center">HW Avg (%)</th>
                        <th className="center">CW Avg (%)</th>
                        <th className="center">Gap</th>
                        <th className="center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedComparisonData.detailedTopicComparison.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          <td>{row.topic}</td>
                          <td className="center">{row.hwAvg}%</td>
                          <td className="center">{row.cwAvg}%</td>
                          <td className={`center ${row.gap > 0 ? 'gap-positive' : 'gap-negative'}`}>
                            {row.gap > 0 ? '+' : ''}{row.gap}%
                          </td>
                          <td className="center">
                            <span className={row.status === 'CW Better' ? 'status-cw-better' : 'status-hw-better'}>
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
      <div className={`tab-content ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Summary Cards */}
        <div className={`summary-cards-grid ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="metric-card metric-card-purple">
            <div className="metric-value">7</div>
            <div className="metric-label">Topics Analyzed</div>
          </div>
          <div className="metric-card metric-card-green">
            <div className="metric-value">66.7%</div>
            <div className="metric-label">Best Performance</div>
          </div>
          <div className="metric-card metric-card-yellow">
            <div className="metric-value">Quadratic</div>
            <div className="metric-label">Most Active Topic</div>
          </div>
          <div className="metric-card metric-card-pink">
            <div className="metric-value">62.5%</div>
            <div className="metric-label">Latest Average</div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="sub-nav-container">
          <div className="sub-nav-tabs">
            {[
              { key: 'datewise', icon: '📅', label: 'Date-wise Comparison' },
              { key: 'chapterwise', icon: '🎯', label: 'Chapter-wise Comparison' },
              { key: 'summary', icon: '📊', label: 'Comparison Summary' }
            ].map((tab, index) => (
              <button 
                key={tab.key}
                onClick={() => handleTopicSubTabChange(tab.key)}
                className={`sub-tab-button topics ${topicAnalysisSubTab === tab.key ? 'active' : ''}`}
              >
                <span className="sub-tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Tab Content */}
        {topicAnalysisSubTab === 'datewise' && (
          <div className={isTransitioning ? 'content-transitioning' : ''}>
            {topicAnalysisView === 'combined' && (
              <>
                <div className="section-header">
                  <h3 className="section-title topics">
                    📅 Homework vs Classwork: Date-wise Performance Analysis
                  </h3>
                  <p className="section-subtitle">Score Comparison Over Time with All Submission Dates</p>
                </div>

                <div className="chart-container">
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

                {/* Vertical Bar Chart */}
                <div className="chart-container">
                  <h4 className="section-subtitle">
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
                  <div className="info-card">
                    <p className="info-text">
                      💡 Blue bars = Homework Performance, Purple bars = Classwork Performance - paired chronologically by dates
                    </p>
                  </div>
                </div>

                <div className="info-card">
                  <p className="info-text">
                    💡 Click on the lines in the first chart to view topic-specific performance analysis
                  </p>
                </div>
              </>
            )}

            {topicAnalysisView === 'homework' && (
              <div className={isTransitioning ? 'content-scaling' : ''}>
                <div style={{ marginBottom: '20px' }}>
                  <button 
                    onClick={() => handleViewTransition('combined', setTopicAnalysisView)}
                    className="back-button"
                  >
                    ← Back to Comparison
                  </button>
                </div>
                
                <h3 className="control-title">📚 Homework Topic Performance Analysis</h3>
                <p className="section-subtitle">Performance by Topic Over Time</p>
                
                {/* Filter Buttons */}
                <div className="filter-buttons" style={{ marginBottom: '20px' }}>
                  {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                    <button 
                      key={filter} 
                      className={`filter-button topics ${filter === 'MAX' ? 'active' : ''}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="chart-container-enhanced">
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
                
                <div className="performance-summary">
                  <div className="performance-summary-title">📊 Performance Summary:</div>
                  <div><strong>Topic:</strong> Quadratic Applications</div>
                  <div><strong>Date:</strong> Jul 04</div>
                  <div><strong>Average Performance:</strong> 62.5%</div>
                </div>
              </div>
            )}

            {topicAnalysisView === 'classwork' && (
              <div className={isTransitioning ? 'content-scaling' : ''}>
                <div style={{ marginBottom: '20px' }}>
                  <button 
                    onClick={() => handleViewTransition('combined', setTopicAnalysisView)}
                    className="back-button topics"
                  >
                    ← Back to Comparison
                  </button>
                </div>
                
                <h3 className="control-title">📚 Classwork Topic Performance Analysis</h3>
                <p className="section-subtitle">Performance by Topic Over Time</p>
                
                {/* Filter Buttons */}
                <div className="filter-buttons" style={{ marginBottom: '20px' }}>
                  {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
                    <button 
                      key={filter} 
                      className={`filter-button topics ${filter === 'MAX' ? 'active' : ''}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="chart-container-enhanced">
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
                
                <div className="performance-summary">
                  <div className="performance-summary-title">📊 Performance Summary:</div>
                  <div><strong>Topic:</strong> Quadratic Applications</div>
                  <div><strong>Date:</strong> Jul 04</div>
                  <div><strong>Average Performance:</strong> 62.5%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {topicAnalysisSubTab === 'chapterwise' && (
          <div className={isTransitioning ? 'content-sliding' : ''}>
            {topicAnalysisView === 'combined' && (
              <>
                <h3 className="section-title topics">
                  🎯 Homework vs Classwork: Interactive Topic Analysis
                </h3>
                
                <p className="section-subtitle">
                  Click buttons above to see detailed timelines for each data type
                </p>

                {/* Interactive Line Chart */}
                <div className="chart-container">
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
                <div className="chart-container">
                  <h4 className="section-subtitle">
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
          <div className={isTransitioning ? 'content-sliding' : ''}>
            <div className="gradient-header topics">
              <h3 className="gradient-header-title">
                📊 TOPIC ANALYSIS COMPARISON SUMMARY
              </h3>
              <p className="gradient-header-subtitle">Comprehensive Topic Performance Analysis & Insights</p>
            </div>

            <div className="analysis-cards-grid">
              <div className="analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-card-icon green">🏆</div>
                  <h4 className="analysis-card-title">Best Performing Topics</h4>
                </div>
                <div className="analysis-card-content">
                  <div className="best-performance-item">
                    <div className="performance-topic good">Calculus - Integration</div>
                    <div className="performance-description">100% (Homework) - Outstanding performance</div>
                  </div>
                  <div className="best-performance-item">
                    <div className="performance-topic good">Coordinate Geometry</div>
                    <div className="performance-description">93% (Classwork) - Excellent classwork performance</div>
                  </div>
                  <div className="best-performance-item">
                    <div className="performance-topic good">Algebra - Rational Functions</div>
                    <div className="performance-description">80% (Homework) - Strong homework performance</div>
                  </div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-card-icon red">⚠</div>
                  <h4 className="analysis-card-title">Topics Needing Attention</h4>
                </div>
                <div className="analysis-card-content">
                  <div className="worst-performance-item">
                    <div className="performance-topic bad">Calculus - Integration (Classwork)</div>
                    <div className="performance-description">9% - Major performance gap needs immediate attention</div>
                  </div>
                  <div className="worst-performance-item">
                    <div className="performance-topic bad">Algebra - Linear Equations (Classwork)</div>
                    <div className="performance-description">13% - Significant gap requiring focused practice</div>
                  </div>
                  <div className="worst-performance-item">
                    <div className="performance-topic bad">Statistics (Classwork)</div>
                    <div className="performance-description">20% - Needs improvement and additional support</div>
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
        {/* Chapter Explorer Header */}
        <div className="chapter-explorer-header">
          <div className="chapter-explorer-title">🔍 Quick Chapter Explorer</div>
          <div className="chapter-explorer-subtitle">📚 Explore Questions by Chapter! 📊</div>
          <div className="chapter-explorer-description">
            Choose any chapter below to instantly see all your questions from that topic!
          </div>
        </div>

        {/* Chapter Explorer Grid */}
        <div style={{ marginBottom: '40px' }}>
          <div className="chapter-grid">
            {chapterExplorerData.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setSelectedChapterFilter(chapter.chapter)}
                className="chapter-button"
              >
                <div>
                  <div className="chapter-name">📚 {chapter.chapter}</div>
                </div>
                <div className={`chapter-percentage ${chapter.percentage >= 70 ? 'high' : chapter.percentage >= 40 ? 'medium' : 'low'}`}>
                  ({chapter.percentage}%)
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Answer Distribution */}
        <div style={{ marginBottom: '40px' }}>
          <h3 className="control-title" style={{ textAlign: 'center' }}>
            📊 How Well Did I Do? (Answer Categories)
          </h3>
          
          <div className="pie-chart-container">
            <div className="pie-chart-content">
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
                <div className="pie-total">
                  <div className="pie-total-label">Total</div>
                  <div className="pie-total-value">30</div>
                  <div className="pie-total-unit">Questions</div>
                </div>
              </div>
              
              <div className="pie-chart-legend">
                {answerDistributionData.map((item, index) => (
                  <div key={index} className="legend-item" style={{ borderLeftColor: item.color }}>
                    <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                    <div className="legend-content">
                      <div className="legend-name">{item.name}</div>
                      <div className="legend-count">{item.value} questions</div>
                    </div>
                    <div className="legend-percentage" style={{ color: item.color }}>
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question Explorer */}
        <div style={{ marginBottom: '40px' }}>
          <h3 className="control-title">
            🔍 Explore Your Questions In Different Ways
          </h3>
          
          <div className="filter-section">
            {/* Filter By Performance Percentage */}
            <div className="filter-card">
              <div className="filter-header">
                <div className="filter-icon">📊</div>
                <h4 className="filter-title">Filter By Performance Percentage</h4>
              </div>
              <p className="filter-description">Choose A Performance Range:</p>
              
              <select
                value={selectedPerformanceFilter}
                onChange={(e) => setSelectedPerformanceFilter(e.target.value)}
                className="filter-select"
              >
                {performanceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Filter By Chapter */}
            <div className="filter-card">
              <div className="filter-header">
                <div className="filter-icon">📚</div>
                <h4 className="filter-title">Filter By Chapter</h4>
              </div>
              <p className="filter-description">Choose A Chapter:</p>
              
              <select
                value={selectedChapterFilter}
                onChange={(e) => setSelectedChapterFilter(e.target.value)}
                className="filter-select"
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
          <div className="results-header">
            <div className="filter-icon">📋</div>
            <h4 className="results-title">Filtered Results - 30 Questions Found</h4>
          </div>
          
          {/* Summary of Filtered Results */}
          <div className="results-summary">
            <div className="results-metric">
              <div className="results-metric-label">Average Performance</div>
              <div className="results-metric-value">66.8%</div>
            </div>
            <div className="results-metric">
              <div className="results-metric-label">Room for Improvement</div>
              <div className="results-metric-value">33.2%</div>
            </div>
            <div className="results-metric">
              <div className="results-metric-label">Chapters Covered</div>
              <div className="results-metric-value">10 Chapters</div>
            </div>
            <div className="results-metric">
              <div className="results-metric-label">Questions Found</div>
              <div className="results-metric-value">30 Questions</div>
            </div>
          </div>

          {/* Question Details Table */}
          <div className="data-table-container">
            <table className="enhanced-data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-enhanced">Question ID</th>
                  <th className="table-header-enhanced">Chapter</th>
                  <th className="table-header-enhanced">Date</th>
                  <th className="table-header-enhanced">Question</th>
                  <th className="table-header-enhanced table-header-center">My Score</th>
                  <th className="table-header-enhanced table-header-center">Performance</th>
                  <th className="table-header-enhanced">Mistake Tracker</th>
                  <th className="table-header-enhanced table-header-center">Current Status</th>
                  <th className="table-header-enhanced">Student Mistake</th>
                  <th className="table-header-enhanced">Correct Approach</th>
                </tr>
              </thead>
              <tbody>
                {questionDetailsData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.id}</td>
                    <td>{row.chapter}</td>
                    <td>{row.date}</td>
                    <td className="table-cell-truncate">{row.question}</td>
                    <td className="table-cell-center">{row.score}</td>
                    <td className="table-cell-center">{row.performance}</td>
                    <td>First submission, no prior mistakes</td>
                    <td className="table-cell-center">
                      <span className={`status-badge ${
                        row.status === 'Irrelevant' ? 'status-irrelevant' :
                        row.status === 'Numerical Error' ? 'status-numerical-error' :
                        'status-default'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.mistake}</td>
                    <td>Minimize the distance function using calculus</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentAnalysisContent = () => {
    return (
      <div>
        {/* Enhanced Student Analysis Main Tabs */}
        <div className="main-tabs-container">
          {[
            { key: 'progression', icon: '📈', label: 'Score Progression', color: '#3b82f6' },
            { key: 'topics', icon: '⏱️', label: 'Topic Analysis', color: '#8b5cf6' },
            { key: 'mistakes', icon: '🔍', label: 'Mistake-Progress-Analysis', color: '#ef4444' },
            { key: 'summary', icon: '📋', label: 'Summary', color: '#22c55e' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStudentAnalysisMainTab(tab.key)}
              className={`main-tab-button ${tab.key} ${studentAnalysisMainTab === tab.key ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Enhanced Content Area with animations */}
        <div className={isTransitioning ? 'loading' : ''} style={{ minHeight: '500px' }}>
          {studentAnalysisMainTab === 'progression' && renderScoreProgressionTab()}
          {studentAnalysisMainTab === 'topics' && renderTopicAnalysisTab()}
          {studentAnalysisMainTab === 'mistakes' && renderMistakeProgressAnalysisTab()}
          {studentAnalysisMainTab === 'summary' && (
            <div className="summary-content">
              <h3 className="summary-title">📋 Student Performance Summary</h3>
              <div className="summary-grid">
                <div className="summary-card" style={{ backgroundColor: '#f8fafc' }}>
                  <h4 className="summary-card-header">🎯 Overall Performance</h4>
                  <p className="summary-card-content">The student shows strong performance in homework assignments but struggles with classwork. This suggests good preparation and understanding when given time, but difficulties with time-constrained assessments.</p>
                </div>
                
                <div className="summary-card" style={{ backgroundColor: '#f0f9ff' }}>
                  <h4 className="summary-card-header">📊 Key Metrics</h4>
                  <ul className="summary-list">
                    <li><strong>Homework Average:</strong> 66.8% (Above class average of 62.2%)</li>
                    <li><strong>Classwork Average:</strong> 33.8% (Below class average of 51.5%)</li>
                    <li><strong>Performance Gap:</strong> -33.0% (Significant difference between HW and CW)</li>
                    <li><strong>Improvement Rate:</strong> 15.07% in homework assignments</li>
                  </ul>
                </div>

                <div className="summary-card" style={{ backgroundColor: '#f0fdf4' }}>
                  <h4 className="summary-card-header">💡 Recommendations</h4>
                  <ul className="summary-list">
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
              <span className="class-selector-label">Select Class</span>
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
              <span className="class-selector-label">Select Student</span>
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

      {/* Main Student Analysis Content */}
      <div style={{ width: '100%', padding: '20px 0' }}>
        {selectedStudent ? renderStudentAnalysisContent() : renderNoStudentSelected()}
      </div>
    </div>
  );
};

export default StudentAnalysis;
      
            