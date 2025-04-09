import React, { useState,useContext, useEffect, useRef } from 'react';
import { CartContext } from './context/cartcontext';
import styled from "styled-components";
import {Link} from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, updateDoc, doc, getDoc, getDocs } from "firebase/firestore";


const newDropdown = [
  {
    category: "New Arrivals",
    items: [
      "Best Sellers",
      "Latest Drops",
      "Nike 24.7",
      "Valentines Day Shop",
      "SNKRS Launch Calendar"
    ]
  },
  {
    category: "Trending",
    items: [
      "ACG Essentials",
      "Retro Running",
      "Nike Style By",
      "Shop Sport",
      "NFL Champs Gear",
      "Shop Classics",
      "Dunk",
      "Air Jordan 1",
      "Air Force",
      "Air Max",
      "Blazer",
      "Vomero"
    ]
  },
  {
    category: "Explore",
    items: [
      "Bra Finder",
      "Product Care",
      "Member Rewards",
      "Buying Guides"
    ]
  }
];

const all = [
  {
    category: "New",
    items: [
      "New Arrivals",
      "Best Sellers",
      "Latest Drops",
      "Nike 24.7",
      "Valentines Day Shop",
      "Shop All Sale"
    ]
  },
  {
    category: "Shoes",
    items: [
      "All Shoes",
      "Basketball",
      "Lifestyle",
      "Jordan",
      "Retro Running",
      "Running",
      "Training & Gym",
      "Shoes $100 & Under"
    ]
  },
  {
    category: "Clothing",
    items: [
      "All Clothing",
      "Hoodies & Sweatshirts",
      "Jordan",
      "Jackets & Vests",
      "Tracksuits",
      "Pants",
      "Shorts",
      "Tops & T-Shirts"
    ]
  },
  {
    category: "Accessories",
    items: [
      "Bags & Backpacks",
      "Hats & Headwear",
      "Socks"
    ]
  },
  {
    category: "Shop by Sport",
    items: [
      "Baseball",
      "Basketball",
      "Fan Gear",
      "Football",
      "Golf",
      "Running",
      "Track & Field",
      "Soccer",
      "Tennis",
      "Training & Gym"
    ]
  }
];

const sportDropdown = [
  {
    category: "Running",
    items: [
      "Running Shoes",
      "Performance Apparel",
      "Compression Gear",
      "Hydration Packs",
      "GPS Watches"
    ]
  },
  {
    category: "Basketball",
    items: [
      "Basketball Shoes",
      "Jerseys & Shorts",
      "Arm & Leg Sleeves",
      "Basketballs",
      "Hoops & Accessories"
    ]
  },
  {
    category: "Soccer",
    items: [
      "Soccer Cleats",
      "Team Jerseys",
      "Shin Guards",
      "Soccer Balls",
      "Goalkeeper Gloves"
    ]
  },
  {
    category: "Training & Gym",
    items: [
      "Training Shoes",
      "Workout Apparel",
      "Weightlifting Belts",
      "Resistance Bands",
      "Gym Bags"
    ]
  },
  {
    category: "Tennis",
    items: [
      "Tennis Shoes",
      "Rackets & Strings",
      "Tennis Apparel",
      "Wristbands & Headbands",
      "Tennis Balls"
    ]
  }
];

const clothesDropdown = [
  {
    category: "Tops",
    items: [
      "T-Shirts",
      "Hoodies & Sweatshirts",
      "Tank Tops",
      "Polos",
      "Long Sleeve Shirts"
    ]
  },
  {
    category: "Bottoms",
    items: [
      "Joggers & Sweatpants",
      "Shorts",
      "Leggings",
      "Jeans",
      "Cargo Pants"
    ]
  },
  {
    category: "Outerwear",
    items: [
      "Jackets & Coats",
      "Vests",
      "Windbreakers",
      "Puffer Jackets",
      "Rain Jackets"
    ]
  },
  {
    category: "Accessories",
    items: [
      "Hats & Caps",
      "Socks",
      "Gloves",
      "Scarves",
      "Belts"
    ]
  },
  {
    category: "Activewear",
    items: [
      "Workout Tops",
      "Training Shorts",
      "Compression Gear",
      "Sports Bras",
      "Athletic Leggings"
    ]
  }
];

const cosmeticsDropdown = [
  {
    category: "Makeup",
    items: [
      "Foundation & Concealer",
      "Lipsticks & Glosses",
      "Eyeshadow Palettes",
      "Mascara & Eyeliner",
      "Blush & Highlighter"
    ]
  },
  {
    category: "Skincare",
    items: [
      "Cleansers & Face Wash",
      "Moisturizers & Creams",
      "Serums & Treatments",
      "Face Masks",
      "Sunscreen & SPF"
    ]
  },
  {
    category: "Hair Care",
    items: [
      "Shampoo & Conditioner",
      "Hair Oils & Serums",
      "Styling Products",
      "Hair Masks",
      "Scalp Treatments"
    ]
  },
  {
    category: "Fragrances",
    items: [
      "Perfumes & Colognes",
      "Body Mists",
      "Essential Oils",
      "Roll-On Fragrances",
      "Scented Candles"
    ]
  },
  {
    category: "Body Care",
    items: [
      "Body Wash & Shower Gels",
      "Body Lotions & Creams",
      "Hand & Foot Care",
      "Deodorants",
      "Bath Salts & Scrubs"
    ]
  }
];

const salesDropdown = [
  {
    category: "New Sale Arrivals",
    items: [
      "Latest Discounts",
      "Limited-Time Offers",
      "Exclusive Online Deals",
      "Flash Sales",
      "Bundle & Save"
    ]
  },
  {
    category: "Clothing Sale",
    items: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      "Jackets & Outerwear",
      "Hoodies & Sweatshirts"
    ]
  },
  {
    category: "Footwear Sale",
    items: [
      "Sneakers",
      "Running Shoes",
      "Basketball Shoes",
      "Casual Shoes",
      "Boots & Sandals"
    ]
  },
  {
    category: "Accessories Sale",
    items: [
      "Bags & Backpacks",
      "Hats & Headwear",
      "Socks & Underwear",
      "Watches & Jewelry",
      "Sunglasses"
    ]
  },
  {
    category: "Beauty & Personal Care Sale",
    items: [
      "Skincare Deals",
      "Makeup Discounts",
      "Fragrance Offers",
      "Hair Care Savings",
      "Body Care Specials"
    ]
  }
];

const Ilink = styled(Link)`
  color:black;
`;

const Menu = () => {
  const { notimsg} = useContext(CartContext);
  const [hovermenu, setHovermenu] = useState([]); // Default to an empty array
  const [scrollbg,setScrollBg] = useState('transparent');
  const [openNoti,setOpenNoti] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const [alertnoti,setalertNoti] = useState(false);
  const [viewallnoti,setViewallNoti] = useState(4);
  const scrollref = useRef();
  const [notification,setNotification] = useState(null);
  const [messagenoti,setMessageNoti] = useState(null);

  const Menuheader = styled.div`
  background-color:${scrollbg};
  transition: all 2s ease;
  `;

  // const formatTimestamp = (timestamp) => {
  //   if (!timestamp || !timestamp.seconds) return "Unknown time"; // Handle missing timestamp
  //   const date = new Date(timestamp.seconds * 1000);
  //   return date.toLocaleString(); // Format to readable date
  // };

  useEffect(() => {
    return () => setalertNoti(true);
  }, [notimsg]);

  const changeonscroll = () => {
    if (window.scrollY >= 90) {
      setScrollBg('white');
    }else {
      setScrollBg('transparent');
    }
  };

  window.addEventListener('scroll',changeonscroll);

  const viewall = () => {
    setViewallNoti(pre => pre + 4);
    setTimeout(() => {
      scrollref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    if (!currentUser) return;
  
    let isMounted = true;
    const cartdata = async () => {
      const productRef = doc(db, "users",currentUser.uid);
      const productSnap = await getDoc(productRef);
      if (isMounted && productSnap.exists()) {
        const orderedProducts = productSnap.data().orderedProducts || [];
        setNotification(orderedProducts);
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
      cartdata();
      return () => {
        isMounted = false;
      };
    }, [viewallnoti,openNoti,currentUser?.uid]);
  

  // useEffect(() => {
  //   if (currentUser) {
  //     const q = query(
  //       collection(db, "notifications"),
  //       where("userId", "==", currentUser.uid),
  //       orderBy("time", "desc")
  //     );
  
  //     const unsubscribe = onSnapshot(q, (snapshot) => {
  //       setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //     });
  
  //     return () => unsubscribe();
  //   }
  // }, [currentUser]);

  // const markAsRead = async (id) => {
  //   await updateDoc(doc(db, "notifications", id), { read: true });
  // };

  // onClick={() => markAsRead(notif.id)}
  

  return (
    <Menuheader
     className='mainmenu'>
      <div className='menu'>
        <Link to="/"><h1>Logo</h1></Link> 
        <div className='menulist'>
          <Link to="/shop"><h5>Shop</h5></Link>
          <Link to="/brands"><h5>Brands</h5></Link>
          <Link onMouseEnter={() => {setHovermenu(newDropdown);setScrollBg('white')}}><h5>New</h5></Link>
          <Link onMouseEnter={() => {setHovermenu(clothesDropdown);setScrollBg('white');}}><h5>Clothes</h5></Link>
          <Link onMouseEnter={() => {setHovermenu(sportDropdown);setScrollBg('white');}}><h5>Sport</h5></Link>
          <Link onMouseEnter={() => {setHovermenu(cosmeticsDropdown);setScrollBg('white');}}><h5>Cosmetic</h5></Link>
          <Link onMouseEnter={() => {setHovermenu(salesDropdown);setScrollBg('white');}}><h5>Sales</h5></Link>
        </div>
        <div className='menufunctions'>
          <input type='search'></input>
          <Ilink to='/cart'><i className="bi bi-cart" onClick={() => setOpenNoti(false)}></i></Ilink>
          <Ilink to='/chats'><i className="bi bi-chat-dots" onClick={() => setOpenNoti(false)}></i></Ilink>
          <i className="bi bi-bell" onClick={() => {setOpenNoti(pre => !pre);setalertNoti(false)}}><span className={alertnoti ? 'alertnoti' : 'noalertnoti'}></span></i>
          <Ilink to='/profile'><i className="bi bi-person" onClick={() => setOpenNoti(false)}></i></Ilink>
        </div>
      </div> 
      
      {/* Dropdown Menu */}
      {/* {hovermenu.length > 0 && (
        <div className='dropdownmenu' onMouseLeave={() => {setHovermenu([]);changeonscroll()}}>
          {hovermenu.map((dropdown, index) => (
            <div key={index} className='dropproductsdown'>
              <h4>{dropdown.category}</h4>
              {dropdown.items.map((text, idx) => (
                <p key={idx}>{text}</p> 
              ))}
            </div>
          ))}
        </div>
      )} */}
      {
        openNoti && (notification || messagenoti ? (
          <div className='notificationscontainer'>
            <i className="bi bi-caret-up-fill"></i>
            <div className='notifications'>
              {notification && notification.map((notif,index) => (
                <div className='onenoti' key={index}>
                  <img src={notif.images[0]} alt='name' />
                  <div className='notitext'> 
                    <h4>{notif.name}</h4>
                    <p>You added to cart {notif.name}</p>
                    <p>{notif.time}</p>
                  </div>
                </div>
              ))}
              {messagenoti && messagenoti.map((notif,index) => (
                  <div className='onenoti' key={index}>
                    <img src={notif.photo} alt='name' />
                    <div className='notitext'> 
                      <h4>{notif.name}</h4>
                      <p>You added to cart {notif.name}</p>
                      <p>{notif.date}</p>
                    </div>
                  </div>
                ))}
              <div className='notiviewall' onClick={viewall} ref={scrollref}>View More</div>
            </div>
          </div>
        ) : (
          <div className='notificationscontainer'>
            <i className="bi bi-caret-up-fill caretnonoti"></i>
            <div className='notifications'>
              <div className='notiviewall'>No notification</div>
            </div>
          </div>
        ))
      }

      
    </Menuheader>
  );           
}

export default Menu
