import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './context/cartcontext';
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { AuthContext } from './context/AuthContext';

const Shop = () => {
    const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();  // useNavigate hook
  const [realproduct, setRealProduct] = useState([]);
  const { setNotiMsg,notimsg} = useContext(CartContext);
  const [product, setProduct] = useState([]);
  const [active,setAvtive] = useState("all");
  const [borderactive,setBorderActive] = useState("0");
  const location = useLocation();
  const { category } = location.state || {}; 

  const handleChatWithPageClick = (sellerId, sellerName,sellerEmail, sellerImage) => {
    // Navigate to the chat page with the seller's ID
    navigate('/chats', { state: { sellerId, sellerName,sellerEmail, sellerImage } }); // 'sellerId' should be dynamically passed
  };

 const addToCart = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);


      if (!productSnap.exists()) {
        console.error("Product not found");
        return;
      }

      const productData = productSnap.data();

      if (!currentUser?.uid) {
        console.error("User is not authenticated");
        return;
      }

      const productWithTime = {
        ...productData,
        time: new Date().toLocaleTimeString(), // Add the current timestamp to the productData
      };
  
      // Update user's cart with the modified product data (including time)
      await updateDoc(doc(db, "users", currentUser?.uid), {
        orderedProducts: arrayUnion(productWithTime),
      });

      // await addDoc(collection(db, "notifications"), {
      //   userId: currentUser.uid,
      //   type: "cart",
      //   name: productData.name,
      //   image: productData.images[0],
      //   time: serverTimestamp(),
      //   read: false
      // });
      const docRef = doc(db, "notifications", currentUser?.uid);
      const docSnap = await getDoc(docRef);

      setNotiMsg((prev) => [...prev, { 
        id: productData.id,
                name: currentUser.displayName,
                productname: productData.name,
                text: `You added to cart ${productData.name}`,
                image: productData.images[0],
                time: serverTimestamp(),
                read: false,
      }]);
      await updateDoc(docRef, {
        cart: arrayUnion({  type: "cart",
          id: productData.id,
          name: currentUser.displayName,
          productname: productData.name,
          text: `You added to cart ${productData.name}`,
          image: productData.images[0],
          time: new Date().toLocaleTimeString(),
          read: false, })
      });
    } catch (error) {
      console.error("Error adding to cart: ", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productdata = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id; // Add the document ID to the product data
        productdata.push(product);
      });
      setRealProduct(productdata);
      setProduct(productdata);
    }, (error) => {
      console.error("Error fetching products: ", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleCategoryClick(category);
  }, [category]);
  

  const handleCategoryClick = (category) => {
    let borderactive = 0;
    if (category === 'all') {
      borderactive = '0px';
    } else if (category === 'fashion&beauty') {
      borderactive = '70px';
    } else if (category === 'Technology&Gadgets') {
      borderactive = '140px';
    } else if (category === 'Home&Living') {
      borderactive = '210px';
    } else if (category === 'Entertainment&Leisure') {
      borderactive = '280px';
    } else if (category === 'Health&Wellness') {
      borderactive = '350px';
    } else if (category === 'Travel&Lifestyle') {
      borderactive = '420px';
    }
    setBorderActive(borderactive)
    setAvtive(category);
    if (category === 'all') {
      const q = query(collection(db, 'products'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productdata = [];
        querySnapshot.forEach((doc) => {
          const product = doc.data();
          product.id = doc.id; // Add the document ID to the product data
          productdata.push(product);
        });
        setRealProduct(productdata);
        setProduct(productdata);
      }, (error) => {
        console.error("Error fetching products: ", error);
      });
      return () => unsubscribe();
    } else {
      const filteredProducts = realproduct.filter((product) => product.product_type === category);
      setProduct(filteredProducts);
    }
  };

  const categories = [
    { name: 'All',type: "all" },
    { name: 'Fashion & Beauty',type: "fashion&beauty" },
    { name: 'Technology & Gadgets',type: "Technology&Gadgets" },
    { name: 'Home & Living',type: "Home&Living" },
    { name: 'Entertainment & Leisure',type: "Entertainment&Leisure" },
    { name: 'Health & Wellness',type: "Health&Wellness" },
    { name: 'Travel & Lifestyle',type: "Travel&Lifestyle" },
  ];

  return (
    <div className='shopcontainer'>
      <div className='shopcategories'>
        {categories.map((item, index) => (
          <div key={index} onClick={() => handleCategoryClick(item.type)} className={active === item.type ? "activecategory" : "unactivecategory"}>{item.name}</div>
        ))}
        <span className='borderactivecategory' style={{top: borderactive}}></span>
      </div>
      <div className='shopproductscontainer'>
        {product.map((product,index) => (
          <div className='shopdiv' key={index}>
            <img src={product.images?.[0] || "default-image-url.jpg"} alt={product.name} />
            <div className='shopnameandbtn'>
              <div className='nameandbtnshop'>
                <h3>{product.name}</h3>
                <p>{product.seller?.name || 'Unknown Seller'}</p>
              </div>
            </div>
            <div className='shoplikeandcm'>
              <i className="bi bi-chat" onClick={() => handleChatWithPageClick(product.id, product.seller.name,product.seller.email, product.images[0])}></i>
              <p onClick={() => addToCart(product.id)}>Add to cart</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
