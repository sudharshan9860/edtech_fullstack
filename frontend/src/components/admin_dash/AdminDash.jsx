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

// Import all existing modules
import Overview from './modules/Overview';
import Settings from './modules/Settings';
import StudentManagement from './modules/StudentManagement';
import TeacherManagement from './modules/TeacherManagement';
import ClassManagement from './modules/ClassManagement';
import ReportsAnalytics from './modules/ReportsAnalytics';
import AcademicRecords from './modules/AcademicRecords';

// Import the 4 new modules we just created
import SubjectManagement from './modules/SubjectManagement';
import AssignmentManagement from './modules/AssignmentManagement';
import ScheduleManagement from './modules/ScheduleManagement';
import NotificationManagement from './modules/NotificationManagement';

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
    { key: 'academic', label: 'Academic Records', icon: faDatabase },
    { key: 'subjects', label: 'Subject Management', icon: faBookOpen },
    { key: 'assignments', label: 'Assignment Management', icon: faFileAlt },
    { key: 'schedule', label: 'Schedule Management', icon: faCalendarAlt },
    { key: 'notifications', label: 'Notification Management', icon: faBell },
    { key: 'reports', label: 'Reports & Analytics', icon: faChartBar },
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
      
      // ✅ ALL WORKING MODULES (11 total)
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'academic':
        return <AcademicRecords />;
      case 'reports':
        return <ReportsAnalytics />;
      
      // ✅ NEW MODULES WE JUST CREATED
      case 'subjects':
        return <SubjectManagement />;
      case 'assignments':
        return <AssignmentManagement />;
      case 'schedule':
        return <ScheduleManagement />;
      case 'notifications':
        return <NotificationManagement />;
      
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