// frontend/src/components/admin_dash/modules/Overview.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faChalkboardTeacher,
  faBookOpen,
  faFileAlt,
  faArrowUp,
  faArrowDown,
  faClock,
  faPlus,
  faUserPlus,
  faFileUpload,
  faCalendarPlus,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Overview.css';

const Overview = () => {
  const [stats, setStats] = useState({
    totalStudents: 1247,
    totalTeachers: 89,
    totalSubjects: 15,
    totalAssignments: 234,
    studentGrowth: 12.5,
    teacherGrowth: 5.2,
    subjectGrowth: 0,
    assignmentGrowth: 8.3
  });

  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      priority: 'high',
      message: 'Server backup scheduled for maintenance tonight at 11 PM'
    },
    {
      id: 2,
      type: 'info',
      priority: 'medium',
      message: 'New student registration portal is now live'
    },
    {
      id: 3,
      type: 'success',
      priority: 'low',
      message: 'Monthly performance reports have been generated'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      message: 'New student enrolled in Grade 10',
      time: '2 minutes ago',
      icon: faUserPlus,
      color: 'blue'
    },
    {
      id: 2,
      message: 'Assignment submitted by Class 9A',
      time: '15 minutes ago',
      icon: faFileUpload,
      color: 'green'
    },
    {
      id: 3,
      message: 'Teacher meeting scheduled for tomorrow',
      time: '1 hour ago',
      icon: faCalendarPlus,
      color: 'purple'
    },
    {
      id: 4,
      message: 'New subject added to curriculum',
      time: '2 hours ago',
      icon: faBookOpen,
      color: 'indigo'
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      case 'success':
        return faCheckCircle;
      default:
        return faInfoCircle;
    }
  };

  const formatStatValue = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <div className="overview-content">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Total Students</h3>
              <div className="stat-value">{formatStatValue(stats.totalStudents)}</div>
              <div className={`stat-change ${stats.studentGrowth >= 0 ? 'positive' : 'negative'}`}>
                <FontAwesomeIcon icon={stats.studentGrowth >= 0 ? faArrowUp : faArrowDown} />
                {Math.abs(stats.studentGrowth)}% this month
              </div>
            </div>
            <div className="stat-icon blue">
              <FontAwesomeIcon icon={faUserGraduate} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Total Teachers</h3>
              <div className="stat-value">{stats.totalTeachers}</div>
              <div className={`stat-change ${stats.teacherGrowth >= 0 ? 'positive' : 'negative'}`}>
                <FontAwesomeIcon icon={stats.teacherGrowth >= 0 ? faArrowUp : faArrowDown} />
                {Math.abs(stats.teacherGrowth)}% this month
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
              <h3>Subjects</h3>
              <div className="stat-value">{stats.totalSubjects}</div>
              <div className={`stat-change ${stats.subjectGrowth >= 0 ? 'positive' : 'negative'}`}>
                {stats.subjectGrowth === 0 ? (
                  'No change'
                ) : (
                  <>
                    <FontAwesomeIcon icon={stats.subjectGrowth >= 0 ? faArrowUp : faArrowDown} />
                    {Math.abs(stats.subjectGrowth)}% this month
                  </>
                )}
              </div>
            </div>
            <div className="stat-icon yellow">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <h3>Assignments</h3>
              <div className="stat-value">{stats.totalAssignments}</div>
              <div className={`stat-change ${stats.assignmentGrowth >= 0 ? 'positive' : 'negative'}`}>
                <FontAwesomeIcon icon={stats.assignmentGrowth >= 0 ? faArrowUp : faArrowDown} />
                {Math.abs(stats.assignmentGrowth)}% this month
              </div>
            </div>
            <div className="stat-icon cyan">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid - Quick Actions and System Alerts */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="quick-actions-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button className="action-btn primary">
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Add Student</span>
            </button>
            <button className="action-btn success">
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Teacher</span>
            </button>
            <button className="action-btn info">
              <FontAwesomeIcon icon={faFileUpload} />
              <span>Upload Content</span>
            </button>
            <button className="action-btn warning">
              <FontAwesomeIcon icon={faCalendarPlus} />
              <span>Schedule Event</span>
            </button>
          </div>
        </div>

        {/* System Alerts */}
        <div className="system-alerts-card">
          <div className="alerts-header">
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