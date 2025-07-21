// frontend/src/components/admin_dash/AdminDash.jsx
import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faChartBar,
  faFileAlt,
  faSchool,
  faCog,
  faDatabase,
  faUserGraduate,
  faChalkboardTeacher,
  faBookOpen,
  faCalendarAlt,
  faBell,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../AuthContext';
import Overview from './modules/Overview';
import Settings from './modules/Settings';
// Import CSS (use relative path since we're in admin_dash folder)
import './styles/AdminDash.css';

const AdminDash = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { username } = useContext(AuthContext);

  // Navigation items for admin sidebar
  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: faTachometerAlt },
    { key: 'students', label: 'Student Management', icon: faUserGraduate },
    { key: 'teachers', label: 'Teacher Management', icon: faChalkboardTeacher },
    { key: 'classes', label: 'Class Management', icon: faSchool },
    { key: 'subjects', label: 'Subject Management', icon: faBookOpen },
    { key: 'reports', label: 'Reports & Analytics', icon: faChartBar },
    { key: 'assignments', label: 'Assignments', icon: faFileAlt },
    { key: 'schedule', label: 'Schedule', icon: faCalendarAlt },
    { key: 'notifications', label: 'Notifications', icon: faBell },
    { key: 'settings', label: 'Settings', icon: faCog }
  ];

  const handleSectionChange = (sectionKey) => {
    setActiveSection(sectionKey);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'settings':
        return <Settings />;
      case 'students':
        return (
          <div className="admin-content-placeholder">
            <h2>Student Management</h2>
            <p>Student management functionality will be implemented here.</p>
          </div>
        );
      case 'teachers':
        return (
          <div className="admin-content-placeholder">
            <h2>Teacher Management</h2>
            <p>Teacher management functionality will be implemented here.</p>
          </div>
        );
      case 'classes':
        return (
          <div className="admin-content-placeholder">
            <h2>Class Management</h2>
            <p>Class management functionality will be implemented here.</p>
          </div>
        );
      case 'subjects':
        return (
          <div className="admin-content-placeholder">
            <h2>Subject Management</h2>
            <p>Subject management functionality will be implemented here.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="admin-content-placeholder">
            <h2>Reports & Analytics</h2>
            <p>Reports and analytics functionality will be implemented here.</p>
          </div>
        );
      case 'assignments':
        return (
          <div className="admin-content-placeholder">
            <h2>Assignment Management</h2>
            <p>Assignment management functionality will be implemented here.</p>
          </div>
        );
      case 'schedule':
        return (
          <div className="admin-content-placeholder">
            <h2>Schedule Management</h2>
            <p>Schedule management functionality will be implemented here.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="admin-content-placeholder">
            <h2>Notification Management</h2>
            <p>Notification management functionality will be implemented here.</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-content-wrapper">
        {/* Admin Sidebar */}
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <h2>Admin Panel</h2>
            <p>Welcome back, {username}</p>
          </div>
          
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleSectionChange(item.key)}
                className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="admin-main-content">
          <div className="main-header">
            <h1>{sidebarItems.find(item => item.key === activeSection)?.label || 'Dashboard'}</h1>
            <p>Manage your educational institution efficiently</p>
          </div>
          
          <div className="main-content">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;