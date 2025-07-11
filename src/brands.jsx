import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './context/cartcontext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { AuthContext } from './context/AuthContext';

const Brands = () => {
    const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();  // useNavigate hook
  const [realexistbrands, setRealExistBrands] = useState([]);
  const [existbrands, setExistBrands] = useState([]);
  const [active,setAvtive] = useState("all");
  const [borderactive,setBorderActive] = useState("0");
  const location = useLocation();
  const { category } = location.state || {}; 

  const handleChatWithPageClick = (sellerId, sellerName,sellerEmail, sellerImage) => {
    // Navigate to the chat page with the seller's ID
    navigate('/chats', { state: { sellerId, sellerName,sellerEmail, sellerImage } }); // 'sellerId' should be dynamically passed
  };

  useEffect(() => {
    handleCategoryClick(category);
  }, [category]);
  

  const handleCategoryClick = (category) => {
    let borderactive = 0;
    if (category === 'all') {
      borderactive = '0px';
    } else if (category === 'Fashion & Beauty') {
      borderactive = '70px';
    } else if (category === 'Technology & Gadgets') {
      borderactive = '140px';
    } else if (category === 'Home & Living') {
      borderactive = '210px';
    } else if (category === 'Entertainment & Leisure') {
      borderactive = '280px';
    } else if (category === 'Health & Wellness') {
      borderactive = '350px';
    } else if (category === 'Travel & Lifestyle') {
      borderactive = '420px'; 
    }
    setBorderActive(borderactive)
    setAvtive(category);
    if (category === 'all') {
      const q = query(collection(db, 'admins'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let userexist = [];
        querySnapshot.forEach((docs) => {
          const userData = docs.data();
        userexist.push(userData);
        });
        setRealExistBrands(userexist);
        setExistBrands(userexist);
      });
      return () => unsubscribe();
    } else {
      const filteredAdmins = realexistbrands.filter((admin) => admin.businessType === category);
      setExistBrands(filteredAdmins);
    }
  };

  const categories = [
    { name: 'All',type: "all" },
    { name: 'Fashion & Beauty',type: "Fashion & Beauty" },
    { name: 'Technology & Gadgets',type: "Technology & Gadgets" },
    { name: 'Home & Living',type: "Home & Living" },
    { name: 'Entertainment & Leisure',type: "Entertainment & Leisure" },
    { name: 'Health & Wellness',type: "Health & Wellness" },
    { name: 'Travel & Lifestyle',type: "Travel & Lifestyle" },
  ];

  useEffect(() => {
    if (!currentUser) return;

      const q = query(collection(db, 'admins'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let userexist = [];
        querySnapshot.forEach((docs) => {
          const userData = docs.data();
        userexist.push(userData);
        });
        setExistBrands(userexist);
      });
      return () => unsubscribe();
  }, [currentUser])
  

  return (
    <div className='shopcontainer'>
     <div className='shopcategories'>
       {categories.map((item, index) => (
         <div key={index} onClick={() => handleCategoryClick(item.type)} className={active === item.type ? "activecategory" : "unactivecategory"}>{item.name}</div>
       ))}
       <span className='borderactivecategory' style={{top: borderactive}}></span>
     </div>
     <div className='brandscontainer'>
       <div className='onebrand' style={{backgroundImage:"url(https://i.pinimg.com/736x/34/c3/57/34c357ee31431b6cd13fe1ebe1d47980.jpg)"}}>
        <div className='brandfacts'>
            <h1>Nike</h1>
            <p>Shoes brand</p>
            <button>View Brand</button>
        </div>
       </div>
       {
        existbrands.map((data,index) => (
          <div className='onebrand' key={index} style={{backgroundImage:`url(${data.photoURL})`}}>
              <div className='brandfacts'>
                  <h1>{data.name}</h1>
                  <p>Shoes brand</p>
                  <button>View Brand</button>
                  <Link to="/brandspage" state={{ brandId: data.uid }} className='brandlink'>View Brand</Link>
              </div>
          </div>
        ))
       }
     </div>
    </div>
  );
};

export default Brands;

// {/* <div className='shopcontainer'>
// <div className='shopcategories'>
//   {categories.map((item, index) => (
//     <div key={index} onClick={() => handleCategoryClick(item.type)} className={active === item.type ? "activecategory" : "unactivecategory"}>{item.name}</div>
//   ))}
//   <span className='borderactivecategory' style={{top: borderactive}}></span>
// </div>
// <div className='shopproductscontainer'>
//   {product.map((product,index) => (
//     <div className='shopdiv' key={index}>
//       <img src={product.images?.[0] || "default-image-url.jpg"} alt={product.name} />
//       <div className='shopnameandbtn'>
//         <div className='nameandbtnshop'>
//           <h3>{product.name}</h3>
//           <p>{product.seller?.name || 'Unknown Seller'}</p>
//         </div>
//       </div>
//       <div className='shoplikeandcm'>
//         <i className="bi bi-chat" onClick={() => handleChatWithPageClick(product.id, product.seller.name,product.seller.email, product.images[0])}></i>
//       </div>
//     </div>
//   ))}
// </div>
// </div> */}
