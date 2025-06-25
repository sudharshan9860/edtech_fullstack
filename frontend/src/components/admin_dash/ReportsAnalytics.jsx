// src/components/admin/ReportsAnalytics.jsx
//no css no functionality


import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faDownload,
  faFilter,
  faCalendar,
  faUsers,
  faGraduationCap,
  faChalkboardTeacher,
  faTrophy,
  faFileAlt,
  faChartBar,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './admin.css';

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('monthly');

  // Sample data for charts
  const studentPerformanceData = [
    { month: 'Jan', math: 85, science: 78, english: 88, hindi: 82 },
    { month: 'Feb', math: 87, science: 80, english: 90, hindi: 84 },
    { month: 'Mar', math: 89, science: 83, english: 87, hindi: 86 },
    { month: 'Apr', math: 91, science: 85, english: 89, hindi: 88 },
    { month: 'May', math: 88, science: 87, english: 91, hindi: 85 },
    { month: 'Jun', math: 92, science: 89, english: 93, hindi: 87 }
  ];

  const attendanceData = [
    { class: '9-A', attendance: 94 },
    { class: '9-B', attendance: 91 },
    { class: '10-A', attendance: 96 },
    { class: '10-B', attendance: 89 },
    { class: '11-A', attendance: 92 },
    { class: '12-A', attendance: 95 }
  ];

  const gradeDistribution = [
    { name: 'A+', value: 25, color: '#10b981' },
    { name: 'A', value: 35, color: '#3b82f6' },
    { name: 'B+', value: 20, color: '#f59e0b' },
    { name: 'B', value: 15, color: '#ef4444' },
    { name: 'C', value: 5, color: '#6b7280' }
  ];

  const teacherPerformanceData = [
    { teacher: 'Dr. Priya', rating: 9.2, students: 85 },
    { teacher: 'Mr. Rajesh', rating: 8.8, students: 78 },
    { teacher: 'Ms. Anita', rating: 9.0, students: 92 },
    { teacher: 'Dr. Vikram', rating: 9.5, students: 65 }
  ];

  const reports = [
    {
      key: 'overview',
      title: 'School Overview',
      description: 'Comprehensive overview of school performance',
      icon: faChartLine
    },
    {
      key: 'academic',
      title: 'Academic Performance',
      description: 'Student performance across subjects',
      icon: faGraduationCap
    },
    {
      key: 'attendance',
      title: 'Attendance Report',
      description: 'Student and teacher attendance analytics',
      icon: faUsers
    },
    {
      key: 'teacher',
      title: 'Teacher Performance',
      description: 'Teacher evaluation and performance metrics',
      icon: faChalkboardTeacher
    },
    {
      key: 'financial',
      title: 'Financial Report',
      description: 'School financial summary and analysis',
      icon: faFileAlt
    },
    {
      key: 'achievements',
      title: 'Achievements Report',
      description: 'Student achievements and recognition',
      icon: faTrophy
    }
  ];

  const renderOverviewReport = () => (
    <div className="report-content">
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Student Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="science" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="english" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="hindi" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Class-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Teacher Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="teacher" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReportsList = () => (
    <div className="reports-list">
      <div className="reports-grid">
        {reports.map(report => (
          <div 
            key={report.key} 
            className={`report-card ${selectedReport === report.key ? 'active' : ''}`}
            onClick={() => setSelectedReport(report.key)}
          >
            <div className="report-header">
              <FontAwesomeIcon icon={report.icon} className="report-icon" />
              <h3>{report.title}</h3>
            </div>
            <p className="report-description">{report.description}</p>
            <div className="report-actions">
              <button className="btn btn-sm btn-primary">
                <FontAwesomeIcon icon={faChartBar} />
                View Report
              </button>
              <button className="btn btn-sm btn-outline">
                <FontAwesomeIcon icon={faDownload} />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="reports-analytics">
      <div className="page-header">
        <div className="header-content">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive reporting and data analytics</p>
        </div>
        <div className="header-actions">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faFilter} />
            Advanced Filters
          </button>
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faDownload} />
            Export All
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="report-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${selectedReport === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedReport('overview')}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Overview Dashboard
          </button>
          <button 
            className={`nav-tab ${selectedReport === 'reports' ? 'active' : ''}`}
            onClick={() => setSelectedReport('reports')}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            All Reports
          </button>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && renderOverviewReport()}
      {selectedReport === 'reports' && renderReportsList()}

      {/* Key Metrics Summary */}
      <div className="metrics-summary">
        <h3>Key Performance Indicators</h3>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="kpi-content">
              <h4>Student Enrollment</h4>
              <span className="kpi-value">2,847</span>
              <span className="kpi-change positive">+8.2%</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div className="kpi-content">
              <h4>Average Performance</h4>
              <span className="kpi-value">87.3%</span>
              <span className="kpi-change positive">+2.1%</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="kpi-content">
              <h4>Attendance Rate</h4>
              <span className="kpi-value">94.2%</span>
              <span className="kpi-change positive">+1.5%</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </div>
            <div className="kpi-content">
              <h4>Teacher Satisfaction</h4>
              <span className="kpi-value">9.1/10</span>
              <span className="kpi-change positive">+0.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="recent-reports">
        <h3>Recently Generated Reports</h3>
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly Performance Report</td>
                <td>Academic</td>
                <td>June 20, 2024</td>
                <td><span className="status-badge success">Completed</span></td>
                <td>
                  <button className="btn btn-sm btn-outline">
                    <FontAwesomeIcon icon={faDownload} />
                    Download
                  </button>
                </td>
              </tr>
              <tr>
                <td>Attendance Summary</td>
                <td>Attendance</td>
                <td>June 18, 2024</td>
                <td><span className="status-badge success">Completed</span></td>
                <td>
                  <button className="btn btn-sm btn-outline">
                    <FontAwesomeIcon icon={faDownload} />
                    Download
                  </button>
                </td>
              </tr>
              <tr>
                <td>Teacher Evaluation Report</td>
                <td>Performance</td>
                <td>June 15, 2024</td>
                <td><span className="status-badge info">Processing</span></td>
                <td>
                  <button className="btn btn-sm btn-outline" disabled>
                    <FontAwesomeIcon icon={faDownload} />
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;