//no css but updated functionality

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'exam',
      message: 'Unit Test 1 scheduled for Class 10 (Math)',
      time: '15 minutes ago',
      icon: faCalendarPlus,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'teacher',
      message: 'Ms. Priya Singh assigned to Class 8-C (Science)',
      time: '1 hour ago',
      icon: faChalkboardTeacher,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'performance',
      message: 'Class 12-A performance improved by 8.5%',
      time: '2 hours ago',
      icon: faChartLine,
      color: 'text-indigo-600'
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
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      module: 'students'
    },
    {
      id: 'reports',
      title: 'Create Report',
      description: 'Generate analytics',
      icon: faFileAlt,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      module: 'reports'
    },
    {
      id: 'examinations',
      title: 'Schedule Exam',
      description: 'Plan examinations',
      icon: faCalendarAlt,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      module: 'examinations'
    },
    {
      id: 'classes',
      title: 'Manage Classes',
      description: 'Organize classes',
      icon: faSchool,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600',
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

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">TOTAL STUDENTS</p>
              <p className="text-3xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <span className="text-green-500">↗ 8.2%</span>
                <span className="ml-1">vs last month</span>
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ACTIVE TEACHERS</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <span className="text-green-500">↗ 4.1%</span>
                <span className="ml-1">vs last month</span>
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">TOTAL CLASSES</p>
              <p className="text-3xl font-bold text-gray-900">42</p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <span>Across all grades</span>
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faSchool} className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">PENDING ADMISSIONS</p>
              <p className="text-3xl font-bold text-gray-900">23</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <span>Require approval</span>
              </p>
            </div>
            <div className="p-3 bg-cyan-100 rounded-lg">
              <FontAwesomeIcon icon={faClipboardList} className="text-cyan-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <FontAwesomeIcon icon={faCogs} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.module)}
                className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <FontAwesomeIcon icon={action.icon} className="text-2xl" />
                  <div>
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
              {systemAlerts.length} Active
            </span>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center p-3 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                <FontAwesomeIcon 
                  icon={getAlertIcon(alert.type)} 
                  className="mr-3 flex-shrink-0" 
                />
                <p className="text-sm font-medium flex-1">{alert.message}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                  alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg mr-4 ${
                activity.color.includes('blue') ? 'bg-blue-100' :
                activity.color.includes('green') ? 'bg-green-100' :
                activity.color.includes('purple') ? 'bg-purple-100' :
                'bg-indigo-100'
              }`}>
                <FontAwesomeIcon icon={activity.icon} className={activity.color} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
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