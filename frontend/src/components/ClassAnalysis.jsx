// ClassAnalysis.jsx

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

  // Color-coded Top Performers data
  const getTopPerformersWithColors = () => {
    const data = [
      { student: '10HPS21', average: 58 },
      { student: '10HPS19', average: 52 },
      { student: '10HPS20', average: 48 },
      { student: '10HPS17', average: 46 },
      { student: '10HPS18', average: 42 }
    ];

    return data.map((item, index) => ({
      ...item,
      color: index < 2 ? '#22c55e' : index < 4 ? '#f59e0b' : '#f97316'
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

  // Chapter-specific sub-topic data
  const getChapterSubTopics = (chapter) => {
    const subTopicData = {
      'Algebra': {
        subTopics: [
          { name: 'Rational Functions', overallAvg: 64.0, hwAvg: 84.0, cwAvg: 54.0, totalQuestions: 15 },
          { name: 'Linear Equations', overallAvg: 46.7, hwAvg: 58.3, cwAvg: 40.8, totalQuestions: 30 }
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
          { name: 'Integration', overallAvg: 58.1, hwAvg: 96.7, cwAvg: 45.3, totalQuestions: 20 },
          { name: 'Derivatives', overallAvg: 52.2, hwAvg: 55.1, cwAvg: 47.5, totalQuestions: 40 }
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

  // Enhanced Class Progress Trends with Color Coding
  const renderClassProgressTrends = () => {
    const topPerformersData = getTopPerformersWithColors();
    
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
                <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                  {topPerformersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="performance-legend">
            <div className="legend-item">
              <div className="legend-color green"></div>
              <span>Top Performers</span>
            </div>
            <div className="legend-item">
              <div className="legend-color yellow"></div>
              <span>Middle Performers</span>
            </div>
            <div className="legend-item">
              <div className="legend-color orange"></div>
              <span>Needs Improvement</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Topic Analysis with Chapter Selection
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
            {/* Chapter Sub-topic Performance */}
            <div className="chapter-analysis-section">
              <h3 className="section-title">🎯 Class Sub-topic Performance: {selectedChapter}</h3>
              <p className="section-subtitle">Sub-topics Ranked by Class Performance (Lowest to Highest)</p>
              
              <div className="subtopic-charts">
                {chapterData.subTopics.map((subtopic, index) => (
                  <div key={index} className="subtopic-chart">
                    <h4 className="subtopic-title">{subtopic.name}</h4>
                    <div className="subtopic-bar">
                      <div 
                        className="subtopic-progress" 
                        style={{ width: `${subtopic.overallAvg}%` }}
                      ></div>
                    </div>
                    <div className="subtopic-stats">
                      <span>Overall: {subtopic.overallAvg}%</span>
                      <span>HW: {subtopic.hwAvg}%</span>
                      <span>CW: {subtopic.cwAvg}%</span>
                    </div>
                  </div>
                ))}
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

  // Enhanced Summary with Achievement-style layout
  const renderSummary = () => {
    return (
      <div className="summary-container">
        <div className="summary-header">
          <h2 className="summary-title">📋 CLASSROOM PERFORMANCE SUMMARY</h2>
          <div className="summary-badge">Class Overview</div>
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
                <div className="achievement-title">Best Subject</div>
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

        {/* Performance Stats */}
        <div className="performance-stats-section">
          <h3 className="section-title">📊 CLASS STATISTICS</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">5</div>
                <div className="stat-label">Total Students</div>
              </div>
            </div>
            
            <div className="stat-box">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">60</div>
                <div className="stat-label">Total Assignments</div>
              </div>
            </div>
            
            <div className="stat-box">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-number">56.5%</div>
                <div className="stat-label">Class Average</div>
              </div>
            </div>
            
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-number">10</div>
                <div className="stat-label">Topics Covered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Rankings */}
        <div className="rankings-section">
          <h3 className="section-title">🏅 STUDENT RANKINGS</h3>
          <div className="ranking-list">
            {[
              { position: 1, student: '10HPS21', score: 69.5, trend: 'up' },
              { position: 2, student: '10HPS17', score: 67.0, trend: 'up' },
              { position: 3, student: '10HPS18', score: 62.0, trend: 'neutral' },
              { position: 4, student: '10HPS19', score: 57.0, trend: 'down' },
              { position: 5, student: '10HPS20', score: 55.0, trend: 'down' }
            ].map((student) => (
              <div key={student.position} className={`ranking-item rank-${student.position}`}>
                <div className="rank-number">{student.position}</div>
                <div className="student-info">
                  <div className="student-name">{student.student}</div>
                  <div className="student-score">{student.score}%</div>
                </div>
                <div className={`trend-indicator ${student.trend}`}>
                  {student.trend === 'up' ? '↑' : student.trend === 'down' ? '↓' : '→'}
                </div>
              </div>
            ))}
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

      {/* Sub-tabs for class analysis */}
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
        {classAnalysisTab === 'summary' && renderSummary()}
      </div>
    </div>
  );
};

export default ClassAnalysis;