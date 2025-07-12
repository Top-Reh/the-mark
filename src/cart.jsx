import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './context/cartcontext';
import { collection, doc, getDoc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AuthContext } from './context/AuthContext';

const Cart = () => {
  const { setCart,cart, removeFromCart } = useContext(CartContext);
    const {currentUser} = useContext(AuthContext);
  const [cartdata, setCartData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);  
  const [price, setPrice] = useState([]);

  const addquantity = (id) => {
    setCart(pre => 
      pre.map(item => item.id === id ? {...item,quantity:item.quantity+1} : item)
    )
  };

  const handleremoveproduct = async(id) => {
    if (!currentUser) {
      return null; // or loading spinner, etc.
    }
    setCart(pre => 
      pre.filter(item => item.id !== id)
    );
    const userRef = doc(db, "users", currentUser?.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedCart = userData.orderedProducts.filter(
        (item) => item.id !== id
      );

      await updateDoc(userRef, {
        orderedProducts: updatedCart,
      });
    }
  }

  const removequantity = async(id) => {
    setCart(pre => 
      pre.map(item => item.id === id ? {...item,quantity:item.quantity-1} : item)
    );
    if (cart.find(item => item.id === id).quantity === 0) {
      removeFromCart(id);
    };
    const userRef = doc(db, "users", currentUser?.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedCart = userData.orderedProducts.filter(
          (item) => item.id !== id
        );

        await updateDoc(userRef, {
          orderedProducts: updatedCart,
        });
      }
  };

  useEffect(() => {
  if (!currentUser?.uid) return;

  const userRef = doc(db, "users", currentUser.uid);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const orderedProducts = docSnap.data().orderedProducts || [];
      setCartData(orderedProducts);

      // Calculate total price
      const totalPrice =
        orderedProducts.reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0
        ) + 1;
      setTotal(totalPrice);
    } else {
      console.warn("User document does not exist.");
    }
  }, (error) => {
    console.error("Error listening to orderedProducts:", error);
  });

  return () => unsubscribe(); // Cleanup on unmount
}, [currentUser?.uid]);


  return (
    <div className="cart">
      <div className='cartItems'>
      {
          cartdata.length > 0 ? cartdata.map(item => (
            <div className='cartone' key={item.id}>
              <img src={item.images[0]} alt={item.name}></img>
              <div className='cartfacts'>
                <div className='carttitle'>
                  <h1>{item.name}</h1>
                  <i className="bi bi-x-lg" onClick={() => handleremoveproduct(item.id)}></i>
                </div>
                <p className='cartprice'>${item.price}</p>
                <div className='cartbadge'>
                  <img src={item.seller.images} alt={item.name}></img>
                  <h2>{item.seller?.name || 'Unknown Seller'}</h2>
                </div>
                <div className='colorandsize'>
                  <div className='cartcolor'>
                    <div></div>
                    <p>Brown</p>
                    <i className="bi bi-caret-down"></i>
                  </div>
                  <div className='cartsize'>
                    <p>34</p>
                    <i className="bi bi-caret-down"></i>
                  </div>
                </div>
                <div className='cartquantity'>
                  <h2>Quantity</h2>
                  <button onClick={() => removequantity(item.id)}>-</button>
                  <p>{item.quantity}</p>
                  <button onClick={() => addquantity(item.id)}>+</button>
                </div>
              </div>
            </div>
          )) : <div className='w-full h-96 flex align-middle self-center content-center justify-center '><h1>No items in cart</h1></div>
        }
      </div>
      <div className='bill'>
        <div className='billpaper'>
          {
            cartdata.map( item=> (
              <div className='billitem'>
                <h2>{item.name}</h2>
                <p>${(quantity * item.price).toFixed(2)}</p>
              </div>
            ))
          }
          <div className='billcost'>
            <h2>Delivery Cost</h2>
            <p>{cartdata.length === 0 ? '0' : '$1'}</p>
          </div>
          <div className='totalbill'>
            <h2>Total</h2>
            <p>{cartdata.length === 0 ? '0' : '$' + total}</p>
          </div>
          <button>Proceed to checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;