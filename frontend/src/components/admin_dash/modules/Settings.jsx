import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Settings.css';

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
  faMapMarker,
  faDownload,
  faUpload,
  faSync,
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
  faPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  const [settings, setSettings] = useState({
    general: {
      schoolName: 'AI Educator School',
      schoolAddress: '123 Education Street, Learning City',
      schoolPhone: '+91 98765 43210',
      schoolEmail: 'admin@aieducatorschool.edu',
      website: 'www.aieducatorschool.edu',
      establishedYear: '2010',
      principalName: 'Dr. Rajesh Kumar',
      timezone: 'Asia/Kolkata',
      academicYear: '2024-25',
      logo: null
    },
    academic: {
      sessionStart: '2024-04-01',
      sessionEnd: '2025-03-31',
      gradingSystem: 'percentage',
      passingMarks: 40,
      maxMarks: 100,
      attendanceRequired: 75,
      examTypes: ['Unit Test', 'Half Yearly', 'Final'],
      subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'],
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      schoolHours: { start: '08:00', end: '14:00' }
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      parentNotifications: true,
      teacherNotifications: true,
      adminNotifications: true,
      examReminders: true,
      feeReminders: true,
      attendanceAlerts: true,
      performanceReports: true
    },
    security: {
      passwordPolicy: 'strong',
      sessionTimeout: 60,
      twoFactorAuth: false,
      ipRestriction: false,
      auditLogging: true,
      dataEncryption: true,
      autoBackup: true,
      backupFrequency: 'daily',
      loginAttempts: 3
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3b82f6',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR',
      timeFormat: '24',
      dashboardLayout: 'default'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      lastBackup: '2024-06-25T10:30:00',
      backupLocation: 'cloud',
      cloudProvider: 'aws'
    }
  });

  const settingSections = [
    { key: 'general', label: 'General', icon: faSchool, description: 'School information and basic settings' },
    { key: 'academic', label: 'Academic', icon: faUser, description: 'Academic year and curriculum settings' },
    { key: 'notifications', label: 'Notifications', icon: faBell, description: 'Configure notification preferences' },
    { key: 'security', label: 'Security', icon: faLock, description: 'Security and authentication settings' },
    { key: 'appearance', label: 'Appearance', icon: faPalette, description: 'Theme and display preferences' },
    { key: 'backup', label: 'Backup & Data', icon: faDatabase, description: 'Data backup and recovery options' }
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

  const handleArraySettingChange = (section, key, index, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: prev[section][key].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (section, key, defaultValue = '') => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: [...prev[section][key], defaultValue]
      }
    }));
  };

  const removeArrayItem = (section, key, index) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: prev[section][key].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveStatus('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would make an API call here
      console.log('Saving settings:', settings);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset to default values
      window.location.reload();
    }
  };

  const handleBackupNow = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Backup completed successfully!');
      handleSettingChange('backup', 'lastBackup', new Date().toISOString());
    } catch (error) {
      alert('Backup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.bak,.sql,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Restore from ${file.name} would be processed here`);
      }
    };
    input.click();
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>General Settings</h3>
      
      <div className="settings-form-grid">
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
          <label>Academic Year</label>
          <input
            type="text"
            value={settings.general.academicYear}
            onChange={(e) => handleSettingChange('general', 'academicYear', e.target.value)}
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
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
      </div>
      
      <div className="setting-group full-width">
        <label>School Address</label>
        <textarea
          value={settings.general.schoolAddress}
          onChange={(e) => handleSettingChange('general', 'schoolAddress', e.target.value)}
          rows="3"
          className="setting-textarea"
        />
      </div>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="settings-section">
      <h3>Academic Settings</h3>
      
      <div className="settings-form-grid">
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
          <label>Passing Marks</label>
          <input
            type="number"
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
            value={settings.academic.attendanceRequired}
            onChange={(e) => handleSettingChange('academic', 'attendanceRequired', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
      </div>

      <div className="setting-group">
        <label>School Hours</label>
        <div className="academic-hours-grid">
          <div className="time-input-group">
            <label className="time-input-label">Start Time</label>
            <input
              type="time"
              value={settings.academic.schoolHours.start}
              onChange={(e) => handleSettingChange('academic', 'schoolHours', {...settings.academic.schoolHours, start: e.target.value})}
              className="setting-input"
            />
          </div>
          <div className="time-input-group">
            <label className="time-input-label">End Time</label>
            <input
              type="time"
              value={settings.academic.schoolHours.end}
              onChange={(e) => handleSettingChange('academic', 'schoolHours', {...settings.academic.schoolHours, end: e.target.value})}
              className="setting-input"
            />
          </div>
        </div>
      </div>

      <div className="setting-group">
        <label>Exam Types</label>
        <div>
          {settings.academic.examTypes.map((type, index) => (
            <div key={index} className="array-setting-item">
              <input
                type="text"
                value={type}
                onChange={(e) => handleArraySettingChange('academic', 'examTypes', index, e.target.value)}
                className="array-setting-input"
              />
              <button
                onClick={() => removeArrayItem('academic', 'examTypes', index)}
                className="array-remove-btn"
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('academic', 'examTypes', 'New Exam Type')}
            className="array-add-btn"
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Exam Type
          </button>
        </div>
      </div>

      <div className="setting-group">
        <label>Subjects</label>
        <div>
          {settings.academic.subjects.map((subject, index) => (
            <div key={index} className="array-setting-item">
              <input
                type="text"
                value={subject}
                onChange={(e) => handleArraySettingChange('academic', 'subjects', index, e.target.value)}
                className="array-setting-input"
              />
              <button
                onClick={() => removeArrayItem('academic', 'subjects', index)}
                className="array-remove-btn"
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('academic', 'subjects', 'New Subject')}
            className="array-add-btn"
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Subject
          </button>
        </div>
      </div>

      <div className="setting-group">
        <label>Working Days</label>
        <div>
          {settings.academic.workingDays.map((day, index) => (
            <div key={index} className="array-setting-item">
              <select
                value={day}
                onChange={(e) => handleArraySettingChange('academic', 'workingDays', index, e.target.value)}
                className="array-setting-input"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <button
                onClick={() => removeArrayItem('academic', 'workingDays', index)}
                className="array-remove-btn"
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('academic', 'workingDays', 'Monday')}
            className="array-add-btn"
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Working Day
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Settings</h3>
      
      <div className="settings-list">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="setting-item">
            <div className="setting-info">
              <h4>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p>
                {key === 'emailNotifications' && 'Send notifications via email'}
                {key === 'smsNotifications' && 'Send notifications via SMS'}
                {key === 'pushNotifications' && 'Send push notifications to mobile apps'}
                {key === 'parentNotifications' && 'Send notifications to parents'}
                {key === 'teacherNotifications' && 'Send notifications to teachers'}
                {key === 'adminNotifications' && 'Send notifications to administrators'}
                {key === 'examReminders' && 'Send reminders about upcoming exams'}
                {key === 'feeReminders' && 'Send reminders about fee payments'}
                {key === 'attendanceAlerts' && 'Send alerts for low attendance'}
                {key === 'performanceReports' && 'Send periodic performance reports'}
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      
      <div className="security-grid">
        <div className="setting-group">
          <label>Password Policy</label>
          <select
            value={settings.security.passwordPolicy}
            onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
            className="setting-select"
          >
            <option value="weak">Weak (6+ characters)</option>
            <option value="medium">Medium (8+ characters, mixed case)</option>
            <option value="strong">Strong (12+ characters, mixed case, numbers, symbols)</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Maximum Login Attempts</label>
          <input
            type="number"
            value={settings.security.loginAttempts}
            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
      </div>

      <div className="settings-list">
        {['twoFactorAuth', 'ipRestriction', 'auditLogging', 'dataEncryption', 'autoBackup'].map((key) => (
          <div key={key} className="setting-item">
            <div className="setting-info">
              <h4>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p>
                {key === 'twoFactorAuth' && 'Enable two-factor authentication for enhanced security'}
                {key === 'ipRestriction' && 'Restrict access to specific IP addresses'}
                {key === 'auditLogging' && 'Log all user activities for security monitoring'}
                {key === 'dataEncryption' && 'Encrypt sensitive data in the database'}
                {key === 'autoBackup' && 'Automatically backup data at regular intervals'}
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.security[key]}
                onChange={(e) => handleSettingChange('security', key, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3>Appearance Settings</h3>
      
      <div className="settings-form-grid">
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
          <div className="color-input-group">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className="setting-color"
            />
            <input
              type="text"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className="setting-input"
            />
          </div>
        </div>
        <div className="setting-group">
          <label>Language</label>
          <select
            value={settings.appearance.language}
            onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
            className="setting-select"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
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
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Time Format</label>
          <select
            value={settings.appearance.timeFormat}
            onChange={(e) => handleSettingChange('appearance', 'timeFormat', e.target.value)}
            className="setting-select"
          >
            <option value="12">12 Hour</option>
            <option value="24">24 Hour</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="settings-section">
      <h3>Backup & Data Management</h3>
      
      <div className="settings-form-grid">
        <div className="setting-group">
          <label>Backup Frequency</label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
            className="setting-select"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Retention Period (days)</label>
          <input
            type="number"
            value={settings.backup.retentionPeriod}
            onChange={(e) => handleSettingChange('backup', 'retentionPeriod', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
        <div className="setting-group">
          <label>Backup Location</label>
          <select
            value={settings.backup.backupLocation}
            onChange={(e) => handleSettingChange('backup', 'backupLocation', e.target.value)}
            className="setting-select"
          >
            <option value="local">Local Storage</option>
            <option value="cloud">Cloud Storage</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Cloud Provider</label>
          <select
            value={settings.backup.cloudProvider}
            onChange={(e) => handleSettingChange('backup', 'cloudProvider', e.target.value)}
            className="setting-select"
            disabled={settings.backup.backupLocation === 'local'}
          >
            <option value="aws">Amazon AWS</option>
            <option value="google">Google Cloud</option>
            <option value="azure">Microsoft Azure</option>
            <option value="dropbox">Dropbox</option>
          </select>
        </div>
      </div>

      <div className="backup-info-section">
        <div className="backup-info-header">
          <FontAwesomeIcon icon={faInfoCircle} className="backup-info-icon" />
          <h4 className="backup-info-title">Last Backup Information</h4>
        </div>
        <p className="backup-info-text">
          Last backup completed on: {new Date(settings.backup.lastBackup).toLocaleString()}
        </p>
      </div>

      <div className="backup-actions">
        <div className="backup-card">
          <div className="backup-info">
            <h4>Create Backup</h4>
            <p>Create a manual backup of your data</p>
            <small>This will create a complete backup of all school data</small>
          </div>
          <div className="backup-buttons">
            <button
              onClick={handleBackupNow}
              disabled={isLoading}
              className={`backup-btn success ${isLoading ? 'spinning' : ''}`}
            >
              <FontAwesomeIcon icon={isLoading ? faSync : faDownload} className="backup-icon" />
              <span>{isLoading ? 'Creating Backup...' : 'Backup Now'}</span>
            </button>
          </div>
        </div>
        <div className="backup-card">
          <div className="backup-info">
            <h4>Restore Backup</h4>
            <p>Restore data from a previous backup</p>
            <small>Select a backup file to restore your data</small>
          </div>
          <div className="backup-buttons">
            <button
              onClick={handleRestoreBackup}
              className="backup-btn warning"
            >
              <FontAwesomeIcon icon={faUpload} className="backup-icon" />
              <span>Restore Backup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'academic':
        return renderAcademicSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="settings">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-title-section">
            <h1>Settings</h1>
            <p>Configure system preferences and school settings</p>
          </div>
          <div className="settings-header-actions">
            <button
              onClick={handleResetSettings}
              className="settings-btn secondary"
            >
              <FontAwesomeIcon icon={faUndo} />
              <span>Reset to Default</span>
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className={`settings-btn primary ${isLoading ? 'spinning' : ''}`}
            >
              <FontAwesomeIcon icon={isLoading ? faSync : faSave} className="settings-icon" />
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`settings-save-status ${saveStatus}`}>
          <FontAwesomeIcon icon={saveStatus === 'success' ? faCheck : faExclamationTriangle} />
          <span>{saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings. Please try again.'}</span>
        </div>
      )}

      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-nav">
            {settingSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`settings-nav-item ${activeSection === section.key ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={section.icon} className="settings-nav-icon" />
                <div className="settings-nav-text">
                  <div>{section.label}</div>
                  <div className="settings-nav-desc">{section.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;