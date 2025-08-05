// ClassAnalysis.jsx - Separate Component for Class Analysis

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ClassAnalysis = ({ selectedClass, classesData, onClassChange }) => {
  const [classAnalysisTab, setClassAnalysisTab] = useState('overview');
  const [selectedChapter, setSelectedChapter] = useState('All Chapters');

  // Data for charts
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

  const studentPerformanceComparisonData = [
    { student: '10HPS20', homeworkAverage: 55, classworkAverage: 49 },
    { student: '10HPS19', homeworkAverage: 57, classworkAverage: 76 },
    { student: '10HPS18', homeworkAverage: 62, classworkAverage: 27 },
    { student: '10HPS21', homeworkAverage: 69, classworkAverage: 70 },
    { student: '10HPS17', homeworkAverage: 67, classworkAverage: 33 }
  ];

  const overallClassStatsData = [
    { type: 'Homework', average: 62, color: '#0ea5e9' },
    { type: 'Classwork', average: 51, color: '#a855f7' }
  ];

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

  const algebraSubTopicsData = [
    { topic: 'Linear Equations', average: 46.7 },
    { topic: 'Rational Functions', average: 64.0 }
  ];

  const calculusSubTopicsData = [
    { topic: 'Derivatives', average: 52.2 },
    { topic: 'Integration', average: 58.1 }
  ];

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

  // Class Overview Dashboard
  const renderClassOverviewDashboard = () => {
    const studentCount = selectedClass.students ? selectedClass.students.length : 28;
    const averageScore = 85;
    const assignments = 12;
    const completionRate = 92;

    return (
      <div className="class-overview-dashboard">
        {/* Metrics Cards */}
        <div className="overview-metrics-grid">
          <div className="overview-metric-card metric-card-blue">
            <div className="overview-metric-icon">👥</div>
            <div className="overview-metric-content">
              <div className="overview-metric-label">Total Students</div>
              <div className="overview-metric-value">{studentCount}</div>
            </div>
          </div>

          <div className="overview-metric-card metric-card-green">
            <div className="overview-metric-icon">📊</div>
            <div className="overview-metric-content">
              <div className="overview-metric-label">Average Score</div>
              <div className="overview-metric-value">{averageScore}%</div>
            </div>
          </div>

          <div className="overview-metric-card metric-card-yellow">
            <div className="overview-metric-icon">📄</div>
            <div className="overview-metric-content">
              <div className="overview-metric-label">Assignments</div>
              <div className="overview-metric-value">{assignments}</div>
            </div>
          </div>

          <div className="overview-metric-card metric-card-pink">
            <div className="overview-metric-icon">🎯</div>
            <div className="overview-metric-content">
              <div className="overview-metric-label">Completion Rate</div>
              <div className="overview-metric-value">{completionRate}%</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="overview-charts-grid">
          <div className="overview-chart-container">
            <h3 className="chart-title">Student Performance Comparison</h3>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentPerformanceComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="student" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 80]} />
                  <Tooltip formatter={(value, name) => [value, name === 'homeworkAverage' ? 'Homework Average' : 'Classwork Average']} />
                  <Legend />
                  <Bar dataKey="homeworkAverage" fill="#0ea5e9" name="Homework Average" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="classworkAverage" fill="#a855f7" name="Classwork Average" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overview-chart-container">
            <h3 className="chart-title">Class Performance Summary</h3>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overallClassStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 70]} />
                  <Tooltip formatter={(value) => [value, 'Average Score']} />
                  <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                    {overallClassStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
              <div>Type: Classwork</div>
              <div>Average: 51.5%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Class Progress Trends
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

        <div className="flex-column-gap">
          {/* Assignment-wise Class Average LineChart */}
          <div>
            <h4 className="subsection-title">📈 Assignment-wise Class Average</h4>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip formatter={(value, name) => [value + '%', name === 'hwAverage' ? 'HW Class Average' : 'CW Class Average']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hwAverage" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                    name="HW Class Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cwAverage" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                    name="CW Class Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers BarChart */}
          <div>
            <h4 className="subsection-title">🏆 Top Performers</h4>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPerformersData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="student" angle={-45} textAnchor="end" height={60} fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 70]} />
                  <Tooltip formatter={(value) => [value + '%', 'Overall Average']} />
                  <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                    {topPerformersData.map((entry, index) => {
                      let color;
                      if (index === 0) {
                        color = '#22c55e'; // Green for top performer
                      } else if (index === topPerformersData.length - 1) {
                        color = '#ef4444'; // Red for least performer
                      } else {
                        color = '#fbbf24'; // Yellow for middle performers
                      }
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Performance Legend */}
            <div className="legend-container">
              <div className="legend-grid">
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#22c55e' }}></div>
                  <span>Top Performer</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#fbbf24' }}></div>
                  <span>Middle Performers</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>Needs Improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Topic Analysis
  const renderTopicAnalysis = () => {
    const renderAllChaptersView = () => {
      return (
        <div>
          {/* Overview Stats */}
          <div className="mb-20">
            <h3 className="section-title">📊 All Topics Overview</h3>
            <div className="highlight-box highlight-box-blue">
              <p style={{ margin: '0', fontSize: '14px' }}>💡 Select a specific chapter from the dropdown above to drill down into sub-topic analysis</p>
            </div>
          </div>

          <div className="summary-cards-grid mb-32">
            <div className="metric-card-blue">
              <div className="metric-value-blue">10</div>
              <div className="metric-label">Total Topics</div>
            </div>
            <div className="metric-card-green">
              <div className="metric-value-green">58.3%</div>
              <div className="metric-label">Overall Average</div>
            </div>
            <div className="metric-card-yellow">
              <div className="metric-value-yellow">8</div>
              <div className="metric-label">Available Chapters</div>
            </div>
          </div>

          {/* All Topics Chart */}
          <div>
            <h4 className="subsection-title">🎯 Class Topic Performance Analysis</h4>
            <p className="topic-stats-text">All Topics Ranked by Class Performance (Lowest to Highest)</p>
            <div className="chart-height-400">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allTopicsRankedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} fontSize={10} interval={0} />
                  <YAxis fontSize={12} domain={[0, 80]} />
                  <Tooltip formatter={(value) => [value + '%', 'Class Average']} />
                  <Bar dataKey="average" fill="#4a90e2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    };

    const renderAlgebraView = () => {
      return (
        <div>
          <div className="mb-20">
            <div className="highlight-box highlight-box-blue">
              <p style={{ margin: '0', fontSize: '14px' }}>📘 Viewing sub-topics for: Algebra</p>
            </div>
          </div>

          {/* Algebra Sub-topic Details Overview */}
          <div className="mb-20">
            <h3 className="section-title">📊 Algebra Sub-topic Details</h3>
          </div>

          <div className="summary-cards-grid mb-32">
            <div className="metric-card-blue">
              <div className="metric-value-blue">2</div>
              <div className="metric-label">Sub-topics Found</div>
            </div>
            <div className="metric-card-green">
              <div className="metric-value-green">55.3%</div>
              <div className="metric-label">Chapter Average</div>
            </div>
            <div className="metric-card-yellow">
              <div className="metric-value-yellow">46.7%</div>
              <div className="metric-label">Needs Most Attention</div>
            </div>
            <div className="metric-card-pink">
              <div className="metric-value-pink">64.0%</div>
              <div className="metric-label">Best Performance</div>
            </div>
          </div>

          {/* Algebra Sub-topics Chart */}
          <div className="mb-32">
            <h4 className="subsection-title">🎯 Class Sub-topic Performance: Algebra</h4>
            <p className="topic-stats-text">Sub-topics Ranked by Class Performance (Lowest to Highest)</p>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={algebraSubTopicsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={60} fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 70]} />
                  <Tooltip formatter={(value) => [value + '%', 'Class Average']} />
                  <Bar dataKey="average" fill="#4a90e2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Sub-topic Performance Table */}
          <div>
            <h4 className="subsection-title">📋 Detailed Sub-topic Performance Table</h4>
            <div className="data-table-container">
              <table className="enhanced-data-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header-enhanced">Sub-topic</th>
                    <th className="table-header-enhanced table-header-center">Overall Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">HW Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">CW Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">Total Questions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row-even">
                    <td className="table-cell-enhanced">
                      <span className="table-id-cell">0</span>
                      Rational Functions
                    </td>
                    <td className="table-cell-enhanced table-cell-center">64</td>
                    <td className="table-cell-enhanced table-cell-center">84</td>
                    <td className="table-cell-enhanced table-cell-center">54</td>
                    <td className="table-cell-enhanced table-cell-center">15</td>
                  </tr>
                  <tr className="table-row-odd">
                    <td className="table-cell-enhanced">
                      <span className="table-id-cell">1</span>
                      Linear Equations
                    </td>
                    <td className="table-cell-enhanced table-cell-center">46.7</td>
                    <td className="table-cell-enhanced table-cell-center">58.3</td>
                    <td className="table-cell-enhanced table-cell-center">40.8</td>
                    <td className="table-cell-enhanced table-cell-center">30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const renderCalculusView = () => {
      return (
        <div>
          <div className="mb-20">
            <div className="highlight-box highlight-box-blue">
              <p style={{ margin: '0', fontSize: '14px' }}>📘 Viewing sub-topics for: Calculus</p>
            </div>
          </div>

          {/* Calculus Sub-topic Details Overview */}
          <div className="mb-20">
            <h3 className="section-title">📊 Calculus Sub-topic Details</h3>
          </div>

          <div className="summary-cards-grid mb-32">
            <div className="metric-card-blue">
              <div className="metric-value-blue">2</div>
              <div className="metric-label">Sub-topics Found</div>
            </div>
            <div className="metric-card-green">
              <div className="metric-value-green">55.2%</div>
              <div className="metric-label">Chapter Average</div>
            </div>
            <div className="metric-card-yellow">
              <div className="metric-value-yellow">52.2%</div>
              <div className="metric-label">Needs Most Attention</div>
            </div>
            <div className="metric-card-pink">
              <div className="metric-value-pink">58.1%</div>
              <div className="metric-label">Best Performance</div>
            </div>
          </div>

          {/* Calculus Sub-topics Chart */}
          <div className="mb-32">
            <h4 className="subsection-title">🎯 Class Sub-topic Performance: Calculus</h4>
            <p className="topic-stats-text">Sub-topics Ranked by Class Performance (Lowest to Highest)</p>
            <div className="chart-height-300">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculusSubTopicsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={60} fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 70]} />
                  <Tooltip formatter={(value) => [value + '%', 'Class Average']} />
                  <Bar dataKey="average" fill="#4a90e2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Sub-topic Performance Table */}
          <div>
            <h4 className="subsection-title">📋 Detailed Sub-topic Performance Table</h4>
            <div className="data-table-container">
              <table className="enhanced-data-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header-enhanced">Sub-topic</th>
                    <th className="table-header-enhanced table-header-center">Overall Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">HW Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">CW Avg (%)</th>
                    <th className="table-header-enhanced table-header-center">Total Questions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row-even">
                    <td className="table-cell-enhanced">
                      <span className="table-id-cell">0</span>
                      Integration
                    </td>
                    <td className="table-cell-enhanced table-cell-center">58.1</td>
                    <td className="table-cell-enhanced table-cell-center">96.7</td>
                    <td className="table-cell-enhanced table-cell-center">45.3</td>
                    <td className="table-cell-enhanced table-cell-center">20</td>
                  </tr>
                  <tr className="table-row-odd">
                    <td className="table-cell-enhanced">
                      <span className="table-id-cell">1</span>
                      Derivatives
                    </td>
                    <td className="table-cell-enhanced table-cell-center">52.2</td>
                    <td className="table-cell-enhanced table-cell-center">55.1</td>
                    <td className="table-cell-enhanced table-cell-center">47.5</td>
                    <td className="table-cell-enhanced table-cell-center">40</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const renderNoSubTopicsView = (chapterName) => {
      return (
        <div>
          <div className="mb-20">
            <div className="highlight-box highlight-box-blue">
              <p style={{ margin: '0', fontSize: '14px' }}>📘 Viewing sub-topics for: {chapterName}</p>
            </div>
          </div>

          <div className="empty-state" style={{ minHeight: '300px' }}>
            <div>
              <div className="empty-state-icon" style={{ color: '#ef4444', fontSize: '48px' }}>🚫</div>
              <h3 className="empty-state-title" style={{ color: '#ef4444' }}>
                No Sub-topics Found for Chapter: {chapterName}
              </h3>
              <p className="empty-state-text" style={{ color: '#ef4444' }}>
                Please select a different chapter or check data format
              </p>
            </div>
          </div>

          <div className="highlight-box highlight-box-yellow">
            <div className="highlight-text-yellow">
              ⚠️ No sub-topics found for chapter '{chapterName}'. This might mean:
            </div>
            <ul className="summary-list" style={{ marginTop: '12px' }}>
              <li>The chapter '{chapterName}' doesn't have sub-topics with '-' separator</li>
              <li>There's no performance data available for this chapter's sub-topics</li>
              <li>Check if your data follows the format: '{chapterName} - Sub-Topic-Name'</li>
            </ul>
          </div>
        </div>
      );
    };

    return (
      <div className="rounded-bottom-card">
        <div className="mb-20">
          <h3 className="section-title">🎯 Class Topic Analysis</h3>
          <p className="section-subtitle">Across All Students</p>
        </div>

        {/* Chapter Selection Dropdown */}
        <div className="mb-24">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              📚 Select Chapter (Main Topic):
            </span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>ℹ️</span>
          </div>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              color: '#374151',
              minWidth: '200px',
              fontWeight: '600'
            }}
          >
            {chapterOptions.map(chapter => (
              <option key={chapter} value={chapter}>{chapter}</option>
            ))}
          </select>
        </div>

        {/* Render content based on selected chapter */}
        {selectedChapter === 'All Chapters' && renderAllChaptersView()}
        {selectedChapter === 'Algebra' && renderAlgebraView()}
        {selectedChapter === 'Calculus' && renderCalculusView()}
        {!['All Chapters', 'Algebra', 'Calculus'].includes(selectedChapter) && 
          renderNoSubTopicsView(selectedChapter)}
      </div>
    );
  };

  // Summary
  const renderSummary = () => {
    const totalStudents = selectedClass.students ? selectedClass.students.length : 5;
    
    return (
      <div className="rounded-bottom-card">
        <div className="mb-20">
          <h3 className="section-title">📋 CLASSROOM PERFORMANCE SUMMARY</h3>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">👥 Class Overview:</h4>
          <ul className="summary-list">
            <li><strong>Total Students:</strong> {totalStudents}</li>
            <li><strong>Students with Homework Data:</strong> {totalStudents}</li>
            <li><strong>Students with Classwork Data:</strong> {totalStudents}</li>
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
            <div className="highlight-text-blue">- **F ({' < '}60%):** 27 assignments (45.0%)</div>
          </div>
          <ul className="summary-list">
            <li><strong>C (70-79%):</strong> 13 assignments (21.7%)</li>
            <li><strong>B (80-89%):</strong> 13 assignments (21.7%)</li>
            <li><strong>D (60-69%):</strong> 6 assignments (10.0%)</li>
            <li><strong>A (90-100%):</strong> 1 assignments (1.7%)</li>
          </ul>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">🏆 Top Performers:</h4>
          <div className="summary-list-none">
            <div className="highlight-box highlight-box-blue">
              <div className="highlight-text-blue">1. **10HPS21:** 69.0%</div>
            </div>
            <p style={{ margin: '8px 0', color: '#4b5563' }}>
              2. <strong>10HPS19:</strong> 66.8% 3. <strong>10HPS20:</strong> 52.2%
            </p>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div className="highlight-box highlight-box-yellow">
              <div className="highlight-text-yellow">### 📚 **Students Needing Support:**</div>
              <div className="highlight-text-yellow">1. **10HPS18:** 44.6%</div>
            </div>
            <p style={{ margin: '8px 0', color: '#4b5563' }}>
              2. <strong>10HPS17:</strong> 50.1% 3. <strong>10HPS20:</strong> 52.2%
            </p>
          </div>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">💪 Strongest Topics:</h4>
          <div className="summary-list-none">
            <div className="highlight-box highlight-box-green">
              <div className="highlight-text-green">1. **Coordinate Geometry:** 71.4%</div>
            </div>
            <p style={{ margin: '8px 0', color: '#4b5563' }}>
              2. <strong>Algebra - Rational Functions:</strong> 64.0% 3. <strong>Probability:</strong> 60.8%
            </p>
          </div>
        </div>

        <div className="summary-section">
          <h4 className="subsection-title">🔍 Topics Needing Attention:</h4>
          <div className="summary-list-none">
            <div className="highlight-box highlight-box-red">
              <div className="highlight-text-red">1. **Algebra - Linear Equations:** 46.7%</div>
            </div>
            <p style={{ margin: '8px 0', color: '#4b5563' }}>
              2. <strong>Calculus - Derivatives:</strong> 52.2% 3. <strong>Statistics:</strong> 56.4%
            </p>
          </div>
        </div>

        <div>
          <h4 className="subsection-title">💡 Recommendations:</h4>
          <div className="highlight-box highlight-box-cyan">
            <div className="highlight-text-cyan">- 📝 **Focus on Classwork:** Class performs 10.2% better on homework. Consider reinforcing classwork concepts.</div>
          </div>
          <ul className="summary-list">
            <li>🎯 <strong>Priority Topics:</strong> Focus additional instruction on Algebra - Linear Equations, Calculus - Derivatives, Statistics.</li>
            <li>⚠️ <strong>Support Needed:</strong> 33 assignments show grades D or F. Consider additional support strategies.</li>
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