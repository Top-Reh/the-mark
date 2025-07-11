import React, { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from '../context/cartcontext';
import { db, storage } from '../firebase';
import { collection, doc, setDoc, onSnapshot, query, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { deleteObject, getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { AuthContext } from "../context/AuthContext";
import { time } from "framer-motion";
import { image } from "framer-motion/client";

const UploadProduct = () => {
  const { currentUser } = useContext(AuthContext);
  const { setNotiMsg } = useContext(CartContext);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [todownloadImage, setTodownloadImage] = useState({});
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState({
    id: '',
    name: "",
    images: [],
    description: "",
    price: "",
    currency: "USD",
    category: "",
    seller: { 
      name: currentUser?.displayName || "",  
      contact: currentUser?.phoneNumber || "",
      images: currentUser?.photoURL || "",
      email: currentUser?.email || "",
    },
    time:"",
    stock: "",
    website: "",
    product_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      return null; // or loading spinner, etc.
    }
  
    if (isNaN(product.price) || isNaN(product.stock)) {
      alert("Price and Stock must be valid numbers.");
      return;
    }

    const timestamp = new Date().getTime();
    const fileRef = ref(storage, `products/${timestamp}-${todownloadImage.name}`);
    await uploadBytes(fileRef, todownloadImage.todownload);
    const downloadUrl = await getDownloadURL(fileRef);
    console.log('downloadUrl : ',downloadUrl);
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, downloadUrl]
    }));
      
    if (!product.name || !product.description || product.images.length === 0) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const docRef = doc(collection(db, "products"));
  
      const newProduct = {
        ...product,
        id: docRef.id,
        seller: {
          uid: currentUser?.uid,
          name: currentUser?.displayName || product.seller.name,
          contact: currentUser?.phoneNumber || product.seller.contact,
          images: currentUser?.photoURL || product.seller.images,
          email: currentUser?.email || product.seller.email,
        },
        time: new Date().toLocaleTimeString(),
      };
  
      await setDoc(docRef, newProduct);
  
      alert("Product added successfully!");
      setNotiMsg((prev) => [...prev, { 
        name: 'System', 
        text: `You added ${product.name}`, 
        image: product.images[0], 
        time: new Date().toLocaleTimeString() 
      }]);
  
      const docRefnoti = doc(db, "notifications", currentUser?.uid);
  
      await updateDoc(docRefnoti, {
        cart: arrayUnion({
          product: newProduct.id,
          name: newProduct.name,
          text: `You added ${newProduct.name}`,
          image: newProduct.images[0],
          time: new Date().toLocaleTimeString()
        })
      });
  
      setProduct({
        id: '',
        name: "",
        images: [],
        description: "",
        price: "",
        currency: "USD",
        category: "",
        seller: { 
          name: currentUser?.displayName || "",  
          contact: currentUser?.phoneNumber || "",
          images: currentUser?.photoURL || "",
          email: currentUser?.email || "",
        },
        time: "",
        stock: "",
        website: "",
        product_type: "",
      });
  
      setImages([]);
  
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Error adding product. Please try again.");
    }
  };

  function selectFiles() {
    fileInputRef.current.click();
  }

  const handleImageUpload = async (files) => {
    const uploadedImages = [];
    
    try {
      let url = window.URL.createObjectURL(files[0]);
      uploadedImages.push({
        name: files[0].name,
        url: url,
        todownload: files[0]
      });
      console.log('uploadedImages : ',uploadedImages);
      
      setImages(prev => [...prev, ...uploadedImages]);
      setTodownloadImage({
        name: files[0].name,
        todownload: files[0]}
      )
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Some images failed to upload. Please try again.");
    }
  };

  const onfileselect = async(e) => {
    const files = Array.from(e.target.files);
    console.log('image onfileselect : ',files);
    if (files.length === 0) return;
    await handleImageUpload(files);
    // const newImages = [];
    // const uploadedImages = [];
    // for (let i = 0; i < files.length; i++) {
    //   if (files[i].type.split('/')[0] !== 'image') continue;
    //   // if (!images.some(e => e.name === files[i].name)) {
    //   //   const imageObject = {
    //   //     name: files[i].name,
    //   //     url: URL.createObjectURL(files[i]),
    //   //   };
    //   //   newImages.push(imageObject);
    //   // }
    //   const file = files[i];
    //   if (file.type.startsWith('image/')) {
    //     const url = await uploadToImgur(file);
    //     uploadedImages.push({ name: file.name, url });
    //   }
    // };
    // setImages((prev) => [...prev, ...uploadedImages]);
    // setProduct((prev) => ({ ...prev, images: [...prev.images,  ...uploadedImages.map((img) => img.url)] }));
  };

  const onDragOver = (e) => {
     e.preventDefault();
     setDragActive(true);
     e.dataTransfer.dropeffect = "copy";
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  }

  const onDrop = async(e) => {
    e.preventDefault();
    console.log('image all drop : ',e);
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('image onDrop : ',files);
    await handleImageUpload(files);
  }

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    }, (error) => console.error("Error fetching products: ", error));
    
    return () => unsubscribe();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="uploadform">
      <div className="uploadproductfacts">
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock Quantity" value={product.stock} onChange={handleChange} required />
        <p>Please select your product type:</p>
        <div  className="radio-group">
          <label><input type="radio" className="accent-blue-500" id="fashion&beauty" name="product_type" value="fashion&beauty" checked={product.product_type === "fashion&beauty"} onChange={handleChange}/>Fashion & Beauty</label>
          <label><input type="radio" className="accent-blue-500" id="Technology&Gadgets" name="product_type" value="Technology&Gadgets" checked={product.product_type === "Technology&Gadgets"} onChange={handleChange}/>Technology & Gadgets</label>
          <label><input type="radio" className="accent-blue-500" id="Home&Living" name="product_type" value="Home&Living" checked={product.product_type === "Home&Living"} onChange={handleChange}/>Home & Living</label>
          <label><input type="radio" className="accent-blue-500" id="Entertainment&Leisure" name="product_type" value="Entertainment&Leisure" checked={product.product_type === "Entertainment&Leisure"} onChange={handleChange}/>Entertainment & Leisure</label>
          <label><input type="radio" className="accent-blue-500" id="Health&Wellness" name="product_type" value="Health&Wellness" checked={product.product_type === "Health&Wellness"} onChange={handleChange}/>Health & Wellness</label>
          <label><input type="radio" className="accent-blue-500" id="Travel&Lifestyle" name="product_type" value="Travel&Lifestyle" checked={product.product_type === "Travel&Lifestyle"} onChange={handleChange}/>Travel & Lifestyle</label>
        </div>
        <button type="submit" className="uploadbtn">Upload Product</button>
      </div>
      <div className="drag-container">
        { 
          images.length > 0 ? (
            <div className="drag-preview">
              {
                images.map((image, index) => (
                  <div key={index} className="drag-preview-images" style={{ backgroundImage: `url(${image.url})` }}>
                    <span className="dragimage-delete" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}>&times;</span>
                  </div>
                ))
              }
            </div>
          ) : (
          <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            {
              dragActive ? (
                <span className="drag-select">
                  Drag & drop images here
                </span>
              ) : 
              <>
                Drag & drop images here, or { " "}
                <span className="select" role="button" onClick={selectFiles}>
                  Browse
                </span>
              </>
            }
            <input name="file" type="file" accept="image/*" multiple ref={fileInputRef} onChange={onfileselect}></input>
          </div>
          )
        }
      </div>
    </form>
  );
};

export default UploadProduct;
