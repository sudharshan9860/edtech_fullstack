import React, { useContext, useState } from 'react';
import { Dropdown, Badge, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationContext } from '../contexts/NotificationContext';

const NotificationDropdown = () => {
  const {
    notifications = [],
    markNotificationAsRead,
    clearAllNotifications,
    getUnreadCount,
  } = useContext(NotificationContext);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const unreadCount = getUnreadCount();

  const getNotificationIcon = (type) => {
    const iconMap = {
      achievement: '🏆',
      progress: '📈',
      recommendation: '💡',
      reminder: '⏰',
    };
    return iconMap[type] || '🔔';
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  return (
    <>
      <Dropdown align="end" className="position-relative">
        <Dropdown.Toggle
          variant="link"
          id="notifications-dropdown"
          className="nav-link p-0 position-relative"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
          {unreadCount > 0 && (
            <Badge
              pill
              bg="danger"
              className="position-absolute top-1 start-10 translate-middle p-1"
              style={{ fontSize: '0.7rem' }}
            >
              {unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="notification-menu" style={{ minWidth: '300px' }}>
          <Dropdown.Header className="d-flex justify-content-between align-items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-link p-0 text-primary"
                onClick={clearAllNotifications}
                style={{ fontSize: '0.85rem' }}
              >
                Clear All
              </button>
            )}
          </Dropdown.Header>

          {notifications.length === 0 ? (
            <Dropdown.Item disabled>No notifications</Dropdown.Item>
          ) : (
            notifications.map((notification) => (
              <Dropdown.Item
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={!notification.read ? 'unread-notification' : ''}
              >
                <div className="d-flex align-items-start">
                  <span className="me-2" style={{ fontSize: '1.2rem' }}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div>
                    <div className="fw-bold">{notification.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {notification.message}
                    </div>
                    <small className="text-muted">
                      {new Date(notification.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Modal for showing notification details */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNotification?.title || 'Notification Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Message:</strong> {selectedNotification?.message}</p>
          <p>
            <strong>Date Assigned:</strong>{' '}
            {selectedNotification?.homework?.date_assigned
              ? new Date(selectedNotification.homework.date_assigned).toLocaleString()
              : 'N/A'}
          </p>
          <p>
            <strong>Homework Code:</strong> {selectedNotification?.homework?.homework_code || 'N/A'}
          </p>
          {/* You can add more homework details here */}
          {selectedNotification?.homework && (
            <div>
              <h5>Homework Details:</h5>
              <ul>
                {Object.entries(selectedNotification.homework).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationDropdown;
