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
background:${(props) => (props.selectedchat ? '#d0d0d3' : 'white')};
`;

const SearchUser = styled.div`
padding:${(props) => (props.$ismobile  === 'true' ? '5px' : '15px')};
width:${(props) => (props.$ismobile  === 'true' ? '70px' : '100%')};
background:${(props) => (props.selectedchat ? '#d0d0d3' : 'white')};
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

      const q = query(collection(db, 'users'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let userexist = [];
        querySnapshot.forEach((docs) => {
          const userData = docs.data();
          if (userData.uid && userData.uid !== currentUser?.uid) { // ✅ Exclude the current user
            userexist.push(userData);
            // if (userData.lastChatWith === currentUser.uid) {
            //   setNotiMsg((prev) => [
            //     {
            //     id: uuid(),
            //     name: userData.name || 'User',
            //     text: 'sent you a message',
            //     image: userData.photoURL,
            //     time: new Date().toLocaleTimeString(),
            //     },
            //     ...prev,
            //   ]);
            // }
          }
        });
        // const userList = querySnapshot.docs
        // .map((doc) => doc.data())
        // .filter((user) => user.uid !== currentUser.uid);
        chatDispatch({type: ACTION.SET_EXISTING_CHATS, payload:userexist}); // exist user
      });
      return () => unsubscribe();
    },[ currentUser,text ]);

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
          await setDoc(doc(db,"chats",combinedId),{messages:[]});

          await updateDoc(doc(db, "users", currentUser?.uid), {
            lastChatWith: selectedUser.uid,
            timestamp: new Date().toLocaleTimeString(),
          });

          await updateDoc(doc(db, "users", selectedUser.uid), {
              lastChatWith: currentUser?.uid,
              timestamp: new Date().toLocaleTimeString(),
          });
        } else {
          await updateDoc(doc(db, "users", currentUser?.uid), {
            [`chats.${combinedId}.lastChatWith`]: selectedUser.uid,
            [`chats.${combinedId}.timestamp`]: new Date().toLocaleTimeString(),
          });

          await updateDoc(doc(db, "users", selectedUser.uid), {
              [`chats.${combinedId}.lastChatWith`]: currentUser?.uid,
            [`chats.${combinedId}.timestamp`]: new Date().toLocaleTimeString(),
          });
        };
        dispatch({ type: "CHANGE_USER", payload: selectedUser });
        setSelectedchat(true);
      } catch (error) {
        console.log(error)
      };
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
                  <SearchUser key={index} selectedchat={selectedchat} $ismobile={!ismobile} onClick={() => {handleSelect(item)}} className='usersearching rounded-md w-full bg-gray-100 py-5 px-5 mb-3 flex justify-center align-middle gap-3'>
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
              <ExistUser key={index} selectedchat={selectedchat} $ismobile={!ismobile} onClick={() => handleSelect(item)} className='usersearching rounded-md w-full  py-5 px-5 mb-3 flex justify-center align-middle gap-3'>
                <img src={item.photoURL} className="avatar w-12 h-12 rounded-full bg-red-400" alt={item.name}/>
                <div className='chat-title' style={{ display: !ismobile  === 'true' ? 'none' : 'block' }}>
                  <span className="chat-name capitalize font-bold" >{item.name}</span>
                  <p >{item.timestamp}</p>
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

    // useEffect(() => {
    //   const q = doc(db, "users", currentUser.uid);
    //   const unsubscribe = onSnapshot(q, async(docSnap) => {
    //     const userRef = doc(db, "users", currentUser.uid);
    //     const userSnap = await getDoc(userRef);

    //     if (userSnap.exists()) {
    //       const userdata = userSnap.data();
    //       const lastMessage = userSnap.data().lastMessage;

    //       if (lastMessage) {
    //         setNotiMsg((prev) => [
    //           ...prev,
    //           {
    //             name: lastMessage.name,
    //             text: lastMessage.text,
    //             image: userdata.image,
    //             time: lastMessage.time?.toDate().toLocaleTimeString(),
    //           }
    //         ]);
    //       }
    //     }
    //   });
    //   return () => unsubscribe();
    // },[text]);

    const handleSend =useCallback (async (e) => {
      if (!currentUser) {
        return null; // or loading spinner, etc.
      }

      e.preventDefault();
      if (!currentUser) {
        console.error("No user is logged in");
        return;
      } 
      if (!inputMessage.trim()) return;
      setInputMessage('');

      // const messageData = {
      //   id: uuid(),
      //   name: currentUser.displayName || 'User',
      //   photo: currentUser.photoURL,
      //   text: inputMessage,
      //   senderId: currentUser?.uid,
      //   toid,
      //   date: new Date().toLocaleTimeString(),
      // };

      // dispatch({ 
      //   type: "SEND_MESSAGE", 
      //   payload: {
      //       message: messageData,
      //       recipientId: data.user.uid
      //   }
      // });

      if (toid === currentUser?.uid) {
        const docRefnoti = doc(db, "notifications", currentUser?.uid);
        const docSnap = await getDoc(docRefnoti);

                  
        // Add new message and cart item
        await updateDoc(docRefnoti, {
          messages: arrayUnion({  
            type: 'chat',
            id: text.senderId,
            name: text.name || 'User',
            text: 'sent you a message',
            image: text.photo,
            time: new Date().toLocaleTimeString(), }),
            read:false
        });
        
        if (docSnap.exists()) {
          // Extract messages and cart
          const data = docSnap.data();
          setNotiMsg([
            ...(data.messages || []),
            ...(data.cart || [])
          ].reverse());
        }
      }

      const chatRef = doc(db, "chats", data.chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        // If chat exists, update it
        await updateDoc(chatRef, {
          messages: arrayUnion({
            id: uuid(),
            name: currentUser.displayName || 'User',
            photo: currentUser.photoURL,
            text: inputMessage, 
            senderId: currentUser?.uid,
            toid,
            date: new Date().toLocaleTimeString(),
          })
        });
      } else {
        // If chat does NOT exist, create it first
        await setDoc(chatRef, {
          messages: [
            {
              id: uuid(),
              name: currentUser.displayName || 'User',
              photo: currentUser.photoURL,
              text: inputMessage,
              senderId: currentUser?.uid,
              toid,
              date: new Date().toLocaleTimeString(),
            },
          ],
        });
      }

      await updateDoc(doc(db, "users", currentUser?.uid), {
        [`chats.${data.chatId}.lastMessage`]: { name: currentUser.displayName,text: inputMessage, senderId: currentUser?.uid,time:new Date().toLocaleTimeString() },
        [`chats.${data.chatId}.date`]: new Date().toLocaleTimeString(),
      });
      
      await updateDoc(doc(db, "users", data.user.uid), {
        [`chats.${data.chatId}.lastMessage`]: {name: data.user.name, text: inputMessage, senderId: data.user.uid,time:new Date().toLocaleTimeString() },
        [`chats.${data.chatId}.date`]: new Date().toLocaleTimeString(),
      });


      // setNotiMsg((prev) => [
      //   {
      //     type: 'chat',
      //     id: text.senderId,
      //     name: text.name || 'User',
      //     text: inputMessage,
      //     image: text.photo,
      //     time: new Date().toLocaleTimeString(),
      //   },
      //   ...prev,
      // ]);

      // if (currentUser.uid !== text.senderId) {
        
      // }

      scrollref.current?.scrollIntoView({behavior: 'smooth'});

    }, [inputMessage, currentUser, data?.chatId]);

    const handlekeydown = (e) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        handleSend(e);
      }
    }



    useEffect(() => {
      if (!data.chatId) return;
    
      const q = doc(db, "chats", data.chatId);
      const unsubscribe = onSnapshot(q, (docSnap) => {
        if (docSnap.exists()) {
          setText(docSnap.data().messages || []);
          // id: uuid(),
          //     name: currentUser.displayName || 'User',
          //     photo: currentUser.photoURL,
          //     text: inputMessage,
          //     senderId: currentUser.uid,
          //     date: serverTimestamp(),
                // docSnap.data().messages.map(e => {
                //   if (e.senderId !== currentUser.uid) {
                //     setNotiMsg((prev) => [
                //       {
                //         type: 'chat',
                //         id: e.senderId,
                //         toid: data.chatId,
                //         name: e.name || 'User',
                //         text: e.text,
                //         image: e.photo,
                //         time: e.date?.toDate().toLocaleTimeString(),
                //       },
                //       ...prev,
                //     ]);
                //   }
                // })
        }
      });
      scrollref.current?.scrollIntoView({behavior: 'smooth'});
      return () => unsubscribe(); //  Fix return statement
    }, [data?.chatId,currentUser]);
  
    

  return (
    <Chatcomponent className="chat-window pb-7 pl-7 pr-7" $ismobile={!ismobile}>
      {
  selectedchat === true ? (
    <>
      <h2 className='text-black border-solid border-b py-3 capitalize text-3xl'>{data.user.name}</h2>

      <Message className="messages" id="chat-container">
        {
          text?.map((item, index) => (
            <div key={index} className={item.senderId === currentUser?.uid ? `sentMessage ${style.messageall}` : `${style.messageall} receivedMessage `}>
              <img src={item.photoURL} alt={item.name} className='w-10 h-10 border-gray border-solid border rounded-full overflow-hidden object-cover object-center' />
              <div>
                <p className='text-gray-600 text-xs capitalize'>{item.name}</p>
                <p className={`px-4 py-2 rounded-md w-auto ${item.senderId === currentUser?.uid ? ` ${style.messageall} ${style.senttext}` : ` ${style.messageall} ${style.receivedtext}`}`}>{item.text}</p>
              </div>
            </div>
          ))
        }
        <span ref={scrollref}></span>
      </Message>

      <div className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={ handlekeydown}
          className='outline-none'
        />
        <button onClick={handleSend}><i className="bi bi-send-fill"></i></button>
      </div>
    </>
  ) : 
    <p className='text-5xl flex w-full h-full justify-center align-middle items-center text-black'>Choose one chat</p>
}

      
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
