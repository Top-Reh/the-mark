import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import bunny from "./images/brandlogos/bunny.png";
import champion from "./images/brandlogos/champion.png";
import chanel from "./images/brandlogos/chanel.png";
import clothingbrand from "./images/brandlogos/clothingbrand.png";
import dg from "./images/brandlogos/d&g.png";
import etro from "./images/brandlogos/etro.png";
import gucci from "./images/brandlogos/gucci.png";
import hm from "./images/brandlogos/h&m.png";
import iwishyouwerehere from "./images/brandlogos/iwishyouwerehere.jpg";
import lee from "./images/brandlogos/lee.png";
import montana from "./images/brandlogos/montana.jpg";
import nrf from "./images/brandlogos/nrf.jpg";
import pla from "./images/brandlogos/pla.jpg";
import puma from "./images/brandlogos/puma.png";
import sisburma from "./images/brandlogos/sisburma.png";
import zara from "./images/brandlogos/zara.png";

const logos = [bunny,champion,chanel,clothingbrand,dg,etro,gucci,hm,iwishyouwerehere,lee,montana,nrf,pla,puma,sisburma,zara]


const Logoslider = () => {
    var settings = {
        dots: false,
        autoplay:true,
        infinite: true,
        speed: 2000,
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplaySpeed:2000,
        cssEase:"linear",
      };
  return (
    <Slider {...settings} className='logoslider'>
            {logos.map((logoimg, index) => (
            <div key={index}>
                <img src={logoimg} alt={`Brand ${index + 1}`} className='brandslogoslider'/>
            </div>
            ))}
    </Slider>
  )
}

export default Logoslider
