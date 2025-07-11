import React from 'react';
import { Link } from 'react-router-dom';
import NotificationMenu from './NotificationMenu';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/chats" className="text-gray-600 hover:text-gray-800">
                  <i className="bi bi-chat-dots text-2xl"></i>
                </Link>
                <NotificationMenu />
                <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                  <i className="bi bi-cart text-2xl"></i>
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                  <i className="bi bi-person text-2xl"></i>
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 