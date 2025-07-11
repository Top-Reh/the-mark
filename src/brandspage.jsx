import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from './firebase';

const Brandspage = () => {
    const location = useLocation();
    const { brandId } = location.state || {}; 
    const [admin,setAdmin] = useState(null);
    const [existbrands, setExistBrands] = useState([]);

    useEffect(() => {
        const cartdata = async () => {
            const adminRef = doc(db, "admins",brandId);
            const adminSnap = await getDoc(adminRef);
            if (adminSnap.exists()) {
                const admindata = adminSnap.data() || [];
                setAdmin(admindata);
                console.log('admin data : ' ,admindata);
            };
            const chatsRef = collection(db, "products");
            const q = query(chatsRef, where("seller.uid", "==", brandId)); // Filter for chats where `toid` equals the current user's `uid`
            const querySnapshot = await getDocs(q);
        
            if (!querySnapshot.empty) {
                querySnapshot.forEach((chatDoc) => {
                const chatData = chatDoc.data();
                setExistBrands(chatData);
                console.log('exist brands : ',chatData);
                });
            } else {
                console.log("No products found with `brandId` equal to brandId.uid.");
            }
            }
            console.log('state products : ',existbrands);
        return () => cartdata();
    }, [brandId]);  

  return (
    <div className='brandspage w-full grid gap-6 pt-16' >
            {
                admin && (
                    <div className='brandspagecontainer border-r border-gray-500 h-full w-full pt-3 pl-10 pr-10 flex flex-col justify-start items-center gap-3'>
                        <img src={admin.photoURL} alt='photoname' className='w-full h-1/2 object-cover object-center rounded-2xl bg-blue-400'></img>
                        <div className='flex justify-between items-center w-full'>
                            <div className='flex flex-col justify-start items-start gap-1'>
                                <h1 className='text-xl font-bold'>{admin.name}</h1>
                                <p className='font-bold'>{admin.businessType}</p>
                            </div>
                            <div className='flex justify-center items-center gap-3'>
                                <button className='bg-blue-500 border-none text-white px-4 py-2 rounded-lg'>Chat</button>
                                <button className='bg-blue-500 border-none text-white px-4 py-2 rounded-lg'>Follow</button>
                            </div>
                        </div>
                        <div className='flex justify-start gap-3 items-center w-full'>
                            <p>Followers : 2k</p>
                            <p>Products : 50</p>
                        </div>
                    </div>
                )
            }
        <div className=' h-full w-full grid grid-cols-4 gap-3 p-3 overflow-y-scroll'>
            {Array.isArray(existbrands) && existbrands.map((data, index) => (
                data.images && data.images[0] && (
                    <img key={index} src={data.images[0]} alt={data.name} className='w-full h-full rounded-lg object-cover object-center'></img>
                )
            ))}
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
            <img src='https://i.pinimg.com/736x/77/7b/36/777b3622b81a9030398529e4de55684e.jpg' alt='lvgirl' className='w-full h-full rounded-lg object-cover object-center'></img>
        </div>
    </div>
  )
}

export default Brandspage