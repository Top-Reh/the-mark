import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";
import { arrayUnion, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {v4 as uuid} from "uuid"

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const [text,setText] = useState([]);
    

    const INITIAL_STATE = {
        chatId: null,
        user: null,  // ✅ Set user to null
    };

    // const handleSendNotification = async (message, recipientId) => {
    //     if (!currentUser || !recipientId || !message.text.trim()) return;
        
    //     try {
    //         const notificationRef = doc(db, "notifications", recipientId);
    //         const notificationId = uuid();
            
    //         await setDoc(notificationRef, {
    //             messages: arrayUnion({
    //                 id: notificationId,
    //                 type: 'chat',
    //                 senderId: currentUser.uid,
    //                 senderName: currentUser.displayName || 'User',
    //                 senderPhoto: currentUser.photoURL,
    //                 text: message.text,
    //                 timestamp: serverTimestamp(),
    //                 read: false,
    //                 chatId: state.chatId  // Use current state.chatId instead of INITIAL_STATE
    //             })
    //         }, { merge: true });
    //     } catch (error) {
    //         console.error("Error sending notification:", error);
    //     }
    // };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                if (!currentUser || !action.payload) return state; // ✅ Prevent null errors
                return {
                    user: action.payload,
                    chatId:
                        currentUser?.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            // case "SEND_MESSAGE":
            //     if (action.payload.recipientId) {
            //         handleSendNotification(action.payload.message, action.payload.recipientId);
            //     }
            //     return state;
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    console.log("ChatContextProvider -> currentUser", INITIAL_STATE.user);

    // ✅ Prevent reducer from running before currentUser is ready
    useEffect(() => {
        if (!currentUser) return;
        dispatch({ type: "CHANGE_USER", payload: null }); // Reset state on logout
    }, [currentUser]);

    return (
        <ChatContext.Provider value={{ data: state, dispatch,setText,text }}>
            {children}
        </ChatContext.Provider>
    );
};
