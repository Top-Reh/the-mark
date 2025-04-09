import React, { useState } from 'react';
import Logoutbtn from "./logoutbtn";
import { auth } from "../firebase";
import {useAuthState} from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom';
import ProductUpload from '../ProductUpload';
import Userprofilehome from './userprofilehome';

const Userpf = () => {
  const [user] = useAuthState(auth);
  const [opentab,setOpenTab] = useState('profile');
  const [borderactive,setBorderActive] = useState(0);
   return (
    user ? (
        <div className="profilecontainer">
            <div className="usersetting">
              <div className="user">
              {user?.photoURL && <img src={user.photoURL} alt={user.displayName}></img>}
                <div>
                  <h2>{user?.displayName}</h2>
                  <p>{user?.email}</p>
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
                  <div className="settingone" onClick={() => {setOpenTab('uploadProduct');setBorderActive('70px')}} style={{backgroundColor : opentab === 'uploadProduct' ? '#f0f0f0' : 'transparent'}}>
                    <i className="bi bi-file-earmark-arrow-up"></i>
                    <h4>UploadProduct</h4>
                  </div>
                  <div className="settingone" onClick={() => {setOpenTab('logout');setBorderActive('140px')}} style={{backgroundColor : opentab === 'logout' ? '#f0f0f0' : 'transparent'}}>
                    <i className="bi bi-box-arrow-right"></i>
                    <h4>Log Out</h4>
                  </div>
                </div>
                <span className='borderactive' style={{top: borderactive}}></span>
              </div>
            </div>
            <div className="settingpage">
              {
                opentab === 'profile' ? <Userprofilehome/> 
                : opentab === 'uploadProduct' ? <ProductUpload/> 
                : opentab === 'logout' ? <Logoutbtn/> : ''
              }
            </div>
        </div>
    ) : null
  )
}

export default Userpf

// {user?.picture && <img src={user.picture} alt={user.name}></img>}
// <h2>{user?.name}</h2>
// <p>{user?.email}</p>