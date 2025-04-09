import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Logoutbtn = () => {
    const handleSignOut = () => {
        signOut(auth);
        console.log('already log out')
    };
    

  return (
    <button onClick={handleSignOut} className='signout'>Signout</button>
  )
}

export default Logoutbtn