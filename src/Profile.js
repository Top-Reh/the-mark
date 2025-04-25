import React, { useEffect, useState } from "react";
import Loginasadmin from "./components/loginasadmin";
import Loginbtn from "./components/loginbtn";
import Userpf from "./dashboards/userpf";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import Logoutbtn from "./components/logoutbtn";
import { use } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Admindashboard from "./dashboards/admindashboard";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth); // Use Firebase auth state
  const [adminlogin, setAdminlogin] = useState(false); // State to manage admin login
  const [googlelogin, setGooglelogin] = useState(false); // State to manage Google login
  const [businessType, setBusinessType] = useState(""); // State to manage business type
  const [userData, setUserData] = useState(null); // State to manage user data
  const [adminData, setAdminData] = useState(null); // State to manage admin data
  const [whoLogin, setWhoLogin] = useState(""); // State to manage who logged in

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const q = query(collection(db, "admins"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const b = query(collection(db, "users"), where("uid", "==", user.uid));
        const userdatasnapshot = await getDocs(b);
    
        if (!querySnapshot.empty) {
          const admindata = querySnapshot.docs.map(doc => doc.data());
          console.log('admindatasnapshot',admindata[0]);
          setAdminData(admindata[0]);
          setWhoLogin("admin");
        } 
        
        if (!userdatasnapshot.empty) {
          const userdata = userdatasnapshot.docs.map(doc => doc.data());
          console.log('userdatasnapshot',userdata[0]);
          setUserData(userdata[0]);
          setWhoLogin("user");
        }
      } else return
    }
  
    fetchData();
  }, [user]);  

  const handleselectbusiness = (e) => {
    const business = e.target.innerText;
    setBusinessType(business);
    console.log(business);
  };

  console.log("User as user:", user); // Log the user object to see its properties


  return (
    <main>
      {error && <p>Authentication Error!</p>}
      {loading && <p>Loading...</p>}
      {user ? (
          whoLogin  === "user" ? (
            <Userpf />
          ) : (
            <Admindashboard />
          )
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
