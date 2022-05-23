import React, { useState, useEffect } from 'react'
import './ProductSlider.scss'



import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function ProductSlider({ imgUrls }) {
  

  // react slide
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i) => <img src={imgUrls[i]} />
  }

  return (
    <div className='product_slider'>
      <Slider {...settings}>
        {imgUrls && imgUrls.map((imgurl, index) => (
          <div key={index}>
            <img src={imgurl} />
          </div>
        ))}
      </Slider>
    </div>
  )
}
