import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../components/AuthContext"

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { username } = useContext(AuthContext);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const connectWebSocket = () => {
      // Fix 1: Properly use template literal with backticks
      wsRef.current = new WebSocket(`ws://localhost:8000/ws/notifications/${username}/`);

      wsRef.current.onopen = () => {
        console.log("✅ Connected to WebSocket for notifications");
      };

      wsRef.current.onmessage = (e) => {
        try {
          // console.log("WebSocket message event:", e);
          const data = JSON.parse(e.data);
      
          console.log("📩 New notification received:", data);
          const newNotification = {
            id: data.homework?.homework_code || data.id || Date.now().toString(),
            title: data.homework?.title || 'New Homework',
            image: data.homework?.attachment || '/default-homework-image.jpeg',
            message: data.message || 'You have a new homework update.',
            timestamp: data.homework?.date_assigned || new Date().toISOString(),
            read: false,
            type: 'homework',
            homework: data.homework,
          };

          setNotifications(prev => {
            const exists = prev.some(n => n.id === newNotification.id);
            return exists ? prev : [newNotification, ...prev];
          });
        } catch (err) {
          console.error("❌ Error parsing WebSocket message", err);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error("❌ WebSocket error", err);
      };

      wsRef.current.onclose = () => {
        console.log("⚠ WebSocket disconnected, trying to reconnect...");
        // Fix 2: Store timeout reference for cleanup
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    // Fix 3: Proper cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [username]);

  // Mark a notification as read
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    console.log('Clearing all notifications');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      // Fix 4: Use username directly (not username.id)
      if (username) {
        await axiosInstance.delete(`/notifications/${username}/all`);
      }
    } catch (error) {
      console.warn('Could not clear notifications on server:', error);
    }
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

export default NotificationProvider;