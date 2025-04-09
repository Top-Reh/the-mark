import React, { useState } from "react";
import Loginasadmin from "./components/loginasadmin";
import Loginbtn from "./components/loginbtn";
import Userpf from "./components/userpf";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Logoutbtn from "./components/logoutbtn";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth); // Use Firebase auth state
  const [adminlogin, setAdminlogin] = useState(false); // State to manage admin login
  const [googlelogin, setGooglelogin] = useState(false); // State to manage Google login
  const [businessType, setBusinessType] = useState(""); // State to manage business type

  const handleselectbusiness = (e) => {
    const business = e.target.innerText;
    setBusinessType(business);
    console.log(business);
  };


  return (
    <main>
      {error && <p>Authentication Error!</p>}
      {loading && <p>Loading...</p>}
      {user ? (
        <div className="loginpage">
          <Userpf />
        </div>
      ) : (
        <div className="loginpage">
          <div className="loginuser">
            <h2>Welcome Back, Shopper!</h2>
            <h1>Login as User</h1>
            <p>Log in to explore exclusive deals, track your orders, and manage your account with ease.</p>
            <Loginbtn />
          </div>
          <div className="loginadmin">
            <h2>Welcome Back, Admin!</h2>
            <h1>Login as Admin</h1>
            <p>Manage your shop, track orders, and stay connected with your customers.</p>
            <button onClick={() => setAdminlogin(pre => !pre)}>Sign In</button>
            <div className="adminloginbtncon" style={{ height: adminlogin ? "100%" : "0" , opacity: adminlogin ? "1" : "0"}}>
              <h3>Please select your business type</h3>
              <div className="business-type">
                <button onClick={handleselectbusiness}>Fashion & Beauty</button>
                <button onClick={handleselectbusiness}>Technology & Gadgets</button>   
                <button onClick={handleselectbusiness}>Home & Living</button>
                <button onClick={handleselectbusiness}>Entertainment & Leisure</button>
                <button onClick={handleselectbusiness}>Health & Wellness</button>
                <button onClick={handleselectbusiness}>Travel & Lifestyle</button>
              </div>
              <div className="loginadminbtn">
              <button onClick={() => setAdminlogin(pre => !pre)}>Previous</button>
              <button onClick={() => setGooglelogin(pre => !pre)}>Next</button>
              </div>
              <div className="adminlogingoogle" style={{display: googlelogin ? "flex" : "none"}}>
                <h3>Login with Google</h3>
                <Loginasadmin type={businessType}/>
                <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
                <button onClick={() => setGooglelogin(pre => !pre)}>Previous</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
//<Loginbtn />
//<Logoutbtn/>
