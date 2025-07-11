import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Containerhover = ({sellerId,sellerName,sellerImage}) => {
  const navigate = useNavigate();  // useNavigate hook

  const handleChatWithPageClick = (sellerId,sellerName,sellerImage) => {
    // Navigate to the chat page with the seller's ID
    navigate('/chats',{state:{sellerId,sellerName,sellerImage}}); // 'sellerId' should be dynamically passed
  };
  return (
    <motion.div 
    className='containerhover'
    >
      <div className='savebtndiv'>
        <motion.button
        initial={{opacity:0,scale:0}}
        animate={{opacity:1,scale:1}}
        transition={{duration:0.2}}
        >Save</motion.button>
      </div>
      <div className='chattingbtns'>
        <Link to='/chats'>
        <motion.button
        initial={{opacity:0,scale:0}}
        animate={{opacity:1,scale:1}}
        transition={{duration:0.2}}
        >Chat with Us</motion.button>
        </Link>
          <motion.button
          initial={{opacity:0,scale:0}}
          animate={{opacity:1,scale:1}}
          transition={{duration:0.2}}
          onClick={() => handleChatWithPageClick(sellerId,sellerName,sellerImage)}
          >Chat with Page</motion.button>
      </div>
    </motion.div>
  )
}

export default Containerhover
