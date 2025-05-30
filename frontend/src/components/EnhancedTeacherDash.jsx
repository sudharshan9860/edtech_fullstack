import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Sector, LineChart, Line, Area, AreaChart
} from 'recharts';
import './EnhancedTeacherDash.css';
import axiosInstance from '../api/axiosInstance';
import TeacherDashboard from './TeacherDashboard';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const ERROR_COLORS = {
  Conceptual: '#ef4444',
  Computational: '#f97316', 
  Careless: '#eab308',
  'No Error': '#22c55e'
};

// Mock data for new analytics features
const generateAnalyticsData = () => {
  return {
    weeklyEfficiency: [
      { week: 'May 01 - May 01', date: 'May 01', efficiency: 76, tasksCompleted: 45, avgTime: 2.1 },
      { week: 'May 08 - May 08', date: 'May 08', efficiency: 82, tasksCompleted: 52, avgTime: 1.8 },
      { week: 'May 15 - May 15', date: 'May 15', efficiency: 84, tasksCompleted: 58, avgTime: 1.7 },
      { week: 'May 22 - May 22', date: 'May 22', efficiency: 78, tasksCompleted: 48, avgTime: 2.2 },
      { week: 'May 29 - May 29', date: 'May 29', efficiency: 74, tasksCompleted: 42, avgTime: 2.5 }
    ],
    
    // Updated error data - simplified to just Conceptual and No Error
    errorTypesByWeek: [
      { 
        week: 'May 01 - May 01', 
        Conceptual: 80, 
        'No Error': 20
      },
      { 
        week: 'May 08 - May 08', 
        Conceptual: 78, 
        'No Error': 22
      },
      { 
        week: 'May 15 - May 15', 
        Conceptual: 60, 
        'No Error': 40
      },
      { 
        week: 'May 22 - May 22', 
        Conceptual: 75, 
        'No Error': 20
      },
      { 
        week: 'May 29 - May 29', 
        Conceptual: 62, 
        'No Error': 38
      }
    ],

    chapterPerformanceOverTime: [
      { 
        date: 'May 01', 
        Chapter1: 90, Chapter2: 85, Chapter3: 60, Chapter4: 75, Chapter5: 88,
        Chapter6: 92, Chapter7: 78, Chapter8: 82, Chapter9: 70, 
        overallAverage: 78.4 
      },
      { 
        date: 'May 08', 
        Chapter1: 92, Chapter2: 88, Chapter3: 68, Chapter4: 78, Chapter5: 90,
        Chapter6: 89, Chapter7: 85, Chapter8: 85, Chapter9: 72, 
        overallAverage: 80.1 
      },
      { 
        date: 'May 15', 
        Chapter1: 95, Chapter2: 90, Chapter3: 82, Chapter4: 85, Chapter5: 93,
        Chapter6: 94, Chapter7: 88, Chapter8: 88, Chapter9: 78, 
        overallAverage: 84.2 
      },
      { 
        date: 'May 22', 
        Chapter1: 93, Chapter2: 87, Chapter3: 75, Chapter4: 82, Chapter5: 91,
        Chapter6: 91, Chapter7: 85, Chapter8: 86, Chapter9: 75, 
        overallAverage: 82.8 
      },
      { 
        date: 'May 29', 
        Chapter1: 88, Chapter2: 83, Chapter3: 70, Chapter4: 78, Chapter5: 87,
        Chapter6: 85, Chapter7: 82, Chapter8: 83, Chapter9: 72, 
        overallAverage: 79.5 
      }
    ],

    aiGeneratedReport: {
      weeklyAnalysis: {
        averageEfficiency: 78.4,
        peakWeek: "May 15",
        lowestWeek: "May 29",
        timeConsistency: "2.0 minutes average",
        trend: "fluctuating"
      },
      chapterAnalysis: {
        strongestChapters: ["Chapter 1: 90.0%", "Chapter 6: 93.3%"],
        weakestChapters: ["Chapter 2: 67.5%", "Chapter 3: 70.0%", "Chapter 9: 70.0%"],
        needsFocus: ["Chapter 4", "Chapter 5", "Chapter 7", "Chapter 8"]
      },
      errorAnalysis: {
        conceptualErrors: 72.0,
        noErrors: 28.0,
        recommendations: [
          "Conceptual errors account for 72.0% of errors, indicating need for improved understanding",
          "No errors account for 28.0% of cases, suggesting significant proportion of accurate completion"
        ]
      }
    }
  };
};

// Custom active shape for pie chart
const renderActiveShape = (props) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value 
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const EnhancedTeacherDash = () => {
  const [analyticsData] = useState(generateAnalyticsData());
  const [selectedClass, setSelectedClass] = useState({ id: 1, name: "Class 6" });
  const [activeTab, setActiveTab] = useState('class');
  const [showReport, setShowReport] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Original mock data (keeping existing functionality)
  const classes = [
    { id: 1, name: "Class 6" },
    { id: 2, name: "Class 7" },
    { id: 3, name: "Class 8" },
    { id: 4, name: "Class 9" },
    { id: 5, name: "Class 10" },
    { id: 6, name: "Class 11" },
    { id: 7, name: "Class 12" },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/allstudents/");
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axiosInstance.get(`/student/${studentId}`);
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentDetails(student.id);
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleAssignmentSubmit = async (assignment) => {
    try {

      const response = await axiosInstance.post('/add-homework/', assignment);
      // console.log('Assignment created:', response.data);
      setAssignments(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const renderAIGeneratedReport = () => {
    const report = analyticsData.aiGeneratedReport;
    
    return (
      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">📊 AI-Generated Performance Report</div>
          <div className="cardDescription">Comprehensive weekly analysis with insights and recommendations</div>
        </div>
        <div className="cardContent">
          <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
            <h4 className="mb4">Weekly Efficiency and Performance Report</h4>
            
            <div className="mb4">
              <h5 style={{ color: '#0284c7' }}>📈 Weekly Efficiency Analysis:</h5>
              <p>The weekly efficiency data reveals a fluctuating trend, with efficiency scores ranging from 74.0% to 84.0%. 
              The average efficiency score over the five weeks is {report.weeklyAnalysis.averageEfficiency}%, which is also reflected in the "Overall Efficiency Average" chapter-wise performance.</p>
              
              <ul style={{ marginLeft: '20px' }}>
                <li><strong>Week {report.weeklyAnalysis.peakWeek}</strong> had the highest efficiency score average (84.0%), indicating a peak in performance.</li>
                <li><strong>Week {report.weeklyAnalysis.lowestWeek}</strong> had the lowest efficiency score average (74.0%), suggesting a decline in performance.</li>
                <li>The time taken to complete tasks has remained within the allocated time frame throughout the five weeks.</li>
              </ul>
            </div>

            <div className="mb4">
              <h5 style={{ color: '#0284c7' }}>📚 Chapter-wise Performance Analysis:</h5>
              <p>The chapter-wise performance data provides a more detailed understanding of the strengths and weaknesses in specific areas. The average efficiency scores for each chapter are:</p>
              
              <div className="flex flexCol gap2 mb2">
                <div><strong>Areas of Strength:</strong></div>
                {report.chapterAnalysis.strongestChapters.map((chapter, index) => (
                  <div key={index} style={{ marginLeft: '15px', color: '#22c55e' }}>• {chapter} (highest)</div>
                ))}
              </div>

              <div className="flex flexCol gap2 mb2">
                <div><strong>Areas for Improvement:</strong></div>
                {report.chapterAnalysis.weakestChapters.map((chapter, index) => (
                  <div key={index} style={{ marginLeft: '15px', color: '#ef4444' }}>• {chapter} (lowest)</div>
                ))}
              </div>
            </div>

            <div className="mb4">
              <h5 style={{ color: '#0284c7' }}>🎯 Error Type Distribution Analysis:</h5>
              <div className="flex flexCol gap2">
                {report.errorAnalysis.recommendations.map((rec, index) => (
                  <div key={index} style={{ marginLeft: '15px' }}>• {rec}</div>
                ))}
              </div>
            </div>

            <div className="mb4">
              <h5 style={{ color: '#0284c7' }}>💡 Conclusion and Recommendations:</h5>
              <p>Based on the analysis, the following conclusions and recommendations can be made:</p>
              <ul style={{ marginLeft: '20px' }}>
                <li>The overall efficiency average of {report.weeklyAnalysis.averageEfficiency}% indicates a solid performance level.</li>
                <li>Chapters {report.chapterAnalysis.strongestChapters.join(' and ')} are areas of strength with high average efficiency scores.</li>
                <li>Chapters {report.chapterAnalysis.weakestChapters.join(', ')} are areas for improvement with lower average efficiency scores.</li>
                <li>Continued focus and improvement efforts should be directed toward the identified weak areas.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentList = () => {
    return (
      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">👥 Students List</div>
          <div className="cardDescription">Select a student to view detailed analysis</div>
        </div>
        <div className="cardContent">
          <div className="student-list">
            {students.map((student) => (
              <div 
                key={student.id}
                className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => handleStudentSelect(student)}
              >
                <div className="student-avatar">
                  {student.name.charAt(0)}
                </div>
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-class">Class {student.class}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStudentAnalysis = () => {
    if (!selectedStudent || !studentDetails) {
      return (
        <div className="card">
          <div className="cardContent">
            <p>Select a student to view their detailed analysis</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">📊 Student Analysis: {selectedStudent.name}</div>
          <div className="cardDescription">Detailed performance metrics and insights</div>
        </div>
        <div className="cardContent">
          {/* Add student-specific charts and metrics here */}
          <div className="student-metrics">
            <div className="metric-card">
              <div className="metric-value">{studentDetails.overallScore || 'N/A'}%</div>
              <div className="metric-label">Overall Score</div>
            </div>
            {/* Add more metric cards as needed */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="appContainer">
      <div className="mainContent">
        {/* Header */}
        <div className="flex justifyBetween">
          <div className="pageHeader">
            <h1 className="pageTitle">Enhanced Analytics Dashboard</h1>
            <p className="pageSubtitle">Comprehensive performance monitoring and AI-driven insights</p>
          </div>
          
          <div className="flex gap2">
            <button 
              className={`btn ${showReport ? 'btnPrimary' : 'btnOutline'}`}
              onClick={() => setShowReport(!showReport)}
            >
              {showReport ? 'Hide' : 'Show'} AI Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tabButton ${activeTab === 'class' ? 'tabButtonActive' : ''}`}
            onClick={() => setActiveTab('class')}
          >
            Class Analysis
          </button>
          <button 
            className={`tabButton ${activeTab === 'student' ? 'tabButtonActive' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Student Analysis
          </button>
          <button 
            className={`tabButton ${activeTab === 'homework' ? 'tabButtonActive' : ''}`}
            onClick={() => setActiveTab('homework')}
          >
            Homework
          </button>
        </div>
        

        {/* Content based on active tab */}
        {activeTab === 'class' ? (
          <>
            {showReport && renderAIGeneratedReport()}
            {/* Existing class analysis content */}
            <div className="cardGrid">
              {/* Weekly Efficiency Progress */}
              <div className="card wideCard">
                <div className="cardHeader">
                  <div className="cardTitle">📈 Weekly Efficiency Progress</div>
                  <div className="cardDescription">Efficiency Score Progression (Date Range View)</div>
                </div>
                <div className="cardContent">
                  <div style={{height: '300px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.weeklyEfficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'efficiency' ? `${value}%` : value,
                            name === 'efficiency' ? 'Efficiency Score' : 'Tasks Completed'
                          ]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="efficiency" 
                          stroke="#0284c7" 
                          strokeWidth={3}
                          dot={{ fill: '#0284c7', strokeWidth: 2, r: 6 }}
                          name="Efficiency (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Error Types Analysis - Updated with Dark Theme */}
              <div className="card error-analysis-card">
                <div className="cardHeader error-analysis-header">
                  <div className="cardTitle error-analysis-title">
                    🎯 Error Types Analysis
                  </div>
                  <div className="cardDescription">Error Distribution by Week</div>
                </div>
                <div className="cardContent error-analysis-content">
                  <h4 className="error-analysis-subtitle">Error Distribution by Week</h4>
                  <div style={{height: '400px', background: '#2d3748', borderRadius: '8px', padding: '20px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={analyticsData.errorTypesByWeek}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis 
                          dataKey="week" 
                          tick={{ fill: '#e2e8f0', fontSize: 12 }}
                          axisLine={{ stroke: '#4a5568' }}
                          tickLine={{ stroke: '#4a5568' }}
                          angle={0}
                          textAnchor="middle"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fill: '#e2e8f0', fontSize: 12 }}
                          axisLine={{ stroke: '#4a5568' }}
                          tickLine={{ stroke: '#4a5568' }}
                          label={{ 
                            value: 'Percentage (%)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#e2e8f0' }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#2d3748',
                            border: '1px solid #4a5568',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                          }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px',
                            color: '#e2e8f0'
                          }}
                          iconType="rect"
                        />
                        <Bar 
                          dataKey="Conceptual" 
                          fill="#ef4444" 
                          name="Conceptual"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar 
                          dataKey="No Error" 
                          fill="#22c55e" 
                          name="No"
                          radius={[0, 0, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Error Type Legend */}
                  <div className="error-legend">
                    <div className="error-legend-item">
                      <div className="error-legend-color conceptual"></div>
                      <span>Conceptual</span>
                    </div>
                    <div className="error-legend-item">
                      <div className="error-legend-color no-error"></div>
                      <span>No</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter-wise Performance Over Time */}
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">📚 Chapter-wise Performance Over Time</div>
                <div className="cardDescription">Chapter Performance Over Time (Date Range View)</div>
              </div>
              <div className="cardContent">
                <div style={{height: '400px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.chapterPerformanceOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Chapter1" stroke="#0088FE" strokeWidth={2} name="Chapter 1" />
                      <Line type="monotone" dataKey="Chapter2" stroke="#00C49F" strokeWidth={2} name="Chapter 2" />
                      <Line type="monotone" dataKey="Chapter3" stroke="#FFBB28" strokeWidth={2} name="Chapter 3" />
                      <Line type="monotone" dataKey="Chapter4" stroke="#FF8042" strokeWidth={2} name="Chapter 4" />
                      <Line type="monotone" dataKey="Chapter5" stroke="#8884D8" strokeWidth={2} name="Chapter 5" />
                      <Line type="monotone" dataKey="Chapter6" stroke="#82ca9d" strokeWidth={2} name="Chapter 6" />
                      <Line type="monotone" dataKey="Chapter7" stroke="#ffc658" strokeWidth={2} name="Chapter 7" />
                      <Line type="monotone" dataKey="Chapter8" stroke="#ff7c7c" strokeWidth={2} name="Chapter 8" />
                      <Line type="monotone" dataKey="Chapter9" stroke="#8dd1e1" strokeWidth={2} name="Chapter 9" />
                      <Line 
                        type="monotone" 
                        dataKey="overallAverage" 
                        stroke="#000000" 
                        strokeWidth={3} 
                        strokeDasharray="5 5"
                        name="Overall Efficiency Average"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Performance Insights Cards */}
            <div className="cardGrid">
              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">📊 Key Metrics</div>
                </div>
                <div className="cardContent">
                  <div className="flex flexCol gap4">
                    <div className="flex justifyBetween">
                      <span>Average Efficiency:</span>
                      <span className="fontWeightBold" style={{color: '#0284c7'}}>78.4%</span>
                    </div>
                    <div className="flex justifyBetween">
                      <span>Peak Performance Week:</span>
                      <span className="fontWeightBold" style={{color: '#22c55e'}}>May 15 (84%)</span>
                    </div>
                    <div className="flex justifyBetween">
                      <span>Improvement Needed:</span>
                      <span className="fontWeightBold" style={{color: '#ef4444'}}>Chapters 2, 3, 9</span>
                    </div>
                    <div className="flex justifyBetween">
                      <span>Strongest Areas:</span>
                      <span className="fontWeightBold" style={{color: '#22c55e'}}>Chapters 1, 6</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">🎯 Error Analysis Summary</div>
                </div>
                <div className="cardContent">
                  <div className="flex flexCol gap4">
                    <div className="flex justifyBetween">
                      <span>Conceptual Errors:</span>
                      <span className="fontWeightBold" style={{color: ERROR_COLORS.Conceptual}}>72.0%</span>
                    </div>
                    <div className="flex justifyBetween">
                      <span>No Errors:</span>
                      <span className="fontWeightBold" style={{color: ERROR_COLORS['No Error']}}>28.0%</span>
                    </div>
                    <div className="flex justifyBetween">
                      <span>Primary Focus:</span>
                      <span className="fontWeightBold">Concept Understanding</span>
                    </div>
                    <div className="flex justifyBetween">
                      <span>Success Rate:</span>
                      <span className="fontWeightBold" style={{color: '#22c55e'}}>Good Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'student' ? (
          <div className="student-analysis-container">
            <div className="student-sidebar">
              {renderStudentList()}
            </div>
            <div className="student-main-content">
              {renderStudentAnalysis()}
            </div>
          </div>
        ) : (
          <TeacherDashboard 
            user={selectedClass}
            assignments={assignments}
            submissions={submissions}
            onAssignmentSubmit={handleAssignmentSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedTeacherDash;