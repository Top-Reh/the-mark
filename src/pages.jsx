import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link } from "react-router-dom";
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

const logos = [champion,iwishyouwerehere,montana,nrf,puma,sisburma,zara]


const Pages = () => {
   
  return (
    <div className='pageslogo'>
      <div className="viewmoreproducts pagesviewmore">
          <h1>Pages you can find here</h1>
          <Link to="/brands" style={{color:"black"}}>View More<i className="bi bi-arrow-right" style={{marginLeft:"10px"}}></i></Link>
      </div>
      <div className='pageslogos'>
      {
          logos.map((page,index) => (
              <img src={page} key={index} alt='name'/>
          ))
      }
      </div>
    </div>
  )
}

export default Pages
