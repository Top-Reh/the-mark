import React, { useEffect, useState } from 'react';
import Logoutbtn from "../components/logoutbtn";
import { auth, db } from "../firebase";
import {useAuthState} from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom';
import ProductUpload from './ProductUpload';
import Userprofilehome from './userprofilehome';
import { ChevronDown } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Userpf = () => {
  const [user] = useAuthState(auth);
  const [opentab,setOpenTab] = useState('profile');
  const [borderactive,setBorderActive] = useState(0);
  const [userData, setUserData] = useState(null); // State to manage user data

    useEffect(() => {
      const fetchData = async () => {
        if (user) {
          const b = query(collection(db, "users"), where("uid", "==", user.uid));
          const userdatasnapshot = await getDocs(b);
          
          if (!userdatasnapshot.empty) {
            const userdata = userdatasnapshot.docs.map(doc => doc.data());
            console.log('userdatasnapshot',userdata[0]);
            setUserData(userdata[0]);
          }
        } else return
      }
    
      fetchData();
    }, [user]); 

   return (
    user ? (
        <div className="profilecontainer">
            <div className="usersetting">
              <div className="user">
              {userData?.photoURL && <img src={userData.photoURL} alt={userData.displayName}></img>}
                <div>
                  <h2>{userData?.displayName}</h2>
                  <p>{userData?.email}</p>
                </div>
              </div>
              <form className="form uniform">
                  <button>
                      <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                          <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Search"
                    className="search-bar input"
                  />
                  <button className="reset" type="reset" >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                  </button>
                </form>
              <div className='settingcontainer'>
                <div className="settingnames">
                  <div className="settingone activesetting" onClick={() => {setBorderActive(0);setOpenTab('profile')}} style={{backgroundColor : opentab === 'profile' ? '#f0f0f0' : 'transparent'}}>
                    <i className="bi bi-house"></i>
                    <h4>notifications</h4>
                  </div>
                  <div className="settingone" onClick={() => {setOpenTab('Orders');setBorderActive('70px')}} style={{backgroundColor : opentab === 'Orders' ? '#f0f0f0' : 'transparent'}}>
                    <i className="bi bi-file-earmark-arrow-up"></i>
                    <h4>Orders</h4>
                  </div>
                  <div className="settingone" onClick={() => {setOpenTab('logout');setBorderActive('140px')}} style={{backgroundColor : opentab === 'logout' ? '#f0f0f0' : 'transparent'}}>
                    <i className="bi bi-box-arrow-right"></i>
                    <h4>Log Out</h4>
                  </div>
                </div>
                <span className='borderactive' style={{top: borderactive}}></span>
              </div>
            </div>
            <div className="settingpage w-full">
              {
                opentab === 'profile' ? <Userprofilehome/> 
                : opentab === 'Orders' ? <Orders/> 
                : opentab === 'logout' ? <Logoutbtn/> : ''
              }
            </div>
        </div>
    ) : null
  )
}

const Orders = () => {
    const ordertabs = ['All orders', 'Complete', 'Pending', 'Cancel'];
    const [activeOrderTab, setActiveOrderTab] = useState('All orders');
    const handleDateFilter = (dateRange) => {
        console.log("Selected date filter:", dateRange);
        // Apply filter logic here based on `dateRange`
      };
    return (
        <div className='admin_orders_container w-full'>
            <div className='orders_table_header'>
                <div>
                    <h1 className='text-xl font-bold'>Orders</h1>
                    <p className='text-xs text-gray-600'>15 Orders found</p>
                </div>
                <DateFilterDropdown onSelect={handleDateFilter}/>
            </div>
            <div className='admin_orders_table_buttons'>
            <ul className="flex gap-7 ">
                {ordertabs.map((tab) => (
                    <li
                    key={tab}
                    className={`relative pb-2 text-sm font-normal cursor-pointer transition-all duration-200 
                        ${activeOrderTab === tab ? 'text-blue-600 ' : 'text-gray-600'}
                    `}
                    onClick={() => setActiveOrderTab(tab)}
                    >
                    {tab}
                    {activeOrderTab === tab && (
                        <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-blue-600 rounded"></span>
                    )}
                    </li>
                ))}
                </ul>
            </div>
            <div className='admin_orders_table'>
                <ul className='admin_orders_table_header'>
                    <li>#</li>
                    <li>Order ID</li>  
                    <li>Product Name</li>
                    <li>Address</li>
                    <li>Date</li>
                    <li>Price</li>
                    <li>Status</li>
                </ul>
                <ul>
                    <li>1</li>
                    <li>#1234567</li>  
                    <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Shirt</li>
                    <li>351 Elgin St .Celina</li>
                    <li>4/21/2025</li>
                    <li>$34452</li>
                    <li><p  className='text-green-600 bg-green-100 p-2 px-3 rounded-3xl'>
                    Received </p></li>
                </ul>
                <ul>
                    <li>2</li>
                    <li>#1234567</li>  
                    <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Shirt</li>
                    <li>351 Elgin St .Celina</li>
                    <li>4/21/2025</li>
                    <li>$34452</li>
                    <li><p  className='text-yellow-600 bg-yellow-100 p-2 px-3 rounded-3xl'>
                    Delivered </p></li>
                </ul>
                <ul>
                    <li>3</li>
                    <li>#1234567</li>  
                    <li><img className='w-8 h-8 object-cover object-center rounded-sm' src='https://i.pinimg.com/474x/8c/2b/4b/8c2b4b428911a7b2a4560ddbf9b51e85.jpg' alt='shirt'></img>Shirt</li>
                    <li>351 Elgin St .Celina</li>
                    <li>4/21/2025</li>
                    <li>$34452</li>
                    <li><p  className='text-red-600 bg-red-100 p-2 px-3 rounded-3xl'>
                    Pending </p></li>
                </ul>
            </div>
        </div>
    )
}

const dateOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
];

const DateFilterDropdown = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Filter by Date');

  const handleSelect = (option) => {
    setSelectedLabel(option.label);
    setIsOpen(false);
    onSelect(option.value); // pass the selected date range to parent
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
      >
        {selectedLabel}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-0 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col ">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Userpf

// {user?.picture && <img src={user.picture} alt={user.name}></img>}
// <h2>{user?.name}</h2>
// <p>{user?.email}</p>