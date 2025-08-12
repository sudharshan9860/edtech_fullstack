// NotificationContext.js - Replace your entire file with this:

import React, { createContext, useState, useCallback, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // FIXED: Define checkConnection function properly
  const checkConnection = useCallback(() => {
    try {
      // Check if navigator is online
      if (typeof navigator !== 'undefined' && navigator.onLine !== undefined) {
        if (navigator.onLine) {
          setConnectionStatus('connected');
          return true;
        } else {
          setConnectionStatus('disconnected');
          return false;
        }
      }
      // Fallback if navigator.onLine is not available
      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.warn('Connection check failed:', error);
      setConnectionStatus('unknown');
      return false;
    }
  }, []);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('connected');
      addNotification({
        type: 'success',
        title: 'Connection Restored',
        message: 'You are back online!',
        duration: 3000
      });
    };

    const handleOffline = () => {
      setConnectionStatus('disconnected');
      addNotification({
        type: 'warning',
        title: 'Connection Lost',
        message: 'You are currently offline. Some features may not work.',
        duration: 5000
      });
    };

    // Add event listeners safely
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // Initial check
    checkConnection();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [checkConnection]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: new Date(),
      duration: notification.duration || 4000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addProgressNotification = useCallback((progressData) => {
    addNotification({
      type: 'success',
      title: progressData.title || 'Progress Update',
      message: progressData.message || 'You made progress!',
      timestamp: progressData.timestamp || new Date(),
      duration: 4000
    });
  }, [addNotification]);

  const addErrorNotification = useCallback((error) => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: typeof error === 'string' ? error : error?.message || 'An error occurred',
      duration: 6000
    });
  }, [addNotification]);

  const addSuccessNotification = useCallback((message) => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: message,
      duration: 3000
    });
  }, [addNotification]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread notifications count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const value = {
    notifications,
    connectionStatus,
    checkConnection, // FIXED: Now properly defined and exported
    addNotification,
    removeNotification,
    addProgressNotification,
    addErrorNotification,
    addSuccessNotification,
    clearAllNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;