// src/components/AdminDash.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faDashboard,
  faSchool,
  faUsers,
  faChalkboardTeacher,
  faClipboardList,
  faClipboard,
  faChartLine,
  faCog
} from '@fortawesome/free-solid-svg-icons';

// Import admin components
import Overview from './admin_dash/modules/Overview';
import ClassManagement from './admin_dash/modules/ClassManagement';
import Examinations from './admin_dash/modules/Examinations';
import Reports from './admin_dash/modules/ReportsAnalytics';
import Settings from './admin_dash/modules/Settings';
import StudentManagement from './admin_dash/modules/StudentManagement';
import TeacherManagement from './admin_dash/modules/TeacherManagement';
import AcademicRecords from './admin_dash/modules/AcademicRecords';

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const adminTabs = [
    { key: 'overview', label: 'Dashboard', icon: faDashboard },
    { key: 'classes', label: 'Class Management', icon: faSchool },
    { key: 'students', label: 'Student Management', icon: faUsers },
    { key: 'teachers', label: 'Teacher Management', icon: faChalkboardTeacher },
    { key: 'academics', label: 'Academic Records', icon: faClipboardList },
    { key: 'examinations', label: 'Examinations', icon: faClipboard },
    { key: 'reports', label: 'Reports & Analytics', icon: faChartLine },
    { key: 'settings', label: 'Settings', icon: faCog }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'classes':
        return <ClassManagement />;
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'academics':
        return <AcademicRecords />;
      case 'examinations':
        return <Examinations />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  const getPageTitle = () => {
    const tab = adminTabs.find(t => t.key === activeTab);
    return tab ? tab.label : 'Dashboard';
  };

  const getPageDescription = () => {
    const descriptions = {
      overview: 'Comprehensive school management and administrative control',
      classes: 'Organize and manage school classes efficiently',
      students: 'Manage student records and academic information',
      teachers: 'Manage teacher assignments and performance',
      academics: 'Track student performance and academic progress',
      examinations: 'Schedule and manage school examinations',
      reports: 'Comprehensive reporting and data analytics',
      settings: 'Configure system preferences and school settings'
    };
    return descriptions[activeTab] || 'Admin Dashboard';
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-content-wrapper">
        {/* Admin Sidebar */}
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <FontAwesomeIcon icon={faUserShield} />
            <h2>Admin Panel</h2>
            <p>AI Educator Platform</p>
          </div>
          
          <nav className="sidebar-nav">
            {adminTabs.map((tab) => (
              <button
                key={tab.key}
                className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-main-content">
          <div className="main-header">
            <h1>{getPageTitle()}</h1>
            <p>{getPageDescription()}</p>
          </div>
          
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDash;