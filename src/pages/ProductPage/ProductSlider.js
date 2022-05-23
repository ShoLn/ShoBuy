import React, { useState, useEffect } from 'react'
import './ProductSlider.scss'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function ProductSlider({ imgUrls }) {
  const [isBigPicture, setisBigPicture] = useState(false)
  const [bigUrls, setBigUrls] = useState([])

  // react slide
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i) => <img src={imgUrls[i]} />
  }

  const settings_big = {
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <div className='product_slider'>
      <Slider {...settings}>
        {imgUrls &&
          imgUrls.map((imgurl, index) => (
            <div key={index}>
              <img
                src={imgurl}
                onClick={(e) => {
                  setisBigPicture(true)
                  setBigUrls([
                    ...imgUrls.slice(index),
                    ...imgUrls.slice(0, index)
                  ])
                }}
              />
            </div>
          ))}
      </Slider>
      {isBigPicture && (
        <div
          className='big_pic_container'
          onClick={(e) => {
            setisBigPicture(false)
          }}
        >
          <Slider {...settings_big}>
            {bigUrls &&
              bigUrls.map((bigUrl, index) => (
                <img
                  key={index}
                  className='big'
                  src={bigUrl}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
              ))}
          </Slider>
        </div>
      )}
    </div>
  )
}
