// src/components/admin/Overview.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faChalkboardTeacher,
  faGraduationCap,
  faUserPlus,
  faBell,
  faArrowUp,
  faArrowDown,
  faPlus,
  faFileAlt,
  faCalendar,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const Overview = () => {
  const [dashboardData] = useState({
    metrics: {
      totalStudents: 2847,
      activeTeachers: 156,
      totalClasses: 42,
      pendingAdmissions: 23,
      systemUptime: '99.9%',
      totalAssignments: 892,
      completedAssignments: 7653,
      avgPerformance: 87.3,
      monthlyGrowth: 12.5
    },
    recentActivity: [
      {
        id: 1,
        type: 'student_admission',
        message: 'New student "Arjun Patel" admitted to Class 9-A',
        timestamp: '2 minutes ago',
        icon: faUserPlus,
        color: 'success'
      },
      {
        id: 2,
        type: 'exam_scheduled',
        message: 'Unit Test 1 scheduled for Class 10 (Math)',
        timestamp: '15 minutes ago',
        icon: faCalendar,
        color: 'info'
      },
      {
        id: 3,
        type: 'teacher_assigned',
        message: 'Ms. Priya Singh assigned to Class 8-C (Science)',
        timestamp: '1 hour ago',
        icon: faChalkboardTeacher,
        color: 'success'
      },
      {
        id: 4,
        type: 'performance_alert',
        message: 'Class 12-A performance improved by 8.5%',
        timestamp: '2 hours ago',
        icon: faArrowUp,
        color: 'info'
      }
    ]
  });

  const MetricCard = ({ title, value, icon, color, change, trend }) => (
    <div className="metric-card">
      <div className="metric-header">
        <div className={`metric-icon text-${color}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        {change && (
          <div className={`metric-change text-${trend === 'up' ? 'success' : 'danger'}`}>
            <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} />
            {change}%
          </div>
        )}
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-label">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="overview-content">
      {/* Enhanced Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Students"
          value={dashboardData.metrics.totalStudents.toLocaleString()}
          icon={faUsers}
          color="primary"
          change={8.2}
          trend="up"
        />
        <MetricCard
          title="Active Teachers"
          value={dashboardData.metrics.activeTeachers}
          icon={faChalkboardTeacher}
          color="success"
          change={4.1}
          trend="up"
        />
        <MetricCard
          title="Classes"
          value={dashboardData.metrics.totalClasses}
          icon={faGraduationCap}
          color="warning"
        />
        <MetricCard
          title="Pending Admissions"
          value={dashboardData.metrics.pendingAdmissions}
          icon={faUserPlus}
          color="info"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="card-content">
            <div className="activity-list">
              {dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon text-${activity.color}`}>
                    <FontAwesomeIcon icon={activity.icon} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <small className="activity-time">{activity.timestamp}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <FontAwesomeIcon icon={faCog} />
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button className="action-btn primary">
                <FontAwesomeIcon icon={faPlus} />
                Add Student
              </button>
              <button className="action-btn success">
                <FontAwesomeIcon icon={faFileAlt} />
                Create Report
              </button>
              <button className="action-btn warning">
                <FontAwesomeIcon icon={faCalendar} />
                Schedule Exam
              </button>
              <button className="action-btn info">
                <FontAwesomeIcon icon={faUsers} />
                Manage Classes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;