import './App.css';
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import Containerhover from './containerhover';
import { CartContext } from './context/cartcontext';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { CartProvider } from './context/cartcontext';

function App() {
  const [hoverimg, setHoverImg] = useState(null);
  const { addToCart, productList, handleAddProduct } = useContext(CartContext);

  const handleAddProductWrapper = (newProduct) => {
    handleAddProduct(newProduct);
  };

  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <CartProvider>
          <div className="mainbody">
            <div className="App">
              {/* Render Products */}
              {productList.map((product) => (
                <div
                  key={product.id}
                  className="productContainer"
                  onMouseEnter={() => setHoverImg(product.id)}
                  onMouseLeave={() => setHoverImg(null)}
                >
                  <div className="imgcontainer">
                    <motion.img
                      src={product.images[0]}
                      alt={product.name}
                      className="productImage"
                      initial={{ scale: 1 }}
                      animate={hoverimg === product.id ? { scale: 1.3 } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <h2>{product.name}</h2>
                  <h4>{product.seller?.name || 'Unknown Seller'}</h4>
                  <p><strong>${product.price?.toFixed(2) || 'N/A'}</strong></p>
                  {product.website && (
                    <a href={product.website} target="_blank" rel="noopener noreferrer">
                      Website Link: {product.seller?.name || 'Visit'}
                    </a>
                  )}
                  <div className="shopbtn">
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                  {hoverimg === product.id && (
                    <Containerhover
                      sellerId={product.id}
                      sellerName={product.seller?.name || 'Unknown'}
                      sellerImage={product.seller?.sellerImage || 'default-avatar.png'}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CartProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  );
}

export default App;
