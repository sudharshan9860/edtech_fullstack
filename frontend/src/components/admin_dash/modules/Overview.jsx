import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Overview.css';
import {
  faUsers,
  faChalkboardTeacher,
  faSchool,
  faClipboardList,
  faBell,
  faChartLine,
  faCalendarAlt,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faUserPlus,
  faFileAlt,
  faCalendarPlus,
  faCogs
} from '@fortawesome/free-solid-svg-icons';

const Overview = ({ onNavigate }) => {
  const [recentActivities] = useState([
    {
      id: 1,
      type: 'student',
      message: 'New student "Arjun Patel" admitted to Class 9-A',
      time: '2 minutes ago',
      icon: faUserPlus,
      color: 'blue'
    },
    {
      id: 2,
      type: 'exam',
      message: 'Unit Test 1 scheduled for Class 10 (Math)',
      time: '15 minutes ago',
      icon: faCalendarPlus,
      color: 'green'
    },
    {
      id: 3,
      type: 'teacher',
      message: 'Ms. Priya Singh assigned to Class 8-C (Science)',
      time: '1 hour ago',
      icon: faChalkboardTeacher,
      color: 'purple'
    },
    {
      id: 4,
      type: 'performance',
      message: 'Class 12-A performance improved by 8.5%',
      time: '2 hours ago',
      icon: faChartLine,
      color: 'indigo'
    }
  ]);

  const [systemAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Backup scheduled for tonight at 2:00 AM',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: '23 pending admissions require review',
      priority: 'high'
    },
    {
      id: 3,
      type: 'success',
      message: 'All exam schedules published successfully',
      priority: 'low'
    }
  ]);

  const quickActions = [
    {
      id: 'students',
      title: 'Add Student',
      description: 'Register new students',
      icon: faUsers,
      className: 'primary',
      module: 'students'
    },
    {
      id: 'reports',
      title: 'Create Report',
      description: 'Generate analytics',
      icon: faFileAlt,
      className: 'success',
      module: 'reports'
    },
    {
      id: 'examinations',
      title: 'Schedule Exam',
      description: 'Plan examinations',
      icon: faCalendarAlt,
      className: 'warning',
      module: 'examinations'
    },
    {
      id: 'classes',
      title: 'Manage Classes',
      description: 'Organize classes',
      icon: faSchool,
      className: 'cyan',
      module: 'classes'
    }
  ];

  const handleQuickAction = (module) => {
    if (onNavigate) {
      onNavigate(module);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return faExclamationTriangle;
      case 'success': return faCheckCircle;
      default: return faBell;
    }
  };

  return (
    <div className="overview-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Total Students</h3>
              <div className="stat-value">2,847</div>
              <div className="stat-change positive">
                <span>↗ 8.2%</span>
                <span>vs last month</span>
              </div>
            </div>
            <div className="stat-icon blue">
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Active Teachers</h3>
              <div className="stat-value">156</div>
              <div className="stat-change positive">
                <span>↗ 4.1%</span>
                <span>vs last month</span>
              </div>
            </div>
            <div className="stat-icon green">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Total Classes</h3>
              <div className="stat-value">42</div>
              <div className="stat-change">
                <span>Across all grades</span>
              </div>
            </div>
            <div className="stat-icon yellow">
              <FontAwesomeIcon icon={faSchool} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Pending Admissions</h3>
              <div className="stat-value">23</div>
              <div className="stat-change">
                <span>Require approval</span>
              </div>
            </div>
            <div className="stat-icon cyan">
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and System Alerts */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="quick-actions-header">
            <h3>Quick Actions</h3>
            <FontAwesomeIcon icon={faCogs} className="text-gray-400" />
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.module)}
                className={`action-btn ${action.className}`}
              >
                <FontAwesomeIcon icon={action.icon} className="action-btn-icon" />
                <div className="action-btn-title">{action.title}</div>
                <div className="action-btn-desc">{action.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="system-alerts-card">
          <div className="system-alerts-header">
            <h3>System Alerts</h3>
            <span className="alerts-count">
              {systemAlerts.length} Active
            </span>
          </div>
          <div className="alerts-list">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <FontAwesomeIcon 
                  icon={getAlertIcon(alert.type)} 
                  className="alert-icon" 
                />
                <p className="alert-message">{alert.message}</p>
                <span className={`alert-priority ${alert.priority}`}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-card">
        <div className="recent-activity-header">
          <h3>Recent Activity</h3>
          <a href="#" className="view-all-btn">View All</a>
        </div>
        <div className="activity-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon-wrapper ${activity.color}`}>
                <FontAwesomeIcon icon={activity.icon} />
              </div>
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <p className="activity-time">
                  <FontAwesomeIcon icon={faClock} />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;