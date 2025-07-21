import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/NotificationManagement.css';
import {
  faBell,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faPaperPlane,
  faEye,
  faTimes,
  faCheck,
  faUsers,
  faCalendarAlt,
  faClock,
  faEnvelope,
  faSms,
  faMobileAlt,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faUserGraduate,
  faChalkboardTeacher,
  faUserFriends,
  faHistory,
  faChartLine,
  faCog,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState('send'); // send, history, templates, settings
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Parent-Teacher Meeting Reminder',
      message: 'Dear parents, this is a reminder about the upcoming parent-teacher meeting scheduled for this Friday at 2:00 PM.',
      type: 'Meeting',
      priority: 'high',
      recipients: ['Parents - Class 10A', 'Parents - Class 10B'],
      channels: ['email', 'sms'],
      status: 'sent',
      sentDate: '2024-02-15T10:30:00',
      deliveredCount: 85,
      readCount: 72,
      totalRecipients: 90,
      sender: 'Admin',
      scheduled: false
    },
    {
      id: 2,
      title: 'Exam Schedule Published',
      message: 'The final examination schedule for Class 12 has been published. Please check the student portal for detailed timings.',
      type: 'Academic',
      priority: 'high',
      recipients: ['Students - Class 12', 'Parents - Class 12'],
      channels: ['email', 'push'],
      status: 'sent',
      sentDate: '2024-02-14T14:20:00',
      deliveredCount: 128,
      readCount: 115,
      totalRecipients: 130,
      sender: 'Academic Office',
      scheduled: false
    },
    {
      id: 3,
      title: 'Fee Payment Due Reminder',
      message: 'This is a gentle reminder that the quarterly fee payment is due by February 25th, 2024.',
      type: 'Administrative',
      priority: 'medium',
      recipients: ['All Parents'],
      channels: ['email', 'sms'],
      status: 'scheduled',
      sentDate: '2024-02-20T09:00:00',
      deliveredCount: 0,
      readCount: 0,
      totalRecipients: 450,
      sender: 'Finance Office',
      scheduled: true
    },
    {
      id: 4,
      title: 'School Closure - Weather Alert',
      message: 'Due to severe weather conditions, the school will remain closed tomorrow. All classes and activities are postponed.',
      type: 'Emergency',
      priority: 'urgent',
      recipients: ['All Students', 'All Parents', 'All Staff'],
      channels: ['email', 'sms', 'push'],
      status: 'sent',
      sentDate: '2024-02-13T18:45:00',
      deliveredCount: 892,
      readCount: 856,
      totalRecipients: 900,
      sender: 'Emergency Alert System',
      scheduled: false
    }
  ]);

  // Templates data
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Fee Payment Reminder',
      category: 'Administrative',
      subject: 'Fee Payment Due Reminder',
      message: 'Dear {{parent_name}}, this is a reminder that the {{fee_type}} payment of {{amount}} is due by {{due_date}}. Please make the payment to avoid late fees.',
      variables: ['parent_name', 'fee_type', 'amount', 'due_date'],
      createdDate: '2024-01-15',
      usageCount: 25
    },
    {
      id: 2,
      name: 'Assignment Submission',
      category: 'Academic',
      subject: 'Assignment Submission Reminder',
      message: 'Dear {{student_name}}, your {{assignment_name}} for {{subject}} is due on {{due_date}}. Please submit before the deadline.',
      variables: ['student_name', 'assignment_name', 'subject', 'due_date'],
      createdDate: '2024-01-20',
      usageCount: 15
    },
    {
      id: 3,
      name: 'Event Invitation',
      category: 'Events',
      subject: '{{event_name}} - Invitation',
      message: 'You are cordially invited to {{event_name}} on {{event_date}} at {{event_time}}. Venue: {{venue}}. Please confirm your attendance.',
      variables: ['event_name', 'event_date', 'event_time', 'venue'],
      createdDate: '2024-01-25',
      usageCount: 8
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'General',
    priority: 'medium',
    recipients: [],
    channels: ['email'],
    scheduled: false,
    scheduleDate: '',
    scheduleTime: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'General',
    subject: '',
    message: '',
    variables: []
  });

  // Options
  const notificationTypes = ['General', 'Academic', 'Administrative', 'Meeting', 'Event', 'Emergency', 'Fee'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const channels = [
    { id: 'email', name: 'Email', icon: faEnvelope },
    { id: 'sms', name: 'SMS', icon: faSms },
    { id: 'push', name: 'Push Notification', icon: faMobileAlt }
  ];
  const recipientGroups = [
    'All Students',
    'All Parents',
    'All Teachers',
    'All Staff',
    'Students - Class 9',
    'Students - Class 10',
    'Students - Class 11', 
    'Students - Class 12',
    'Parents - Class 9',
    'Parents - Class 10',
    'Parents - Class 11',
    'Parents - Class 12'
  ];

  const templateCategories = ['General', 'Academic', 'Administrative', 'Events', 'Emergency', 'Fee'];

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || notification.type === filterType;
    const matchesStatus = filterStatus === '' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSendNotification = () => {
    if (newNotification.title && newNotification.message && newNotification.recipients.length > 0) {
      const newId = Math.max(...notifications.map(n => n.id)) + 1;
      const notification = {
        ...newNotification,
        id: newId,
        status: newNotification.scheduled ? 'scheduled' : 'sent',
        sentDate: newNotification.scheduled ? 
          new Date(`${newNotification.scheduleDate}T${newNotification.scheduleTime}`).toISOString() : 
          new Date().toISOString(),
        deliveredCount: newNotification.scheduled ? 0 : Math.floor(Math.random() * 100) + 50,
        readCount: newNotification.scheduled ? 0 : Math.floor(Math.random() * 80) + 30,
        totalRecipients: newNotification.recipients.length * 50, // Estimate
        sender: 'Admin'
      };
      
      setNotifications([notification, ...notifications]);
      setNewNotification({
        title: '',
        message: '',
        type: 'General',
        priority: 'medium',
        recipients: [],
        channels: ['email'],
        scheduled: false,
        scheduleDate: '',
        scheduleTime: ''
      });
      setShowSendModal(false);
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.message) {
      const newId = Math.max(...templates.map(t => t.id)) + 1;
      const template = {
        ...newTemplate,
        id: newId,
        createdDate: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      
      setTemplates([template, ...templates]);
      setNewTemplate({
        name: '',
        category: 'General',
        subject: '',
        message: '',
        variables: []
      });
      setShowTemplateModal(false);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleRecipientToggle = (recipient) => {
    const updatedRecipients = newNotification.recipients.includes(recipient)
      ? newNotification.recipients.filter(r => r !== recipient)
      : [...newNotification.recipients, recipient];
    setNewNotification({ ...newNotification, recipients: updatedRecipients });
  };

  const handleChannelToggle = (channel) => {
    const updatedChannels = newNotification.channels.includes(channel)
      ? newNotification.channels.filter(c => c !== channel)
      : [...newNotification.channels, channel];
    setNewNotification({ ...newNotification, channels: updatedChannels });
  };

  const getStatusClass = (status) => {
    return `notification-status-badge ${status}`;
  };

  const getPriorityClass = (priority) => {
    return `notification-priority-badge ${priority}`;
  };

  const getTypeClass = (type) => {
    return `notification-type-badge ${type.toLowerCase()}`;
  };

  const getDeliveryRate = (notification) => {
    return Math.round((notification.deliveredCount / notification.totalRecipients) * 100);
  };

  const getReadRate = (notification) => {
    return notification.deliveredCount > 0 ? 
      Math.round((notification.readCount / notification.deliveredCount) * 100) : 0;
  };

  const renderSendNotification = () => (
    <div className="send-notification-section">
      <div className="send-notification-header">
        <div className="section-title">
          <h3>Send New Notification</h3>
          <p>Create and send notifications to students, parents, and staff</p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          className="notification-btn primary"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Notification
        </button>
      </div>

      {/* Quick Stats */}
      <div className="notification-quick-stats">
        <div className="quick-stat-card">
          <div className="quick-stat-icon">
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{notifications.filter(n => n.status === 'sent').length}</span>
            <span className="quick-stat-label">Sent Today</span>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{notifications.filter(n => n.status === 'scheduled').length}</span>
            <span className="quick-stat-label">Scheduled</span>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{notifications.reduce((sum, n) => sum + n.totalRecipients, 0)}</span>
            <span className="quick-stat-label">Total Reached</span>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">
              {Math.round(notifications.reduce((sum, n) => sum + getReadRate(n), 0) / notifications.length)}%
            </span>
            <span className="quick-stat-label">Avg Read Rate</span>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="recent-notifications">
        <h4>Recent Notifications</h4>
        <div className="recent-notifications-list">
          {notifications.slice(0, 5).map(notification => (
            <div key={notification.id} className="recent-notification-item">
              <div className="recent-notification-content">
                <div className="recent-notification-header">
                  <h5>{notification.title}</h5>
                  <span className={getStatusClass(notification.status)}>{notification.status}</span>
                </div>
                <p className="recent-notification-message">{notification.message.substring(0, 100)}...</p>
                <div className="recent-notification-meta">
                  <span className="notification-date">
                    {new Date(notification.sentDate).toLocaleDateString()}
                  </span>
                  <span className="notification-recipients">
                    {notification.totalRecipients} recipients
                  </span>
                  <span className="notification-delivery">
                    {getDeliveryRate(notification)}% delivered
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationHistory = () => (
    <div className="notification-history-section">
      <div className="history-header">
        <div className="history-controls">
          <div className="history-search">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="notification-search-input"
            />
          </div>
          <div className="history-filters">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="notification-filter-select"
            >
              <option value="">All Types</option>
              {notificationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="notification-filter-select"
            >
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="notifications-table">
        <div className="notifications-table-header">
          <h3>All Notifications ({filteredNotifications.length})</h3>
        </div>
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <div key={notification.id} className="notification-row">
              <div className="notification-main-content">
                <div className="notification-header-row">
                  <div className="notification-title-section">
                    <h4>{notification.title}</h4>
                    <div className="notification-badges">
                      <span className={getTypeClass(notification.type)}>{notification.type}</span>
                      <span className={getPriorityClass(notification.priority)}>{notification.priority}</span>
                      <span className={getStatusClass(notification.status)}>{notification.status}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button
                      onClick={() => setSelectedNotification(notification)}
                      className="notification-action-btn view"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="notification-action-btn delete"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                
                <div className="notification-message">
                  <p>{notification.message}</p>
                </div>
                
                <div className="notification-details-row">
                  <div className="notification-meta">
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>{new Date(notification.sentDate).toLocaleString()}</span>
                    </div>
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faUsers} />
                      <span>{notification.recipients.join(', ')}</span>
                    </div>
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faUserFriends} />
                      <span>By {notification.sender}</span>
                    </div>
                  </div>
                  
                  <div className="notification-channels">
                    {notification.channels.map(channel => {
                      const channelInfo = channels.find(c => c.id === channel);
                      return (
                        <span key={channel} className="channel-badge">
                          <FontAwesomeIcon icon={channelInfo?.icon || faBell} />
                          {channelInfo?.name || channel}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {notification.status === 'sent' && (
                  <div className="notification-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Recipients:</span>
                      <span className="stat-value">{notification.totalRecipients}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Delivered:</span>
                      <span className="stat-value">{notification.deliveredCount} ({getDeliveryRate(notification)}%)</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Read:</span>
                      <span className="stat-value">{notification.readCount} ({getReadRate(notification)}%)</span>
                    </div>
                    <div className="delivery-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${getDeliveryRate(notification)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="templates-section">
      <div className="templates-header">
        <div className="section-title">
          <h3>Notification Templates</h3>
          <p>Create and manage reusable notification templates</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="notification-btn primary"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Template
        </button>
      </div>

      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <div className="template-title-section">
                <h4>{template.name}</h4>
                <span className="template-category">{template.category}</span>
              </div>
              <div className="template-actions">
                <button
                  onClick={() => {
                    // Use template for new notification
                    setNewNotification({
                      ...newNotification,
                      title: template.subject,
                      message: template.message,
                      type: template.category
                    });
                    setShowSendModal(true);
                  }}
                  className="template-action-btn use"
                  title="Use Template"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="template-action-btn delete"
                  title="Delete Template"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            
            <div className="template-content">
              <div className="template-subject">
                <strong>Subject:</strong> {template.subject}
              </div>
              <div className="template-message">
                <strong>Message:</strong>
                <p>{template.message.substring(0, 150)}...</p>
              </div>
              {template.variables.length > 0 && (
                <div className="template-variables">
                  <strong>Variables:</strong>
                  <div className="variables-list">
                    {template.variables.map(variable => (
                      <span key={variable} className="variable-tag">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="template-footer">
              <div className="template-meta">
                <span>Created: {new Date(template.createdDate).toLocaleDateString()}</span>
                <span>Used: {template.usageCount} times</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-section">
      <div className="settings-placeholder">
        <FontAwesomeIcon icon={faCog} />
        <h3>Notification Settings</h3>
        <p>Configure notification preferences and automation rules</p>
        <p>Features will include:</p>
        <ul>
          <li>Default notification channels</li>
          <li>Automated notification triggers</li>
          <li>Sender email configuration</li>
          <li>SMS gateway settings</li>
          <li>Push notification setup</li>
          <li>Delivery scheduling rules</li>
          <li>User preferences management</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="notification-management">
      {/* Header */}
      <div className="notification-header">
        <div className="notification-header-content">
          <div className="notification-title-section">
            <h1>Notification Management</h1>
            <p>Send announcements, alerts, and updates to students, parents, and staff</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="notification-tabs">
        <button
          onClick={() => setActiveTab('send')}
          className={`notification-tab ${activeTab === 'send' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          Send Notification
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`notification-tab ${activeTab === 'history' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faHistory} />
          History
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`notification-tab ${activeTab === 'templates' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faClipboardList} />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`notification-tab ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faCog} />
          Settings
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="notification-content">
        {activeTab === 'send' && renderSendNotification()}
        {activeTab === 'history' && renderNotificationHistory()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="notification-modal-overlay">
          <div className="notification-modal large">
            <div className="notification-modal-header">
              <h2 className="notification-modal-title">Create New Notification</h2>
              <button
                onClick={() => setShowSendModal(false)}
                className="notification-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="notification-modal-body">
              <div className="notification-form-grid">
                <div className="notification-form-group">
                  <label className="notification-form-label">Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="notification-form-input"
                    placeholder="Enter notification title"
                  />
                </div>
                <div className="notification-form-group">
                  <label className="notification-form-label">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="notification-form-select"
                  >
                    {notificationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="notification-form-group">
                  <label className="notification-form-label">Priority</label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                    className="notification-form-select"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div className="notification-form-group">
                  <label className="notification-form-label">
                    <input
                      type="checkbox"
                      checked={newNotification.scheduled}
                      onChange={(e) => setNewNotification({...newNotification, scheduled: e.target.checked})}
                      className="notification-checkbox"
                    />
                    Schedule for later
                  </label>
                </div>
                {newNotification.scheduled && (
                  <>
                    <div className="notification-form-group">
                      <label className="notification-form-label">Schedule Date</label>
                      <input
                        type="date"
                        value={newNotification.scheduleDate}
                        onChange={(e) => setNewNotification({...newNotification, scheduleDate: e.target.value})}
                        className="notification-form-input"
                      />
                    </div>
                    <div className="notification-form-group">
                      <label className="notification-form-label">Schedule Time</label>
                      <input
                        type="time"
                        value={newNotification.scheduleTime}
                        onChange={(e) => setNewNotification({...newNotification, scheduleTime: e.target.value})}
                        className="notification-form-input"
                      />
                    </div>
                  </>
                )}
                <div className="notification-form-group full-width">
                  <label className="notification-form-label">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    className="notification-form-textarea"
                    placeholder="Enter your notification message"
                    rows="5"
                  />
                </div>
                <div className="notification-form-group full-width">
                  <label className="notification-form-label">Recipients</label>
                  <div className="recipients-grid">
                    {recipientGroups.map(group => (
                      <div key={group} className="recipient-item">
                        <input
                          type="checkbox"
                          checked={newNotification.recipients.includes(group)}
                          onChange={() => handleRecipientToggle(group)}
                          className="notification-checkbox"
                        />
                        <label className="recipient-label">{group}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="notification-form-group full-width">
                  <label className="notification-form-label">Delivery Channels</label>
                  <div className="channels-grid">
                    {channels.map(channel => (
                      <div key={channel.id} className="channel-item">
                        <input
                          type="checkbox"
                          checked={newNotification.channels.includes(channel.id)}
                          onChange={() => handleChannelToggle(channel.id)}
                          className="notification-checkbox"
                        />
                        <label className="channel-label">
                          <FontAwesomeIcon icon={channel.icon} />
                          {channel.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="notification-modal-footer">
              <button
                onClick={() => setShowSendModal(false)}
                className="notification-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="notification-modal-btn submit"
              >
                {newNotification.scheduled ? 'Schedule Notification' : 'Send Notification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="notification-modal-overlay">
          <div className="notification-modal">
            <div className="notification-modal-header">
              <h2 className="notification-modal-title">Create Template</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="notification-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="notification-modal-body">
              <div className="notification-form-grid">
                <div className="notification-form-group">
                  <label className="notification-form-label">Template Name</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className="notification-form-input"
                    placeholder="Enter template name"
                  />
                </div>
                <div className="notification-form-group">
                  <label className="notification-form-label">Category</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    className="notification-form-select"
                  >
                    {templateCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="notification-form-group full-width">
                  <label className="notification-form-label">Subject</label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                    className="notification-form-input"
                    placeholder="Enter subject line"
                  />
                </div>
                <div className="notification-form-group full-width">
                  <label className="notification-form-label">Message Template</label>
                  <textarea
                    value={newTemplate.message}
                    onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
                    className="notification-form-textarea"
                    placeholder="Enter message template (use {{variable_name}} for dynamic content)"
                    rows="6"
                  />
                  <p className="template-help">
                    Use double curly braces for variables: {'{'}{'{'} student_name {'}'}{'}'},  {'{'}{'{'} due_date {'}'}{'}'},  {'{'}{'{'} amount {'}'}{'}'},  etc.
                  </p>
                </div>
              </div>
            </div>
            <div className="notification-modal-footer">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="notification-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="notification-modal-btn submit"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;