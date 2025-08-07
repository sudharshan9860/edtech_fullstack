import React, { createContext, useEffect, useState, useContext } from 'react';
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../components/AuthContext"

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastFetchAttempt, setLastFetchAttempt] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch notifications from the server with error handling
  const fetchNotifications = async () => {
    try {
      setLastFetchAttempt(new Date());
      
      // Check if backend is available first
      // const healthCheck = await axiosInstance.get('/health');
      // if (!healthCheck.data) {
      //   throw new Error('Backend not responding');
      // }
      
      // setIsConnected(true);
      
      // Get notifications from the endpoint
      const res = await axiosInstance.get('/studentnotifications/');
      const item = res.data.homework;

      if (!item) {
        console.warn('No homework data received.');
        return;
      }

      // Create notification object
      const notification = {
        id: item.homework_code,
        title: item.title || 'New Homework',
        image: item.attachment || '/default-homework-image.jpeg',
        message: res.data.message || 'You have a new homework update.',
        timestamp: item.date_assigned || new Date().toISOString(),
        read: false,
        type: 'homework',
        homework: item,
      };

      // Add to notifications if not already present
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        return exists ? prev : [notification, ...prev];
      });

    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsConnected(false);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        console.warn('Notification endpoint not found. Backend may not be running.');
      } else if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
        console.warn('Cannot connect to backend server. Is it running on port 8000?');
      }
      
      // Add a system notification about the connection issue
      const errorNotification = {
        id: `error_${Date.now()}`,
        title: 'Connection Issue',
        message: 'Unable to fetch latest notifications. Check if backend server is running.',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system',
        isError: true
      };
      
      setNotifications((prev) => {
        const hasErrorNotification = prev.some(n => n.type === 'system' && n.isError);
        return hasErrorNotification ? prev : [errorNotification, ...prev];
      });
    }
  };

  // Check backend connection
  // const checkConnection = async () => {
  //   try {
  //     const response = await axiosInstance.get('/health');
  //     setIsConnected(!!response.data);
  //     return !!response.data;
  //   } catch (error) {
  //     setIsConnected(false);
  //     return false;
  //   }
  // };

  // Initial fetch and polling setup
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    
    // Set up polling with exponential backoff when disconnected
    const setupPolling = () => {
      const baseInterval = isConnected ? 10000 : 30000; // 10s when connected, 30s when not
      const interval = setInterval(() => {
        if (!isConnected) {
          // Try to reconnect less frequently
          checkConnection().then(connected => {
            if (connected) {
              fetchNotifications();
            }
          });
        } else {
          fetchNotifications();
        }
      }, baseInterval);
      
      return interval;
    };
    
    const interval = setupPolling();
    return () => clearInterval(interval);
  }, [isConnected]);

  // Create a new notification (used by TeacherDashboard)
  const createNotification = async (notificationData) => {
    try {
      // Add default properties if not provided
      if (!notificationData.id) {
        notificationData.id = notificationData.homework?.homework_code || Date.now().toString();
      }
      
      if (notificationData.read === undefined) {
        notificationData.read = false;
      }
      
      // Try to send to server if connected
      if (isConnected) {
        try {
          await axiosInstance.post('/notifications/', notificationData);
        } catch (error) {
          console.warn('Could not save notification to server:', error);
        }
      }
      
      // Add to local state
      setNotifications(prev => {
        const exists = prev.some(n => n.id === notificationData.id);
        return exists ? prev : [notificationData, ...prev];
      });
      
      return notificationData.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read && !n.isError).length;
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Retry connection
  const retryConnection = async () => {
    const connected = await checkConnection();
    if (connected) {
      // Clear any error notifications
      setNotifications(prev => prev.filter(n => !n.isError));
      fetchNotifications();
    }
    return connected;
  };

  const value = {
    notifications,
    createNotification,
    markAsRead,
    removeNotification,
    getUnreadCount,
    clearAllNotifications,
    isConnected,
    lastFetchAttempt,
    retryConnection
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;