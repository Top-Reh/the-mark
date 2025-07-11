import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Array containing image URLs and names
const brandImages = [
  { name: "madison beer" ,job:"Singer",review:"As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. LC Mark.com has been my trusted partner in this process.",star:"",images: 'https://people.com/thmb/djHIbpwxDIrmxm1qxvQWxxKLsHU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(730x230:732x232)/Madison-Beer-singer-082924-tout-45187f78314b4dca8eed6919b49d8a2e.jpg' },
  { name: "madison beer",job:"Singer",review:"As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. LC Mark.com has been my trusted partner in this process.",star:"",images: 'https://people.com/thmb/djHIbpwxDIrmxm1qxvQWxxKLsHU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(730x230:732x232)/Madison-Beer-singer-082924-tout-45187f78314b4dca8eed6919b49d8a2e.jpg'  },
  { name: "madison beer",job:"Singer",review:"As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. LC Mark.com has been my trusted partner in this process.",star:"",images: 'https://people.com/thmb/djHIbpwxDIrmxm1qxvQWxxKLsHU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(730x230:732x232)/Madison-Beer-singer-082924-tout-45187f78314b4dca8eed6919b49d8a2e.jpg'  },
  { name: "madison beer",job:"Singer",review:"As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. LC Mark.com has been my trusted partner in this process.",star:"",images: 'https://people.com/thmb/djHIbpwxDIrmxm1qxvQWxxKLsHU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(730x230:732x232)/Madison-Beer-singer-082924-tout-45187f78314b4dca8eed6919b49d8a2e.jpg'},
  { name: "madison beer",job:"Singer",review:"“As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. LC Mark.com has been my trusted partner in this process.”",star:"",images: 'https://people.com/thmb/djHIbpwxDIrmxm1qxvQWxxKLsHU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(730x230:732x232)/Madison-Beer-singer-082924-tout-45187f78314b4dca8eed6919b49d8a2e.jpg'},
  { name: "madison beer", job:"Singer",review:"As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. LC Mark.com has been my trusted partner in this process.",star:"",images: 'https://people.com/thmb/djHIbpwxDIrmxm1qxvQWxxKLsHU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(730x230:732x232)/Madison-Beer-singer-082924-tout-45187f78314b4dca8eed6919b49d8a2e.jpg' },
];

const ReviewSlider = () => {

  const NextArrow = ({ onClick }) => {
    return (
      <div className="nextarrowslide revarrwhite" onClick={onClick}>
        <i className="bi bi-chevron-right"></i>
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="prearrowslide revarrwhite" onClick={onClick}>
        <i className="bi bi-chevron-left"></i>
      </div>
    );
  };

  var settings = {
    dots: false,
    autoplay: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite:true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="reviewslidercomponent">
      <Slider {...settings} className="reviewslider">
        {brandImages.map((item, index) => (
          <div key={index} className="reviewdiv">
            <div className="reviewdivcontainer">
              <i className="bi bi-quote"></i>
              <p>{item.review}</p>
              <div className="reviewpfcontainer">
                <div className="reviewpf">
                  <img src={item.images} alt="name"></img>
                  <div className="nameandjobreview">
                    <h3>{item.name}</h3>
                    <p>{item.job}</p>
                  </div>
                </div>
                <div className="reviewrating">
                  <div className="reviewstars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                    <i className="bi bi-star"></i>
                  </div>
                  <p>5.0</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReviewSlider;
