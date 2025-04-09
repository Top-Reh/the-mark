import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR00dMn6rnUG6vB6DpnKBS3J62H-6dsbI",
  authDomain: "the-mark-59ada.firebaseapp.com",
  projectId: "the-mark-59ada",
  storageBucket: "the-mark-59ada.appspot.com",
  messagingSenderId: "1074353582902",
  appId: "1:1074353582902:web:0d6272a727db8514787997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;