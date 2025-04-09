import React, { useState,useContext, useEffect, useRef } from 'react';
import { CartContext } from '../context/cartcontext';
import { AuthContext } from '../context/AuthContext';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const Userprofilehome = () => {
  const { notimsg} = useContext(CartContext);
    const {currentUser} = useContext(AuthContext);
  const [notification,setNotification] = useState(null);
  const [messagenoti,setMessageNoti] = useState(null);
  
  // useEffect(() => {
  //   async function fetchData (params) {
  //     const docRef = doc(db, "notifications", currentUser.uid);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       // Extract messages and cart
  //       const data = docSnap.data();
  //       setNotification(data);
  //       return data; // Return the data if needed
  //     }
      
  //   }
  //   fetchData();
  // }, [notimsg]);
  useEffect(() => {
    if (!currentUser?.uid) return;
    const cartdata = async () => {
      const productRef = doc(db, "users",currentUser.uid);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const orderedProducts = productSnap.data().orderedProducts || [];
        setNotification(orderedProducts);
      };
      const uploadproductRef = doc(db, "products",currentUser.uid);
      const uploadproductSnap = await getDoc(uploadproductRef);
      if (uploadproductSnap.exists()) {
        const uploadedProducts = uploadproductSnap.data() || [];
        setNotification(prev => [...prev, ...uploadedProducts]);
      };
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("toid", "==", currentUser.uid)); // Filter for chats where `toid` equals the current user's `uid`
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((chatDoc) => {
          const chatData = chatDoc.data();
          setMessageNoti(chatData)
        });
      } else {
        console.log("No chats found with `toid` equal to currentUser.uid.");
      }

    }
    return () => cartdata();
  }, [currentUser?.uid]);

  return (
    <div className='userprofilehome'>
      <div className='whatuordered'>
        <h1>What you ordered</h1>
        <div className='uorderedcontainer'>
        <div className='alreadyordered'>
            <div className='orderedalready1'>
              <img src='https://i.pinimg.com/736x/26/85/71/268571d234af58056a4a8590b995db91.jpg' alt='phot'></img>
              <div>
                <h1>Lv girl</h1>
                <p>10:30 PM</p>
              </div>
            </div>
            <button>View</button>
          </div>
          <div className='alreadyordered'>
            <div className='orderedalready1'>
              <img src='https://i.pinimg.com/736x/26/85/71/268571d234af58056a4a8590b995db91.jpg' alt='phot'></img>
              <div>
                <h1>Lv girl</h1>
                <p>10:30 PM</p>
              </div>
            </div>
            <button>View</button>
          </div>
        {notification ? (
          notification.map((data, index) => (
            <div className="alreadyordered" key={index}>
              <div className="orderedalready1">
                <img
                  src={data.images[0]}
                  alt={data.name}
                />
                <div>
                  <h1>{data.productname || data.name}</h1>
                  <p>{data.time}</p>
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
      <div className='yournotis'>
        <h1>Your notifications</h1>
        <div className='yournotipfcontainer'>
          {
            messagenoti ? (
              messagenoti.map((data,index) => (
                <div className='yournotipf' key={index}>
                  <div className='yournotipf1'>
                    <img src={data.photo} alt='phot'></img>
                    <div>
                      <h1>{data.name}</h1>
                      <p>replied you</p>
                    </div>
                  </div>
                  <p className='yournotipfps'>10:30 PM</p>
                </div>
              ))
            ): (
              <p>No message found.</p>
            )
          }
          <div className='yournotipf'>
            <div className='yournotipf1'>
              <img src='https://i.pinimg.com/736x/26/85/71/268571d234af58056a4a8590b995db91.jpg' alt='phot'></img>
              <div>
                <h1>Lv girl</h1>
                <p>replied you</p>
              </div>
            </div>
            <p className='yournotipfps'>10:30 PM</p>
          </div>
          <div className='yournotipf'>
            <div className='yournotipf1'>
              <img src='https://i.pinimg.com/736x/26/85/71/268571d234af58056a4a8590b995db91.jpg' alt='phot'></img>
              <div>
                <h1>Lv girl</h1>
                <p>replied you</p>
              </div>
            </div>
            <p className='yournotipfps'>10:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Userprofilehome