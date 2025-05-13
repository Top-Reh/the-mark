import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const notificationRef = doc(db, "notifications", currentUser.uid);
    const unsubscribe = onSnapshot(notificationRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const messages = data.messages || [];
        
        // Sort notifications by timestamp (newest first)
        const sortedNotifications = [...messages].sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        setNotifications(sortedNotifications);
        
        // Count unread notifications
        const unread = sortedNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (notificationId) => {
    if (!currentUser?.uid) return;

    try {
      const notificationRef = doc(db, "notifications", currentUser.uid);
      const messages = notifications.map(msg => 
        msg.id === notificationId ? { ...msg, read: true } : msg
      );

      await updateDoc(notificationRef, { messages });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser?.uid) return;

    try {
      const notificationRef = doc(db, "notifications", currentUser.uid);
      const messages = notifications.map(msg => ({ ...msg, read: true }));

      await updateDoc(notificationRef, { messages });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 