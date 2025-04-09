import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {v4 as uuid} from "uuid"
import { AuthContext } from './AuthContext';
import { ChatContext } from './ChatContext'

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [notimsg,setNotiMsg] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
    
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevCart, { 
        id: product.id, 
        name: product.name, 
        description: product.description, 
        price: product.price, 
        currency: product.currency, 
        category: product.category, 
        seller: product.seller, 
        images: product.images, 
        stock: product.stock, 
        ratings: product.ratings, 
        reviews: product.reviews, 
        website: product.website, 
        quantity: 1 
      }];
    });
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

//   const markAsRead = useCallback(async (notificationId) => {
//     if (!currentUser?.uid) return;
    
//     try {
//         const notificationRef = doc(db, "notifications", currentUser.uid);
//         const notificationDoc = await getDoc(notificationRef);
        
//         if (notificationDoc.exists()) {
//             const messages = notificationDoc.data().messages || [];
//             const updatedMessages = messages.map(msg => 
//                 msg.id === notificationId ? { ...msg, read: true } : msg
//             );
            
//             await updateDoc(notificationRef, {
//                 messages: updatedMessages
//             });
//         }
//     } catch (error) {
//         console.error("Error marking notification as read:", error);
//     }
// }, [currentUser]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []); // Runs only once on component mount

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]); // Sync cart to localStorage whenever it changes

  // Modify your useEffect for notifications
// useEffect(() => {
//   if (!currentUser?.uid) return;

//   const notificationsRef = doc(db, "notifications", currentUser.uid);
//   const unsubscribe = onSnapshot(notificationsRef, (docSnap) => {
//       if (docSnap.exists()) {
//           const notifications = docSnap.data().messages || [];
          
//           // Process notifications with proper typing
//           const processedNotifications = notifications.map(notification => {
//               if (notification.type === 'chat') {
//                   return {
//                       id: notification.id,
//                       type: 'chat',
//                       name: notification.senderName,
//                       text: notification.text,
//                       image: notification.senderPhoto,
//                       time: notification.timestamp?.toDate().toLocaleTimeString(),
//                       chatId: notification.chatId,
//                       read: notification.read || false
//                   };
//               } else {
//                   // Handle cart notifications
//                   return notification;
//               }
//           });

//           // Filter out notifications from current chat
//           const filteredNotifications = processedNotifications.filter(
//               notification => notification.type !== 'chat' || 
//                             notification.chatId !== data?.chatId
//           );

//           // Sort by timestamp (newest first)
//           const sortedNotifications = [...filteredNotifications].sort((a, b) => {
//               return new Date(b.timestamp?.toDate()) - new Date(a.timestamp?.toDate());
//           });

//           setNotiMsg(sortedNotifications);
//       }
//   });

//   return () => unsubscribe();
// }, [currentUser, data?.chatId]);
  

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        setNotiMsg,
        notimsg
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
