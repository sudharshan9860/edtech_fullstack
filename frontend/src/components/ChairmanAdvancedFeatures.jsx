// src/components/ChairmanAdvancedFeatures.jsx
import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Badge, ProgressBar, Tabs, Tab, Form, InputGroup } from 'react-bootstrap';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const ChairmanAdvancedFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('realtime');

  // Real-time monitoring data
  const [realtimeData] = useState({
    activeUsers: 87,
    onlineTeachers: 3,
    activeStudents: 84,
    currentAssignments: 12,
    completedToday: 156,
    systemHealth: 98.5,
    serverLoad: 45,
    avgResponseTime: 120
  });

  // Predictive analytics data
  const [predictiveData] = useState({
    riskStudents: [
      { name: 'John Doe', riskScore: 85, subjects: ['Math', 'Science'], lastActivity: '2 days ago' },
      { name: 'Jane Smith', riskScore: 78, subjects: ['English'], lastActivity: '1 day ago' },
      { name: 'Mike Johnson', riskScore: 82, subjects: ['History', 'Math'], lastActivity: '3 days ago' }
    ],
    performancePrediction: {
      nextMonth: [82, 84, 85, 83, 86],
      confidence: 89
    },
    interventionNeeded: 8
  });

  // Comprehensive analytics
  const [comprehensiveData] = useState({
    subjectPerformance: {
      labels: ['Mathematics', 'Science', 'English', 'History', 'Computer Science'],
      data: [85, 78, 82, 76, 88]
    },
    learningPatterns: {
      morning: 45,
      afternoon: 35,
      evening: 20
    },
    engagementTrends: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [78, 82, 79, 85]
    }
  });

  // Resource management data
  const [resourceData] = useState({
    classroomUtilization: [
      { room: 'Room 101', utilization: 85, capacity: 30, teacher: 'John Smith' },
      { room: 'Room 102', utilization: 92, capacity: 28, teacher: 'Sarah Johnson' },
      { room: 'Lab 201', utilization: 67, capacity: 25, teacher: 'Mike Brown' },
      { room: 'Lab 202', utilization: 78, capacity: 25, teacher: 'Emily Davis' }
    ],
    equipment: [
      { item: 'Projectors', total: 8, working: 7, maintenance: 1 },
      { item: 'Computers', total: 45, working: 42, maintenance: 3 },
      { item: 'Tablets', total: 30, working: 29, maintenance: 1 }
    ]
  });

  const renderRealtimeMonitoring = () => (
    <div className="realtime-monitoring">
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center realtime-card">
            <Card.Body>
              <div className="realtime-icon">🟢</div>
              <h3 className="text-success">{realtimeData.activeUsers}</h3>
              <p className="text-muted">Active Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center realtime-card">
            <Card.Body>
              <div className="realtime-icon">👨‍🏫</div>
              <h3 className="text-primary">{realtimeData.onlineTeachers}</h3>
              <p className="text-muted">Online Teachers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center realtime-card">
            <Card.Body>
              <div className="realtime-icon">📚</div>
              <h3 className="text-info">{realtimeData.currentAssignments}</h3>
              <p className="text-muted">Active Assignments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center realtime-card">
            <Card.Body>
              <div className="realtime-icon">✅</div>
              <h3 className="text-success">{realtimeData.completedToday}</h3>
              <p className="text-muted">Completed Today</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6>🖥️ System Health Monitor</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>System Health</span>
                  <span className="fw-bold text-success">{realtimeData.systemHealth}%</span>
                </div>
                <ProgressBar variant="success" now={realtimeData.systemHealth} />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Server Load</span>
                  <span className="fw-bold text-warning">{realtimeData.serverLoad}%</span>
                </div>
                <ProgressBar variant="warning" now={realtimeData.serverLoad} />
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Avg Response Time</span>
                  <span className="fw-bold text-info">{realtimeData.avgResponseTime}ms</span>
                </div>
                <ProgressBar variant="info" now={realtimeData.avgResponseTime / 10} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6>⚡ Live Activity Feed</h6>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <div className="activity-feed">
                <div className="activity-item">
                  <span className="activity-time">2 min ago</span>
                  <span className="activity-text">John Smith uploaded new assignment</span>
                  <Badge bg="success" className="ms-2">New</Badge>
                </div>
                <div className="activity-item">
                  <span className="activity-time">5 min ago</span>
                  <span className="activity-text">15 students completed Math Quiz</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">8 min ago</span>
                  <span className="activity-text">Sarah Johnson started live session</span>
                  <Badge bg="primary" className="ms-2">Live</Badge>
                </div>
                <div className="activity-item">
                  <span className="activity-time">12 min ago</span>
                  <span className="activity-text">System backup completed successfully</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderPredictiveAnalytics = () => (
    <div className="predictive-analytics">
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h6>🔮 Performance Prediction (Next 30 Days)</h6>
            </Card.Header>
            <Card.Body>
              <Line 
                data={{
                  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                  datasets: [{
                    label: 'Predicted Performance',
                    data: predictiveData.performancePrediction.nextMonth,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Confidence Level: ${predictiveData.performancePrediction.confidence}%`
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h6>⚠️ Early Warning System</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <h2 className="text-danger">{predictiveData.interventionNeeded}</h2>
                <p className="text-muted">Students Need Intervention</p>
                <Button variant="outline-danger" size="sm">View Details</Button>
              </div>
              <hr />
              <div>
                <h6>Automated Alerts</h6>
                <div className="alert-item">
                  <Badge bg="warning" className="me-2">Medium</Badge>
                  <small>Attendance dropping in Section C</small>
                </div>
                <div className="alert-item">
                  <Badge bg="danger" className="me-2">High</Badge>
                  <small>Performance decline detected</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h6>🎯 At-Risk Students Analysis</h6>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Risk Score</th>
                    <th>Subjects at Risk</th>
                    <th>Last Activity</th>
                    <th>Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {predictiveData.riskStudents.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>
                        <Badge bg={student.riskScore > 80 ? 'danger' : 'warning'}>
                          {student.riskScore}%
                        </Badge>
                      </td>
                      <td>{student.subjects.join(', ')}</td>
                      <td>{student.lastActivity}</td>
                      <td>
                        <Button size="sm" variant="outline-primary">
                          Schedule Meeting
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
    </div>
  );

  const renderComprehensiveAnalytics = () => (
    <div className="comprehensive-analytics">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6>📚 Subject-wise Performance</h6>
            </Card.Header>
            <Card.Body>
              <Radar
                data={{
                  labels: comprehensiveData.subjectPerformance.labels,
                  datasets: [{
                    label: 'Average Score',
                    data: comprehensiveData.subjectPerformance.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6>⏰ Learning Pattern Analysis</h6>
            </Card.Header>
            <Card.Body>
              <Doughnut
                data={{
                  labels: ['Morning (8-12)', 'Afternoon (12-17)', 'Evening (17-22)'],
                  datasets: [{
                    data: [comprehensiveData.learningPatterns.morning, comprehensiveData.learningPatterns.afternoon, comprehensiveData.learningPatterns.evening],
                    backgroundColor: [
                      'rgba(255, 206, 86, 0.8)',
                      'rgba(54, 162, 235, 0.8)',
                      'rgba(153, 102, 255, 0.8)'
                    ]
                  }]
                }}
                options={{ responsive: true }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h6>📈 Engagement Trends Analysis</h6>
            </Card.Header>
            <Card.Body>
              <Line
                data={{
                  labels: comprehensiveData.engagementTrends.labels,
                  datasets: [{
                    label: 'Average Engagement %',
                    data: comprehensiveData.engagementTrends.data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderResourceManagement = () => (
    <div className="resource-management">
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h6>🏫 Classroom Utilization</h6>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Classroom</th>
                    <th>Utilization</th>
                    <th>Capacity</th>
                    <th>Assigned Teacher</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceData.classroomUtilization.map((room, index) => (
                    <tr key={index}>
                      <td><strong>{room.room}</strong></td>
                      <td>
                        <ProgressBar 
                          now={room.utilization} 
                          label={`${room.utilization}%`}
                          variant={room.utilization > 90 ? 'danger' : room.utilization > 75 ? 'warning' : 'success'}
                        />
                      </td>
                      <td>{room.capacity} students</td>
                      <td>{room.teacher}</td>
                      <td>
                        <Badge bg={room.utilization > 90 ? 'danger' : 'success'}>
                          {room.utilization > 90 ? 'Over-utilized' : 'Optimal'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h6>🔧 Equipment Status</h6>
            </Card.Header>
            <Card.Body>
              {resourceData.equipment.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{item.item}</strong>
                    <Badge bg="info">{item.total} total</Badge>
                  </div>
                  <div className="mt-1">
                    <small className="text-success">Working: {item.working}</small> | 
                    <small className="text-warning ms-1">Maintenance: {item.maintenance}</small>
                  </div>
                  <ProgressBar className="mt-1">
                    <ProgressBar variant="success" now={(item.working / item.total) * 100} />
                    <ProgressBar variant="warning" now={(item.maintenance / item.total) * 100} />
                  </ProgressBar>
                </div>
              ))}
              <Button variant="outline-primary" className="w-100 mt-3">
                Schedule Maintenance
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="chairman-advanced-features">
      <Tabs
        activeKey={activeFeature}
        onSelect={setActiveFeature}
        className="mb-4"
        fill
      >
        <Tab eventKey="realtime" title="⚡ Real-time Monitor">
          {renderRealtimeMonitoring()}
        </Tab>
        <Tab eventKey="predictive" title="🔮 Predictive Analytics">
          {renderPredictiveAnalytics()}
        </Tab>
        <Tab eventKey="comprehensive" title="📊 Deep Analytics">
          {renderComprehensiveAnalytics()}
        </Tab>
        <Tab eventKey="resources" title="🏫 Resource Management">
          {renderResourceManagement()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default ChairmanAdvancedFeatures;