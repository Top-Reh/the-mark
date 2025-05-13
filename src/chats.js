import { useRef,useState, useEffect,useContext, useCallback, useReducer } from 'react';
import {db} from './firebase';
import {AuthContext} from './context/AuthContext';
import { ChatContext } from './context/ChatContext'
import {v4 as uuid} from "uuid"
import { useMediaQuery } from "react-responsive";
import {query,collection,onSnapshot, where, getDoc, getDocs, doc, setDoc, updateDoc, arrayUnion,} from 'firebase/firestore'
import styled from 'styled-components';
import { CartContext } from './context/cartcontext';
import { useLocation } from 'react-router-dom';

const MessageList = styled.div`
height:${(props) => (props.$ismobile  === 'true' ? 'auto' : '100%')};
padding:${(props) => (props.$ismobile  === 'true' ? '9px' : '5%')};
`;

const ExistUser = styled.div`
padding:${(props) => (props.$ismobile  === 'true' ? '5px' : '15px')};
width:${(props) => (props.$ismobile  === 'true' ? '70px' : '100%')};
background:${(props) => (props.$selectedchat ? '#d0d0d3' : 'white')};
`;

const SearchUser = styled.div`
padding:${(props) => (props.$ismobile  === 'true' ? '5px' : '15px')};
width:${(props) => (props.$ismobile  === 'true' ? '70px' : '100%')};
background:${(props) => (props.$selectedchat ? '#d0d0d3' : 'white')};
`;

const Usernames = styled.div`
position:${(props) => (props.$ismobile  === 'true' ? 'absolute' : 'relative')};
bottom:${(props) => (props.$ismobile  === 'true' ? '-65px' : '0')};
flex-direction:${(props) => (props.$ismobile  === 'true' ? 'row' : 'column')};
`;

// ChatList Component - Displays a list of chat conversations
const ChatList = ({setSelectedchat,ismobile,selectedchat,setToid}) => {
    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const {text} = useContext(ChatContext);
    const location = useLocation();
    const { sellerEmail } = location.state || {}; 

    const ACTION = {
      SET_SEARCH_USER: 'SET_SEARCH_USER',
      SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
      SET_SEARCH_ERROR: 'SET_SEARCH_ERROR',
      SET_EXISTING_CHATS: 'SET_EXISTING_CHATS',
      SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
    };

    const initialState = {
      SearchUser: '',   // user name
      searchResults: [],    // replaces user
      searchError: false,   // replaces err
      existingChats: [],    // replaces existUser
      errorMessage: '',     // replaces nousershow
      isLoading: false      // new helpful state
    };

    const [chatState, chatDispatch] = useReducer(chatReducer, initialState); 

    function chatReducer( state, action) {
      switch (action.type) {
        case ACTION.SET_SEARCH_USER:
          return { ...state, SearchUser: action.payload };
        case ACTION.SET_SEARCH_RESULTS:
          return { ...state, searchResults: action.payload };
        case ACTION.SET_SEARCH_ERROR:
          return { ...state, searchError: action.payload };
        case ACTION.SET_EXISTING_CHATS:
          return { ...state, existingChats: action.payload };
        case ACTION.SET_ERROR_MESSAGE:
          return { ...state, errorMessage: action.payload };
      default:
        return state;
      }
    }

    useEffect(() => {
      if (!currentUser) return;

      // Fetch admins
      const adminQuery = query(collection(db, 'admins'));
      const adminUnsubscribe = onSnapshot(adminQuery, (querySnapshot) => {
        let adminUsers = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.uid && userData.uid !== currentUser?.uid) {
            adminUsers.push({
              ...userData,
              isAdmin: true // Add flag to identify admin users
            });
          }
        });
        
        // Fetch regular users
        const userQuery = query(collection(db, 'users'));
        const userUnsubscribe = onSnapshot(userQuery, (querySnapshot) => {
          let regularUsers = [];
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.uid && userData.uid !== currentUser?.uid) {
              regularUsers.push({
                ...userData,
                isAdmin: false // Add flag to identify regular users
              });
            }
          });
          
          // Combine both admin and regular users
          const allUsers = [...adminUsers, ...regularUsers];
          chatDispatch({type: ACTION.SET_EXISTING_CHATS, payload: allUsers});
        });

        return () => {
          userUnsubscribe();
        };
      });

      return () => {
        adminUnsubscribe();
      };
    }, [currentUser]);

    const handleSearch = async(e) => {
      e.preventDefault();
      if (!chatState.SearchUser.trim()) return; 
    };

    useEffect(() => {
      if (!chatState.SearchUser.trim()) return;
      const fetchData = async () => {
        console.log('search user with state: '+ chatState.SearchUser);
        const q = query(
          collection(db, "users"),
          where("name", "==", chatState.SearchUser.toLowerCase())
        );
    
        try {
          chatDispatch({type: ACTION.SET_SEARCH_ERROR, payload:false}); // resetting error state
          const querySnapshot = await getDocs(q);
          const users = [];
          querySnapshot.forEach((doc) => {
            const userdata = doc.data();
            if (userdata.uid !== currentUser?.uid) {
              users.push(userdata);
            }
          });
          if (users.length === 0) {
            chatDispatch({type: ACTION.SET_SEARCH_ERROR, payload:true}); // resetting error state
          };
          chatDispatch({type: ACTION.SET_SEARCH_RESULTS, payload:users}); //setting user
        } catch (error) {
          chatDispatch({type: ACTION.SET_SEARCH_ERROR, payload:true}); // resetting error state
          console.log('searching user : ',error);
        };
        if (chatState.SearchUser === '') {
          chatDispatch({type: ACTION.SET_SEARCH_ERROR, payload:false}); // resetting error state
        };
      };
    
      fetchData(); // Call the async function
    
    }, [chatState.SearchUser]);

    const handlekeydown = (e) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent form submission
        handleSearch(e);
        chatDispatch({type: ACTION.SET_SEARCH_USER, payload:""}); // clear search user
        if (chatState.searchError) {
          chatDispatch({type: ACTION.SET_ERROR_MESSAGE, payload:"User not found"}); // no user found message
          // Hide the message after 3 seconds
          setTimeout(() => {
            chatDispatch({type: ACTION.SET_ERROR_MESSAGE, payload:" "}); // no user found message
          }, 3000);
        }
      };
      if (chatState.SearchUser === '') {
        chatDispatch({type: ACTION.SET_SEARCH_ERROR, payload:false}); // resetting error state
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        if (!sellerEmail) return; // Ensure sellerEmail is provided
    
        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", sellerEmail)
          );
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            // Extract the first document's data (assuming email is unique)
            const userData = querySnapshot.docs[0].data();
            handleSelect(userData); // Pass the user data to handleSelect
          } else {
            console.error("No user found with the provided email.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
    
      return () => fetchData();
    }, [sellerEmail]);

    const handleSelect = async (selectedUser) => {
      setToid(selectedUser.uid);
      const combinedId = 
        currentUser?.uid > selectedUser.uid
          ? currentUser?.uid + selectedUser.uid 
          : selectedUser.uid + currentUser?.uid;

      try {
        const res = await getDoc(doc(db,"chats",combinedId));

        if (!res.exists()) {
          // Create new chat document with initial empty messages array
          await setDoc(doc(db,"chats",combinedId), {
            messages: [],
            participants: [currentUser?.uid, selectedUser.uid],
            createdAt: new Date().toLocaleTimeString()
          });

          // Update user documents with chat reference
          await updateDoc(doc(db, "users", currentUser?.uid), {
            [`chats.${combinedId}`]: {
              lastChatWith: selectedUser.uid,
              timestamp: new Date().toLocaleTimeString(),
              lastMessage: null
            }
          });

          await updateDoc(doc(db, "users", selectedUser.uid), {
            [`chats.${combinedId}`]: {
              lastChatWith: currentUser?.uid,
              timestamp: new Date().toLocaleTimeString(),
              lastMessage: null
            }
          });
        }

        // Always update the chat context with the selected user
        dispatch({ type: "CHANGE_USER", payload: selectedUser });
        setSelectedchat(true);
      } catch (error) {
        console.error("Error in handleSelect:", error);
      }
    };

    const handleuseronchange = (e) => {
      chatDispatch({type: ACTION.SET_SEARCH_USER, payload:e.target.value});
    }

  return (
    <MessageList className="chat-list" ismobile={ismobile}>
      <form className="form uniform" onSubmit={handleSearch}>
          <button type='submit'>
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                  <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
          </button>
          <input
            type="text"
            placeholder="Search users..."
            className="search-bar input"
            onKeyDown={handlekeydown}
            value={chatState.SearchUser}
            onChange={e => handleuseronchange(e)}
          />
      </form>
      <Usernames className='chatusernames' $ismobile={!ismobile}>
          {
            chatState.searchError ? (<span className='text-black'>{chatState.errorMessage}</span>) : (
             <>
               {
                chatState.searchResults.length > 0 && chatState.searchResults?.map((item,index) => (
                  <SearchUser key={index} $selectedchat={selectedchat} $ismobile={!ismobile} onClick={() => {handleSelect(item)}} className='usersearching rounded-md w-full bg-gray-100 py-5 px-5 mb-3 flex justify-center align-middle gap-3'>
                    <img src={item.photoURL} className="avatar w-12 h-12 rounded-full" alt={item.name}/>
                    <div className='chat-title' style={{ display: !ismobile  === 'true' ? 'none' : 'block' }}>
                      <span className="chat-name capitalize font-bold">{item.name}</span>
                    </div>
                  </SearchUser>
                ))
              }
             </>
            )
          }
          {
            chatState.existingChats && chatState.existingChats.map((item,index) => (
              <ExistUser key={index} $selectedchat={selectedchat} $ismobile={!ismobile} onClick={() => handleSelect(item)} className='usersearching rounded-md w-full py-5 px-5 mb-3 flex justify-center align-middle gap-3'>
                <img src={item.photoURL} className="avatar w-12 h-12 rounded-full bg-red-400" alt={item.name}/>
                <div className='chat-title' style={{ display: !ismobile === 'true' ? 'none' : 'block' }}>
                  <div className="flex items-center gap-2">
                    <span className="chat-name capitalize font-bold">{item.name}</span>
                    {item.isAdmin && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Admin</span>
                    )}
                  </div>
                  <p>{item.timestamp?.seconds
                    ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString()
                    : item.timestamp}</p>
                </div>
              </ExistUser>
            ))
          }
          
      </Usernames>
    </MessageList>
  );
};

const style = {
  sent:` justify-start items-start w-full flex-row-reverse `,
  received:` justify-start items-start w-full`,
  senttext:`bg-blue-400`,
  receivedtext:`bg-gray-200`,
  messageall:`flex flex-row items-center gap-3`
}

const Message = styled.div`
`;

const Chatcomponent = styled.div`
padding-top:${(props) => (!props.$ismobile  === 'true' ? '12%' : '20px')};
height:${(props) => (props.$ismobile  === 'true' ? '90%' : '90vh')};
`;

// ChatWindow Component - The main area for viewing and sending messages
const ChatWindow = ({selectedchat,ismobile,toid}) => {
    const [inputMessage,setInputMessage] = useState('');
    const {data,text,setText} = useContext(ChatContext);
    const {currentUser} = useContext(AuthContext);
    const { setNotiMsg} = useContext(CartContext);

    const scrollref = useRef();

    const handleSend = useCallback(async (e) => {
      if (!currentUser || !data?.user) {
        console.error("No user is logged in or no chat selected");
        return;
      }

      e.preventDefault();
      if (!inputMessage.trim()) return;
      setInputMessage('');

      try {
        const chatRef = doc(db, "chats", data.chatId);
        const chatDoc = await getDoc(chatRef);

        const messageData = {
          id: uuid(),
          name: currentUser.displayName || 'User',
          photoURL: currentUser.photoURL,
          text: inputMessage,
          senderId: currentUser.uid,
          toid: data.user.uid,
          date: new Date().toLocaleTimeString(),
        };

        if (chatDoc.exists()) {
          await updateDoc(chatRef, {
            messages: arrayUnion(messageData)
          });
        } else {
          await setDoc(chatRef, {
            messages: [messageData],
            participants: [currentUser.uid, data.user.uid],
            createdAt: new Date().toLocaleTimeString()
          });
        }

        // Create notification for the recipient
        const notificationRef = doc(db, "notifications", data.user.uid);
        const notificationDoc = await getDoc(notificationRef);

        const notificationData = {
          id: uuid(),
          type: 'chat',
          senderId: currentUser.uid,
          senderName: currentUser.displayName || 'User',
          senderPhoto: currentUser.photoURL,
          senderEmail: currentUser.email,
          text: inputMessage,
          chatId: data.chatId,
          timestamp: new Date().toLocaleTimeString(),
          read: false
        };

        if (notificationDoc.exists()) {
          await updateDoc(notificationRef, {
            messages: arrayUnion(notificationData)
          });
        } else {
          await setDoc(notificationRef, {
            messages: [notificationData]
          });
        }

        // Update last message in user documents
        await updateDoc(doc(db, "users", currentUser.uid), {
          [`chats.${data.chatId}.lastMessage`]: {
            text: inputMessage,
            senderId: currentUser.uid,
            timestamp: new Date().toLocaleTimeString()
          }
        });

        await updateDoc(doc(db, "users", data.user.uid), {
          [`chats.${data.chatId}.lastMessage`]: {
            text: inputMessage,
            senderId: currentUser.uid,
            timestamp: new Date().toLocaleTimeString()
          }
        });

        scrollref.current?.scrollIntoView({behavior: 'smooth'});
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }, [inputMessage, currentUser, data]);

    const handlekeydown = (e) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        handleSend(e);
      }
    }

    useEffect(() => {
      if (!data?.chatId) return;
    
      const q = doc(db, "chats", data.chatId);
      const unsubscribe = onSnapshot(q, (docSnap) => {
        if (docSnap.exists()) {
          setText(docSnap.data().messages || []);
          scrollref.current?.scrollIntoView({behavior: 'smooth'});
        }
      });
      return () => unsubscribe();
    }, [data?.chatId]);

    return (
      <Chatcomponent className="chat-window pb-7 pl-7 pr-7" $ismobile={!ismobile}>
        {selectedchat && data?.user ? (
          <>
            <h2 className='text-black border-solid border-b py-3 capitalize text-3xl'>{data.user.name}</h2>

            <Message className="messages" id="chat-container">
              {text?.map((item, index) => (
                <div key={index} className={item.senderId === currentUser?.uid ? `sentMessage ${style.messageall}` : `${style.messageall} receivedMessage`}>
                  <img src={item.photoURL} alt={item.name} className='w-10 h-10 border-gray border-solid border rounded-full overflow-hidden object-cover object-center' />
                  <div>
                    <p className='text-gray-600 text-xs capitalize'>{item.name}</p>
                    <p className={`px-4 py-2 rounded-md w-auto ${item.senderId === currentUser?.uid ? style.senttext : style.receivedtext}`}>{item.text}</p>
                  </div>
                </div>
              ))}
              <span ref={scrollref}></span>
            </Message>

            <div className="message-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={handlekeydown}
                className='outline-none'
              />
              <button onClick={handleSend}><i className="bi bi-send-fill"></i></button>
            </div>
          </>
        ) : (
          <p className='text-5xl flex w-full h-full justify-center align-middle items-center text-black'>Choose one chat</p>
        )}
      </Chatcomponent>
    );
};

// ChatApp - The main app that holds the chat functionality

const ChatApp= styled.div`
display:${props => (props.$ismobile === 'true' ? 'flex' : 'grid')}
`;

const Home = () => {
  const [selectedchat,setSelectedchat] = useState(false);
  const ismobile = useMediaQuery({ maxWidth: 768 });  
  const [toid,setToid] = useState(null)
 
  return (
    <ChatApp className="chat-app" $ismobile={ismobile ? 'true' : 'false'}>
      <ChatList
      setSelectedchat={setSelectedchat}
      selectedchat={selectedchat}
      $ismobile={!ismobile ? 'true' : 'false'}
      setToid={setToid}
      />
      <ChatWindow
      selectedchat={selectedchat}
      $ismobile={!ismobile ? 'true' : 'false'}
      toid={toid}
      />
    </ChatApp>
  );
};

export default Home;
