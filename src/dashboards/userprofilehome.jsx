import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/cartcontext';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const Userprofilehome = () => {
  const { currentUser } = useContext(AuthContext);
  const { notifications } = useContext(NotificationContext);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Filter notifications by type
    const orderNotifications = notifications.filter(n => n.type === 'order');
    const cartNotifications = notifications.filter(n => n.type === 'cart');
    const messageNotifications = notifications.filter(n => n.type === 'chat');

    setOrders(orderNotifications);
    setCartItems(cartNotifications);
    setMessages(messageNotifications);

    // Fetch additional order data
    const fetchOrderData = async () => {
      const productRef = doc(db, "users", currentUser.uid);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const orderedProducts = productSnap.data().orderedProducts || [];
        setOrders(prev => [...prev, ...orderedProducts]);
      }
    };

    fetchOrderData();
  }, [currentUser?.uid, notifications]);

  return (
    <div className='userprofilehome'>
      {/* Orders Section */}
      <div className='whatuordered'>
        <h1>What you ordered</h1>
        <div className='uorderedcontainer'>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div className="alreadyordered" key={index}>
                <div className="orderedalready1">
                  <img
                    src={order.images?.[0] || order.productImage || '/default-product.png'}
                    alt={order.productname || order.productName}
                  />
                  <div>
                    <h1>{order.productname || order.productName}</h1>
                    <p>{order.timestamp || order.time}</p>
                  </div>
                </div>
                <button>View</button>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>

      {/* Cart Items Section */}
      <div className='whatuordered'>
        <h1>Items in Cart</h1>
        <div className='uorderedcontainer'>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div className="alreadyordered" key={index}>
                <div className="orderedalready1">
                  <img
                    src={item.productImage || '/default-product.png'}
                    alt={item.productName}
                  />
                  <div>
                    <h1>{item.productName}</h1>
                    <p>{item.timestamp}</p>
                  </div>
                </div>
                <button>View</button>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className='whatuordered'>
        <h1>Your Messages</h1>
        <div className='yournotipfcontainer'>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div className='yournotipf' key={index}>
                <div className='yournotipf1'>
                  <img src={message.senderPhoto || '/default-avatar.png'} alt={message.senderName} />
                  <div>
                    <h1>{message.senderName}</h1>
                    <p>{message.text}</p>
                  </div>
                </div>
                <p className='yournotipfps'>{message.timestamp}</p>
              </div>
            ))
          ) : (
            <p>No messages found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userprofilehome;