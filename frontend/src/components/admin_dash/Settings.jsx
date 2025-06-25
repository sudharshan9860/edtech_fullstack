// src/components/admin/Settings.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faUser,
  faSchool,
  faBell,
  faLock,
  faDatabase,
  faPalette,
  faGlobe,
  faSave,
  faUndo,
  faShield,
  faEnvelope,
  faPhone,
  faMapMarker
} from '@fortawesome/free-solid-svg-icons';
import './admin.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      schoolName: 'AI Educator School',
      schoolAddress: '123 Education Street, Learning City',
      schoolPhone: '+91 98765 43210',
      schoolEmail: 'admin@aieducatorschool.edu',
      website: 'www.aieducatorschool.edu',
      establishedYear: '2010',
      principalName: 'Dr. Rajesh Kumar',
      timezone: 'Asia/Kolkata'
    },
    academic: {
      academicYear: '2024-25',
      sessionStart: '2024-04-01',
      sessionEnd: '2025-03-31',
      gradingSystem: 'percentage',
      passingMarks: 40,
      maxMarks: 100,
      attendanceRequired: 75,
      examTypes: ['Unit Test', 'Half Yearly', 'Final']
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      parentNotifications: true,
      teacherNotifications: true,
      adminNotifications: true,
      examReminders: true,
      feeReminders: true
    },
    security: {
      passwordPolicy: 'strong',
      sessionTimeout: 60,
      twoFactorAuth: false,
      ipRestriction: false,
      auditLogging: true,
      dataEncryption: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3b82f6',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR'
    }
  });

  const settingSections = [
    { key: 'general', label: 'General', icon: faSchool },
    { key: 'academic', label: 'Academic', icon: faUser },
    { key: 'notifications', label: 'Notifications', icon: faBell },
    { key: 'security', label: 'Security', icon: faLock },
    { key: 'appearance', label: 'Appearance', icon: faPalette },
    { key: 'backup', label: 'Backup & Data', icon: faDatabase }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // API call to save settings
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      console.log('Resetting settings');
    }
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>General Settings</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>School Name</label>
          <input
            type="text"
            value={settings.general.schoolName}
            onChange={(e) => handleSettingChange('general', 'schoolName', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Principal Name</label>
          <input
            type="text"
            value={settings.general.principalName}
            onChange={(e) => handleSettingChange('general', 'principalName', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>School Address</label>
          <textarea
            value={settings.general.schoolAddress}
            onChange={(e) => handleSettingChange('general', 'schoolAddress', e.target.value)}
            className="setting-textarea"
            rows="3"
          />
        </div>
        <div className="setting-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={settings.general.schoolPhone}
            onChange={(e) => handleSettingChange('general', 'schoolPhone', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Email Address</label>
          <input
            type="email"
            value={settings.general.schoolEmail}
            onChange={(e) => handleSettingChange('general', 'schoolEmail', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Website</label>
          <input
            type="url"
            value={settings.general.website}
            onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Established Year</label>
          <input
            type="number"
            value={settings.general.establishedYear}
            onChange={(e) => handleSettingChange('general', 'establishedYear', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="setting-select"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="settings-section">
      <h3>Academic Settings</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Academic Year</label>
          <input
            type="text"
            value={settings.academic.academicYear}
            onChange={(e) => handleSettingChange('academic', 'academicYear', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Session Start Date</label>
          <input
            type="date"
            value={settings.academic.sessionStart}
            onChange={(e) => handleSettingChange('academic', 'sessionStart', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Session End Date</label>
          <input
            type="date"
            value={settings.academic.sessionEnd}
            onChange={(e) => handleSettingChange('academic', 'sessionEnd', e.target.value)}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Grading System</label>
          <select
            value={settings.academic.gradingSystem}
            onChange={(e) => handleSettingChange('academic', 'gradingSystem', e.target.value)}
            className="setting-select"
          >
            <option value="percentage">Percentage</option>
            <option value="gpa">GPA (10 Point)</option>
            <option value="letter">Letter Grades</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Passing Marks (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.academic.passingMarks}
            onChange={(e) => handleSettingChange('academic', 'passingMarks', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Maximum Marks</label>
          <input
            type="number"
            value={settings.academic.maxMarks}
            onChange={(e) => handleSettingChange('academic', 'maxMarks', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Required Attendance (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.academic.attendanceRequired}
            onChange={(e) => handleSettingChange('academic', 'attendanceRequired', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Settings</h3>
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <h4>Email Notifications</h4>
            <p>Send notifications via email</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>SMS Notifications</h4>
            <p>Send notifications via SMS</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Push Notifications</h4>
            <p>Send browser push notifications</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Parent Notifications</h4>
            <p>Send notifications to parents</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.parentNotifications}
              onChange={(e) => handleSettingChange('notifications', 'parentNotifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Exam Reminders</h4>
            <p>Send exam schedule reminders</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.examReminders}
              onChange={(e) => handleSettingChange('notifications', 'examReminders', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Fee Reminders</h4>
            <p>Send fee payment reminders</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.feeReminders}
              onChange={(e) => handleSettingChange('notifications', 'feeReminders', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <h4>Two-Factor Authentication</h4>
            <p>Enable 2FA for admin accounts</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Audit Logging</h4>
            <p>Log all user activities</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.security.auditLogging}
              onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Data Encryption</h4>
            <p>Encrypt sensitive data</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.security.dataEncryption}
              onChange={(e) => handleSettingChange('security', 'dataEncryption', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-group">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            min="5"
            max="480"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Password Policy</label>
          <select
            value={settings.security.passwordPolicy}
            onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
            className="setting-select"
          >
            <option value="basic">Basic (6+ characters)</option>
            <option value="medium">Medium (8+ chars, numbers)</option>
            <option value="strong">Strong (8+ chars, numbers, symbols)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3>Appearance Settings</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Theme</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            className="setting-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Primary Color</label>
          <input
            type="color"
            value={settings.appearance.primaryColor}
            onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
            className="setting-color"
          />
        </div>
        <div className="setting-group">
          <label>Language</label>
          <select
            value={settings.appearance.language}
            onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
            className="setting-select"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Date Format</label>
          <select
            value={settings.appearance.dateFormat}
            onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
            className="setting-select"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Currency</label>
          <select
            value={settings.appearance.currency}
            onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
            className="setting-select"
          >
            <option value="INR">₹ Indian Rupee</option>
            <option value="USD">$ US Dollar</option>
            <option value="EUR">€ Euro</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="settings-section">
      <h3>Backup & Data Management</h3>
      <div className="backup-actions">
        <div className="backup-card">
          <div className="backup-info">
            <h4>Database Backup</h4>
            <p>Create a backup of all school data</p>
            <small>Last backup: June 20, 2024 at 2:30 PM</small>
          </div>
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faDatabase} />
            Create Backup
          </button>
        </div>
        <div className="backup-card">
          <div className="backup-info">
            <h4>Export Student Data</h4>
            <p>Export student records as CSV/Excel</p>
          </div>
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faDownload} />
            Export Data
          </button>
        </div>
        <div className="backup-card">
          <div className="backup-info">
            <h4>System Restore</h4>
            <p>Restore from a previous backup</p>
          </div>
          <button className="btn btn-warning">
            <FontAwesomeIcon icon={faUndo} />
            Restore System
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings">
      <div className="page-header">
        <div className="header-content">
          <h1>Settings</h1>
          <p>Configure system preferences and school settings</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleResetSettings}>
            <FontAwesomeIcon icon={faUndo} />
            Reset to Default
          </button>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            <FontAwesomeIcon icon={faSave} />
            Save Settings
          </button>
        </div>
      </div>

      <div className="settings-container">
        {/* Settings Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {settingSections.map(section => (
              <button
                key={section.key}
                className={`settings-nav-item ${activeSection === section.key ? 'active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                <FontAwesomeIcon icon={section.icon} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeSection === 'general' && renderGeneralSettings()}
          {activeSection === 'academic' && renderAcademicSettings()}
          {activeSection === 'notifications' && renderNotificationSettings()}
          {activeSection === 'security' && renderSecuritySettings()}
          {activeSection === 'appearance' && renderAppearanceSettings()}
          {activeSection === 'backup' && renderBackupSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;