import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axiosInstance from '../api/axiosInstance';
import './ChairmanDashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// API Service Class
class APIService {
  static API_CONFIG = {
    BASE_URL: "https://corsproxy.io/?https://autogen.aieducator.com/",
    USERNAME: "admin",
    PASSWORD: "Orcalex@54321",
    token: null
  };

  static async getJWTToken() {
    try {
      const response = await fetch(`${this.API_CONFIG.BASE_URL}api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.API_CONFIG.USERNAME,
          password: this.API_CONFIG.PASSWORD
        })
      });

      if (response.ok) {
        const tokens = await response.json();
        this.API_CONFIG.token = tokens.access;
        return tokens.access;
      } else {
        throw new Error(`Login failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  }

  static async makeAuthenticatedRequest(url, params = {}) {
    if (!this.API_CONFIG.token) {
      await this.getJWTToken();
    }

    const queryParams = new URLSearchParams(params);
    const fullUrl = `${this.API_CONFIG.BASE_URL}${url}?${queryParams}`;

    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${this.API_CONFIG.token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 401) {
        await this.getJWTToken();
        const retryResponse = await fetch(fullUrl, {
          headers: {
            'Authorization': `Bearer ${this.API_CONFIG.token}`,
            'Content-Type': 'application/json',
          }
        });
        if (retryResponse.ok) {
          return await retryResponse.json();
        }
      }
      throw new Error(`API Error: ${response.status}`);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getActiveUsers(date = null, startDate = null, endDate = null) {
    const params = {};
    if (date) {
      params.date = date;
    } else if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    return await this.makeAuthenticatedRequest('active-users/', params);
  }

  static async getDailyActiveUsers() {
    try {
      const promises = [];
      const labels = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        promises.push(this.getActiveUsers(dateString));
      }

      const results = await Promise.allSettled(promises);
      const data = results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value?.active_users_count || 0;
        }
        return 0;
      });

      return { labels, data, success: true };
    } catch (error) {
      console.error('Error getting daily active users:', error);
      throw error;
    }
  }

  static async getWeeklyActiveUsers() {
    try {
      const promises = [];
      const labels = [];
      
      for (let i = 7; i >= 0; i--) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - (i * 7));
        
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        
        labels.push(`Week ${8-i}`);
        promises.push(this.getActiveUsers(null, startDateString, endDateString));
      }

      const results = await Promise.allSettled(promises);
      const data = results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value?.active_users_count || 0;
        }
        return 0;
      });

      return { labels, data, success: true };
    } catch (error) {
      console.error('Error getting weekly active users:', error);
      throw error;
    }
  }
}

const ChairmanDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('daily-report');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Chatbot specific states
  const [sessionId, setSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSessionCreating, setIsSessionCreating] = useState(false);
  const [chatError, setChatError] = useState('');
  
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

  // School data for chatbot context
  const schoolData = {
    school_name: "Excellence Academy",
    total_students: 1250,
    total_teachers: 48,
    total_classes: 36,
    blocks: ["Block A", "Block B", "Block C"],
    current_date: new Date().toISOString().split('T')[0],
    metrics: {
      homework_completion: 88,
      classwork_completion: 92,
      average_score: 8.2,
      attendance_rate: 92.5
    },
    classes: {
      "Class 10A": { students: 35, homework_completion: 90, average_score: 8.5, teacher: "Ms. Johnson" },
      "Class 10B": { students: 32, homework_completion: 85, average_score: 7.9, teacher: "Mr. Smith" },
      "Class 9A": { students: 38, homework_completion: 92, average_score: 8.7, teacher: "Dr. Reed" }
    },
    teachers: {
      "Ms. Johnson": { classes: ["10A", "11A"], total_homeworks_assigned: 15, avg_completion_rate: 89 },
      "Mr. Smith": { classes: ["10B", "11B"], total_homeworks_assigned: 12, avg_completion_rate: 84 },
      "Dr. Reed": { classes: ["9A", "9B"], total_homeworks_assigned: 18, avg_completion_rate: 91 }
    }
  };

  // Filters - Global for all sections
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [selectedClass, setSelectedClass] = useState('Class 8');
  
  // Daily Report specific states
  const [showHomeworkList, setShowHomeworkList] = useState(false);
  const [showHomeworkDetail, setShowHomeworkDetail] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  
  // Engagement data
  const [engagementData, setEngagementData] = useState({
    students: [],
    targetGroup: [],
    selectedCategory: null
  });

  // Charts data
  const [dailyActiveUsersData, setDailyActiveUsersData] = useState(null);
  const [weeklyActiveUsersData, setWeeklyActiveUsersData] = useState(null);
  const [performanceTrendData, setPerformanceTrendData] = useState(null);
  const [engagementDistributionData, setEngagementDistributionData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [teacherWorkloadData, setTeacherWorkloadData] = useState(null);

  // Student names for mock data
  const studentNames = ["Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Gupta", "Arjun Patel", "Sai Reddy", "Reyansh Mishra", "Krishna Yadav", "Ananya Sharma", "Diya Singh", "Saanvi Kumar", "Aadhya Gupta", "Myra Patel", "Pari Reddy", "Kiara Mishra", "Aarohi Yadav", "Ira Jain", "Amaira Verma"];
  const teachers = ['Dr. Reed', 'Mr. Chen', 'Ms. Desai'];

  // Backend API configuration for chatbot
  const CHATBOT_API_URL = 'http://localhost:8000';

  // Initialize chatbot session
  const initializeChatSession = async () => {
    setIsSessionCreating(true);
    setChatError('');
    
    try {
      const response = await fetch(`${CHATBOT_API_URL}/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: schoolData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      setSessionId(data.session_id);
      
      setChatMessages([{
        role: 'assistant',
        content: 'Hello! How can I help you with the school data today?',
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      console.error('Failed to create session:', error);
      setChatError('Failed to initialize chat session. Please ensure the backend server is running on port 8000.');
    } finally {
      setIsSessionCreating(false);
    }
  };

  // Send message to chatbot
  const sendMessage = async () => {
    if (!currentMessage.trim() || !sessionId || isChatLoading) return;
    
    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsChatLoading(true);
    setChatError('');
    
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);
    
    try {
      const response = await fetch(`${CHATBOT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatError('Failed to send message. Please check your connection.');
      setChatMessages(prev => prev.slice(0, -1));
      setCurrentMessage(userMessage);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle quick action buttons
  const handleQuickAction = (question) => {
    setCurrentMessage(question);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  // Handle Daily Report Submit
  const handleDailyReportSubmit = () => {
    setShowHomeworkList(true);
    updateDashboardView();
  };

  // Load dashboard data with API integration
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try to fetch real data from API
      const dailyData = await APIService.getDailyActiveUsers();
      const weeklyData = await APIService.getWeeklyActiveUsers();
      
      // Update daily active users chart
      setDailyActiveUsersData({
        labels: dailyData.labels,
        datasets: [{
          label: 'Daily Active Users',
          data: dailyData.data,
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
          borderWidth: 3
        }]
      });
      
      // Update weekly active users chart
      setWeeklyActiveUsersData({
        labels: weeklyData.labels,
        datasets: [{
          label: 'Weekly Active Users',
          data: weeklyData.data,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderRadius: 12
        }]
      });
      
      setSuccess('Data loaded successfully from API');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Failed to load API data, using fallback:', error);
      setError('Using cached data. Live API connection unavailable.');
      
      // Fallback to mock data
      setDailyActiveUsersData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Active Users',
          data: [120, 150, 180, 135, 95, 85, 110],
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          fill: true,
          tension: 0.4
        }]
      });
      
      setWeeklyActiveUsersData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [{
          label: 'Weekly Active Users',
          data: [400, 420, 510, 400, 460, 530, 440, 520],
          backgroundColor: 'rgba(139, 92, 246, 0.8)'
        }]
      });
    } finally {
      setLoading(false);
    }
    
    // Initialize other chart data
    initializeChartsData();
  };

  const initializeChartsData = () => {
    // Performance Trend Data
    setPerformanceTrendData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Overall Performance %',
        data: [78, 81, 80, 84, 86, 88],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    });
    
    // Progress Data
    setProgressData({
      weeklyPerformance: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
        datasets: [{
          label: 'Average Score',
          data: [78, 83, 85, 79, 88],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      targetedVsUntargeted: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
        datasets: [
          {
            label: 'Targeted',
            data: [75, 82, 88, 92, 95],
            borderColor: '#22c55e',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Untargeted',
            data: [72, 74, 73, 76, 75],
            borderColor: '#f97316',
            fill: true,
            tension: 0.4
          }
        ]
      }
    });
    
    // Teacher Workload Data
    setTeacherWorkloadData({
      workload: {
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
      },
      performance: {
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
      },
      intervention: {
        labels: ['Taking Action', 'No Action'],
        datasets: [{
          data: [35, 13],
          backgroundColor: ['#22c55e', '#ef4444']
        }]
      }
    });
  };

  // Generate engagement data
  const generateEngagementData = () => {
    const students = studentNames.map(name => ({
      name,
      attendance: Array(5).fill(0).map(() => Math.random() > 0.2),
      engagement: Math.floor(Math.random() * 71) + 30
    }));
    
    const high = students.filter(s => s.engagement > 90).length;
    const medium = students.filter(s => s.engagement >= 60 && s.engagement <= 90).length;
    const low = students.filter(s => s.engagement < 60).length;
    
    setEngagementDistributionData({
      labels: ['High (>90%)', 'Medium (60-90%)', 'Low (<60%)'],
      datasets: [{
        data: [high, medium, low],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 4
      }]
    });
    
    setEngagementData({ students, targetGroup: [], selectedCategory: null });
  };

  // Handle engagement pie click
  const handleEngagementPieClick = (event, elements) => {
    if (elements.length === 0) return;
    const index = elements[0].index;
    let targetGroup, category;
    
    if (index === 0) {
      targetGroup = engagementData.students.filter(s => s.engagement > 90);
      category = 'High Engagement Students';
    } else if (index === 1) {
      targetGroup = engagementData.students.filter(s => s.engagement >= 60 && s.engagement <= 90);
      category = 'Medium Engagement Students';
    } else {
      targetGroup = engagementData.students.filter(s => s.engagement < 60);
      category = 'Low Engagement Students';
    }
    
    setEngagementData(prev => ({ ...prev, targetGroup, selectedCategory: category }));
  };

  // Handle homework click
  const handleHomeworkClick = (homework) => {
    setSelectedHomework(homework);
    setShowHomeworkDetail(true);
  };

  // Update dashboard based on class selection
  const updateDashboardView = () => {
    let hw = selectedClass === 'All Classes' ? 9 : 3;
    let cw = selectedClass === 'All Classes' ? 15 : 5;
    let comp = selectedClass === 'All Classes' ? 88 : 92;
    let score = selectedClass === 'All Classes' ? 8.2 : 8.5;
    
    setDashboardData(prev => ({
      ...prev,
      totalHomeworks: hw,
      totalClassworks: cw,
      overallCompletion: comp,
      overallScore: score
    }));
  };

  // Initialize data on component mount and tab change
  useEffect(() => {
    if (activeTab === 'chatbot' && !sessionId) {
      initializeChatSession();
    }
    if (activeTab === 'engagement') {
      generateEngagementData();
      loadDashboardData();
    }
    if (activeTab === 'dashboard' || activeTab === 'progress' || activeTab === 'teacher-analytics') {
      loadDashboardData();
    }
  }, [activeTab]);

  // Auto-scroll chat
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  // Render Daily Report Section
  const renderDailyReport = () => (
    <Container fluid className="p-0">
      {/* Filters Section */}
      <Row className="mb-4">
        <Col>
          <Card className="filter-card-enhanced">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={12}>
                  <h4 className="mb-3">
                    <span className="text-primary">📊</span> Daily Report
                  </h4>
                  <Row className="g-3 align-items-end">
                    <Col md={3}>
                      <Form.Label className="text-uppercase small fw-bold text-muted">Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Label className="text-uppercase small fw-bold text-muted">Block</Form.Label>
                      <Form.Select
                        value={selectedBlock}
                        onChange={(e) => setSelectedBlock(e.target.value)}
                      >
                        <option>Block A</option>
                        <option>Block B</option>
                        <option>Block C</option>
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="text-uppercase small fw-bold text-muted">Class</Form.Label>
                      <Form.Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option>All Classes</option>
                        <option>Class 8</option>
                        <option>Class 9</option>
                        <option>Class 10</option>
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Button 
                        variant="primary" 
                        className="w-100"
                        onClick={handleDailyReportSubmit}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Show metrics only after submit */}
      {showHomeworkList && !showHomeworkDetail && (
        <>
          {/* Metrics Cards */}
          <Row className="g-3 mb-4">
            <Col md={3}>
              <Card className="metric-card-animated">
                <Card.Body>
                  <div className="text-uppercase small fw-bold text-muted mb-2">Total Homeworks</div>
                  <div className="display-4 fw-bold text-primary">{dashboardData.totalHomeworks}</div>
                  <ProgressBar 
                    now={60} 
                    variant="primary" 
                    className="mt-3"
                    style={{ height: '6px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="metric-card-animated">
                <Card.Body>
                  <div className="text-uppercase small fw-bold text-muted mb-2">Total Classworks</div>
                  <div className="display-4 fw-bold" style={{ color: '#8b5cf6' }}>{dashboardData.totalClassworks}</div>
                  <ProgressBar 
                    now={75} 
                    variant="info" 
                    className="mt-3"
                    style={{ height: '6px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="metric-card-animated">
                <Card.Body>
                  <div className="text-uppercase small fw-bold text-muted mb-2">Overall Completion</div>
                  <div className="display-4 fw-bold text-success">{dashboardData.overallCompletion}%</div>
                  <ProgressBar 
                    now={dashboardData.overallCompletion} 
                    variant="success" 
                    className="mt-3"
                    style={{ height: '6px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="metric-card-animated">
                <Card.Body>
                  <div className="text-uppercase small fw-bold text-muted mb-2">Overall Avg. Score</div>
                  <div className="display-4 fw-bold text-warning">{dashboardData.overallScore}/10</div>
                  <ProgressBar 
                    now={dashboardData.overallScore * 10} 
                    variant="warning" 
                    className="mt-3"
                    style={{ height: '6px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Homework Assignments List */}
          <Card>
            <Card.Body>
              <h5 className="mb-4">Homework Assignments for {selectedClass}</h5>
              <div className="homework-list">
                {[
                  { id: 1, title: 'Algebra - Chapter 5', subject: 'Mathematics', completion: 85 },
                  { id: 2, title: 'Newton\'s Laws', subject: 'Physics', completion: 92 },
                  { id: 3, title: 'Climate Change Essay', subject: 'Science', completion: 78 }
                ].map(hw => (
                  <div 
                    key={hw.id}
                    className="p-3 mb-2 border rounded hover-shadow"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                    onClick={() => handleHomeworkClick(hw)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 text-primary">{hw.title}</h6>
                        <small className="text-muted">{hw.subject}</small>
                      </div>
                      <Badge bg="success">{hw.completion}% Complete</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Homework Detail View */}
      {showHomeworkDetail && selectedHomework && (
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p className="text-muted mb-1">{selectedBlock} / {selectedClass} / {selectedHomework.subject}</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowHomeworkDetail(false);
                  setSelectedHomework(null);
                }}
              >
                Back to Report
              </Button>
            </div>
            
            <Row>
              <Col lg={7}>
                <h5 className="mb-3">Student Scores</h5>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <Table striped bordered hover>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                      <tr>
                        <th>STUDENT NAME</th>
                        <th>SCORE (/10)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentNames.map((name, idx) => {
                        const score = Math.random() > 0.1 ? Math.floor(Math.random() * 7) + 4 : null;
                        return (
                          <tr key={idx}>
                            <td>{name}</td>
                            <td>{score || <span className="text-danger">NOT ATTEMPTED</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                
                {/* Teacher Comments Section */}
                <div className="mt-4">
                  <h5 className="mb-3">Teacher Comments for Low Performers</h5>
                  <div className="space-y-2">
                    {['Aarav Sharma', 'Ishaan Jain', 'Advik Verma', 'Saanvi Kumar'].map((student, idx) => (
                      <Card key={idx} className="mb-2">
                        <Card.Body className="py-2">
                          <strong>{student}</strong>
                          <p className="mb-0 text-muted small">"Struggled with the core concepts. Needs review."</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              </Col>
              
              <Col lg={5}>
                <h5 className="mb-3">Performance Distribution</h5>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={{
                      labels: ['Excellent (>8)', 'Improving (6-8)', 'Needs Improvement (<6)'],
                      datasets: [{
                        data: [2, 8, 6],
                        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      onClick: (event, elements) => {
                        if (elements.length > 0) {
                          const index = elements[0].index;
                          // Handle pie click if needed
                        }
                      }
                    }}
                  />
                </div>
                <div className="mt-3 p-3 bg-light rounded">
                  <p className="text-muted">Click on a pie chart section.</p>
                  <p className="text-muted small">No students in this category.</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );

  // Render Dashboard Section (unchanged)
  const renderDashboard = () => (
    <Container fluid className="p-0">
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="metric-card-animated">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Students</h6>
              <h3 className="text-primary">{dashboardData.totalStudents}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card-animated">
            <Card.Body>
              <h6 className="text-muted mb-2">Average Attendance</h6>
              <h3 className="text-primary">{dashboardData.averageAttendance}%</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card-animated">
            <Card.Body>
              <h6 className="text-muted mb-2">Overall Performance</h6>
              <h3 className="text-primary">{dashboardData.overallPerformance}%</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card-animated">
            <Card.Body>
              <h6 className="text-muted mb-2">Teachers Active</h6>
              <h3 className="text-primary">{dashboardData.teachersActive}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="chart-card-enhanced">
        <Card.Body>
          <h5 className="mb-4">School-wide Performance Trend</h5>
          {performanceTrendData && (
            <Line 
              data={performanceTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 70
                  }
                }
              }}
              height={400}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );

  // Render Engagement Section with filters
  const renderEngagement = () => (
    <Container fluid className="p-0">
      {/* Global Filters for Engagement */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Label className="text-uppercase small fw-bold text-muted">Block</Form.Label>
              <Form.Select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option>Block A</option>
                <option>Block B</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="text-uppercase small fw-bold text-muted">Class</Form.Label>
              <Form.Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="primary"
                onClick={() => {
                  generateEngagementData();
                  loadDashboardData();
                }}
              >
                Generate Report
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Charts Row */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-3">Daily Active Users</h5>
              {dailyActiveUsersData && (
                <Line 
                  data={dailyActiveUsersData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    }
                  }} 
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-3">Weekly Active Users</h5>
              {weeklyActiveUsersData && (
                <Bar 
                  data={weeklyActiveUsersData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    }
                  }} 
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Student Engagement Tracker with Distribution */}
      <Card>
        <Card.Body>
          <Row>
            <Col lg={7}>
              <h5 className="mb-4">Student Engagement Tracker</h5>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm">
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                    <tr>
                      <th>STUDENT NAME</th>
                      <th className="text-center">MON</th>
                      <th className="text-center">TUE</th>
                      <th className="text-center">WED</th>
                      <th className="text-center">THU</th>
                      <th className="text-center">FRI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.students.map((student, idx) => (
                      <tr key={idx}>
                        <td>{student.name}</td>
                        {student.attendance.map((present, dayIdx) => (
                          <td key={dayIdx} className="text-center">
                            <Form.Check 
                              type="checkbox" 
                              checked={present}
                              readOnly
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col lg={5}>
              <h5 className="mb-4">Engagement Distribution</h5>
              <div style={{ height: '300px' }}>
                {engagementDistributionData && (
                  <Doughnut
                    data={engagementDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      onClick: handleEngagementPieClick
                    }}
                  />
                )}
              </div>
              <div className="mt-3 p-3 bg-light rounded">
                {engagementData.selectedCategory ? (
                  <>
                    <h6>{engagementData.selectedCategory}</h6>
                    <ul className="mb-0 small">
                      {engagementData.targetGroup.map((student, idx) => (
                        <li key={idx}>{student.name} (Engagement: {student.engagement}%)</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="mb-0">Click on a pie chart section.</p>
                    <p className="mb-0 text-muted small">No students in this category.</p>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );

  // Render Progress Section with filters
  const renderProgress = () => (
    <Container fluid className="p-0">
      {/* Global Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Label className="text-uppercase small fw-bold text-muted">Block</Form.Label>
              <Form.Select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option>Block A</option>
                <option>Block B</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="text-uppercase small fw-bold text-muted">Class</Form.Label>
              <Form.Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Button variant="primary" onClick={loadDashboardData}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-4">Week-wise Average Student Performance</h5>
              {progressData?.weeklyPerformance && (
                <Line
                  data={progressData.weeklyPerformance}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                  height={350}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-4">Progress of Targeted vs. Untargeted Students</h5>
              {progressData?.targetedVsUntargeted && (
                <Line
                  data={progressData.targetedVsUntargeted}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                  height={350}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  // Render Teacher Analytics Section with filters
  const renderTeacherAnalytics = () => (
    <Container fluid className="p-0">
      {/* Global Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Label className="text-uppercase small fw-bold text-muted">Block</Form.Label>
              <Form.Select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option>Block A</option>
                <option>Block B</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="text-uppercase small fw-bold text-muted">Class</Form.Label>
              <Form.Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Button variant="primary" onClick={loadDashboardData}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col lg={12}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-4">Workload Distribution</h5>
              {teacherWorkloadData?.workload && (
                <Bar
                  data={teacherWorkloadData.workload}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                  height={300}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="g-3 mt-3">
        <Col lg={6}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-4">Performance vs Work Type</h5>
              {teacherWorkloadData?.performance && (
                <Bar
                  data={teacherWorkloadData.performance}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                  height={300}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="chart-card-enhanced">
            <Card.Body>
              <h5 className="mb-4">Low-Performer Intervention</h5>
              <div className="text-center">
                {teacherWorkloadData?.intervention && (
                  <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                    <Doughnut
                      data={teacherWorkloadData.intervention}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                      height={250}
                    />
                  </div>
                )}
                <p className="mt-3 text-muted">
                  Percentage of teachers taking action.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  // Render Enhanced Chatbot
  const renderChatbot = () => (
    <Container fluid className="p-0">
      <Card style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
        <Card.Header className="bg-white border-bottom">
          <h4 className="mb-1">School Performance Dashboard</h4>
          <p className="text-muted mb-0">Analytics and insights at a glance.</p>
        </Card.Header>
        
        <Card.Body className="p-0 d-flex flex-column" style={{ height: 'calc(100% - 100px)' }}>
          {/* Chat Messages Area */}
          <div 
            id="chat-messages-container"
            className="flex-grow-1 p-4"
            style={{
              overflowY: 'auto',
              backgroundColor: '#f8f9fa',
              maxHeight: 'calc(100% - 150px)'
            }}
          >
            {isSessionCreating ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Initializing chat session...</p>
              </div>
            ) : chatError ? (
              <Alert variant="danger">
                {chatError}
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={initializeChatSession}
                  className="ms-2"
                >
                  Retry
                </Button>
              </Alert>
            ) : (
              <div>
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}
                  >
                    <div 
                      className={`d-inline-block p-3 rounded-3 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-white border'
                      }`}
                      style={{ maxWidth: '70%' }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-start">
                    <div className="d-inline-block p-3 bg-white border rounded-3">
                      <Spinner animation="grow" size="sm" variant="primary" className="me-2" />
                      <span className="text-muted">Typing...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions and Input Area */}
          <div className="border-top p-3 bg-white">
            {/* Quick Action Buttons */}
            <div className="mb-3">
              <Row className="g-2">
                <Col xs={6} md={3}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => handleQuickAction("Best progress by class?")}
                    disabled={!sessionId || isChatLoading}
                  >
                    Best progress by class?
                  </Button>
                </Col>
                <Col xs={6} md={3}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => handleQuickAction("Which teacher gives the most homework?")}
                    disabled={!sessionId || isChatLoading}
                  >
                    Which teacher gives the most homework?
                  </Button>
                </Col>
                <Col xs={6} md={3}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => handleQuickAction("Which teacher gives the least homework?")}
                    disabled={!sessionId || isChatLoading}
                  >
                    Which teacher gives the least homework?
                  </Button>
                </Col>
                <Col xs={6} md={3}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => handleQuickAction("Who is missing homework regularly?")}
                    disabled={!sessionId || isChatLoading}
                  >
                    Who is missing homework regularly?
                  </Button>
                </Col>
                <Col xs={6} md={3}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => handleQuickAction("Top performing students this week?")}
                    disabled={!sessionId || isChatLoading}
                  >
                    Top performing students this week?
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Input Area */}
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={sessionId ? "Ask a question..." : "Initializing..."}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={!sessionId || isChatLoading}
              />
              <Button 
                variant="primary"
                onClick={sendMessage}
                disabled={!sessionId || isChatLoading || !currentMessage.trim()}
                style={{ minWidth: '100px' }}
              >
                Send
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'daily-report': return renderDailyReport();
      case 'dashboard': return renderDashboard();
      case 'engagement': return renderEngagement();
      case 'progress': return renderProgress();
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
              className={`sidebar-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <i className="fas fa-chart-bar me-2"></i>
              Progress
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