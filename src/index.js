import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import reportWebVitals from './reportWebVitals';
import CartProvider from './context/cartcontext';
import Menu from './menu';
import Chats from './chats';
import Cart from './cart';
import UploadProduct from './ProductUpload';
import Profile from './Profile';
import Home from './home';
import Shop from './shop';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Brands from './brands';
import Brandspage from './brandspage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <CartProvider>
        <React.StrictMode>
          <Router>
              <Menu />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/productupload" element={<UploadProduct />} />
                <Route path='/shop' element={<Shop/>} />
                <Route path='/brands' element={<Brands/>} />
                <Route path='/brandspage' element={<Brandspage/>} />
              </Routes>
          </Router>
        </React.StrictMode>
      </CartProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function to log results
reportWebVitals();
