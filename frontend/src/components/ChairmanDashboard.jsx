import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axiosInstance from '../api/axiosInstance';
import './ChairmanDashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const ChairmanDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('daily-report');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dashboard data states
  const [dashboardData, setDashboardData] = useState({
    totalHomeworks: 9,
    totalClassworks: 15,
    overallCompletion: 88,
    overallScore: 8.2,
    totalStudents: 1250,
    averageAttendance: 92.5,
    overallPerformance: 85,
    teachersActive: 48
  });

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  // Charts data
  const [dailyActiveUsersData, setDailyActiveUsersData] = useState(null);
  const [weeklyActiveUsersData, setWeeklyActiveUsersData] = useState(null);

  // Sample data for charts
  const mockStudentNames = [
    "Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Gupta", 
    "Arjun Patel", "Sai Reddy", "Reyansh Mishra", "Krishna Yadav",
    "Ananya Sharma", "Diya Singh", "Saanvi Kumar", "Aadhya Gupta"
  ];

  const teachers = ['Dr. Reed', 'Mr. Chen', 'Ms. Desai'];

  useEffect(() => {
    loadDashboardData();
    initializeCharts();
  }, [selectedDate, selectedBlock, selectedClass]);

  const loadDashboardData = async () => {
    // Initialize with enhanced chart data
    setDailyActiveUsersData({
      labels: ['Aug 31', 'Sep 1', 'Sep 2', 'Sep 3', 'Sep 4'],
      datasets: [{
        label: 'Daily Active Users',
        data: [120, 150, 180, 135, 95],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(99, 102, 241, 1)',
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3
      }]
    });

    setWeeklyActiveUsersData({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [{
        label: 'Weekly Active Users',
        data: [400, 420, 510, 400, 460, 530, 440, 520],
        backgroundColor: (context) => {
          const colors = [
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ];
          return colors[context.dataIndex];
        },
        borderColor: 'transparent',
        borderRadius: 12,
        borderSkipped: false
      }]
    });
  };

  const initializeCharts = () => {
    // Charts are initialized in loadDashboardData
  };

  // Render different sections
  const renderDailyReport = () => (
    <Container fluid className="p-0">
      <Row className="mb-4">
        <Col>
          <Card className="filter-card-enhanced">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h4 className="filter-title mb-0">
                    <span className="title-icon">📊</span>
                    Daily Report
                  </h4>
                </Col>
                <Col md={6}>
                  <Row className="g-2">
                    <Col md={4}>
                      <div className="custom-select-wrapper">
                        <Form.Label className="select-label">
                          <i className="fas fa-calendar-day"></i> Date
                        </Form.Label>
                        <div className="animated-select">
                          <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="custom-date-input"
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="custom-select-wrapper">
                        <Form.Label className="select-label">
                          <i className="fas fa-building"></i> Block
                        </Form.Label>
                        <div className="animated-select">
                          <Form.Select
                            value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                            className="custom-select"
                          >
                            <option>Block A</option>
                            <option>Block B</option>
                          </Form.Select>
                          <span className="select-arrow">▼</span>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="custom-select-wrapper">
                        <Form.Label className="select-label">
                          <i className="fas fa-users-class"></i> Class
                        </Form.Label>
                        <div className="animated-select">
                          <Form.Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="custom-select"
                          >
                            <option>All Classes</option>
                            <option>Class 8</option>
                            <option>Class 9</option>
                            <option>Class 10</option>
                          </Form.Select>
                          <span className="select-arrow">▼</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="metric-card-animated metric-homework">
            <div className="metric-icon">
              <i className="fas fa-book"></i>
            </div>
            <Card.Body>
              <h6 className="metric-label">TOTAL HOMEWORKS</h6>
              <h2 className="metric-value">{dashboardData.totalHomeworks}</h2>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card-animated metric-classwork">
            <div className="metric-icon">
              <i className="fas fa-chalkboard"></i>
            </div>
            <Card.Body>
              <h6 className="metric-label">TOTAL CLASSWORKS</h6>
              <h2 className="metric-value">{dashboardData.totalClassworks}</h2>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '85%' }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card-animated metric-completion">
            <div className="metric-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <Card.Body>
              <h6 className="metric-label">OVERALL COMPLETION</h6>
              <h2 className="metric-value">{dashboardData.overallCompletion}%</h2>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: `${dashboardData.overallCompletion}%` }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card-animated metric-score">
            <div className="metric-icon">
              <i className="fas fa-star"></i>
            </div>
            <Card.Body>
              <h6 className="metric-label">OVERALL AVG. SCORE</h6>
              <h2 className="metric-value">{dashboardData.overallScore}/10</h2>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: `${dashboardData.overallScore * 10}%` }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  const renderDashboard = () => (
    <Container fluid className="p-0">
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="metric-card text-center">
            <Card.Body>
              <h6 className="text-muted mb-2 small">TOTAL STUDENTS</h6>
              <h2 className="text-primary mb-0 fw-bold">{dashboardData.totalStudents.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card text-center">
            <Card.Body>
              <h6 className="text-muted mb-2 small">AVERAGE ATTENDANCE</h6>
              <h2 className="text-primary mb-0 fw-bold">{dashboardData.averageAttendance}%</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card text-center">
            <Card.Body>
              <h6 className="text-muted mb-2 small">OVERALL PERFORMANCE</h6>
              <h2 className="text-primary mb-0 fw-bold">{dashboardData.overallPerformance}%</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card text-center">
            <Card.Body>
              <h6 className="text-muted mb-2 small">TEACHERS ACTIVE</h6>
              <h2 className="text-primary mb-0 fw-bold">{dashboardData.teachersActive}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="chart-title mb-3">
                <span className="title-gradient">School-wide Performance Trend</span>
              </h5>
              <div style={{ height: '350px' }}>
                <Line 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Overall Performance %',
                      data: [78, 81, 80, 84, 86, 88],
                      borderColor: 'rgba(99, 102, 241, 1)',
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
                        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
                        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
                        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
                        return gradient;
                      },
                      fill: true,
                      tension: 0.4,
                      borderWidth: 3,
                      pointRadius: 5,
                      pointBackgroundColor: '#fff',
                      pointBorderColor: 'rgba(99, 102, 241, 1)',
                      pointBorderWidth: 2,
                      pointHoverRadius: 7,
                      pointHoverBackgroundColor: 'rgba(99, 102, 241, 1)',
                      pointHoverBorderColor: '#fff',
                      pointHoverBorderWidth: 2
                    }]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                          label: function(context) {
                            return `Performance: ${context.parsed.y}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 70,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                          drawBorder: false
                        },
                        ticks: {
                          color: '#64748b',
                          font: {
                            size: 12
                          },
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          color: '#64748b',
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  const renderEngagement = () => (
    <Container fluid className="p-0">
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="chart-title mb-3">
                <span className="title-gradient">Daily Active Users</span>
              </h5>
              {dailyActiveUsersData ? (
                <div style={{ height: '300px' }}>
                  <Line 
                    data={dailyActiveUsersData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(99, 102, 241, 1)',
                          borderWidth: 1,
                          padding: 12,
                          displayColors: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                          },
                          ticks: {
                            color: '#64748b',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#64748b',
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="chart-title mb-3">
                <span className="title-gradient">Weekly Active Users</span>
              </h5>
              {weeklyActiveUsersData ? (
                <div style={{ height: '300px' }}>
                  <Bar 
                    data={weeklyActiveUsersData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(139, 92, 246, 1)',
                          borderWidth: 1,
                          padding: 12,
                          displayColors: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                          },
                          ticks: {
                            color: '#64748b',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#64748b',
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="attendance-tracker-card">
            <Card.Body>
              <div className="tracker-header">
                <h5 className="tracker-title">
                  <span className="title-icon">👥</span>
                  Student Attendance Tracker
                </h5>
                <div className="tracker-stats">
                  <div className="stat-item">
                    <span className="stat-value">92%</span>
                    <span className="stat-label">Today</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">88%</span>
                    <span className="stat-label">This Week</span>
                  </div>
                </div>
              </div>
              
              <Row className="mb-4 tracker-filters">
                <Col md={3}>
                  <div className="filter-group">
                    <Form.Label className="filter-label">
                      <i className="fas fa-building"></i> Block
                    </Form.Label>
                    <Form.Select className="filter-select">
                      <option>Block A</option>
                      <option>Block B</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="filter-group">
                    <Form.Label className="filter-label">
                      <i className="fas fa-graduation-cap"></i> Class
                    </Form.Label>
                    <Form.Select className="filter-select">
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button className="submit-button">
                    <i className="fas fa-search"></i> SEARCH
                  </Button>
                </Col>
              </Row>
              
              <div className="attendance-table-wrapper">
                <Table className="attendance-table">
                  <thead>
                    <tr>
                      <th className="student-name-header">
                        <i className="fas fa-user-graduate"></i> STUDENT NAME
                      </th>
                      <th className="day-header">MON</th>
                      <th className="day-header">TUE</th>
                      <th className="day-header">WED</th>
                      <th className="day-header">THU</th>
                      <th className="day-header">FRI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudentNames.map((name, index) => (
                      <tr key={index} className="student-row">
                        <td className="student-name">
                          <div className="student-avatar">
                            {name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{name}</span>
                        </td>
                        <td className="attendance-cell">
                          <div className="custom-checkbox">
                            <Form.Check 
                              type="checkbox" 
                              defaultChecked={Math.random() > 0.2}
                              className="attendance-check"
                            />
                          </div>
                        </td>
                        <td className="attendance-cell">
                          <div className="custom-checkbox">
                            <Form.Check 
                              type="checkbox" 
                              defaultChecked={Math.random() > 0.2}
                              className="attendance-check"
                            />
                          </div>
                        </td>
                        <td className="attendance-cell">
                          <div className="custom-checkbox">
                            <Form.Check 
                              type="checkbox" 
                              defaultChecked={Math.random() > 0.2}
                              className="attendance-check"
                            />
                          </div>
                        </td>
                        <td className="attendance-cell">
                          <div className="custom-checkbox">
                            <Form.Check 
                              type="checkbox" 
                              defaultChecked={Math.random() > 0.2}
                              className="attendance-check"
                            />
                          </div>
                        </td>
                        <td className="attendance-cell">
                          <div className="custom-checkbox">
                            <Form.Check 
                              type="checkbox" 
                              defaultChecked={Math.random() > 0.2}
                              className="attendance-check"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  const renderTeacherAnalytics = () => {
    const workloadData = {
      labels: teachers,
      datasets: [
        {
          label: 'Homeworks',
          data: [15, 12, 18],
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Classworks',
          data: [30, 25, 35],
          backgroundColor: '#8b5cf6'
        }
      ]
    };

    const performanceData = {
      labels: teachers,
      datasets: [
        {
          label: 'HW Performance',
          data: [88, 85, 90],
          backgroundColor: '#10b981'
        },
        {
          label: 'CW Performance',
          data: [92, 89, 94],
          backgroundColor: '#60a5fa'
        }
      ]
    };

    const interventionData = {
      labels: ['Taking Action', 'No Action'],
      datasets: [{
        data: [35, 13],
        backgroundColor: ['#22c55e', '#ef4444'],
        hoverOffset: 4
      }]
    };

    return (
      <Container fluid className="p-0">
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Workload Distribution</h5>
                <div style={{ height: '300px' }}>
                  <Bar 
                    data={workloadData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3">
          <Col lg={8}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Performance vs Work Type</h5>
                <div style={{ height: '250px' }}>
                  <Bar 
                    data={performanceData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="text-center">
              <Card.Body>
                <h5 className="mb-3">Low-Performer Intervention</h5>
                <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut 
                    data={interventionData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
                <p className="text-muted mt-3 small">Percentage of teachers taking action</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

  const renderChatbot = () => (
    <Container fluid className="p-0">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-secondary text-white p-2 rounded" style={{ maxWidth: '70%' }}>
                    Hello! How can I help you with the school data today?
                  </div>
                </div>
              </div>
              
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Button variant="outline-primary" size="sm" className="w-100">
                    Best progress by class?
                  </Button>
                </Col>
                <Col md={6}>
                  <Button variant="outline-primary" size="sm" className="w-100">
                    Which teacher gives the most homework?
                  </Button>
                </Col>
                <Col md={6}>
                  <Button variant="outline-primary" size="sm" className="w-100">
                    Who is missing homework regularly?
                  </Button>
                </Col>
                <Col md={6}>
                  <Button variant="outline-primary" size="sm" className="w-100">
                    Top performing students this week?
                  </Button>
                </Col>
              </Row>
              
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Ask a question..."
                />
                <Button variant="primary">Send</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'daily-report': return renderDailyReport();
      case 'dashboard': return renderDashboard();
      case 'engagement': return renderEngagement();
      case 'teacher-analytics': return renderTeacherAnalytics();
      case 'chatbot': return renderChatbot();
      default: return renderDailyReport();
    }
  };

  return (
    <div className="chairman-dashboard-wrapper">
      <div className="sidebar-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h4>Chairman Panel</h4>
          </div>
          
          <div className="sidebar-menu">
            <button
              className={`sidebar-item ${activeTab === 'daily-report' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily-report')}
            >
              <i className="fas fa-chart-line me-2"></i>
              Daily Report
            </button>
            <button
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fas fa-tachometer-alt me-2"></i>
              Dashboard
            </button>
            <button
              className={`sidebar-item ${activeTab === 'engagement' ? 'active' : ''}`}
              onClick={() => setActiveTab('engagement')}
            >
              <i className="fas fa-users me-2"></i>
              Engagement
            </button>
            <button
              className={`sidebar-item ${activeTab === 'teacher-analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('teacher-analytics')}
            >
              <i className="fas fa-chalkboard-teacher me-2"></i>
              Teacher Analytics
            </button>
            <button
              className={`sidebar-item ${activeTab === 'chatbot' ? 'active' : ''}`}
              onClick={() => setActiveTab('chatbot')}
            >
              <i className="fas fa-robot me-2"></i>
              Chatbot
            </button>
          </div>
        </div>
      </div>

      <div className="main-content-container">
        <div className="content-header-fixed">
          <h2>School Performance Analytics</h2>
          <p>Comprehensive insights and management dashboard</p>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChairmanDashboard;