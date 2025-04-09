import React from 'react';
import GoogleButton from "react-google-button";
import { auth, db } from "../firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    if (!result.user) {
      return;
    }
    

    const user = result.user;
    console.log("User signed in:", user);

    const userRef = doc(db, "users", user.uid);
    
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName ? user.displayName.toLowerCase() : "Anonymous",
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toLocaleTimeString(),
    }, { merge: true });

    // Ensure notifications document exists
    const docRef = doc(db, "notifications", user.uid);
    await setDoc(docRef, { messages: [], cart: [] }, { merge: true });

  } catch (error) {
    console.error("Sign-in error:", error);
  }
};


const Loginbtn = () => {
  return <GoogleButton onClick={googleSignIn} />;
};

export default Loginbtn;
