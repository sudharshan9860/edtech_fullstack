// StudentAnalysis.jsx - Enhanced Component for Student Analysis

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, ReferenceLine
} from 'recharts';

const StudentAnalysis = ({ selectedClass, selectedStudent, onStudentSelect, classesData, onClassChange }) => {
  const [studentAnalysisMainTab, setStudentAnalysisMainTab] = useState('progression');
  const [scoreProgressionType, setScoreProgressionType] = useState('homework');
  const [comparisonSubTab, setComparisonSubTab] = useState('datewise');
  
  // New state for Topic Analysis
  const [topicAnalysisType, setTopicAnalysisType] = useState('homework');
  const [topicComparisonSubTab, setTopicComparisonSubTab] = useState('datewise');
  
  // New state for Mistake Progress Analysis
  const [mistakeAnalysisType, setMistakeAnalysisType] = useState('homework');
  const [mistakeComparisonSubTab, setMistakeComparisonSubTab] = useState('datewise');
  const [chapterFilter, setChapterFilter] = useState('All My Work');
  const [performanceFilter, setPerformanceFilter] = useState('All Percentages');
  const [chapterListFilter, setChapterListFilter] = useState('All Chapters');

  // Sample data matching the images provided
  const studentHomeworkProgressionData = [
    { date: 'Jun 23', performance: 18, trend: 28 },
    { date: 'Jun 25', performance: 35, trend: 42 },
    { date: 'Jun 27', performance: 78, trend: 58 },
    { date: 'Jun 29', performance: 80, trend: 68 },
    { date: 'Jul 01', performance: 85, trend: 78 },
    { date: 'Jul 03', performance: 92, trend: 88 }
  ];

  const studentClassworkProgressionData = [
    { date: 'Jun 23', performance: 38, trend: 35 },
    { date: 'Jun 25', performance: 20, trend: 32 },
    { date: 'Jun 27', performance: 47, trend: 38 },
    { date: 'Jun 29', performance: 28, trend: 35 },
    { date: 'Jul 01', performance: 25, trend: 38 },
    { date: 'Jul 03', performance: 44, trend: 42 }
  ];

  const studentDateWiseComparisonData = [
    { date: 'Jun 23', homework: 6, classwork: 12 },
    { date: 'Jun 25', homework: 14, classwork: 7 },
    { date: 'Jun 27', homework: 27, classwork: 14 },
    { date: 'Jun 29', homework: 31, classwork: 10 },
    { date: 'Jul 01', homework: 31, classwork: 10 },
    { date: 'Jul 03', homework: 38, classwork: 16 }
  ];

  const studentTopicWiseComparisonLineData = [
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

  const studentTopicWiseComparisonBarData = [
    { topic: 'Calculus - Integration', homework: 100, classwork: 9 },
    { topic: 'Algebra - Linear Equations', homework: 75, classwork: 13 },
    { topic: 'Statistics', homework: 78, classwork: 20 },
    { topic: 'Algebra - Rational Functions', homework: 80, classwork: 30 },
    { topic: 'Probability', homework: 72, classwork: 33 },
    { topic: 'Trigonometry', homework: 79, classwork: 50 },
    { topic: 'Quadratic Applications', homework: 68, classwork: 39 },
    { topic: 'Calculus - Derivatives', homework: 59, classwork: 32 },
    { topic: 'Functions and Graphs', homework: 51, classwork: 58 },
    { topic: 'Coordinate Geometry', homework: 66, classwork: 93 }
  ];

  const studentComparisonSummaryData = {
    homeworkAverage: 66.8,
    classworkAverage: 33.8,
    performanceGap: -33.0,
    homeworkScore: 24.5,
    classworkScore: 11.3,
    scoreDifference: -13.2,
    homeworkAssignments: 6,
    classworkAssignments: 6,
    commonTopics: 10,
    improvementTopics: [
      { topic: 'Coordinate Geometry', improvement: 27.6 },
      { topic: 'Functions and Graphs', improvement: 7.9 }
    ],
    declineTopics: [
      { topic: 'Calculus - Integration', decline: -90.3 },
      { topic: 'Algebra - Linear Equations', decline: -62.5 },
      { topic: 'Statistics', decline: -57.3 },
      { topic: 'Algebra - Rational Functions', decline: -50.0 },
      { topic: 'Probability', decline: -38.9 },
      { topic: 'Trigonometry', decline: -29.2 },
      { topic: 'Quadratic Applications', decline: -28.5 },
      { topic: 'Calculus - Derivatives', decline: -25.2 }
    ]
  };

  // Topic Analysis Data
  const homeworkTopicPerformanceData = [
    { topic: 'Quadratic Applications', performance: [0, 50, 75, 100, 80, 100] },
    { topic: 'Calculus - Derivatives', performance: [null, null, null, null, null, null] },
    { topic: 'Functions and Graphs', performance: [null, null, null, null, null, null] },
    { topic: 'Coordinate Geometry', performance: [null, null, null, null, null, null] },
    { topic: 'Probability', performance: [null, null, null, null, null, null] },
    { topic: 'Statistics', performance: [null, null, null, null, null, null] },
    { topic: 'Calculus - Integration', performance: [null, null, null, null, null, null] },
    { topic: 'Algebra - Rational Functions', performance: [null, null, null, null, null, null] },
    { topic: 'Trigonometry', performance: [null, null, null, null, null, null] },
    { topic: 'Algebra - Linear Equations', performance: [null, null, null, null, null, null] }
  ];

  const classworkTopicPerformanceData = [
    { topic: 'Quadratic Applications', performance: [25, 25, 66.7, 30, 25, 62.5] },
    { topic: 'Trigonometry', performance: [null, null, null, null, null, null] },
    { topic: 'Calculus - Integration', performance: [null, null, null, null, null, null] },
    { topic: 'Statistics', performance: [null, null, null, null, null, null] },
    { topic: 'Functions and Graphs', performance: [null, null, null, null, null, null] },
    { topic: 'Algebra - Rational Functions', performance: [null, null, null, null, null, null] },
    { topic: 'Probability', performance: [null, null, null, null, null, null] }
  ];

  // Chapter Performance Data
  const chapterPerformanceData = [
    { chapter: 'Calculus - Integration', performance: 100 },
    { chapter: 'Trigonometry', performance: 81.2 },
    { chapter: 'Algebra - Rational Functions', performance: 80.0 },
    { chapter: 'Statistics', performance: 77.5 },
    { chapter: 'Algebra - Linear Equations', performance: 75.0 },
    { chapter: 'Probability', performance: 72.2 },
    { chapter: 'Quadratic Applications', performance: 66.7 },
    { chapter: 'Coordinate Geometry', performance: 63.6 },
    { chapter: 'Calculus - Derivatives', performance: 60.9 },
    { chapter: 'Functions and Graphs', performance: 43.5 }
  ];

  const chapterPerformanceClassworkData = [
    { chapter: 'Calculus - Integration', performance: 0 },
    { chapter: 'Trigonometry', performance: 50.0 },
    { chapter: 'Quadratic Applications', performance: 37.5 },
    { chapter: 'Calculus - Derivatives', performance: 33.3 },
    { chapter: 'Algebra - Rational Functions', performance: 30.0 },
    { chapter: 'Statistics', performance: 18.8 },
    { chapter: 'Algebra - Linear Equations', performance: 8.3 }
  ];

  // Answer Categories Data
  const answerCategoriesData = [
    { name: 'Correct', value: 13, percentage: 43.3 },
    { name: 'Partially-Correct', value: 3, percentage: 10 },
    { name: 'Numerical Error', value: 4, percentage: 13.3 },
    { name: 'Irrelevant', value: 7, percentage: 23.3 },
    { name: 'Unattempted', value: 3, percentage: 10 }
  ];

  const answerCategoriesClassworkData = [
    { name: 'Correct', value: 5, percentage: 16.7 },
    { name: 'Partially-Correct', value: 15, percentage: 50 },
    { name: 'Numerical Error', value: 5, percentage: 16.7 },
    { name: 'Irrelevant', value: 3, percentage: 10 },
    { name: 'Unattempted', value: 2, percentage: 6.7 }
  ];

  // Question Details Data
  const questionDetailsData = [
    { id: 'Q1', chapter: 'Quadratic Applications', date: '2025-06-23', question: 'Find the shortest distance of the point (5,1) from the parab...', score: '0/20', performance: '0.0%', firstSubmission: 'No utter mistakes', irrelevant: 'Irrelevant formula application', currentStatus: 'Irrelevant', studentMistake: 'Distance = √[(x₂-x₁)² + (y₂-y₁)²]', correctApproach: 'Minimize the distance function using calculus' },
    { id: 'Q3', chapter: 'Algebra - Linear Equations', date: '2025-06-23', question: 'Solve the system: 2x + 3y = 7, x - y = 1', score: '3/6', performance: '50.0%', firstSubmission: 'First submission, no utter mistakes', numericalError: 'Numerical Error', currentStatus: 'Numerical Error', studentMistake: '5y = 5', correctApproach: '5y = 5' },
    { id: 'Q4', chapter: 'Coordinate Geometry', date: '2025-06-23', question: 'Find the equation of line passing through (2,3) with slope m...', score: '1/5', performance: '20.0%', firstSubmission: 'First submission, no utter mistakes', conceptualError: 'Conceptual error', currentStatus: 'Conceptual error', studentMistake: 'Area = ½ × base × height', correctApproach: 'y = 3 + 2(2×x + 2)' }
  ];

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

  const COLORS = {
    'Correct': '#22c55e',
    'Partially-Correct': '#fbbf24',
    'Numerical Error': '#f97316',
    'Irrelevant': '#ef4444',
    'Unattempted': '#6b7280'
  };

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

  const renderStudentAnalysisContent = () => {
    return (
      <div>
        {/* Student Analysis Main Tabs */}
        <div className="class-sub-tabs">
          <button
            onClick={() => {
              setStudentAnalysisMainTab('progression');
              setScoreProgressionType('homework');
            }}
            className={`class-sub-tab ${studentAnalysisMainTab === 'progression' ? 'active' : ''}`}
          >
            📈 Score Progression
          </button>
          <button
            onClick={() => {
              setStudentAnalysisMainTab('topics');
              setTopicAnalysisType('homework');
            }}
            className={`class-sub-tab ${studentAnalysisMainTab === 'topics' ? 'active' : ''}`}
          >
            ⏱️ Topic Analysis
          </button>
          <button
            onClick={() => {
              setStudentAnalysisMainTab('mistakes');
              setMistakeAnalysisType('homework');
            }}
            className={`class-sub-tab ${studentAnalysisMainTab === 'mistakes' ? 'active' : ''}`}
          >
            🔍 Mistake-Progress-Analysis
          </button>
          <button
            onClick={() => setStudentAnalysisMainTab('summary')}
            className={`class-sub-tab ${studentAnalysisMainTab === 'summary' ? 'active' : ''}`}
          >
            📋 Summary
          </button>
        </div>

        {/* Content Area */}
        <div className="class-analysis-content">
          {renderStudentAnalysisTabContent()}
        </div>
      </div>
    );
  };

  const renderStudentAnalysisTabContent = () => {
    switch (studentAnalysisMainTab) {
      case 'progression':
        return renderScoreProgressionContent();
      case 'topics':
        return renderTopicAnalysisContent();
      case 'mistakes':
        return renderMistakeProgressContent();
      case 'summary':
        return renderStudentSummaryContent();
      default:
        return null;
    }
  };

  // Score Progression Content
  const renderScoreProgressionContent = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        {/* Summary Cards at the top */}
        <div className="summary-cards-grid mb-32" style={{ animation: 'slideIn 0.4s ease-in-out' }}>
          <div className="metric-card-blue" style={{ transform: 'translateY(0)', transition: 'all 0.3s ease' }}>
            <div className="metric-value-blue">66.8%</div>
            <div className="metric-label">Homework Average</div>
          </div>
          <div className="metric-card-purple" style={{ transform: 'translateY(0)', transition: 'all 0.3s ease' }}>
            <div className="metric-value-pink">33.8%</div>
            <div className="metric-label">Classwork Average</div>
          </div>
          <div className="metric-card-green" style={{ transform: 'translateY(0)', transition: 'all 0.3s ease' }}>
            <div className="metric-value-green">15.07%</div>
            <div className="metric-label">HW Improvement Rate</div>
          </div>
          <div className="metric-card-yellow" style={{ transform: 'translateY(0)', transition: 'all 0.3s ease' }}>
            <div className="metric-value-yellow">-33.0%</div>
            <div className="metric-label">Performance Gap</div>
          </div>
        </div>

        {/* Enhanced Dropdown with Animation */}
        <div className="mb-24" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Select Analysis Type:
          </label>
          <select
            value={scoreProgressionType}
            onChange={(e) => {
              setScoreProgressionType(e.target.value);
              if (e.target.value === 'comparison') {
                setComparisonSubTab('datewise');
              }
            }}
            style={{
              padding: '12px 20px',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: 'white',
              cursor: 'pointer',
              color: '#374151',
              minWidth: '250px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <option value="homework">📝 Homework Analysis</option>
            <option value="classwork">📚 Classwork Analysis</option>
            <option value="comparison">🔄 HW vs CW Comparison</option>
          </select>
        </div>

        {/* Content based on selection */}
        {scoreProgressionType === 'homework' && (
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            {renderHomeworkProgressionChart()}
          </div>
        )}
        {scoreProgressionType === 'classwork' && (
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            {renderClassworkProgressionChart()}
          </div>
        )}
        {scoreProgressionType === 'comparison' && (
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            {/* Comparison Sub-tabs */}
            <div className="sub-tabs-container" style={{ marginBottom: '20px' }}>
              <div className="sub-tabs">
                <button
                  onClick={() => setComparisonSubTab('datewise')}
                  className={`sub-tab-button ${comparisonSubTab === 'datewise' ? 'active' : ''}`}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  📅 Date-wise Comparison
                </button>
                <button
                  onClick={() => setComparisonSubTab('topicwise')}
                  className={`sub-tab-button ${comparisonSubTab === 'topicwise' ? 'active' : ''}`}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  🎯 Chapter-wise Comparison
                </button>
                <button
                  onClick={() => setComparisonSubTab('summary')}
                  className={`sub-tab-button ${comparisonSubTab === 'summary' ? 'active' : ''}`}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  📊 Comparison Summary
                </button>
              </div>
            </div>
            {renderProgressionComparisonContent()}
          </div>
        )}
      </div>
    );
  };

  // Topic Analysis Content - NEW IMPLEMENTATION
  const renderTopicAnalysisContent = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        {/* Enhanced Dropdown with Animation */}
        <div className="mb-24" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Select Analysis Type:
          </label>
          <select
            value={topicAnalysisType}
            onChange={(e) => {
              setTopicAnalysisType(e.target.value);
              if (e.target.value === 'comparison') {
                setTopicComparisonSubTab('datewise');
              }
            }}
            style={{
              padding: '12px 20px',
              border: '2px solid #8b5cf6',
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: 'white',
              cursor: 'pointer',
              color: '#374151',
              minWidth: '250px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7c3aed';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#8b5cf6';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <option value="homework">📝 Homework Topic Analysis</option>
            <option value="classwork">📚 Classwork Topic Analysis</option>
            <option value="comparison">🔄 HW vs CW Topic Comparison</option>
          </select>
        </div>

        {/* Content based on selection */}
        {topicAnalysisType === 'homework' && renderHomeworkTopicAnalysis()}
        {topicAnalysisType === 'classwork' && renderClassworkTopicAnalysis()}
        {topicAnalysisType === 'comparison' && (
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            {/* Comparison Sub-tabs */}
            <div className="sub-tabs-container" style={{ marginBottom: '20px' }}>
              <div className="sub-tabs">
                <button
                  onClick={() => setTopicComparisonSubTab('datewise')}
                  className={`sub-tab-button ${topicComparisonSubTab === 'datewise' ? 'active' : ''}`}
                >
                  📅 Date-wise Comparison
                </button>
                <button
                  onClick={() => setTopicComparisonSubTab('topicwise')}
                  className={`sub-tab-button ${topicComparisonSubTab === 'topicwise' ? 'active' : ''}`}
                >
                  🎯 Topic-wise Comparison
                </button>
                <button
                  onClick={() => setTopicComparisonSubTab('summary')}
                  className={`sub-tab-button ${topicComparisonSubTab === 'summary' ? 'active' : ''}`}
                >
                  📊 Comparison Summary
                </button>
              </div>
            </div>
            {renderTopicComparisonContent()}
          </div>
        )}
      </div>
    );
  };

  // Homework Topic Analysis
  const renderHomeworkTopicAnalysis = () => {
    return (
      <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
        {/* Summary Cards */}
        <div className="summary-cards-grid mb-32">
          <div className="metric-card-blue">
            <div className="metric-value-blue">10</div>
            <div className="metric-label">Topics Analyzed</div>
          </div>
          <div className="metric-card-green">
            <div className="metric-value-green">100%</div>
            <div className="metric-label">Best Performance</div>
          </div>
          <div className="metric-card-yellow">
            <div className="metric-value-yellow">Quadratic</div>
            <div className="metric-label">Most Active Topic</div>
          </div>
          <div className="metric-card-pink">
            <div className="metric-value-pink">6</div>
            <div className="metric-label">Dates Tracked</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons mb-20">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button 
              key={filter} 
              className={`filter-button ${filter === 'MAX' ? 'active' : ''}`}
              style={{ animation: 'fadeIn 0.2s ease-in-out' }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div>
          <h3 className="section-title" style={{ color: '#8b5cf6' }}>📚 Homework Topic Performance Analysis</h3>
          <p className="section-subtitle">Performance by Topic Over Time</p>
          
          <div className="chart-height-400">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={[
                  { date: 'Jun 23', quadratic: 0 },
                  { date: 'Jun 25', quadratic: 50 },
                  { date: 'Jun 27', quadratic: 75 },
                  { date: 'Jun 29', quadratic: 100 },
                  { date: 'Jul 01', quadratic: 80 },
                  { date: 'Jul 03', quadratic: 100 }
                ]} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Quadratic Applications Average']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="quadratic" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  name="Quadratic Applications Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            Click legend items to show/hide topics. Only 'Quadratic Applications' is available.
          </div>
        </div>
      </div>
    );
  };

  // Classwork Topic Analysis
  const renderClassworkTopicAnalysis = () => {
    return (
      <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
        {/* Summary Cards */}
        <div className="summary-cards-grid mb-32">
          <div className="metric-card-blue">
            <div className="metric-value-blue">7</div>
            <div className="metric-label">Topics Analyzed</div>
          </div>
          <div className="metric-card-green">
            <div className="metric-value-green">66.7%</div>
            <div className="metric-label">Best Performance</div>
          </div>
          <div className="metric-card-yellow">
            <div className="metric-value-yellow">Quadratic</div>
            <div className="metric-label">Most Active Topic</div>
          </div>
          <div className="metric-card-pink">
            <div className="metric-value-pink">62.5%</div>
            <div className="metric-label">Latest Average</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons mb-20">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button 
              key={filter} 
              className={`filter-button ${filter === 'MAX' ? 'active' : ''}`}
              style={{ animation: 'fadeIn 0.2s ease-in-out' }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div>
          <h3 className="section-title" style={{ color: '#a855f7' }}>📚 Classwork Topic Performance Analysis</h3>
          <p className="section-subtitle">Performance by Topic Over Time</p>
          
          <div className="chart-height-400">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={[
                  { date: 'Jun 25', quadratic: 25 },
                  { date: 'Jun 27', quadratic: 66.7 },
                  { date: 'Jun 29', quadratic: 30 },
                  { date: 'Jul 01', quadratic: 25 },
                  { date: 'Jul 03', quadratic: 62.5 }
                ]} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 80]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Quadratic Applications Average']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="quadratic" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2, r: 6 }}
                  name="Quadratic Applications Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              <strong>Topic:</strong> Quadratic Applications<br/>
              <strong>Date:</strong> Jul 04<br/>
              <strong>Average Performance:</strong> 62.5%
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Topic Comparison Content
  const renderTopicComparisonContent = () => {
    switch (topicComparisonSubTab) {
      case 'datewise':
        return renderDateWiseProgressionComparison();
      case 'topicwise':
        return renderTopicWiseProgressionComparison();
      case 'summary':
        return renderTopicComparisonSummary();
      default:
        return null;
    }
  };

  // Topic Comparison Summary
  const renderTopicComparisonSummary = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">📊 HOMEWORK vs CLASSWORK COMPARISON:</h3>
        </div>

        <div className="flex-column-gap">
          {/* Overall Performance */}
          <div>
            <h4 className="subsection-title">Overall Performance:</h4>
            <ul className="summary-list">
              <li><strong>Homework Average:</strong> 66.8%</li>
              <li><strong>Classwork Average:</strong> 33.8%</li>
              <li><strong>Performance Gap:</strong> -33.0% (Homework Better)</li>
            </ul>
          </div>

          {/* Score Analysis */}
          <div>
            <h4 className="subsection-title">Score Analysis:</h4>
            <ul className="summary-list">
              <li><strong>Homework Avg Score:</strong> 24.5</li>
              <li><strong>Classwork Avg Score:</strong> 11.3</li>
              <li><strong>Score Difference:</strong> -13.2 points</li>
            </ul>
          </div>

          {/* Topics with Improvement */}
          <div>
            <h4 className="subsection-title">📈 Topics with Improvement (CW {' > '} HW):</h4>
            <ul className="summary-list">
              <li><strong>Coordinate Geometry:</strong> +27.6%</li>
              <li><strong>Functions and Graphs:</strong> +7.9%</li>
            </ul>
          </div>

          {/* Topics with Decline */}
          <div>
            <h4 className="subsection-title">🚫 Topics with Decline (CW {' < '} HW):</h4>
            <ul className="summary-list">
              <li><strong>Calculus - Integration:</strong> -90.3%</li>
              <li><strong>Algebra - Linear Equations:</strong> -62.5%</li>
              <li><strong>Statistics:</strong> -57.3%</li>
              <li><strong>Algebra - Rational Functions:</strong> -50.0%</li>
              <li><strong>Probability:</strong> -38.9%</li>
              <li><strong>Trigonometry:</strong> -29.2%</li>
              <li><strong>Quadratic Applications:</strong> -28.5%</li>
              <li><strong>Calculus - Derivatives:</strong> -25.2%</li>
            </ul>
          </div>

          {/* Detailed Topic Comparison Table */}
          <div>
            <h4 className="subsection-title">🎯 Detailed Topic Comparison</h4>
            <div className="data-table-container">
              <table className="enhanced-data-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header-enhanced"></th>
                    <th className="table-header-enhanced">Topic</th>
                    <th className="table-header-enhanced table-header-center">Homework Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">Classwork Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">Gap (CW-HW)</th>
                    <th className="table-header-enhanced table-header-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { topic: 'Functions and Graphs', hw: 50.8, cw: 58.7, gap: 7.9, status: 'CW Better', color: '#3b82f6' },
                    { topic: 'Probability', hw: 72.2, cw: 33.3, gap: -38.9, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Trigonometry', hw: 79.2, cw: 50.0, gap: -29.2, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Statistics', hw: 77.5, cw: 20.2, gap: -57.3, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Calculus - Integration', hw: 100.0, cw: 9.7, gap: -90.3, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Calculus - Derivatives', hw: 58.5, cw: 33.3, gap: -25.2, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Algebra - Rational Functions', hw: 80.0, cw: 30.0, gap: -50.0, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Algebra - Linear Equations', hw: 75.0, cw: 12.5, gap: -62.5, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Quadratic Applications', hw: 67.5, cw: 39.0, gap: -28.5, status: 'HW Better', color: '#ef4444' },
                    { topic: 'Coordinate Geometry', hw: 65.7, cw: 93.3, gap: 27.6, status: 'CW Better', color: '#3b82f6' }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                      <td className="table-cell-enhanced table-cell-center">{index}</td>
                      <td className="table-cell-enhanced">{row.topic}</td>
                      <td className="table-cell-enhanced table-cell-center">{row.hw}%</td>
                      <td className="table-cell-enhanced table-cell-center">{row.cw}%</td>
                      <td className="table-cell-enhanced table-cell-center">{row.gap > 0 ? '+' : ''}{row.gap}%</td>
                      <td className="table-cell-enhanced table-cell-center">
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: row.color === '#3b82f6' ? '#dbeafe' : '#fee2e2',
                          color: row.color
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
    );
  };

  // Mistake Progress Analysis Content - ENHANCED
  const renderMistakeProgressContent = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        {/* First show the original mistake progress analysis */}
        <div className="mb-32">
          <h3 className="section-title">🔍 Mistake-Progress-Analysis Overview</h3>
          <p className="section-subtitle">Analysis of common mistakes and improvement areas</p>

          <div className="summary-cards-grid mb-32">
            <div className="metric-card-blue">
              <div className="metric-value-blue">45</div>
              <div className="metric-label">Total Mistakes</div>
            </div>
            <div className="metric-card-green">
              <div className="metric-value-green">67%</div>
              <div className="metric-label">Improvement Rate</div>
            </div>
            <div className="metric-card-yellow">
              <div className="metric-value-yellow">Conceptual</div>
              <div className="metric-label">Most Common Error</div>
            </div>
            <div className="metric-card-pink">
              <div className="metric-value-pink">15</div>
              <div className="metric-label">Repeated Mistakes</div>
            </div>
          </div>

          <div className="flex-column-gap">
            {/* Error Type Distribution */}
            <div>
              <h4 className="subsection-title">Error Type Distribution</h4>
              <div className="chart-height-300">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Conceptual', value: 45, color: '#ef4444' },
                        { name: 'Computational', value: 30, color: '#f97316' },
                        { name: 'Careless', value: 20, color: '#eab308' },
                        { name: 'Other', value: 5, color: '#6b7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Conceptual', value: 45, color: '#ef4444' },
                        { name: 'Computational', value: 30, color: '#f97316' },
                        { name: 'Careless', value: 20, color: '#eab308' },
                        { name: 'Other', value: 5, color: '#6b7280' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mistake Improvement Timeline */}
            <div>
              <h4 className="subsection-title">Mistake Improvement Timeline</h4>
              <div className="chart-height-300">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: 'Week 1', mistakes: 12, improved: 3 },
                    { date: 'Week 2', mistakes: 10, improved: 5 },
                    { date: 'Week 3', mistakes: 8, improved: 7 },
                    { date: 'Week 4', mistakes: 6, improved: 8 },
                    { date: 'Week 5', mistakes: 4, improved: 9 },
                    { date: 'Week 6', mistakes: 3, improved: 10 }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mistakes" stroke="#ef4444" strokeWidth={2} name="New Mistakes" />
                    <Line type="monotone" dataKey="improved" stroke="#22c55e" strokeWidth={2} name="Improved Areas" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ 
          height: '2px', 
          background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)', 
          margin: '40px 0' 
        }}></div>

        {/* Enhanced Dropdown with Animation */}
        <div className="mb-24" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Select Analysis Type:
          </label>
          <select
            value={mistakeAnalysisType}
            onChange={(e) => {
              setMistakeAnalysisType(e.target.value);
              if (e.target.value === 'comparison') {
                setMistakeComparisonSubTab('datewise');
              }
            }}
            style={{
              padding: '12px 20px',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: 'white',
              cursor: 'pointer',
              color: '#374151',
              minWidth: '250px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <option value="homework">📝 Homework Mistake Analysis</option>
            <option value="classwork">📚 Classwork Mistake Analysis</option>
            <option value="comparison">🔄 HW vs CW Mistake Comparison</option>
          </select>
        </div>

        {/* Content based on selection */}
        {mistakeAnalysisType === 'homework' && renderHomeworkMistakeAnalysis()}
        {mistakeAnalysisType === 'classwork' && renderClassworkMistakeAnalysis()}
        {mistakeAnalysisType === 'comparison' && (
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            {/* Comparison Sub-tabs */}
            <div className="sub-tabs-container" style={{ marginBottom: '20px' }}>
              <div className="sub-tabs">
                <button
                  onClick={() => setMistakeComparisonSubTab('datewise')}
                  className={`sub-tab-button ${mistakeComparisonSubTab === 'datewise' ? 'active' : ''}`}
                >
                  📅 Date-wise Comparison
                </button>
                <button
                  onClick={() => setMistakeComparisonSubTab('topicwise')}
                  className={`sub-tab-button ${mistakeComparisonSubTab === 'topicwise' ? 'active' : ''}`}
                >
                  🎯 Topic-wise Comparison
                </button>
                <button
                  onClick={() => setMistakeComparisonSubTab('summary')}
                  className={`sub-tab-button ${mistakeComparisonSubTab === 'summary' ? 'active' : ''}`}
                >
                  📊 Comparison Summary
                </button>
              </div>
            </div>
            {renderMistakeComparisonContent()}
          </div>
        )}
      </div>
    );
  };

  // Homework Mistake Analysis
  const renderHomeworkMistakeAnalysis = () => {
    return (
      <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
        {/* Chapter Performance */}
        <div className="mb-32">
          <h3 className="section-title">🎯 Chapter Performance: Your Overall Performance</h3>
          
          {/* Chapter Filter Dropdown */}
          <div className="mb-20">
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
              📅 Show Chapters From:
            </label>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#374151',
                minWidth: '200px',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              <option value="All My Work">All My Work</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 5 Days">Last 5 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 10 Days">Last 10 Days</option>
              <option value="Last 15 Days">Last 15 Days</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>

          <div className="chart-height-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chapterPerformanceData} 
                layout="vertical" 
                margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" fontSize={12} domain={[0, 100]} />
                <YAxis dataKey="chapter" type="category" fontSize={11} />
                <Tooltip formatter={(value) => [`${value}%`, 'Current Performance']} />
                <Bar dataKey="performance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Answer Categories */}
        <div className="mb-32">
          <h3 className="section-title">📊 How Well Did I Do? (Answer Categories)</h3>
          
          <div className="chart-height-300">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={answerCategoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {answerCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} Questions`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              Total: 30 Questions
            </p>
          </div>
        </div>

        {/* Explore Questions */}
        {renderExploreQuestions('homework')}
      </div>
    );
  };

  // Classwork Mistake Analysis
  const renderClassworkMistakeAnalysis = () => {
    return (
      <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
        {/* Chapter Performance */}
        <div className="mb-32">
          <h3 className="section-title">🎯 Chapter Performance: Your Overall Performance</h3>
          
          {/* Chapter Filter Dropdown */}
          <div className="mb-20">
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
              📅 Show Chapters From:
            </label>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#374151',
                minWidth: '200px',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              <option value="All My Work">All My Work</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 5 Days">Last 5 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 10 Days">Last 10 Days</option>
              <option value="Last 15 Days">Last 15 Days</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>

          <div className="chart-height-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chapterPerformanceClassworkData} 
                layout="vertical" 
                margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" fontSize={12} domain={[0, 100]} />
                <YAxis dataKey="chapter" type="category" fontSize={11} />
                <Tooltip formatter={(value) => [`${value}%`, 'Current Performance']} />
                <Bar dataKey="performance" fill="#a855f7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Answer Categories */}
        <div className="mb-32">
          <h3 className="section-title">📊 How Well Did I Do? (Answer Categories)</h3>
          
          <div className="chart-height-300">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={answerCategoriesClassworkData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {answerCategoriesClassworkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} Questions`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              Total: 30 Questions
            </p>
          </div>
        </div>

        {/* Explore Questions */}
        {renderExploreQuestions('classwork')}
      </div>
    );
  };

  // Explore Questions Component
  const renderExploreQuestions = (type) => {
    const performanceRanges = [
      'All Percentages',
      '0-19% (Needs Practice! 🔴)',
      '20-39% (Keep Trying! 💪)',
      '40-59% (Good Work! 😊)',
      '60-79% (Great Job! 👍)',
      '80-100% (Amazing! 🌟)'
    ];

    const chapters = [
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

    return (
      <div className="mb-32">
        <h3 className="section-title">🔍 Explore Your Questions In Different Ways</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
          {/* Filter By Performance Percentage */}
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h4 className="subsection-title">📊 Filter By Performance Percentage</h4>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Choose A Performance Range:</p>
            
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              {performanceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Filter By Chapter */}
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h4 className="subsection-title">📚 Filter By Chapter</h4>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Choose A Chapter:</p>
            
            <select
              value={chapterListFilter}
              onChange={(e) => setChapterListFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtered Results */}
        <div className="mt-32">
          <h4 className="subsection-title">📋 Filtered Results - 30 Questions Found</h4>
          
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
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Performance</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{type === 'homework' ? '66.8%' : '32.3%'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Room for Improvement</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{type === 'homework' ? '33.2%' : '67.7%'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Chapters Covered</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>10 Chapters</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Questions Found</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>30 Questions</p>
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
                {questionDetailsData.slice(0, 3).map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <td className="table-cell-enhanced">{row.id}</td>
                    <td className="table-cell-enhanced">{row.chapter}</td>
                    <td className="table-cell-enhanced">{row.date}</td>
                    <td className="table-cell-enhanced">{row.question}</td>
                    <td className="table-cell-enhanced table-cell-center">{row.score}</td>
                    <td className="table-cell-enhanced table-cell-center">{row.performance}</td>
                    <td className="table-cell-enhanced">{row.firstSubmission}</td>
                    <td className="table-cell-enhanced table-cell-center">
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        backgroundColor: row.currentStatus === 'Irrelevant' ? '#fee2e2' : '#fef3c7',
                        color: row.currentStatus === 'Irrelevant' ? '#ef4444' : '#f59e0b'
                      }}>
                        {row.currentStatus}
                      </span>
                    </td>
                    <td className="table-cell-enhanced">{row.studentMistake}</td>
                    <td className="table-cell-enhanced">{row.correctApproach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Mistake Comparison Content
  const renderMistakeComparisonContent = () => {
    switch (mistakeComparisonSubTab) {
      case 'datewise':
        return renderDateWiseProgressionComparison();
      case 'topicwise':
        return renderTopicWiseProgressionComparison();
      case 'summary':
        return renderProgressionComparisonSummary();
      default:
        return null;
    }
  };

  // Progression Comparison Content
  const renderProgressionComparisonContent = () => {
    switch (comparisonSubTab) {
      case 'datewise':
        return renderDateWiseProgressionComparison();
      case 'topicwise':
        return renderTopicWiseProgressionComparison();
      case 'summary':
        return renderProgressionComparisonSummary();
      default:
        return null;
    }
  };

  // Homework Progression Chart
  const renderHomeworkProgressionChart = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">📝 Homework Performance Progression with Class Ranking</h3>
          <p className="section-subtitle">Student Performance Percentage by Submission Date</p>
        </div>

        <div className="filter-buttons">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button key={filter} className={`filter-button ${filter === 'MAX' ? 'active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="chart-height-400">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentHomeworkProgressionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                    name="Homework Performance (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={false}
                    name="Trend Line"
                  />
                  <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#fbbf24', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: 'white', width: 'fit-content', marginTop: '10px' }}>
              Improvement Trend: 15.07% per assignment
            </div>
          </div>
          
          <div style={{ width: '200px', marginTop: '20px' }}>
            <div style={{ backgroundColor: '#fbbf24', border: '2px solid #f59e0b', borderRadius: '8px', padding: '16px', textAlign: 'center', animation: 'pulse 2s infinite' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
                YOU ARE AMONG TOP 60% STUDENTS
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e' }}>Your Score: 66.8%</div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>Class Avg: 62.2%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Classwork Progression Chart
  const renderClassworkProgressionChart = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">📚 Classwork Performance Progression with Class Ranking</h3>
          <p className="section-subtitle">Student Performance Percentage by Submission Date</p>
        </div>

        <div className="filter-buttons">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button key={filter} className={`filter-button ${filter === 'MAX' ? 'active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="chart-height-400">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentClassworkProgressionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                    name="Classwork Performance (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={false}
                    name="Trend Line"
                  />
                  <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#fbbf24', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: 'white', width: 'fit-content', marginTop: '10px' }}>
              Improvement Trend: 0.62% per assignment
            </div>
          </div>
          
          <div style={{ width: '200px', marginTop: '20px' }}>
            <div style={{ backgroundColor: '#ef4444', border: '2px solid #dc2626', borderRadius: '8px', padding: '16px', textAlign: 'center', animation: 'pulse 2s infinite' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                YOU ARE AMONG BOTTOM 50% STUDENTS
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>Your Score: 33.8%</div>
              <div style={{ fontSize: '14px', color: 'white' }}>Class Avg: 51.5%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Date-wise Progression Comparison
  const renderDateWiseProgressionComparison = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">📅 Homework vs Classwork: Date-wise Performance Analysis</h3>
          <p className="section-subtitle">Score Comparison Over Time with All Submission Dates</p>
        </div>

        {/* Summary Cards for Date-wise Comparison */}
        <div className="summary-cards-grid mb-32" style={{ animation: 'slideIn 0.4s ease-in-out' }}>
          <div className="metric-card-blue">
            <div className="metric-value-blue">6</div>
            <div className="metric-label">Total Dates</div>
          </div>
          <div className="metric-card-green">
            <div className="metric-value-green">532%</div>
            <div className="metric-label">HW Growth Rate</div>
          </div>
          <div className="metric-card-yellow">
            <div className="metric-value-yellow">33%</div>
            <div className="metric-label">CW Growth Rate</div>
          </div>
          <div className="metric-card-pink">
            <div className="metric-value-pink">26 pts</div>
            <div className="metric-label">Max Gap (HW-CW)</div>
          </div>
        </div>

        <div className="filter-buttons">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button key={filter} className={`filter-button ${filter === 'MAX' ? 'active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="flex-column-gap">
          {/* Line Chart */}
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            <h4 className="subsection-title">Date-wise Score Comparison (Line Chart)</h4>
            <div className="chart-height-350">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentDateWiseComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 40]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="homework" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                    name="Homework Scores"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="classwork" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 6 }}
                    name="Classwork Scores"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div style={{ animation: 'scaleIn 0.3s ease-in-out 0.1s' }}>
            <h4 className="subsection-title">Date-wise Score Comparison (Grouped Bar Chart)</h4>
            <div className="chart-height-350">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentDateWiseComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 40]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="homework" fill="#0ea5e9" name="Homework" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="classwork" fill="#a855f7" name="Classwork" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Topic-wise Progression Comparison
  const renderTopicWiseProgressionComparison = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">🎯 Homework vs Classwork: Topic-wise Performance Analysis</h3>
          <p className="section-subtitle">Average Performance Comparison by TOPIC</p>
        </div>

        {/* Summary Cards for Topic-wise Comparison */}
        <div className="summary-cards-grid mb-32" style={{ animation: 'slideIn 0.4s ease-in-out' }}>
          <div className="metric-card-blue">
            <div className="metric-value-blue">10</div>
            <div className="metric-label">Topics Analyzed</div>
          </div>
          <div className="metric-card-green">
            <div className="metric-value-green">2</div>
            <div className="metric-label">Topics CW Better</div>
          </div>
          <div className="metric-card-yellow">
            <div className="metric-value-yellow">8</div>
            <div className="metric-label">Topics HW Better</div>
          </div>
          <div className="metric-card-pink">
            <div className="metric-value-pink">90.3%</div>
            <div className="metric-label">Max Gap (Calculus)</div>
          </div>
        </div>

        <div className="flex-column-gap">
          {/* Line Chart */}
          <div style={{ animation: 'scaleIn 0.3s ease-in-out' }}>
            <div className="chart-height-350">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentTopicWiseComparisonLineData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="homework" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                    name="Homework Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="classwork" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                    name="Classwork Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div style={{ animation: 'scaleIn 0.3s ease-in-out 0.1s' }}>
            <div className="chart-height-350">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentTopicWiseComparisonBarData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="homework" fill="#0ea5e9" name="Homework" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="classwork" fill="#a855f7" name="Classwork" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
              Grouped bars show direct comparison Blue=Homework, Purple=Classwork
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Progression Comparison Summary
  const renderProgressionComparisonSummary = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">📊 HOMEWORK vs CLASSWORK COMPARISON:</h3>
        </div>

        <div className="flex-column-gap">
          {/* Overall Performance */}
          <div style={{ animation: 'slideIn 0.3s ease-in-out' }}>
            <h4 className="subsection-title">Overall Performance:</h4>
            <ul className="summary-list">
              <li><strong>Homework Average:</strong> {studentComparisonSummaryData.homeworkAverage}%</li>
              <li><strong>Classwork Average:</strong> {studentComparisonSummaryData.classworkAverage}%</li>
              <li><strong>Performance Gap:</strong> {studentComparisonSummaryData.performanceGap}% (Homework Better)</li>
            </ul>
          </div>

          {/* Score Analysis */}
          <div style={{ animation: 'slideIn 0.3s ease-in-out 0.1s' }}>
            <h4 className="subsection-title">Score Analysis:</h4>
            <ul className="summary-list">
              <li><strong>Homework Avg Score:</strong> {studentComparisonSummaryData.homeworkScore}</li>
              <li><strong>Classwork Avg Score:</strong> {studentComparisonSummaryData.classworkScore}</li>
              <li><strong>Score Difference:</strong> {studentComparisonSummaryData.scoreDifference} points</li>
            </ul>
          </div>

          {/* Assignment Count */}
          <div style={{ animation: 'slideIn 0.3s ease-in-out 0.2s' }}>
            <h4 className="subsection-title">Assignment Count:</h4>
            <ul className="summary-list">
              <li><strong>Homework Assignments:</strong> {studentComparisonSummaryData.homeworkAssignments}</li>
              <li><strong>Classwork Assignments:</strong> {studentComparisonSummaryData.classworkAssignments}</li>
              <li><strong>Common Topics:</strong> {studentComparisonSummaryData.commonTopics}</li>
            </ul>
          </div>

          {/* Topics with Improvement */}
          <div style={{ animation: 'slideIn 0.3s ease-in-out 0.3s' }}>
            <h4 className="subsection-title">📈 Topics with Improvement (CW {' > '} HW):</h4>
            <ul className="summary-list">
              {studentComparisonSummaryData.improvementTopics.map((topic, index) => (
                <li key={index}><strong>{topic.topic}:</strong> +{topic.improvement}%</li>
              ))}
            </ul>
          </div>

          {/* Topics with Decline */}
          <div style={{ animation: 'slideIn 0.3s ease-in-out 0.4s' }}>
            <h4 className="subsection-title">📉 Topics with Decline (CW {' < '} HW):</h4>
            <ul className="summary-list">
              {studentComparisonSummaryData.declineTopics.slice(0, 8).map((topic, index) => (
                <li key={index}><strong>{topic.topic}:</strong> {topic.decline}%</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Student Summary Content
  const renderStudentSummaryContent = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-20">
          <h3 className="section-title">📋 Student Performance Summary</h3>
          <p className="section-subtitle">Complete analysis for {selectedStudent?.rollNo || 'Unknown Student'} - {selectedStudent?.name || ''}</p>
        </div>

        <div className="summary-section" style={{ animation: 'slideIn 0.3s ease-in-out' }}>
          <h4 className="subsection-title">📊 Overall Performance:</h4>
          <ul className="summary-list">
            <li><strong>Overall Average:</strong> 72.5%</li>
            <li><strong>Homework Average:</strong> 66.8%</li>
            <li><strong>Classwork Average:</strong> 33.8%</li>
            <li><strong>Performance Gap:</strong> -33.0% (Homework performs better)</li>
          </ul>
        </div>

        <div className="summary-section" style={{ animation: 'slideIn 0.3s ease-in-out 0.1s' }}>
          <h4 className="subsection-title">🎯 Topic Performance:</h4>
          <div className="summary-list-none">
            <div className="highlight-box highlight-box-green">
              <div className="highlight-text-green">**Strongest Topics:**</div>
            </div>
            <ul className="summary-list">
              <li><strong>Calculus - Integration:</strong> 54.9% average</li>
              <li><strong>Algebra - Rational Functions:</strong> 55.0% average</li>
              <li><strong>Coordinate Geometry:</strong> 80.0% average</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div className="highlight-box highlight-box-red">
              <div className="highlight-text-red">**Needs Improvement:**</div>
            </div>
            <ul className="summary-list">
              <li><strong>Algebra - Linear Equations:</strong> 43.8% average</li>
              <li><strong>Statistics:</strong> 49.1% average</li>
              <li><strong>Calculus - Derivatives:</strong> 45.9% average</li>
            </ul>
          </div>
        </div>

        <div className="summary-section" style={{ animation: 'slideIn 0.3s ease-in-out 0.2s' }}>
          <h4 className="subsection-title">📈 Progress Trends:</h4>
          <ul className="summary-list">
            <li><strong>Homework Trend:</strong> Improving at 15.07% per assignment</li>
            <li><strong>Classwork Trend:</strong> Stable with 0.62% improvement</li>
            <li><strong>Error Reduction:</strong> 67% improvement in mistake frequency</li>
            <li><strong>Consistency:</strong> More consistent performance in homework</li>
          </ul>
        </div>

        <div className="summary-section" style={{ animation: 'slideIn 0.3s ease-in-out 0.3s' }}>
          <h4 className="subsection-title">🎯 Ranking & Comparison:</h4>
          <ul className="summary-list">
            <li><strong>Homework Ranking:</strong> Top 60% of class (66.8% vs 62.2% class avg)</li>
            <li><strong>Classwork Ranking:</strong> Bottom 50% of class (33.8% vs 51.5% class avg)</li>
            <li><strong>Overall Class Position:</strong> Above average in homework, below in classwork</li>
          </ul>
        </div>

        <div className="summary-section" style={{ animation: 'slideIn 0.3s ease-in-out 0.4s' }}>
          <h4 className="subsection-title">🔍 Key Insights:</h4>
          <div className="highlight-box highlight-box-blue">
            <div className="highlight-text-blue">**Performance Pattern:**</div>
          </div>
          <ul className="summary-list">
            <li>Student performs significantly better on homework assignments</li>
            <li>Consistent improvement trend in homework submissions</li>
            <li>Classwork performance needs focused attention</li>
            <li>Strong conceptual understanding but struggles with time-limited assessments</li>
          </ul>
        </div>

        <div style={{ animation: 'slideIn 0.3s ease-in-out 0.5s' }}>
          <h4 className="subsection-title">💡 Recommendations:</h4>
          <div className="highlight-box highlight-box-cyan">
            <div className="highlight-text-cyan">**Action Items:**</div>
          </div>
          <ul className="summary-list">
            <li>🎯 <strong>Focus Areas:</strong> Intensive practice on Linear Equations, Statistics, and Derivatives</li>
            <li>⏰ <strong>Time Management:</strong> Practice timed exercises to improve classwork performance</li>
            <li>📚 <strong>Study Strategy:</strong> Apply homework preparation techniques to classwork</li>
            <li>🤝 <strong>Support:</strong> One-on-one sessions for conceptual reinforcement</li>
          </ul>
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
                className="class-header-dropdown"
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
                className="class-header-dropdown"
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
      <div style={{ width: '100%' }}>
        {selectedStudent ? renderStudentAnalysisContent() : renderNoStudentSelected()}
      </div>
    </div>
  );
};

export default StudentAnalysis;