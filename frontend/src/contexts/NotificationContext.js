import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../components/AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { username } = useContext(AuthContext);
  console.log("User in NotificationProvider:", username);
  const intervalRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/studentnotifications/');
      const items = res.data;

      if (!Array.isArray(items) || items.length === 0) return;

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

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const uniqueNew = newNotifications.filter(
          (n) => !existingIds.has(n.id)
        );
        return [...uniqueNew, ...prev];
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("JWT expired or unauthorized, stopping notification polling.");
        clearInterval(intervalRef.current);
      } else {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  // Setup polling only if logged in
  useEffect(() => {
    if (!username) return; // don’t poll if not logged in

    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 10000);

    return () => clearInterval(intervalRef.current);
  }, [username]);

  // Create notification (optimistic)
  const createNotification = async (notificationData) => {
    try {
      if (!notificationData.id) {
        notificationData.id =
          notificationData.homework?.homework_code || Date.now().toString();
      }
      if (notificationData.read === undefined) {
        notificationData.read = false;
      }

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notificationData.id);
        return exists ? prev : [notificationData, ...prev];
      });

      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      if (user && user.id) {
        axiosInstance.delete(`/notifications/${user.id}/all`);
      }
    } catch (error) {
      console.warn('Could not clear notifications on server:', error);
    }
  };

  const getUnreadCount = () =>
    notifications.filter((notif) => !notif.read).length;

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
        createNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
