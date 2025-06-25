//no css but updated functionality


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
  faMapMarker,
  faDownload,
  faUpload,
  faSync,
  faCheck,
  faExclamationTriangle,
  faInfoCircle
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">General Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
          <input
            type="text"
            value={settings.general.schoolName}
            onChange={(e) => handleSettingChange('general', 'schoolName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Principal Name</label>
          <input
            type="text"
            value={settings.general.principalName}
            onChange={(e) => handleSettingChange('general', 'principalName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={settings.general.schoolPhone}
            onChange={(e) => handleSettingChange('general', 'schoolPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={settings.general.schoolEmail}
            onChange={(e) => handleSettingChange('general', 'schoolEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={settings.general.website}
            onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
          <input
            type="number"
            value={settings.general.establishedYear}
            onChange={(e) => handleSettingChange('general', 'establishedYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
          <input
            type="text"
            value={settings.general.academicYear}
            onChange={(e) => handleSettingChange('general', 'academicYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
        <textarea
          value={settings.general.schoolAddress}
          onChange={(e) => handleSettingChange('general', 'schoolAddress', e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Academic Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Start Date</label>
          <input
            type="date"
            value={settings.academic.sessionStart}
            onChange={(e) => handleSettingChange('academic', 'sessionStart', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session End Date</label>
          <input
            type="date"
            value={settings.academic.sessionEnd}
            onChange={(e) => handleSettingChange('academic', 'sessionEnd', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grading System</label>
          <select
            value={settings.academic.gradingSystem}
            onChange={(e) => handleSettingChange('academic', 'gradingSystem', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="percentage">Percentage</option>
            <option value="gpa">GPA (10 Point)</option>
            <option value="letter">Letter Grades</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Passing Marks</label>
          <input
            type="number"
            value={settings.academic.passingMarks}
            onChange={(e) => handleSettingChange('academic', 'passingMarks', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Marks</label>
          <input
            type="number"
            value={settings.academic.maxMarks}
            onChange={(e) => handleSettingChange('academic', 'maxMarks', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Required Attendance (%)</label>
          <input
            type="number"
            value={settings.academic.attendanceRequired}
            onChange={(e) => handleSettingChange('academic', 'attendanceRequired', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">School Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Time</label>
            <input
              type="time"
              value={settings.academic.schoolHours.start}
              onChange={(e) => handleSettingChange('academic', 'schoolHours', {...settings.academic.schoolHours, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Time</label>
            <input
              type="time"
              value={settings.academic.schoolHours.end}
              onChange={(e) => handleSettingChange('academic', 'schoolHours', {...settings.academic.schoolHours, end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Exam Types</label>
        <div className="space-y-2">
          {settings.academic.examTypes.map((type, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={type}
                onChange={(e) => handleArraySettingChange('academic', 'examTypes', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeArrayItem('academic', 'examTypes', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('academic', 'examTypes', 'New Exam Type')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Exam Type
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Notification Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p className="text-sm text-gray-600">
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
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Security Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
          <select
            value={settings.security.passwordPolicy}
            onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weak">Weak (6+ characters)</option>
            <option value="medium">Medium (8+ characters, mixed case)</option>
            <option value="strong">Strong (12+ characters, mixed case, numbers, symbols)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Login Attempts</label>
          <input
            type="number"
            value={settings.security.loginAttempts}
            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {['twoFactorAuth', 'ipRestriction', 'auditLogging', 'dataEncryption', 'autoBackup'].map((key) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p className="text-sm text-gray-600">
                {key === 'twoFactorAuth' && 'Enable two-factor authentication for enhanced security'}
                {key === 'ipRestriction' && 'Restrict access to specific IP addresses'}
                {key === 'auditLogging' && 'Log all user activities for security monitoring'}
                {key === 'dataEncryption' && 'Encrypt sensitive data in the database'}
                {key === 'autoBackup' && 'Automatically backup data at regular intervals'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security[key]}
                onChange={(e) => handleSettingChange('security', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Appearance Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.appearance.language}
            onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.appearance.dateFormat}
            onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.appearance.currency}
            onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
          <select
            value={settings.appearance.timeFormat}
            onChange={(e) => handleSettingChange('appearance', 'timeFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="12">12 Hour</option>
            <option value="24">24 Hour</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Backup & Data Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
          <input
            type="number"
            value={settings.backup.retentionPeriod}
            onChange={(e) => handleSettingChange('backup', 'retentionPeriod', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Location</label>
          <select
            value={settings.backup.backupLocation}
            onChange={(e) => handleSettingChange('backup', 'backupLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="local">Local Storage</option>
            <option value="cloud">Cloud Storage</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cloud Provider</label>
          <select
            value={settings.backup.cloudProvider}
            onChange={(e) => handleSettingChange('backup', 'cloudProvider', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={settings.backup.backupLocation === 'local'}
          >
            <option value="aws">Amazon AWS</option>
            <option value="google">Google Cloud</option>
            <option value="azure">Microsoft Azure</option>
            <option value="dropbox">Dropbox</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">Last Backup Information</h4>
        </div>
        <p className="text-blue-800 text-sm">
          Last backup completed on: {new Date(settings.backup.lastBackup).toLocaleString()}
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleBackupNow}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={isLoading ? faSync : faDownload} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Creating Backup...' : 'Backup Now'}</span>
        </button>
        <button
          onClick={handleRestoreBackup}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <FontAwesomeIcon icon={faUpload} />
          <span>Restore Backup</span>
        </button>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure system preferences and school settings</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleResetSettings}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <FontAwesomeIcon icon={faUndo} />
              <span>Reset to Default</span>
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={isLoading ? faSync : faSave} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          saveStatus === 'success' 
            ? 'bg-green-100 border border-green-200 text-green-800' 
            : 'bg-red-100 border border-red-200 text-red-800'
        }`}>
          <FontAwesomeIcon icon={saveStatus === 'success' ? faCheck : faExclamationTriangle} />
          <span>{saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings. Please try again.'}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {settingSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full p-4 text-left border-b border-gray-100 transition-colors ${
                  activeSection === section.key
                    ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={section.icon} className="text-lg" />
                  <div>
                    <p className="font-medium">{section.label}</p>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;