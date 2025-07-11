import React from 'react';
import herobackground from "./images/herobackground.jpg";
import Logoslider from './logoslider';
import TrandClothesSlide from './trandclothesslide';
import Sneakerslide from './sneakerslide';
import Pages from './pages';
import ReviewSlider from './review';
import { useNavigate } from 'react-router-dom';
//test git

const Home = () => {
  const navigate = useNavigate();

  const productlists = [
    {name:"Fashion & Beauty",image:"https://thumbs.dreamstime.com/b/elegant-lady-black-dress-wearing-pearl-jewelry-necklace-wide-brim-hat-fashion-woman-cocktail-form-fitted-gown-gloves-336345619.jpg",category: 'fashion&beauty'},
    {name:"Technology & Gadgets",image:"https://images.stockcake.com/public/5/3/d/53d9e0ea-efac-4aee-b4b1-a506af6d8b23_large/tech-gadget-assortment-stockcake.jpg",category: 'Technology&Gadgets'},
    {name:"Home & Living",image:"https://st.hzcdn.com/simgs/03412be6063b84ac_14-7411/home-design.jpg",category: 'Home&Living'},
    {name:"Entertainment & Leisure",image:"https://i1.wp.com/www.differencebetween.com/wp-content/uploads/2017/10/Difference-Between-Entertainment-and-Leisure-fig-1.jpg",category: 'Entertainment&Leisure'},
    {name:"Health & Wellness",image:"https://i0.wp.com/krct.ac.in/blog/wp-content/uploads/2024/06/1-4.png?fit=760%2C486&ssl=1",category: 'Health&Wellness'},
    {name:"Travel & Lifestyle",image:"https://i0.wp.com/eatsleeplovetravel.com/wp-content/uploads/2020/06/shutterstock_597796082-scaled.jpg?fit=2048%2C1365&ssl=1",category: 'Travel&Lifestyle'},
  ]

  const handlecategory = (category) => {
    // Navigate to the chat page with the seller's ID
    navigate('/shop', { state: { category } }); // 'sellerId' should be dynamically passed
  };
    
  return (
    <div className='home'>
        <div className="herosection" style={{ backgroundImage: `url(${herobackground})`}}></div>
        <Logoslider/>
        <TrandClothesSlide/>
        <div className='productlists'>
          {
            productlists.map((product,index) => (
              <div key={index} className='singleproductlist' style={{backgroundImage: `url(${product.image})`}} onClick={() => handlecategory(product.category)}>
                <h1>{product.name}</h1>
              </div>
            ))
          }
        </div>
        <Sneakerslide/>
        <Pages/>
        <div className='optionspayment'>
          <div className='optionshead'>
            <h1>Make ordering simple and smooth, from finding what you need to getting it delivered—all in one place.</h1>
          </div>
          <div className='optionsdivs'>
            <div className='deliverydiv'>
              <img src='https://www.parcelhub.co.uk/520x430/4817/2173/4892/Parcelhub_Tracked_Parcel_Delivery.jpg' alt='images'></img>
              <div>
                <h2>Delivery You Can Count On</h2>
                <p>Fast, secure, and reliable delivery for every need. Trust us to bring your packages to their destination with care and precision.</p>
              </div>
            </div>
            <div className='deliverydiv'>
              <img src='https://www.winpay.id/wp-content/uploads/2024/01/manfaat-payment-gateway.png' alt='images'></img>
              <div>
                <h2>Pay with confidence</h2>
                <p>Your security is our priority. We ensure a seamless and secure payment process so you can shop with peace of mind.</p>
              </div>
            </div>
            <div className='deliverydiv'>
              <img src='https://martech.org/wp-content/uploads/2019/04/fashion-online-shopping-visual-search-stock.jpg' alt='images'></img>
              <div>
                <h2>Search for matches</h2>
                <p>Search and filter from millions of product and supplier offerings to find the matching ones for your business.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='reviewsection'>
          <h1>Unlock Exclusive Benefits for Your Business</h1>
          <p>No matter your business stage, the free TheMark.com Membership offers tailored discounts, services, and tools to help you grow. From essential resources for small businesses starting their sourcing journey to advanced solutions for established enterprises managing complex orders, we’ve got you covered.</p>
          <a href="#">learn more</a>
          <ReviewSlider/>
        </div>
        <div className='calltoaction'>
          <div className='ctadiv'>
            <h1>Ready to get start?</h1>
            <p>Explore millions of products from trusted suppliers by sigining today!</p>
            <button><a href='/profile'>Sign Up</a></button>
          </div>
        </div>
    </div>
  )
}

export default Home
