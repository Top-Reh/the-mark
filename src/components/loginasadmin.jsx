import React from 'react';
import GoogleButton from "react-google-button";
import { auth, db } from "../firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleSignIn = async (type) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    if (!result.user) {
      return;
    }
    console.log("type", type);

    const user = result.user;
    console.log("User signed in:", user);

    const userRef = doc(db, "admins", user.uid);
    
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName ? user.displayName.toLowerCase() : "Anonymous",
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toLocaleTimeString(),
        businessType: type,
    }, { merge: true });

    // Ensure notifications document exists
    // const docRef = doc(db, "notifications", user.uid);
    // await setDoc(docRef, { messages: [], cart: [] }, { merge: true });

  } catch (error) {
    console.error("Sign-in error:", error);
  }
};


const Loginasadmin = ({type}) => {
  return <GoogleButton onClick={() => googleSignIn(type)} />;
};

export default Loginasadmin;
