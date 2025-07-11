import React from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import airforce from "./images/trandclothes/airforce1.png";
import airjordan1 from "./images/trandclothes/airjordan1.png";
import airjordan1low from "./images/trandclothes/airjordan1low.png";
import ja2 from "./images/trandclothes/ja2.png";
import airjordan5 from "./images/trandclothes/airjordan5.png";
import airmaxdn from "./images/trandclothes/airmaxdn.png";

// Array containing image URLs and names
const brandImages = [
  { src: airforce, name: "Air Force 1" },
  { src: airjordan1, name: "Air Jordan 1" },
  { src: airjordan1low, name: "Air Jordan 1 Low" },
  { src: ja2, name: "Ja 2" },
  { src: airjordan5, name: "Air Jordan 5" },
  { src: airmaxdn, name: "Air Max DN" },
];

const Sneakerslide = () => {

  const NextArrow = ({ onClick }) => {
    return (
      <div className="nextarrowslide" onClick={onClick}>
        <i className="bi bi-chevron-right"></i>
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="prearrowslide" onClick={onClick}>
        <i className="bi bi-chevron-left"></i>
      </div>
    );
  };

  var settings = {
    dots: false,
    autoplay: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite:true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="trandclothsliderdiv sneakerslide">
      <div className="viewmoreproducts">
        <h1>sneakers</h1>
        <Link to="#" style={{color:"black"}}>View More<i className="bi bi-arrow-right" style={{marginLeft:"10px"}}></i></Link>
      </div>
      <Slider {...settings} className="trandClothSlider">
        {brandImages.map((item, index) => (
          <div key={index} className="trandCloth">
            <img src={item.src} alt={item.name} />
            <div className="trandclothfacts">
              <h3>{item.name}</h3>
              <a href="#">Buy now</a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Sneakerslide;
