import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from "../api/axiosInstance";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/studentnotifications/');
      const item = res.data.homework;

      if (!item) {
        console.warn('No homework data received.');
        return;
      }

      const notification = {
        id: item.homework_code,
        title: item.title || 'New Homework',
        message: res.data.message || 'You have a new homework update.',
        timestamp: item.date_assigned || new Date().toISOString(),
        read: false,
        type: 'reminder',
        homework: item,
      };

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        return exists ? prev : [notification, ...prev];
      });

    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval); // Cleanup
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    console.log('Clearing all notifications');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getUnreadCount = () =>
    notifications.filter((notif) => !notif.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
