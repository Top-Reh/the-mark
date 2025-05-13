import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {v4 as uuid} from "uuid"
import { AuthContext } from './AuthContext';
import { ChatContext } from './ChatContext'

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [notimsg, setNotiMsg] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = useCallback(async (product) => {
    if (!currentUser?.uid) return;

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

    // Create notification for the seller
    try {
      const notificationRef = doc(db, "notifications", product.seller.uid);
      const notificationDoc = await getDoc(notificationRef);

      const notificationData = {
        id: uuid(),
        type: 'cart',
        productId: product.id,
        productName: product.name,
        buyerId: currentUser.uid,
        buyerName: currentUser.displayName || 'User',
        buyerPhoto: currentUser.photoURL,
        action: 'added to cart',
        timestamp: new Date().toLocaleTimeString(),
        read: false
      };

      if (notificationDoc.exists()) {
        await updateDoc(notificationRef, {
          messages: arrayUnion(notificationData)
        });
      } else {
        await setDoc(notificationRef, {
          messages: [notificationData]
        });
      }
    } catch (error) {
      console.error("Error creating cart notification:", error);
    }
  }, [currentUser]);

  // Remove product from cart
  const removeFromCart = useCallback(async (product) => {
    if (!currentUser?.uid) return;

    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));

    // Create notification for the seller
    try {
      const notificationRef = doc(db, "notifications", product.seller.uid);
      const notificationDoc = await getDoc(notificationRef);

      const notificationData = {
        id: uuid(),
        type: 'cart',
        productId: product.id,
        productName: product.name,
        buyerId: currentUser.uid,
        buyerName: currentUser.displayName || 'User',
        buyerPhoto: currentUser.photoURL,
        action: 'removed from cart',
        timestamp: new Date().toLocaleTimeString(),
        read: false
      };

      if (notificationDoc.exists()) {
        await updateDoc(notificationRef, {
          messages: arrayUnion(notificationData)
        });
      } else {
        await setDoc(notificationRef, {
          messages: [notificationData]
        });
      }
    } catch (error) {
      console.error("Error creating cart notification:", error);
    }
  }, [currentUser]);

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
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

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
