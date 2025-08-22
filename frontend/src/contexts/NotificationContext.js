import React, { createContext, useEffect, useState, useContext } from 'react';
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../components/AuthContext"

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch notifications from the server
const fetchNotifications = async () => {
  try {
    // Get notifications list from endpoint
    const res = await axiosInstance.get('/studentnotifications/');
    const items = res.data; // since it's a list

    if (!Array.isArray(items) || items.length === 0) {
      console.warn('No homework data received.');
      return;
    }

    // Convert each homework item into a notification object
    const newNotifications = items.map((item) => ({
      id: item.homework_code,
      title: item.title || 'New Homework',
      image: item.attachment || '/default-homework-image.jpeg',
      message: item.message || 'You have a new homework update.',
      timestamp: item.date_assigned || new Date().toISOString(),
      read: false,
      type: 'homework',
      homework: item,
    }));

    // Update notifications state (avoid duplicates by ID)
    setNotifications((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const uniqueNew = newNotifications.filter(
        (n) => !existingIds.has(n.id)
      );
      return [...uniqueNew, ...prev]; // prepend new ones
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

  // Initial fetch and polling setup
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval); // Cleanup
  }, []);
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
      
      // You can send to server if you have an endpoint for creating notifications
      // For now, just add to local state
      setNotifications(prev => {
        const exists = prev.some(n => n.id === notificationData.id);
        return exists ? prev : [notificationData, ...prev];
      });
      
      // // Try to send to server if you have an endpoint
      // try {
      //   await axiosInstance.post('/create-notification/', notificationData);
      // } catch (serverError) {
      //   console.warn('Could not save notification to server:', serverError);
      //   // Continue anyway since we've already updated local state
      // }
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Optionally update on server if you have an endpoint
    // try {
    //   axiosInstance.put(`/notifications/${id}/read`);
    // } catch (error) {
    //   console.warn('Could not mark notification as read on server:', error);
    // }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    console.log('Clearing all notifications');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    
    // Optionally clear on server if you have an endpoint
    try {
      if (user && user.id) {
        axiosInstance.delete(`/notifications/${user.id}/all`);
      }
    } catch (error) {
      console.warn('Could not clear notifications on server:', error);
    }
  };

  // Get count of unread notifications
  const getUnreadCount = () =>
    notifications.filter((notif) => !notif.read).length;

  // Manually refresh notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        getUnreadCount,
        createNotification, // Added for teacher dashboard
        refreshNotifications // Added for manual refresh
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;