import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/ScheduleManagement.css';
import {
  faCalendarAlt,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faClock,
  faEye,
  faTimes,
  faCheck,
  faCalendarWeek,
  faChalkboardTeacher,
  faUsers,
  faBookOpen,
  faMapMarkerAlt,
  faBell,
  faCalendarDay,
  faSchool,
  faClipboardList,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const ScheduleManagement = () => {
  const [activeTab, setActiveTab] = useState('timetable'); // timetable, events, calendar
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Time slots for timetable
  const timeSlots = [
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:30 - 10:15',
    '10:15 - 10:30', // Break
    '10:30 - 11:15',
    '11:15 - 12:00',
    '12:00 - 12:45',
    '12:45 - 13:30', // Lunch
    '13:30 - 14:15',
    '14:15 - 15:00',
    '15:00 - 15:45'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classes = ['9-A', '9-B', '9-C', '10-A', '10-B', '10-C', '11-A', '11-B', '12-A', '12-B'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Physical Education'];
  const teachers = ['Dr. Priya Sharma', 'Dr. Vikram Patel', 'Ms. Anita Singh', 'Mr. Arjun Gupta', 'Mrs. Meera Joshi'];
  const rooms = ['Room 101', 'Room 102', 'Lab 1', 'Lab 2', 'Auditorium', 'Gym', 'Library'];

  // Sample timetable data
  const [timetable, setTimetable] = useState({
    '10-A': {
      'Monday': {
        '08:00 - 08:45': { subject: 'Mathematics', teacher: 'Dr. Priya Sharma', room: 'Room 101' },
        '08:45 - 09:30': { subject: 'Physics', teacher: 'Dr. Vikram Patel', room: 'Lab 1' },
        '09:30 - 10:15': { subject: 'English', teacher: 'Ms. Anita Singh', room: 'Room 102' },
        '10:15 - 10:30': { subject: 'Break', teacher: '', room: '' },
        '10:30 - 11:15': { subject: 'Chemistry', teacher: 'Mrs. Meera Joshi', room: 'Lab 2' },
        '11:15 - 12:00': { subject: 'Hindi', teacher: 'Ms. Anita Singh', room: 'Room 101' },
        '12:00 - 12:45': { subject: 'Computer Science', teacher: 'Mr. Arjun Gupta', room: 'Room 103' },
        '12:45 - 13:30': { subject: 'Lunch Break', teacher: '', room: '' },
        '13:30 - 14:15': { subject: 'Biology', teacher: 'Dr. Vikram Patel', room: 'Lab 1' },
        '14:15 - 15:00': { subject: 'Physical Education', teacher: 'Coach Ramesh', room: 'Gym' },
        '15:00 - 15:45': { subject: 'Study Hall', teacher: '', room: 'Library' }
      },
      'Tuesday': {
        '08:00 - 08:45': { subject: 'English', teacher: 'Ms. Anita Singh', room: 'Room 102' },
        '08:45 - 09:30': { subject: 'Mathematics', teacher: 'Dr. Priya Sharma', room: 'Room 101' },
        '09:30 - 10:15': { subject: 'Chemistry', teacher: 'Mrs. Meera Joshi', room: 'Lab 2' },
        '10:15 - 10:30': { subject: 'Break', teacher: '', room: '' },
        '10:30 - 11:15': { subject: 'Physics', teacher: 'Dr. Vikram Patel', room: 'Lab 1' },
        '11:15 - 12:00': { subject: 'Computer Science', teacher: 'Mr. Arjun Gupta', room: 'Room 103' },
        '12:00 - 12:45': { subject: 'Hindi', teacher: 'Ms. Anita Singh', room: 'Room 101' },
        '12:45 - 13:30': { subject: 'Lunch Break', teacher: '', room: '' },
        '13:30 - 14:15': { subject: 'Biology', teacher: 'Dr. Vikram Patel', room: 'Lab 1' },
        '14:15 - 15:00': { subject: 'Mathematics', teacher: 'Dr. Priya Sharma', room: 'Room 101' },
        '15:00 - 15:45': { subject: 'Study Hall', teacher: '', room: 'Library' }
      }
      // Add more days as needed
    }
  });

  // Sample events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Annual Sports Day',
      type: 'School Event',
      date: '2024-03-15',
      startTime: '09:00',
      endTime: '17:00',
      location: 'School Playground',
      description: 'Annual sports competition for all classes',
      participants: 'All Students',
      organizer: 'Sports Department',
      status: 'upcoming',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting',
      type: 'Meeting',
      date: '2024-02-20',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Class Rooms',
      description: 'Quarterly parent-teacher interaction',
      participants: 'Parents & Teachers',
      organizer: 'Academic Department',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Science Exhibition',
      type: 'Academic Event',
      date: '2024-02-25',
      startTime: '10:00',
      endTime: '15:00',
      location: 'Science Lab & Auditorium',
      description: 'Student science project presentations',
      participants: 'Class 9-12 Students',
      organizer: 'Science Department',
      status: 'upcoming',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Staff Meeting',
      type: 'Internal Meeting',
      date: '2024-02-18',
      startTime: '15:30',
      endTime: '16:30',
      location: 'Staff Room',
      description: 'Monthly staff coordination meeting',
      participants: 'All Teachers',
      organizer: 'Administration',
      status: 'completed',
      priority: 'medium'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'School Event',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    participants: '',
    organizer: '',
    priority: 'medium'
  });

  const eventTypes = ['School Event', 'Academic Event', 'Meeting', 'Internal Meeting', 'Holiday', 'Exam', 'Workshop'];
  const priorities = ['low', 'medium', 'high'];

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime) {
      const newId = Math.max(...events.map(e => e.id)) + 1;
      setEvents([...events, { 
        ...newEvent, 
        id: newId, 
        status: 'upcoming'
      }]);
      setNewEvent({
        title: '',
        type: 'School Event',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        participants: '',
        organizer: '',
        priority: 'medium'
      });
      setShowEventModal(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const getEventStatusClass = (status) => {
    return `event-status-badge ${status}`;
  };

  const getPriorityClass = (priority) => {
    return `event-priority-badge ${priority}`;
  };

  const getTypeClass = (type) => {
    return `event-type-badge ${type.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const isEventToday = (eventDate) => {
    const today = new Date().toISOString().split('T')[0];
    return eventDate === today;
  };

  const isEventUpcoming = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    return event > today;
  };

  const getUpcomingEvents = () => {
    return events.filter(event => isEventUpcoming(event.date)).slice(0, 5);
  };

  const getTodayEvents = () => {
    return events.filter(event => isEventToday(event.date));
  };

  const renderTimetable = () => (
    <div className="timetable-section">
      <div className="timetable-controls">
        <div className="timetable-selectors">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="schedule-select"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="schedule-select"
          >
            <option value="current">Current Week</option>
            <option value="next">Next Week</option>
            <option value="previous">Previous Week</option>
          </select>
        </div>
        <button className="schedule-btn primary">
          <FontAwesomeIcon icon={faPlus} />
          Add Period
        </button>
      </div>

      {selectedClass && timetable[selectedClass] ? (
        <div className="timetable-grid">
          <div className="timetable-container">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th className="time-header">Time</th>
                  {weekDays.map(day => (
                    <th key={day} className="day-header">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot} className={timeSlot.includes('Break') || timeSlot.includes('Lunch') ? 'break-row' : ''}>
                    <td className="time-cell">{timeSlot}</td>
                    {weekDays.map(day => {
                      const period = timetable[selectedClass][day]?.[timeSlot];
                      const isBreak = timeSlot.includes('Break') || timeSlot.includes('Lunch');
                      
                      return (
                        <td key={`${day}-${timeSlot}`} className={`period-cell ${isBreak ? 'break-cell' : ''}`}>
                          {period ? (
                            <div className={`period-content ${isBreak ? 'break-content' : ''}`}>
                              {!isBreak ? (
                                <>
                                  <div className="period-subject">{period.subject}</div>
                                  <div className="period-teacher">{period.teacher}</div>
                                  <div className="period-room">{period.room}</div>
                                </>
                              ) : (
                                <div className="break-label">{period.subject}</div>
                              )}
                            </div>
                          ) : (
                            <div className="empty-period">Free</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-timetable">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <p>Please select a class to view timetable</p>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="events-section">
      <div className="events-header">
        <div className="events-controls">
          <button
            onClick={() => setShowEventModal(true)}
            className="schedule-btn primary"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Event
          </button>
        </div>
      </div>

      <div className="events-grid">
        <div className="events-list">
          <h3>All Events</h3>
          <div className="events-container">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-title-section">
                    <h4>{event.title}</h4>
                    <div className="event-meta">
                      <span className={getTypeClass(event.type)}>{event.type}</span>
                      <span className={getPriorityClass(event.priority)}>{event.priority}</span>
                    </div>
                  </div>
                  <span className={getEventStatusClass(event.status)}>{event.status}</span>
                </div>
                
                <div className="event-details">
                  <div className="event-detail-row">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="event-detail-row">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="event-detail-row">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{event.location}</span>
                  </div>
                  <div className="event-detail-row">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{event.participants}</span>
                  </div>
                </div>

                <div className="event-description">
                  <p>{event.description}</p>
                </div>

                <div className="event-actions">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      // Handle view event
                    }}
                    className="event-action-btn view"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                    className="event-action-btn edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="event-action-btn delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="events-sidebar">
          <div className="upcoming-events">
            <h3>Today's Events</h3>
            <div className="today-events">
              {getTodayEvents().length > 0 ? (
                getTodayEvents().map(event => (
                  <div key={event.id} className="today-event">
                    <div className="today-event-time">{event.startTime}</div>
                    <div className="today-event-info">
                      <div className="today-event-title">{event.title}</div>
                      <div className="today-event-location">{event.location}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-events">No events today</p>
              )}
            </div>
          </div>

          <div className="upcoming-events">
            <h3>Upcoming Events</h3>
            <div className="upcoming-events-list">
              {getUpcomingEvents().map(event => (
                <div key={event.id} className="upcoming-event">
                  <div className="upcoming-event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="upcoming-event-info">
                    <div className="upcoming-event-title">{event.title}</div>
                    <div className="upcoming-event-type">{event.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="calendar-section">
      <div className="calendar-placeholder">
        <FontAwesomeIcon icon={faCalendarWeek} />
        <h3>Calendar View</h3>
        <p>Interactive calendar will be implemented here with monthly/weekly views</p>
        <p>Features will include:</p>
        <ul>
          <li>Monthly and weekly calendar views</li>
          <li>Event integration with timetable</li>
          <li>Drag & drop event scheduling</li>
          <li>Color coding for different event types</li>
          <li>Quick event creation</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="schedule-management">
      {/* Header */}
      <div className="schedule-header">
        <div className="schedule-header-content">
          <div className="schedule-title-section">
            <h1>Schedule Management</h1>
            <p>Manage timetables, events, and academic calendar</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="schedule-stats-grid">
        <div className="schedule-stat-card">
          <div className="schedule-stat-icon">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="schedule-stat-content">
            <h3>Total Events</h3>
            <span className="schedule-stat-value">{events.length}</span>
            <span className="schedule-stat-label">This month</span>
          </div>
        </div>
        <div className="schedule-stat-card">
          <div className="schedule-stat-icon">
            <FontAwesomeIcon icon={faSchool} />
          </div>
          <div className="schedule-stat-content">
            <h3>Active Classes</h3>
            <span className="schedule-stat-value">{classes.length}</span>
            <span className="schedule-stat-label">Timetables</span>
          </div>
        </div>
        <div className="schedule-stat-card">
          <div className="schedule-stat-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="schedule-stat-content">
            <h3>Today's Events</h3>
            <span className="schedule-stat-value">{getTodayEvents().length}</span>
            <span className="schedule-stat-label">Scheduled</span>
          </div>
        </div>
        <div className="schedule-stat-card">
          <div className="schedule-stat-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="schedule-stat-content">
            <h3>High Priority</h3>
            <span className="schedule-stat-value">{events.filter(e => e.priority === 'high').length}</span>
            <span className="schedule-stat-label">Events</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="schedule-tabs">
        <button
          onClick={() => setActiveTab('timetable')}
          className={`schedule-tab ${activeTab === 'timetable' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faClipboardList} />
          Timetable
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`schedule-tab ${activeTab === 'events' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faCalendarAlt} />
          Events
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`schedule-tab ${activeTab === 'calendar' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faCalendarWeek} />
          Calendar
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="schedule-content">
        {activeTab === 'timetable' && renderTimetable()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'calendar' && renderCalendar()}
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="schedule-modal-overlay">
          <div className="schedule-modal large">
            <div className="schedule-modal-header">
              <h2 className="schedule-modal-title">
                {selectedEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="schedule-modal-close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="schedule-modal-body">
              <div className="schedule-form-grid">
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="schedule-form-input"
                    placeholder="Enter event title"
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="schedule-form-select"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="schedule-form-input"
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Priority</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                    className="schedule-form-select"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="schedule-form-input"
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="schedule-form-input"
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="schedule-form-input"
                    placeholder="Enter location"
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Organizer</label>
                  <input
                    type="text"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})}
                    className="schedule-form-input"
                    placeholder="Enter organizer name"
                  />
                </div>
                <div className="schedule-form-group full-width">
                  <label className="schedule-form-label">Participants</label>
                  <input
                    type="text"
                    value={newEvent.participants}
                    onChange={(e) => setNewEvent({...newEvent, participants: e.target.value})}
                    className="schedule-form-input"
                    placeholder="Who will participate?"
                  />
                </div>
                <div className="schedule-form-group full-width">
                  <label className="schedule-form-label">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="schedule-form-textarea"
                    placeholder="Enter event description"
                    rows="4"
                  />
                </div>
              </div>
            </div>
            <div className="schedule-modal-footer">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="schedule-modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="schedule-modal-btn submit"
              >
                {selectedEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;