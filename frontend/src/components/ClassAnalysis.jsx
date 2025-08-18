// ClassAnalysis.jsx - Fixed all template literal errors

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import './ClassAnalysis.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ClassAnalysis = ({ selectedClass, classesData, onClassChange }) => {
  const [classAnalysisTab, setClassAnalysisTab] = useState('overview');
  const [selectedChapter, setSelectedChapter] = useState('All Chapters');
  
  // New state for Submitted Results filters
  const [dateFilter, setDateFilter] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('all'); // all, homework, classwork

  // Updated data with 5 students instead of 3
  const studentPerformanceComparisonData = [
    { student: '10HPS20', homeworkAverage: 55, classworkAverage: 49 },
    { student: '10HPS19', homeworkAverage: 57, classworkAverage: 76 },
    { student: '10HPS18', homeworkAverage: 62, classworkAverage: 27 },
    { student: '10HPS21', homeworkAverage: 69, classworkAverage: 70 },
    { student: '10HPS17', homeworkAverage: 67, classworkAverage: 33 }
  ];

  // Updated summary cards data for 5 students
  const summaryCardsData = {
    totalStudents: 5,
    averageScore: 85,
    assignments: 12,
    completionRate: 92
  };

  // Updated Top Performers data with single color
  const getTopPerformersData = () => {
    const data = [
      { student: '10HPS21', average: 58 },
      { student: '10HPS19', average: 52 },
      { student: '10HPS20', average: 48 },
      { student: '10HPS17', average: 46 },
      { student: '10HPS18', average: 42 }
    ];

    // All bars will have the same color
    return data.map((item) => ({
      ...item,
      color: '#3b82f6' // Single blue color for all performers
    }));
  };

  const overallClassStatsData = [
    { type: 'Homework', average: 62, color: '#0ea5e9' },
    { type: 'Classwork', average: 51, color: '#a855f7' }
  ];

  // Chapter options for dropdown
  const chapterOptions = [
    'All Chapters',
    'Algebra',
    'Calculus', 
    'Coordinate Geometry',
    'Functions and Graphs',
    'Probability',
    'Quadratic Applications',
    'Statistics',
    'Trigonometry'
  ];

  // All topics data for main view
  const allTopicsRankedData = [
    { topic: 'Algebra - Linear Equations', average: 46.7 },
    { topic: 'Calculus - Derivatives', average: 52.2 },
    { topic: 'Statistics', average: 56.4 },
    { topic: 'Trigonometry', average: 56.9 },
    { topic: 'Functions and Graphs', average: 57.0 },
    { topic: 'Calculus - Integration', average: 58.1 },
    { topic: 'Quadratic Applications', average: 59.0 },
    { topic: 'Probability', average: 60.8 },
    { topic: 'Algebra - Rational Functions', average: 64.0 },
    { topic: 'Coordinate Geometry', average: 71.4 }
  ];

  // Chapter-specific sub-topic data - reformatted for bar chart
  const getChapterSubTopics = (chapter) => {
    const subTopicData = {
      'Algebra': {
        subTopics: [
          { name: 'Linear Equations', overallAvg: 46.7, hwAvg: 58.3, cwAvg: 40.8, totalQuestions: 30 },
          { name: 'Rational Functions', overallAvg: 64.0, hwAvg: 84.0, cwAvg: 54.0, totalQuestions: 15 }
        ],
        chartData: [
          { topic: 'Linear Equations', average: 46.7 },
          { topic: 'Rational Functions', average: 64.0 }
        ],
        stats: {
          subTopicsFound: 2,
          chapterAverage: 55.3,
          needsMostAttention: 46.7,
          bestPerformance: 64.0
        }
      },
      'Calculus': {
        subTopics: [
          { name: 'Derivatives', overallAvg: 52.2, hwAvg: 55.1, cwAvg: 47.5, totalQuestions: 40 },
          { name: 'Integration', overallAvg: 58.1, hwAvg: 96.7, cwAvg: 45.3, totalQuestions: 20 }
        ],
        chartData: [
          { topic: 'Derivatives', average: 52.2 },
          { topic: 'Integration', average: 58.1 }
        ],
        stats: {
          subTopicsFound: 2,
          chapterAverage: 55.2,
          needsMostAttention: 52.2,
          bestPerformance: 58.1
        }
      }
    };
    return subTopicData[chapter] || null;
  };

  // Sample data for Submitted Results
  const submittedResultsData = [
    { studentId: '10HPS17', marks: 67, homeworkSubmitted: true, classworkSubmitted: true, date: '2025-08-10' },
    { studentId: '10HPS18', marks: 42, homeworkSubmitted: true, classworkSubmitted: false, date: '2025-08-10' },
    { studentId: '10HPS19', marks: 52, homeworkSubmitted: true, classworkSubmitted: true, date: '2025-08-11' },
    { studentId: '10HPS20', marks: 48, homeworkSubmitted: false, classworkSubmitted: true, date: '2025-08-11' },
    { studentId: '10HPS21', marks: 58, homeworkSubmitted: true, classworkSubmitted: true, date: '2025-08-12' }
  ];

  // Filter submitted results based on filters
  const getFilteredResults = () => {
    let filtered = [...submittedResultsData];
    
    if (dateFilter) {
      filtered = filtered.filter(item => item.date === dateFilter);
    }
    
    if (submissionFilter === 'homework') {
      filtered = filtered.filter(item => item.homeworkSubmitted);
    } else if (submissionFilter === 'classwork') {
      filtered = filtered.filter(item => item.classworkSubmitted);
    }
    
    return filtered;
  };

  // Class Overview Dashboard
  const renderClassOverviewDashboard = () => {
    return (
      <div className="class-overview-container">
        <div className="overview-header">
          <div className="overview-title-section">
            <h2 className="overview-title">📊 CLASS OVERVIEW DASHBOARD</h2>
            <p className="overview-subtitle">Overall class performance metrics and insights</p>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="summary-cards-grid">
          <div className="summary-card card-blue">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <div className="card-value">{summaryCardsData.totalStudents}</div>
              <div className="card-label">Total Students</div>
            </div>
          </div>
          
          <div className="summary-card card-green">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-value">{summaryCardsData.averageScore}%</div>
              <div className="card-label">Average Score</div>
            </div>
          </div>
          
          <div className="summary-card card-yellow">
            <div className="card-icon">📝</div>
            <div className="card-content">
              <div className="card-value">{summaryCardsData.assignments}</div>
              <div className="card-label">Assignments</div>
            </div>
          </div>
          
          <div className="summary-card card-purple">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <div className="card-value">{summaryCardsData.completionRate}%</div>
              <div className="card-label">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart-card">
            <h3 className="chart-title">Student Performance Comparison</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={studentPerformanceComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="student" 
                    fontSize={12} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                  />
                  <YAxis 
                    fontSize={12} 
                    domain={[0, 100]} 
                    tickCount={6}
                    ticks={[0, 20, 40, 60, 80, 100]}
                  />
                  <Tooltip formatter={(value, name) => [value + '%', name === 'homeworkAverage' ? 'Homework Average' : 'Classwork Average']} />
                  <Legend />
                  <Bar dataKey="homeworkAverage" fill="#0ea5e9" name="Homework Average" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="classworkAverage" fill="#a855f7" name="Classwork Average" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Class Performance Summary</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={overallClassStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" fontSize={12} />
                  <YAxis 
                    fontSize={12} 
                    domain={[0, 100]} 
                    tickCount={6}
                    ticks={[0, 20, 40, 60, 80, 100]}
                  />
                  <Tooltip formatter={(value) => [value + '%', 'Average Score']} />
                  <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                    {overallClassStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-info">
              <div>Type: Classwork</div>
              <div>Average: 51.5%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Class Progress Trends with Single Color
  const renderClassProgressTrends = () => {
    const topPerformersData = getTopPerformersData();
    
    return (
      <div className="progress-trends-container">
        <div className="trends-header">
          <h2 className="trends-title">📈 Class Progress Trends</h2>
          <p className="trends-subtitle">Top Performers Analysis</p>
        </div>

        <div className="filter-buttons-container">
          {['1D', '5D', '10D', '15D', '1M', 'MAX'].map((filter) => (
            <button key={filter} className={`filter-btn ${filter === '1M' ? 'active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="top-performers-section">
          <h3 className="section-title">🏆 Top Performers</h3>
          <div className="chart-wrapper large">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={topPerformersData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="student" 
                  fontSize={12} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                />
                <YAxis 
                  fontSize={12} 
                  domain={[0, 100]} 
                  tickCount={6}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Tooltip formatter={(value) => [value + '%', 'Average Score']} />
                <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="performance-legend">
            <div className="legend-item">
              <div className="legend-color all-performers"></div>
              <span>All Performers</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Topic Analysis with Bar Chart for Sub-topics
  const renderTopicAnalysis = () => {
    const chapterData = getChapterSubTopics(selectedChapter);
    
    return (
      <div className="topic-analysis-container">
        <div className="topic-header">
          <h2 className="topic-title">🎯 Topic Analysis</h2>
          <p className="topic-subtitle">Performance breakdown by academic topics</p>
        </div>

        <div className="chapter-filter-section">
          <label className="filter-label">📚 Select Chapter (Main Topic):</label>
          <select 
            value={selectedChapter} 
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="chapter-dropdown"
          >
            {chapterOptions.map(chapter => (
              <option key={chapter} value={chapter}>{chapter}</option>
            ))}
          </select>
        </div>

        {selectedChapter === 'All Chapters' ? (
          <>
            {/* Summary Stats */}
            <div className="topic-summary-stats">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">10</div>
                  <div className="stat-label">Total Topics</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-value">58.3%</div>
                  <div className="stat-label">Overall Average</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Available Chapters</div>
                </div>
              </div>
            </div>

            {/* All Topics Chart */}
            <div className="topic-chart-section">
              <h3 className="chart-title">🎯 Class Topic Performance Analysis</h3>
              <p className="chart-subtitle">All Topics Ranked by Class Performance (Lowest to Highest)</p>
              
              <div className="chart-wrapper large">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={allTopicsRankedData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="topic" 
                      fontSize={10} 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                    />
                    <YAxis 
                      fontSize={12} 
                      domain={[0, 100]} 
                      tickCount={11}
                      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    />
                    <Tooltip formatter={(value) => [value + '%', 'Average Performance']} />
                    <Bar dataKey="average" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : chapterData ? (
          <>
            {/* Chapter Sub-topic Performance as Bar Chart */}
            <div className="chapter-analysis-section">
              <h3 className="section-title">🎯 Class Sub-topic Performance: {selectedChapter}</h3>
              <p className="section-subtitle">Sub-topics Ranked by Class Performance (Lowest to Highest)</p>
              
              {/* Bar Chart for Sub-topics */}
              <div className="subtopic-bar-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={chapterData.chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="topic" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      fontSize={12} 
                      domain={[0, 100]} 
                      tickCount={6}
                      ticks={[0, 20, 40, 60, 80, 100]}
                    />
                    <Tooltip formatter={(value) => [value + '%', 'Average']} />
                    <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chapter Statistics */}
              <div className="chapter-stats">
                <h4 className="stats-title">📊 {selectedChapter} Sub-topic Details</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Sub-topics Found</span>
                    <span className="stat-value">{chapterData.stats.subTopicsFound}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Chapter Average</span>
                    <span className="stat-value">{chapterData.stats.chapterAverage}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Needs Most Attention</span>
                    <span className="stat-value">{chapterData.stats.needsMostAttention}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Best Performance</span>
                    <span className="stat-value">{chapterData.stats.bestPerformance}%</span>
                  </div>
                </div>

                {/* Detailed Performance Table */}
                <div className="performance-table">
                  <h5 className="table-title">📋 Detailed Sub-topic Performance Table</h5>
                  <table>
                    <thead>
                      <tr>
                        <th>Sub-topic</th>
                        <th>Overall Avg (%)</th>
                        <th>HW Avg (%)</th>
                        <th>CW Avg (%)</th>
                        <th>Total Questions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chapterData.subTopics.map((subtopic, index) => (
                        <tr key={index}>
                          <td>{subtopic.name}</td>
                          <td>{subtopic.overallAvg}</td>
                          <td>{subtopic.hwAvg}</td>
                          <td>{subtopic.cwAvg}</td>
                          <td>{subtopic.totalQuestions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-subtopics-section">
            <div className="empty-state">
              <div className="empty-icon">🚫</div>
              <h3 className="empty-title">No Sub-topics Found for Chapter: {selectedChapter}</h3>
              <p className="empty-message">Please select a different chapter or check data format</p>
            </div>
            
            <div className="troubleshooting">
              <h4>⚠ No sub-topics found for chapter '{selectedChapter}'. This might mean:</h4>
              <ul>
                <li>The chapter '{selectedChapter}' doesn't have sub-topics with '-' separator</li>
                <li>There's no performance data available for this chapter's sub-topics</li>
                <li>Check if your data follows the format: 'Chapter Name - Sub-Topic-Name'</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // New Submitted Results Tab
  const renderSubmittedResults = () => {
    const filteredResults = getFilteredResults();
    
    return (
      <div className="submitted-results-container">
        <div className="submitted-results-header">
          <h2 className="submitted-results-title">📝 Submitted Results</h2>
          <p className="submitted-results-subtitle">Track student submissions and marks</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Show:</label>
            <select
              value={submissionFilter}
              onChange={(e) => setSubmissionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="homework">Only Homework</option>
              <option value="classwork">Only Classwork</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="submitted-results-table">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Marks</th>
                <th>Homework</th>
                <th>Classwork</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.studentId}</td>
                  <td>{result.marks}</td>
                  <td>
                    <span className={`submission-status ${result.homeworkSubmitted ? 'submitted' : 'not-submitted'}`}>
                      {result.homeworkSubmitted ? '✓ Submitted' : '✗ Not Submitted'}
                    </span>
                  </td>
                  <td>
                    <span className={`submission-status ${result.classworkSubmitted ? 'submitted' : 'not-submitted'}`}>
                      {result.classworkSubmitted ? '✓ Submitted' : '✗ Not Submitted'}
                    </span>
                  </td>
                  <td>{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Enhanced Summary with All Tab Data
  const renderSummary = () => {
    return (
      <div className="summary-container">
        <div className="summary-header">
          <h2 className="summary-title">📋 CLASSROOM PERFORMANCE SUMMARY</h2>
        </div>

        {/* Achievement Cards */}
        <div className="achievements-section">
          <h3 className="section-title">🏆 ACHIEVEMENTS</h3>
          <div className="achievement-cards">
            <div className="achievement-card gold">
              <div className="achievement-icon">🥇</div>
              <div className="achievement-content">
                <div className="achievement-title">Top Performer</div>
                <div className="achievement-value">10HPS21 - 69.5%</div>
              </div>
            </div>
            
            <div className="achievement-card silver">
              <div className="achievement-icon">📈</div>
              <div className="achievement-content">
                <div className="achievement-title">Best Chapter</div>
                <div className="achievement-value">Coordinate Geometry - 71.4%</div>
              </div>
            </div>
            
            <div className="achievement-card bronze">
              <div className="achievement-icon">✅</div>
              <div className="achievement-content">
                <div className="achievement-title">Completion Rate</div>
                <div className="achievement-value">92% Overall</div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Overview Summary */}
        <div className="summary-section">
          <h3 className="summary-section-title">📊 Class Overview</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Students:</span>
              <span className="summary-value">{summaryCardsData.totalStudents}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average Score:</span>
              <span className="summary-value">{summaryCardsData.averageScore}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Assignments:</span>
              <span className="summary-value">{summaryCardsData.assignments}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Completion Rate:</span>
              <span className="summary-value">{summaryCardsData.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Progress Trends Summary */}
        <div className="summary-section">
          <h3 className="summary-section-title">📈 Progress Trends</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Top Performer:</span>
              <span className="summary-value">10HPS21 (58%)</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Lowest Performer:</span>
              <span className="summary-value">10HPS18 (42%)</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Class Average:</span>
              <span className="summary-value">49.2%</span>
            </div>
          </div>
        </div>

        {/* Topic Analysis Summary */}
        <div className="summary-section">
          <h3 className="summary-section-title">🎯 Topic Analysis</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Topics:</span>
              <span className="summary-value">10</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Best Topic:</span>
              <span className="summary-value">Coordinate Geometry (71.4%)</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Weakest Topic:</span>
              <span className="summary-value">Linear Equations (46.7%)</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Topics Average:</span>
              <span className="summary-value">58.3%</span>
            </div>
          </div>
        </div>

        {/* Submitted Results Summary */}
        <div className="summary-section">
          <h3 className="summary-section-title">📝 Submission Summary</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Submissions:</span>
              <span className="summary-value">5</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Homework Completion:</span>
              <span className="summary-value">80%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Classwork Completion:</span>
              <span className="summary-value">80%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average Marks:</span>
              <span className="summary-value">52.8</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="insights-section">
          <h3 className="section-title">💡 KEY INSIGHTS & RECOMMENDATIONS</h3>
          <div className="insight-cards">
            <div className="insight-card success">
              <div className="insight-header">
                <div className="insight-icon">✅</div>
                <div className="insight-title">Strengths</div>
              </div>
              <ul className="insight-list">
                <li>Homework performance 11% higher than classwork</li>
                <li>Strong performance in Coordinate Geometry (71.4%)</li>
                <li>High completion rate (92%)</li>
              </ul>
            </div>
            
            <div className="insight-card warning">
              <div className="insight-header">
                <div className="insight-icon">⚠</div>
                <div className="insight-title">Areas for Improvement</div>
              </div>
              <ul className="insight-list">
                <li>Linear Equations needs focus (46.7%)</li>
                <li>Classwork strategies need enhancement</li>
                <li>2 students need additional support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="class-analysis-main-content">
      <div className="class-analysis-header">
        <div className="class-header-top">
          <div className="class-header-info">
            <div className="class-header-icon">📊</div>
            <div>
              <h2 className="class-header-title">Class Analysis Dashboard</h2>
              <p className="class-header-subtitle">Comprehensive performance analysis for {selectedClass.name}</p>
            </div>
          </div>
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
        </div>
      </div>

      {/* Updated Sub-tabs with 5 tabs */}
      <div className="class-sub-tabs">
        <button
          onClick={() => setClassAnalysisTab('overview')}
          className={`class-sub-tab ${classAnalysisTab === 'overview' ? 'active' : ''}`}
        >
          📊 Class Overview
        </button>
        <button
          onClick={() => setClassAnalysisTab('trends')}
          className={`class-sub-tab ${classAnalysisTab === 'trends' ? 'active' : ''}`}
        >
          📈 Class Progress Trends
        </button>
        <button
          onClick={() => setClassAnalysisTab('topics')}
          className={`class-sub-tab ${classAnalysisTab === 'topics' ? 'active' : ''}`}
        >
          🎯 Topic Analysis
        </button>
        <button
          onClick={() => setClassAnalysisTab('submitted')}
          className={`class-sub-tab ${classAnalysisTab === 'submitted' ? 'active' : ''}`}
        >
          📝 Submitted Results
        </button>
        <button
          onClick={() => setClassAnalysisTab('summary')}
          className={`class-sub-tab ${classAnalysisTab === 'summary' ? 'active' : ''}`}
        >
          📋 Summary
        </button>
      </div>

      {/* Class Analysis Content */}
      <div className="class-analysis-content">
        {classAnalysisTab === 'overview' && renderClassOverviewDashboard()}
        {classAnalysisTab === 'trends' && renderClassProgressTrends()}
        {classAnalysisTab === 'topics' && renderTopicAnalysis()}
        {classAnalysisTab === 'submitted' && renderSubmittedResults()}
        {classAnalysisTab === 'summary' && renderSummary()}
      </div>
    </div>
  );
};

export default ClassAnalysis;