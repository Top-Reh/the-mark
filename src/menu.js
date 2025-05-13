import React, { useState, useContext, useEffect, useRef } from 'react';
import { CartContext } from './context/cartcontext';
import { NotificationContext } from './context/NotificationContext';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, updateDoc, doc, getDoc, getDocs } from "firebase/firestore";
//menu

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
  const { notimsg } = useContext(CartContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const [hovermenu, setHovermenu] = useState([]);
  const [scrollbg, setScrollBg] = useState('transparent');
  const [openNoti, setOpenNoti] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [alertnoti, setalertNoti] = useState(false);
  const [viewallnoti, setViewallNoti] = useState(4);
  const scrollref = useRef();

  const Menuheader = styled.div`
    background-color: ${scrollbg};
    transition: all 2s ease;
  `;

  useEffect(() => {
    return () => setalertNoti(true);
  }, [notimsg]);

  const changeonscroll = () => {
    if (window.scrollY >= 90) {
      setScrollBg('white');
    } else {
      setScrollBg('transparent');
    }
  };

  window.addEventListener('scroll', changeonscroll);

  const viewall = () => {
    setViewallNoti(pre => pre + 4);
    setTimeout(() => {
      scrollref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setOpenNoti(false);
  };

  return (
    <Menuheader className='mainmenu'>
      <div className='menu'>
        <Link to="/"><h1>Logo</h1></Link>
        <div className='menulist'>
          <Link to="/shop"><h5>Shop</h5></Link>
          <Link to="/brands"><h5>Brands</h5></Link>
        </div>
        <div className='menufunctions'>
          <input type='search'></input>
          <Ilink to='/cart'><i className="bi bi-cart" onClick={() => setOpenNoti(false)}></i></Ilink>
          <Ilink to='/chats'><i className="bi bi-chat-dots" onClick={() => setOpenNoti(false)}></i></Ilink>
          <i className="bi bi-bell" onClick={() => { setOpenNoti(pre => !pre); setalertNoti(false) }}>
            {unreadCount > 0 && <span className='alertnoti'></span>}
          </i>
          <Ilink to='/profile'><i className="bi bi-person" onClick={() => setOpenNoti(false)}></i></Ilink>
        </div>
      </div>

      {openNoti && (
        <div className='notificationscontainer'>
          <i className="bi bi-caret-up-fill"></i>
          <div className='notifications'>
            {notifications.length === 0 ? (
              <div className='notiviewall'>No notifications</div>
            ) : (
              <>
                {notifications.slice(0, viewallnoti).map((notification) => (
                  <div
                    key={notification.id}
                    className={`onenoti ${!notification.read ? 'activenoti' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.type === 'chat' ? (
                      <img src={notification.senderPhoto} alt={notification.senderName} />
                    ) : (
                      <img src={notification.productImage || '/default-product.png'} alt={notification.productName} />
                    )}
                    <div className='notitext'>
                      <h4>{notification.type === 'chat' ? notification.senderName : notification.productName}</h4>
                      <p>{notification.text}</p>
                      <p>{notification.timestamp}</p>
                    </div>
                  </div>
                ))}
                {notifications.length > viewallnoti && (
                  <div className='notiviewall' onClick={viewall} ref={scrollref}>
                    View More
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Menuheader>
  );
};

export default Menu;
