import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/ReportsAnalytics.css';

import {
  faChartLine,
  faFilter,
  faCalendar,
  faUsers,
  faGraduationCap,
  faChalkboardTeacher,
  faTrophy,
  faFileAlt,
  faChartBar,
  faChartPie,
  faSchool,
  faBookOpen,
  faSearch,
  faTimes,
  faEye,
  faRefresh,
  faBook
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
  Cell,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [filters, setFilters] = useState({
    dateRange: 'monthly',
    selectedClasses: [],
    selectedSections: [],
    selectedSubjects: [],
    academicYear: '2024-25',
    examType: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced data structures with class, section, and subject breakdowns
  const classesData = [
    { id: '9', name: 'Class 9', sections: ['A', 'B', 'C'] },
    { id: '10', name: 'Class 10', sections: ['A', 'B', 'C'] },
    { id: '11', name: 'Class 11', sections: ['A', 'B'] },
    { id: '12', name: 'Class 12', sections: ['A', 'B'] }
  ];

  const subjectsData = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics'
  ];

  // Comprehensive performance data by class, section, and subject
  const [performanceData, setPerformanceData] = useState([
    { class: '9-A', math: 85, science: 78, english: 88, hindi: 82, social: 80, avgAttendance: 94, totalStudents: 35 },
    { class: '9-B', math: 83, science: 81, english: 85, hindi: 79, social: 82, avgAttendance: 92, totalStudents: 33 },
    { class: '9-C', math: 87, science: 75, english: 90, hindi: 85, social: 78, avgAttendance: 91, totalStudents: 32 },
    { class: '10-A', math: 91, science: 85, english: 89, hindi: 88, social: 85, avgAttendance: 96, totalStudents: 30 },
    { class: '10-B', math: 88, science: 87, english: 87, hindi: 84, social: 89, avgAttendance: 89, totalStudents: 28 },
    { class: '10-C', math: 85, science: 82, english: 91, hindi: 86, social: 83, avgAttendance: 93, totalStudents: 31 },
    { class: '11-A', math: 92, science: 89, english: 85, hindi: 87, social: 91, avgAttendance: 92, totalStudents: 25 },
    { class: '11-B', math: 89, science: 91, english: 88, hindi: 83, social: 87, avgAttendance: 95, totalStudents: 27 },
    { class: '12-A', math: 94, science: 92, english: 90, hindi: 89, social: 93, avgAttendance: 95, totalStudents: 22 },
    { class: '12-B', math: 91, science: 90, english: 93, hindi: 91, social: 89, avgAttendance: 94, totalStudents: 24 }
  ]);

  // Teacher performance by subject and class
  const teacherPerformanceData = [
    { teacher: 'Dr. Priya Sharma', subject: 'Mathematics', classes: ['9-A', '10-A'], rating: 9.2, avgPerformance: 88 },
    { teacher: 'Mr. Rajesh Kumar', subject: 'Science', classes: ['9-B', '10-B'], rating: 8.8, avgPerformance: 84 },
    { teacher: 'Ms. Anita Singh', subject: 'English', classes: ['9-C', '11-A'], rating: 9.0, avgPerformance: 87 },
    { teacher: 'Dr. Vikram Patel', subject: 'Physics', classes: ['11-A', '12-A'], rating: 9.5, avgPerformance: 91 },
    { teacher: 'Mrs. Meera Joshi', subject: 'Chemistry', classes: ['11-B', '12-B'], rating: 9.1, avgPerformance: 89 },
    { teacher: 'Mr. Arjun Gupta', subject: 'Biology', classes: ['11-A', '12-A'], rating: 8.9, avgPerformance: 86 }
  ];

  // Subject-wise performance trends
  const subjectTrendsData = [
    { month: 'Jan', Mathematics: 85, Science: 78, English: 88, Hindi: 82, 'Social Studies': 80 },
    { month: 'Feb', Mathematics: 87, Science: 80, English: 90, Hindi: 84, 'Social Studies': 82 },
    { month: 'Mar', Mathematics: 89, Science: 83, English: 87, Hindi: 86, 'Social Studies': 84 },
    { month: 'Apr', Mathematics: 91, Science: 85, English: 89, Hindi: 88, 'Social Studies': 86 },
    { month: 'May', Mathematics: 88, Science: 87, English: 91, Hindi: 85, 'Social Studies': 88 },
    { month: 'Jun', Mathematics: 92, Science: 89, English: 93, Hindi: 87, 'Social Studies': 90 }
  ];

  // Apply filters to data
  const getFilteredData = () => {
    let filteredData = [...performanceData];

    if (filters.selectedClasses.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.selectedClasses.some(cls => item.class.startsWith(cls))
      );
    }

    if (filters.selectedSections.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.selectedSections.some(section => item.class.endsWith(section))
      );
    }

    return filteredData;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleMultiSelectFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'monthly',
      selectedClasses: [],
      selectedSections: [],
      selectedSubjects: [],
      academicYear: '2024-25',
      examType: 'all'
    });
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Chart color schemes
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderAdvancedFilters = () => (
    <div className={`advanced-filters ${showAdvancedFilters ? 'show' : ''}`}>
      <div className="filters-grid">
        {/* Class Filter */}
        <div className="filter-group">
          <label className="filter-label">Classes</label>
          <div className="filter-checkboxes">
            {classesData.map(cls => (
              <label key={cls.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.selectedClasses.includes(cls.id)}
                  onChange={() => handleMultiSelectFilter('selectedClasses', cls.id)}
                />
                <span>{cls.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section Filter */}
        <div className="filter-group">
          <label className="filter-label">Sections</label>
          <div className="filter-checkboxes">
            {['A', 'B', 'C'].map(section => (
              <label key={section} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.selectedSections.includes(section)}
                  onChange={() => handleMultiSelectFilter('selectedSections', section)}
                />
                <span>Section {section}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="filter-group">
          <label className="filter-label">Subjects</label>
          <div className="filter-checkboxes">
            {subjectsData.slice(0, 5).map(subject => (
              <label key={subject} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.selectedSubjects.includes(subject)}
                  onChange={() => handleMultiSelectFilter('selectedSubjects', subject)}
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label className="filter-label">Academic Year</label>
          <select 
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
            className="filter-select"
          >
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </select>
        </div>

        {/* Exam Type */}
        <div className="filter-group">
          <label className="filter-label">Exam Type</label>
          <select 
            value={filters.examType}
            onChange={(e) => handleFilterChange('examType', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Exams</option>
            <option value="unit">Unit Tests</option>
            <option value="midterm">Mid-term</option>
            <option value="final">Final Exams</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button onClick={clearFilters} className="filter-btn outline">
          <FontAwesomeIcon icon={faTimes} />
          Clear Filters
        </button>
        <button onClick={refreshData} className="filter-btn primary">
          <FontAwesomeIcon icon={faRefresh} />
          Refresh Data
        </button>
      </div>
    </div>
  );

  const renderOverviewReport = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="report-content">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="card-content">
              <h3>Total Students</h3>
              <span className="card-value">
                {filteredData.reduce((sum, item) => sum + item.totalStudents, 0)}
              </span>
              <span className="card-subtitle">
                Across {filteredData.length} classes
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div className="card-content">
              <h3>Average Performance</h3>
              <span className="card-value">
                {(filteredData.reduce((sum, item) => sum + ((item.math + item.science + item.english + item.hindi + item.social) / 5), 0) / filteredData.length).toFixed(1)}%
              </span>
              <span className="card-subtitle">All subjects</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="card-content">
              <h3>Average Attendance</h3>
              <span className="card-value">
                {(filteredData.reduce((sum, item) => sum + item.avgAttendance, 0) / filteredData.length).toFixed(1)}%
              </span>
              <span className="card-subtitle">Class-wise average</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faSchool} />
            </div>
            <div className="card-content">
              <h3>Classes Analyzed</h3>
              <span className="card-value">{filteredData.length}</span>
              <span className="card-subtitle">With current filters</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Class-wise Performance Comparison */}
          <div className="chart-container large">
            <h3>Class-wise Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="math" fill="#3b82f6" name="Mathematics" />
                <Bar dataKey="science" fill="#10b981" name="Science" />
                <Bar dataKey="english" fill="#f59e0b" name="English" />
                <Bar dataKey="hindi" fill="#ef4444" name="Hindi" />
                <Bar dataKey="social" fill="#8b5cf6" name="Social Studies" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Performance Trends */}
          <div className="chart-container large">
            <h3>Subject Performance Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={subjectTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Mathematics" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Science" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="English" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Hindi" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Social Studies" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance vs Performance */}
          <div className="chart-container">
            <h3>Attendance vs Performance Correlation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgAttendance" fill="#10b981" name="Attendance %" />
                <Line yAxisId="right" type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={2} name="Math Score" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Class Strength Distribution */}
          <div className="chart-container">
            <h3>Class Strength Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData.map(item => ({
                    name: item.class,
                    value: item.totalStudents,
                    fill: colors[filteredData.indexOf(item) % colors.length]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="detailed-table">
          <h3>Detailed Performance Data</h3>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Math</th>
                  <th>Science</th>
                  <th>English</th>
                  <th>Hindi</th>
                  <th>Social</th>
                  <th>Attendance</th>
                  <th>Overall Avg</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.class}</td>
                    <td>{item.totalStudents}</td>
                    <td>{item.math}%</td>
                    <td>{item.science}%</td>
                    <td>{item.english}%</td>
                    <td>{item.hindi}%</td>
                    <td>{item.social}%</td>
                    <td>{item.avgAttendance}%</td>
                    <td>{((item.math + item.science + item.english + item.hindi + item.social) / 5).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTeacherReport = () => (
    <div className="report-content">
      <h3>Teacher Performance Analysis</h3>
      <div className="charts-grid">
        <div className="chart-container large">
          <h4>Teacher Ratings by Subject</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={teacherPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="teacher" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#3b82f6" name="Teacher Rating" />
              <Bar dataKey="avgPerformance" fill="#10b981" name="Avg Student Performance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSubjectReport = () => (
    <div className="report-content">
      <h3>Subject-wise Analysis</h3>
      <div className="charts-grid">
        <div className="chart-container large">
          <h4>Subject Performance Across All Classes</h4>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={subjectTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Mathematics" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="Science" stackId="1" stroke="#10b981" fill="#10b981" />
              <Area type="monotone" dataKey="English" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              <Area type="monotone" dataKey="Hindi" stackId="1" stroke="#ef4444" fill="#ef4444" />
              <Area type="monotone" dataKey="Social Studies" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reports-analytics">
      {/* Header with Filters */}
      <div className="reports-header">
        <div className="reports-header-content">
          <div className="reports-title-section">
            <h1>Reports & Analytics</h1>
            <p>Comprehensive reporting and data analytics with advanced filtering</p>
          </div>
          <div className="reports-header-actions">
            <select 
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="reports-date-select"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
            <button 
              className={`reports-filter-btn ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Advanced Filters
            </button>
            <button 
              onClick={refreshData} 
              className="reports-refresh-btn"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faRefresh} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {renderAdvancedFilters()}

      {/* Active Filters Display */}
      {(filters.selectedClasses.length > 0 || filters.selectedSections.length > 0 || filters.selectedSubjects.length > 0) && (
        <div className="active-filters">
          <span className="filter-label">Active Filters:</span>
          {filters.selectedClasses.map(cls => (
            <span key={cls} className="filter-tag">
              Class {cls}
              <button onClick={() => handleMultiSelectFilter('selectedClasses', cls)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </span>
          ))}
          {filters.selectedSections.map(section => (
            <span key={section} className="filter-tag">
              Section {section}
              <button onClick={() => handleMultiSelectFilter('selectedSections', section)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </span>
          ))}
          {filters.selectedSubjects.map(subject => (
            <span key={subject} className="filter-tag">
              {subject}
              <button onClick={() => handleMultiSelectFilter('selectedSubjects', subject)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </span>
          ))}
        </div>
      )}

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
            className={`nav-tab ${selectedReport === 'teacher' ? 'active' : ''}`}
            onClick={() => setSelectedReport('teacher')}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} />
            Teacher Analysis
          </button>
          <button 
            className={`nav-tab ${selectedReport === 'subject' ? 'active' : ''}`}
            onClick={() => setSelectedReport('subject')}
          >
            <FontAwesomeIcon icon={faBook} />
            Subject Analysis
          </button>
        </div>
      </div>

      {/* Report Content */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading report data...</p>
        </div>
      ) : (
        <>
          {selectedReport === 'overview' && renderOverviewReport()}
          {selectedReport === 'teacher' && renderTeacherReport()}
          {selectedReport === 'subject' && renderSubjectReport()}
        </>
      )}
    </div>
  );
};

export default ReportsAnalytics;