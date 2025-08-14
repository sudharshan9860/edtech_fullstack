import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, ReferenceLine
} from 'recharts';
import './StudentAnalysis.css';

const StudentAnalysis = ({ selectedClass, selectedStudent, onStudentSelect, classesData, onClassChange }) => {
  // Main tab state - Updated tab names
  const [studentAnalysisMainTab, setStudentAnalysisMainTab] = useState('score-progression');
  
  // View states for interactive charts
  const [scoreDateView, setScoreDateView] = useState('combined'); // 'combined', 'homework', 'classwork'
  const [chapterView, setChapterView] = useState('combined'); // 'combined', 'homework', 'classwork'
  
  // Summary tab filters
  const [summaryFilter, setSummaryFilter] = useState('all'); // 'all', 'homework', 'classwork'
  
  // Mistake Analysis states
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('All Chapters');
  const [selectedPerformanceFilter, setSelectedPerformanceFilter] = useState('All Percentages');

  // Animation states
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced data for Score Date-wise Progression
  const studentDateWiseComparisonData = [
    { date: 'Jun 23', homework: 18, classwork: 38 },
    { date: 'Jun 25', homework: 35, classwork: 20 },
    { date: 'Jun 27', homework: 78, classwork: 47 },
    { date: 'Jun 29', homework: 80, classwork: 28 },
    { date: 'Jul 01', homework: 85, classwork: 25 },
    { date: 'Jul 03', homework: 92, classwork: 44 }
  ];

  // Enhanced Topic-wise Performance Data for Chapter Analysis
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

  // NCERT Weightage Data (New addition for Mistake Analysis)
  const ncertWeightageData = [
    { chapter: 'Algebra - Linear Equations', weightage: '8%', studentPerformance: '75%', importance: 'High' },
    { chapter: 'Calculus - Integration', weightage: '15%', studentPerformance: '0%', importance: 'Very High' },
    { chapter: 'Quadratic Applications', weightage: '12%', studentPerformance: '38%', importance: 'High' },
    { chapter: 'Trigonometry', weightage: '10%', studentPerformance: '81%', importance: 'Medium' },
    { chapter: 'Statistics', weightage: '8%', studentPerformance: '78%', importance: 'Medium' },
    { chapter: 'Probability', weightage: '7%', studentPerformance: '72%', importance: 'Medium' },
    { chapter: 'Coordinate Geometry', weightage: '6%', studentPerformance: '64%', importance: 'Low' },
    { chapter: 'Functions and Graphs', weightage: '5%', studentPerformance: '43%', importance: 'Low' }
  ];

  // Answer Categories Data for Mistake Analysis
  const answerCategoriesData = [
    { name: 'Correct', value: 43.3, count: 13, color: '#22c55e' },
    { name: 'Partially Correct', value: 10, count: 3, color: '#f59e0b' },
    { name: 'Numerical Error', value: 13.3, count: 4, color: '#ef4444' },
    { name: 'Irrelevant', value: 23.3, count: 7, color: '#8b5cf6' },
    { name: 'Unattempted', value: 10, count: 3, color: '#6b7280' }
  ];

  // Performance filters for mistake analysis
  const performanceFilters = [
    'All Percentages',
    '0-19% (Need Help! 🔴)',
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

  // Get students for the selected class
  const getStudentsForClass = () => {
    const sampleStudents = [
      { id: 1, name: 'Sanjay Kumar', rollNo: '10HPS01', class: 'Class 12th', efficiency: 78 },
      { id: 2, name: 'Priya Sharma', rollNo: '10HPS02', class: 'Class 12th', efficiency: 73 },
      { id: 3, name: 'Ahmed Khan', rollNo: '10HPS03', class: 'Class 12th', efficiency: 85 },
      { id: 4, name: 'Rahul Verma', rollNo: '10HPS04', class: 'Class 12th', efficiency: 58 },
      { id: 5, name: 'Anita Singh', rollNo: '11HPS01', class: 'Class 11th', efficiency: 92 }
    ];
    return sampleStudents;
  };

  // 1. Modified Score Date-wise Progression Tab
  const renderScoreDatewiseProgression = () => {
    const getChartData = () => {
      switch (scoreDateView) {
        case 'homework':
          return studentDateWiseComparisonData.map(item => ({
            ...item,
            classwork: null
          }));
        case 'classwork':
          return studentDateWiseComparisonData.map(item => ({
            ...item,
            homework: null
          }));
        default:
          return studentDateWiseComparisonData;
      }
    };

    const handleLineClick = (dataKey) => {
      if (dataKey === 'homework') {
        handleViewTransition('homework', setScoreDateView);
      } else if (dataKey === 'classwork') {
        handleViewTransition('classwork', setScoreDateView);
      }
    };

    return (
      <div className="score-datewise-container">
        <div className="gradient-header">
          <h2 className="gradient-header-title">📅 Homework vs Classwork: Date-wise Performance Analysis</h2>
          <p className="gradient-header-subtitle">Score Comparison Over Time with All Submission Dates</p>
        </div>

        {/* View Toggle Buttons */}
        <div className="view-toggle-buttons">
          <button 
            className={`toggle-btn ${scoreDateView === 'combined' ? 'active' : ''}`}
            onClick={() => handleViewTransition('combined', setScoreDateView)}
          >
            📊 Combined View
          </button>
          <button 
            className={`toggle-btn ${scoreDateView === 'homework' ? 'active' : ''}`}
            onClick={() => handleViewTransition('homework', setScoreDateView)}
          >
            📚 Homework Only
          </button>
          <button 
            className={`toggle-btn ${scoreDateView === 'classwork' ? 'active' : ''}`}
            onClick={() => handleViewTransition('classwork', setScoreDateView)}
          >
            ✏️ Classwork Only
          </button>
        </div>

        {/* Performance Metrics Cards */}
        <div className="performance-metrics-grid">
          <div className="metric-card blue">
            <div className="metric-value">6</div>
            <div className="metric-label">Total Dates</div>
          </div>
          <div className="metric-card green">
            <div className="metric-value">532%</div>
            <div className="metric-label">HW Growth Rate</div>
          </div>
          <div className="metric-card yellow">
            <div className="metric-value">33%</div>
            <div className="metric-label">CW Growth Rate</div>
          </div>
          <div className="metric-card pink">
            <div className="metric-value">26 pts</div>
            <div className="metric-label">Max Gap (HW-CW)</div>
          </div>
        </div>

        {/* Interactive Line Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Score Comparison Over Time with All Submission Dates</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [value ? `${value}%` : 'N/A', name === 'homework' ? 'Homework' : 'Classwork']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              {scoreDateView !== 'classwork' && (
                <Line 
                  type="monotone" 
                  dataKey="homework" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  name="Homework Scores"
                  onClick={() => handleLineClick('homework')}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {scoreDateView !== 'homework' && (
                <Line 
                  type="monotone" 
                  dataKey="classwork" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  name="Classwork Scores"
                  onClick={() => handleLineClick('classwork')}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-interaction-hint">
            💡 Click on the lines to view detailed performance progression with class ranking
          </div>
        </div>

        {/* Improvement Trend Display */}
        {scoreDateView === 'homework' && (
          <div className="trend-analysis">
            <div className="trend-card success">
              <h4>📈 Homework Improvement Trend: 15.07% per assignment</h4>
              <p>You are among the top 60% of students in homework performance!</p>
            </div>
          </div>
        )}

        {scoreDateView === 'classwork' && (
          <div className="trend-analysis">
            <div className="trend-card warning">
              <h4>⚠️ Classwork Performance Needs Attention</h4>
              <p>Currently in the bottom 50% - Focus on time management and quick problem-solving!</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 2. Modified Chapter Analysis Tab
  const renderChapterAnalysis = () => {
    const getChartData = () => {
      switch (chapterView) {
        case 'homework':
          return topicWisePerformanceData.map(item => ({
            ...item,
            classwork: null
          }));
        case 'classwork':
          return topicWisePerformanceData.map(item => ({
            ...item,
            homework: null
          }));
        default:
          return topicWisePerformanceData;
      }
    };

    const handleTopicLineClick = (dataKey) => {
      if (dataKey === 'homework') {
        handleViewTransition('homework', setChapterView);
      } else if (dataKey === 'classwork') {
        handleViewTransition('classwork', setChapterView);
      }
    };

    return (
      <div className="chapter-analysis-container">
        <div className="gradient-header topics">
          <h2 className="gradient-header-title">🎯 Homework vs Classwork: Interactive Topic Analysis</h2>
          <p className="gradient-header-subtitle">Click buttons above to see detailed timelines for each data type</p>
        </div>

        {/* View Toggle Buttons */}
        <div className="view-toggle-buttons">
          <button 
            className={`toggle-btn ${chapterView === 'combined' ? 'active' : ''}`}
            onClick={() => handleViewTransition('combined', setChapterView)}
          >
            📊 Combined View
          </button>
          <button 
            className={`toggle-btn ${chapterView === 'homework' ? 'active' : ''}`}
            onClick={() => handleViewTransition('homework', setChapterView)}
          >
            📚 Homework Only
          </button>
          <button 
            className={`toggle-btn ${chapterView === 'classwork' ? 'active' : ''}`}
            onClick={() => handleViewTransition('classwork', setChapterView)}
          >
            ✏️ Classwork Only
          </button>
        </div>

        {/* Chapter Performance Metrics */}
        <div className="performance-metrics-grid">
          <div className="metric-card purple">
            <div className="metric-value">7</div>
            <div className="metric-label">Topics Analyzed</div>
          </div>
          <div className="metric-card green">
            <div className="metric-value">66.7%</div>
            <div className="metric-label">Best Performance</div>
          </div>
          <div className="metric-card orange">
            <div className="metric-value">Quadratic</div>
            <div className="metric-label">Most Active Topic</div>
          </div>
          <div className="metric-card pink">
            <div className="metric-value">62.5%</div>
            <div className="metric-label">Latest Average</div>
          </div>
        </div>

        {/* Interactive Topic Performance Chart */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="topic" 
                fontSize={10} 
                angle={-45} 
                textAnchor="end" 
                height={100}
              />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [value ? `${value}%` : 'N/A', name === 'homework' ? 'Homework' : 'Classwork']}
              />
              <Legend />
              {chapterView !== 'classwork' && (
                <Line 
                  type="monotone" 
                  dataKey="homework" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  name="Homework Average (Click to see timeline)"
                  onClick={() => handleTopicLineClick('homework')}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {chapterView !== 'homework' && (
                <Line 
                  type="monotone" 
                  dataKey="classwork" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  name="Classwork Average (Click to see timeline)"
                  onClick={() => handleTopicLineClick('classwork')}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chapter-wise Bar Chart */}
        <div className="chart-container">
          <h4>💡 Use buttons above to switch between comparison views and detailed timeline views</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="topic" 
                fontSize={10} 
                angle={-45} 
                textAnchor="end" 
                height={100}
              />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {chapterView !== 'classwork' && (
                <Bar dataKey="homework" fill="#3b82f6" name="Homework" />
              )}
              {chapterView !== 'homework' && (
                <Bar dataKey="classwork" fill="#8b5cf6" name="Classwork" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 3. Modified Mistake-Progress-Analysis Tab
  const renderMistakeProgressAnalysisTab = () => {
    return (
      <div className="mistake-analysis-container">
        <div className="gradient-header">
          <h2 className="gradient-header-title">🔍 Mistake-Progress-Analysis</h2>
          <p className="gradient-header-subtitle">Detailed performance analysis for 10HPS02 - Rohit Sharma</p>
        </div>

        {/* Answer Categories Analysis */}
        <div className="analysis-section">
          <h3 className="section-title">📊 How Well Did I Do? (Answer Categories)</h3>
          
          <div className="answer-categories-container">
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={answerCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {answerCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-center-text">
                <div className="total-label">Total</div>
                <div className="total-value">30</div>
                <div className="total-sublabel">Questions</div>
              </div>
            </div>

            <div className="categories-legend">
              {answerCategoriesData.map((category, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="legend-details">
                    <div className="legend-name">{category.name}</div>
                    <div className="legend-count">{category.count} questions</div>
                  </div>
                  <div className="legend-percentage">{category.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEW: NCERT Weightage Analysis */}
        <div className="analysis-section">
          <h3 className="section-title">🎯 Smart Study Recommendations Based on Performance & Final Exam Weightage</h3>
          
          <div className="ncert-weightage-container">
            <div className="focus-recommendation">
              <h4 className="focus-title">🎯 Focus on these Chapters:</h4>
              <div className="focus-chapters">
                <span className="chapter-name">Algebra - Linear Equations</span>
                <span className="chapter-name">Calculus - Integration</span>
                <span className="chapter-name">Quadratic Applications</span>
              </div>
              <p className="focus-reason">Because they have Low Performance & High Exam Weightage! ✅</p>
              <div className="focus-details">
                <div>Algebra - Linear Equations (8% performance) • Calculus - Integration (0% performance) • Quadratic Applications (38% performance)</div>
              </div>
            </div>

            <div className="weightage-table-container">
              <table className="weightage-table">
                <thead>
                  <tr>
                    <th>Chapter/Topic</th>
                    <th>NCERT Weightage</th>
                    <th>Your Performance</th>
                    <th>Priority Level</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {ncertWeightageData.map((item, index) => (
                    <tr key={index} className={item.importance === 'Very High' ? 'high-priority' : item.importance === 'High' ? 'medium-priority' : 'low-priority'}>
                      <td className="chapter-cell">{item.chapter}</td>
                      <td className="weightage-cell">{item.weightage}</td>
                      <td className="performance-cell">
                        <div className="performance-bar">
                          <div 
                            className="performance-fill" 
                            style={{ width: item.studentPerformance }}
                          ></div>
                        </div>
                        <span>{item.studentPerformance}</span>
                      </td>
                      <td className={`priority-cell ${item.importance.toLowerCase().replace(' ', '-')}`}>
                        {item.importance}
                      </td>
                      <td className="recommendation-cell">
                        {parseInt(item.studentPerformance) < 50 && item.weightage.replace('%', '') > 7 ? 
                          '🔥 Focus Now!' : 
                          parseInt(item.studentPerformance) > 70 ? 
                          '✅ Maintain' : 
                          '📚 Practice More'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Question Explorer */}
        <div className="analysis-section">
          <h3 className="section-title">🔍 Explore Your Questions In Different Ways</h3>
          
          <div className="filter-controls-grid">
            <div className="filter-group">
              <h4>📊 Filter By Performance Percentage</h4>
              <p>Choose A Performance Range:</p>
              <select 
                value={selectedPerformanceFilter} 
                onChange={(e) => setSelectedPerformanceFilter(e.target.value)}
                className="filter-dropdown"
              >
                {performanceFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h4>📚 Filter By Chapter</h4>
              <p>Choose A Chapter:</p>
              <select 
                value={selectedChapterFilter} 
                onChange={(e) => setSelectedChapterFilter(e.target.value)}
                className="filter-dropdown"
              >
                {chaptersList.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filtered-results">
            <h4>📋 Filtered Results - 30 Questions Found</h4>
            <p>Showing questions based on your selected filters</p>
          </div>
        </div>
      </div>
    );
  };

  // 4. Modified Summary Tab with Filters
  const renderSummaryTab = () => {
    const getFilteredSummaryData = () => {
      const baseData = {
        homeworkAverage: 66.8,
        classworkAverage: 33.8,
        performanceGap: -33.0,
        improvementRate: 15.07
      };

      switch (summaryFilter) {
        case 'homework':
          return {
            ...baseData,
            focus: 'Homework Performance',
            mainMetric: baseData.homeworkAverage,
            insight: 'Strong homework performance with consistent improvement trend'
          };
        case 'classwork':
          return {
            ...baseData,
            focus: 'Classwork Performance', 
            mainMetric: baseData.classworkAverage,
            insight: 'Classwork needs significant improvement - focus on time management'
          };
        default:
          return {
            ...baseData,
            focus: 'Overall Performance',
            mainMetric: (baseData.homeworkAverage + baseData.classworkAverage) / 2,
            insight: 'Large gap between homework and classwork performance indicates time management issues'
          };
      }
    };

    const summaryData = getFilteredSummaryData();

    return (
      <div className="summary-container">
        <div className="gradient-header">
          <h2 className="gradient-header-title">📋 Student Performance Summary</h2>
          <p className="gradient-header-subtitle">Comprehensive analysis across all performance areas</p>
        </div>

        {/* Summary Filters */}
        <div className="summary-filters">
          <h3>📊 Filter Summary View:</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${summaryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSummaryFilter('all')}
            >
              📈 All Data
            </button>
            <button 
              className={`filter-btn ${summaryFilter === 'homework' ? 'active' : ''}`}
              onClick={() => setSummaryFilter('homework')}
            >
              📚 Homework Only
            </button>
            <button 
              className={`filter-btn ${summaryFilter === 'classwork' ? 'active' : ''}`}
              onClick={() => setSummaryFilter('classwork')}
            >
              ✏️ Classwork Only
            </button>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="summary-cards-grid">
          <div className="summary-card performance-overview">
            <h4 className="summary-card-header">🎯 {summaryData.focus} Overview</h4>
            <div className="summary-metric-large">{summaryData.mainMetric.toFixed(1)}%</div>
            <p className="summary-insight">{summaryData.insight}</p>
          </div>

          <div className="summary-card key-metrics">
            <h4 className="summary-card-header">📊 Key Metrics</h4>
            <ul className="summary-list">
              {summaryFilter !== 'classwork' && (
                <li><strong>Homework Average:</strong> {summaryData.homeworkAverage}% (Above class average of 62.2%)</li>
              )}
              {summaryFilter !== 'homework' && (
                <li><strong>Classwork Average:</strong> {summaryData.classworkAverage}% (Below class average of 51.5%)</li>
              )}
              {summaryFilter === 'all' && (
                <li><strong>Performance Gap:</strong> {summaryData.performanceGap}% (Significant difference between HW and CW)</li>
              )}
              <li><strong>Improvement Rate:</strong> {summaryData.improvementRate}% in homework assignments</li>
            </ul>
          </div>

          <div className="summary-card recommendations">
            <h4 className="summary-card-header">💡 Recommendations</h4>
            <ul className="summary-list">
              {summaryFilter === 'homework' ? (
                <>
                  <li>Maintain current homework study strategies</li>
                  <li>Continue consistent assignment completion</li>
                  <li>Share homework techniques with classwork preparation</li>
                </>
              ) : summaryFilter === 'classwork' ? (
                <>
                  <li>Focus on time management skills for classwork</li>
                  <li>Practice more timed exercises</li>
                  <li>Reduce careless errors through careful review processes</li>
                </>
              ) : (
                <>
                  <li>Focus on time management skills for classwork</li>
                  <li>Practice more timed exercises</li>
                  <li>Reinforce conceptual understanding through targeted practice</li>
                  <li>Reduce careless errors through careful review processes</li>
                </>
              )}
            </ul>
          </div>

          <div className="summary-card chapter-focus">
            <h4 className="summary-card-header">🎯 Priority Chapters (Based on NCERT Weightage)</h4>
            <div className="priority-chapters">
              <div className="priority-item high">
                <span className="priority-label">🔥 High Priority:</span>
                <span>Calculus - Integration (0% performance, 15% weightage)</span>
              </div>
              <div className="priority-item medium">
                <span className="priority-label">⚠️ Medium Priority:</span>
                <span>Quadratic Applications (38% performance, 12% weightage)</span>
              </div>
              <div className="priority-item low">
                <span className="priority-label">✅ Maintain:</span>
                <span>Trigonometry (81% performance, 10% weightage)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="summary-statistics">
          <h3>📈 Performance Statistics Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{studentDateWiseComparisonData.length}</div>
              <div className="stat-label">Total Assessment Dates</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{topicWisePerformanceData.length}</div>
              <div className="stat-label">Chapters Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">30</div>
              <div className="stat-label">Total Questions Attempted</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">43.3%</div>
              <div className="stat-label">Overall Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderStudentAnalysisContent = () => {
    return (
      <div>
        {/* Updated Main Tabs with new names */}
        <div className="main-tabs-container">
          {[
            { key: 'score-progression', icon: '📈', label: 'Score- Date-wise progression', color: '#3b82f6' },
            { key: 'chapter-analysis', icon: '📚', label: 'Chapter Analysis', color: '#8b5cf6' },
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

        {/* Content Area */}
        <div className={isTransitioning ? 'loading' : ''} style={{ minHeight: '500px' }}>
          {studentAnalysisMainTab === 'score-progression' && renderScoreDatewiseProgression()}
          {studentAnalysisMainTab === 'chapter-analysis' && renderChapterAnalysis()}
          {studentAnalysisMainTab === 'mistakes' && renderMistakeProgressAnalysisTab()}
          {studentAnalysisMainTab === 'summary' && renderSummaryTab()}
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
                  backgroundColor: 'white'
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

            {/* Select Student */}
            <div className="class-selector-container">
              <span className="class-selector-label">Select Student</span>
              <select
                value={selectedStudent ? selectedStudent.rollNo : ''}
                onChange={(e) => {
                  const student = getStudentsForClass().find(s => s.rollNo === e.target.value);
                  onStudentSelect(student);
                }}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Student</option>
                {getStudentsForClass().map(student => (
                  <option key={student.id} value={student.rollNo}>
                    {student.rollNo} - {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent ? renderStudentAnalysisContent() : (
        <div className="no-student-selected">
          <h3>👆 Please select a student to view analysis</h3>
          <p>Choose a student from the dropdown above to see detailed performance analysis.</p>
        </div>
      )}
    </div>
  );
};

export default StudentAnalysis;