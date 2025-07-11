import {  createContext,useEffect,useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import React from 'react'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // 🔥 Add loading state

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log('login user',user);
            setLoading(false); // 🔥 Stop loading when auth state is set
        });

        return () => unsub();
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Optional: Show a loading indicator
    }

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
