// src/components/ChairmanDashboard.jsx - Enhanced with Fixed Layout
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Nav, Button, Table, Badge, Modal, Form, Container } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './ChairmanDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChairmanDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedData, setSelectedData] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalStudents: 250,
      totalTeachers: 4,
      totalSections: 8,
      overallAverage: 79.1,
      targetedStudents: 125,
      untargetedStudents: 125,
      monthlyGrowth: 2.3,
      averageEngagement: 83.5,
      budgetUtilization: 68
    },
    studentPerformance: {
      testScoresTrend: [78, 83, 85, 79, 88],
      testLabels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
      gradeDistribution: {
        'A+': 15,
        'A': 25,
        'B+': 30,
        'B': 20,
        'C': 8,
        'F': 2
      }
    },
    teacherAnalytics: {
      engagement: [
        { name: 'John Smith', engagement: 87, students: 32, subjects: ['Math', 'Physics'] },
        { name: 'Sarah Johnson', engagement: 91, students: 28, subjects: ['Chemistry', 'Biology'] },
        { name: 'Michael Brown', engagement: 79, students: 35, subjects: ['English', 'History'] },
        { name: 'Emily Davis', engagement: 84, students: 30, subjects: ['Math', 'Computer Science'] }
      ]
    },
    sections: [
      { id: 1, name: 'Section A', students: 32, teacher: 'John Smith', average: 85, subjects: 4 },
      { id: 2, name: 'Section B', students: 28, teacher: 'Sarah Johnson', average: 91, subjects: 3 },
      { id: 3, name: 'Section C', students: 35, teacher: 'Michael Brown', average: 79, subjects: 5 },
      { id: 4, name: 'Section D', students: 30, teacher: 'Emily Davis', average: 84, subjects: 4 }
    ],
    alerts: [
      { 
        type: 'danger', 
        message: 'Section C (Teacher: Michael Brown) - Performance 79% significantly below target. Immediate intervention required.', 
        priority: 'urgent', 
        timestamp: '2 hours ago',
        action: 'warn_teacher',
        teacher: 'Michael Brown',
        section: 'Section C',
        performance: 79
      },
      { 
        type: 'warning', 
        message: '15 students in Section C need immediate attention in Mathematics - Teacher Michael Brown notified', 
        priority: 'high', 
        timestamp: '4 hours ago',
        action: 'academic_support'
      },
      { 
        type: 'info', 
        message: 'New educational resources available for download', 
        priority: 'medium', 
        timestamp: '6 hours ago' 
      },
      { 
        type: 'success', 
        message: 'Overall improvement of 2.3% this month - Section B leading with 91%', 
        priority: 'low', 
        timestamp: '1 day ago' 
      }
    ]
  });

  const handleShowModal = (type, data = null) => {
    setModalType(type);
    setSelectedData(data);
    setShowModal(true);
  };

  const exportData = (type) => {
    const exportData = {
      timestamp: new Date().toISOString(),
      type: type,
      data: dashboardData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `chairman_${type}_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Chart data configurations
  const trendChartData = {
    labels: dashboardData.studentPerformance.testLabels,
    datasets: [
      {
        label: 'Average Score',
        data: dashboardData.studentPerformance.testScoresTrend,
        borderColor: '#4FACFE',
        backgroundColor: 'rgba(79, 172, 254, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4FACFE',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6
      }
    ]
  };

  const gradeDistributionData = {
    labels: Object.keys(dashboardData.studentPerformance.gradeDistribution),
    datasets: [
      {
        data: Object.values(dashboardData.studentPerformance.gradeDistribution),
        backgroundColor: [
          '#28a745',
          '#4FACFE', 
          '#FFC107',
          '#FF8C00',
          '#FF6384',
          '#DC3545'
        ],
        borderWidth: 3,
        borderColor: '#fff'
      }
    ]
  };

  const renderOverview = () => (
    <div className="overview-section">
      <Container fluid>
        {/* Key Metrics Row */}
        <Row className="mb-4">
          <Col xl={3} md={6}>
            <Card className="metric-card gradient-blue">
              <Card.Body className="text-center">
                <div className="metric-header">
                  <h6>Total Students</h6>
                  <Badge bg="primary" className="trend-badge">+2.3%</Badge>
                </div>
                <div className="metric-value">{dashboardData.overview.totalStudents}</div>
                <small className="text-white-50">Across {dashboardData.overview.totalSections} sections</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="metric-card gradient-green">
              <Card.Body className="text-center">
                <div className="metric-header">
                  <h6>Overall Average</h6>
                  <Badge bg="success" className="trend-badge">+{dashboardData.overview.monthlyGrowth}%</Badge>
                </div>
                <div className="metric-value">{dashboardData.overview.overallAverage}%</div>
                <small className="text-white-50">Above national average</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="metric-card gradient-orange">
              <Card.Body className="text-center">
                <div className="metric-header">
                  <h6>Budget Utilization</h6>
                  <Badge bg="warning" className="trend-badge">{dashboardData.overview.budgetUtilization}%</Badge>
                </div>
                <div className="metric-value">$85K</div>
                <small className="text-white-50">of $125K budget</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="metric-card gradient-purple">
              <Card.Body className="text-center">
                <div className="metric-header">
                  <h6>Avg. Engagement</h6>
                  <Badge bg="info" className="trend-badge">High</Badge>
                </div>
                <div className="metric-value">{dashboardData.overview.averageEngagement}%</div>
                <small className="text-white-50">Excellent participation</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="chart-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="me-3">📈 Performance Trend Analysis</h5>
                  <Button size="sm" variant="outline-primary" onClick={() => exportData('performance')}>
                    Export
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px', position: 'relative' }}>
                  <Line 
                    data={trendChartData} 
                    options={{ 
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'top',
                          labels: {
                            usePointStyle: true,
                            padding: 20
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          grid: {
                            color: 'rgba(0,0,0,0.1)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="chart-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="me-3">🎯 Grade Distribution</h5>
                  <Button size="sm" variant="outline-success" onClick={() => exportData('grades')}>
                    Export
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px', position: 'relative' }}>
                  <Doughnut 
                    data={gradeDistributionData} 
                    options={{ 
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'right',
                          labels: {
                            usePointStyle: true,
                            padding: 15
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

        {/* Alerts and Actions Row */}
        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5>⚠️ Priority Alerts & Notifications</h5>
              </Card.Header>
              <Card.Body>
                {dashboardData.alerts.map((alert, index) => (
                  <div key={index} className={`alert alert-${alert.type}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Badge 
                          bg={alert.priority === 'urgent' ? 'danger' : alert.priority === 'high' ? 'warning' : alert.priority === 'medium' ? 'info' : 'success'} 
                          className="me-2"
                        >
                          {alert.priority.toUpperCase()}
                        </Badge>
                        {alert.message}
                        {alert.action === 'warn_teacher' && (
                          <div className="mt-2">
                            <Button size="sm" variant="danger" className="me-2" onClick={() => handleShowModal('warnTeacher', alert)}>
                              SEND WARNING TO {alert.teacher}
                            </Button>
                            <Button size="sm" variant="warning" onClick={() => handleShowModal('interventionPlan', alert)}>
                              CREATE INTERVENTION PLAN
                            </Button>
                          </div>
                        )}
                      </div>
                      <small className="text-muted">{alert.timestamp}</small>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-3">
                  <Button variant="outline-primary" onClick={() => handleShowModal('allAlerts')}>
                    VIEW ALL ALERTS
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5>⚡ Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => handleShowModal('generateReport')}>
                    GENERATE EXECUTIVE REPORT
                  </Button>
                  <Button variant="success" onClick={() => handleShowModal('scheduleAnnouncement')}>
                    SCHEDULE ANNOUNCEMENT
                  </Button>
                  <Button variant="info" onClick={() => handleShowModal('viewCalendar')}>
                    VIEW ACADEMIC CALENDAR
                  </Button>
                  <Button variant="warning" onClick={() => handleShowModal('budgetOverview')}>
                    BUDGET OVERVIEW
                  </Button>
                  <Button variant="secondary" onClick={() => handleShowModal('systemSettings')}>
                    SYSTEM SETTINGS
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );

  const renderStudentManagement = () => (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>📚 Section-wise Student Management</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Students</th>
                    <th>Teacher</th>
                    <th>Average Score</th>
                    <th>Subjects</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.sections.map((section) => (
                    <tr key={section.id}>
                      <td><strong>{section.name}</strong></td>
                      <td>{section.students}</td>
                      <td>{section.teacher}</td>
                      <td>
                        <Badge bg={section.average >= 85 ? 'success' : section.average >= 80 ? 'warning' : 'danger'}>
                          {section.average}%
                        </Badge>
                      </td>
                      <td>{section.subjects} subjects</td>
                      <td>
                        <Button size="sm" variant="outline-primary" className="me-1" onClick={() => handleShowModal('sectionDetail', section)}>
                          View
                        </Button>
                        <Button size="sm" variant="outline-secondary" onClick={() => handleShowModal('editSection', section)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  const renderTeacherManagement = () => (
    <Container fluid>
      <Row className="mb-4">
        {/* Teacher Performance Overview */}
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5>👨‍🏫 Faculty Performance & Management</h5>
                <Button size="sm" variant="primary" onClick={() => handleShowModal('addTeacher')}>
                  ADD NEW TEACHER
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Section Assigned</th>
                    <th>Students Count</th>
                    <th>Subjects Taught</th>
                    <th>Avg Performance</th>
                    <th>Engagement Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.teacherAnalytics.engagement.map((teacher, index) => {
                    const section = dashboardData.sections.find(s => s.teacher === teacher.name);
                    const isLowPerforming = section && section.average < 80;
                    return (
                      <tr key={index} className={isLowPerforming ? 'table-danger' : section?.average >= 85 ? 'table-success' : ''}>
                        <td>
                          <strong>{teacher.name}</strong>
                          {isLowPerforming && (
                            <Badge bg="danger" className="ms-2">
                              Low Performance
                            </Badge>
                          )}
                        </td>
                        <td>{section?.name || 'Not Assigned'}</td>
                        <td>{teacher.students}</td>
                        <td>
                          {teacher.subjects.map((subject, idx) => (
                            <Badge key={idx} bg="secondary" className="me-1">
                              {subject}
                            </Badge>
                          ))}
                        </td>
                        <td>
                          <Badge bg={section?.average >= 85 ? 'success' : section?.average >= 80 ? 'warning' : 'danger'}>
                            {section?.average || 'N/A'}%
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={teacher.engagement >= 85 ? 'success' : teacher.engagement >= 80 ? 'warning' : 'danger'}>
                            {teacher.engagement}%
                          </Badge>
                        </td>
                        <td>
                          {isLowPerforming ? (
                            <Badge bg="danger">Needs Attention</Badge>
                          ) : section?.average >= 85 ? (
                            <Badge bg="success">Excellent</Badge>
                          ) : (
                            <Badge bg="warning">Good</Badge>
                          )}
                        </td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-1" onClick={() => handleShowModal('teacherDetail', teacher)}>
                            View
                          </Button>
                          {isLowPerforming && (
                            <Button size="sm" variant="outline-danger" onClick={() => handleShowModal('warnTeacher', {...teacher, section: section?.name, performance: section?.average})}>
                              Warn
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Teacher Performance Charts */}
      <Row>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5>📊 Teacher Engagement Comparison</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={{
                    labels: dashboardData.teacherAnalytics.engagement.map(t => t.name.split(' ')[0]),
                    datasets: [
                      {
                        label: 'Engagement Rate',
                        data: dashboardData.teacherAnalytics.engagement.map(t => t.engagement),
                        backgroundColor: dashboardData.teacherAnalytics.engagement.map(t => 
                          t.engagement >= 85 ? '#28a745' : t.engagement >= 80 ? '#ffc107' : '#dc3545'
                        ),
                        borderRadius: 5
                      }
                    ]
                  }} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5>⚠️ Performance Alerts</h5>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-danger">
                <strong>URGENT:</strong> Michael Brown (Section C) - Performance at 79%, 6% below acceptable threshold.
                <div className="mt-2">
                  <Button size="sm" variant="danger" onClick={() => handleShowModal('warnTeacher', {name: 'Michael Brown', section: 'Section C', performance: 79})}>
                    SEND FORMAL WARNING
                  </Button>
                </div>
              </div>
              <div className="alert alert-success">
                <strong>EXCELLENT:</strong> Sarah Johnson maintains highest performance at 91% (Section B).
              </div>
              <div className="alert alert-info">
                <strong>IMPROVEMENT:</strong> John Smith showing consistent engagement at 87%.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  const renderModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'generateReport' && 'Generate Executive Report'}
          {modalType === 'budgetOverview' && 'Budget Overview'}
          {modalType === 'sectionDetail' && `Section Details - ${selectedData?.name}`}
          {modalType === 'teacherDetail' && `Teacher Profile - ${selectedData?.name}`}
          {modalType === 'warnTeacher' && `Performance Warning - ${selectedData?.name}`}
          {modalType === 'interventionPlan' && `Intervention Plan - ${selectedData?.section}`}
          {modalType === 'allAlerts' && 'All System Alerts'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === 'generateReport' && (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select>
                    <option>Executive Summary</option>
                    <option>Performance Analysis</option>
                    <option>Financial Report</option>
                    <option>Teacher Effectiveness</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Period</Form.Label>
                  <Form.Select>
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                    <option>This Semester</option>
                    <option>This Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
        
        {modalType === 'budgetOverview' && (
          <Row>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h4 className="text-primary">$125,000</h4>
                  <small className="text-muted">Total Budget</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h4 className="text-warning">$85,000</h4>
                  <small className="text-muted">Spent</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h4 className="text-success">$40,000</h4>
                  <small className="text-muted">Remaining</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {modalType === 'sectionDetail' && selectedData && (
          <div>
            <p><strong>Section:</strong> {selectedData.name}</p>
            <p><strong>Students:</strong> {selectedData.students}</p>
            <p><strong>Teacher:</strong> {selectedData.teacher}</p>
            <p><strong>Average Score:</strong> {selectedData.average}%</p>
            <p><strong>Subjects:</strong> {selectedData.subjects}</p>
          </div>
        )}

        {modalType === 'teacherDetail' && selectedData && (
          <div>
            <p><strong>Teacher:</strong> {selectedData.name}</p>
            <p><strong>Students:</strong> {selectedData.students}</p>
            <p><strong>Subjects:</strong> {selectedData.subjects.join(', ')}</p>
            <p><strong>Engagement Rate:</strong> {selectedData.engagement}%</p>
          </div>
        )}

        {modalType === 'warnTeacher' && selectedData && (
          <div className="alert alert-danger">
            <h6>Performance Warning Notice</h6>
            <p><strong>Teacher:</strong> {selectedData.name}</p>
            <p><strong>Section:</strong> {selectedData.section}</p>
            <p><strong>Current Performance:</strong> {selectedData.performance}%</p>
            <p><strong>Issue:</strong> Performance significantly below institutional standards (85% minimum).</p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Warning Type</Form.Label>
                <Form.Select>
                  <option>Formal Written Warning</option>
                  <option>Performance Improvement Plan</option>
                  <option>Final Warning</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Additional Comments</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter specific concerns and improvement expectations..." />
              </Form.Group>
            </Form>
          </div>
        )}

        {modalType === 'interventionPlan' && selectedData && (
          <div>
            <h6>Academic Intervention Plan</h6>
            <p><strong>Section:</strong> {selectedData.section}</p>
            <p><strong>Teacher:</strong> {selectedData.teacher}</p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Intervention Type</Form.Label>
                <Form.Select>
                  <option>Additional Teaching Support</option>
                  <option>Student Tutoring Program</option>
                  <option>Curriculum Modification</option>
                  <option>Teacher Training</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Timeline</Form.Label>
                <Form.Select>
                  <option>2 Weeks</option>
                  <option>1 Month</option>
                  <option>2 Months</option>
                  <option>End of Semester</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        {modalType === 'generateReport' && (
          <Button variant="success">Download Report</Button>
        )}
        {modalType === 'warnTeacher' && (
          <>
            <Button variant="warning">Send Warning Email</Button>
            <Button variant="danger">Issue Formal Warning</Button>
          </>
        )}
        {modalType === 'interventionPlan' && (
          <Button variant="primary">Create Intervention Plan</Button>
        )}
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="chairman-dashboard">
      {/* Dashboard Content - Removed fixed header to prevent overlap */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Chairman Executive Dashboard</h2>
          <p>Comprehensive institutional oversight and management</p>
        </div>

        {/* Navigation Tabs */}
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            >
              Executive Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'students'} 
              onClick={() => setActiveTab('students')}
            >
              Student Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'teachers'} 
              onClick={() => setActiveTab('teachers')}
            >
              Faculty Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')}
            >
              Executive Reports
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderStudentManagement()}
        {activeTab === 'teachers' && renderTeacherManagement()}
        {activeTab === 'reports' && (
          <Container fluid>
            <div className="text-center p-5">
              <h3>Executive Reports</h3>
              <p>Advanced reporting and analytics dashboard coming soon.</p>
            </div>
          </Container>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default ChairmanDashboard;