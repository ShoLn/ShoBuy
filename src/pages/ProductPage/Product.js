import React, { useEffect, useState } from 'react'
import './Product.scss'

import { useParams } from 'react-router-dom'

import { db } from '../../firebase/config'

// components
import ProductSlider from './ProductSlider'
import ProductInfo from './ProductInfo'

export default function Product() {
  const { productId } = useParams()
  const [productData, setProductData] = useState('')

  // get product data by productId
  useEffect(() => {
    const unsub = db.collection('products')
      .doc(productId)
      .onSnapshot((snapShot) => {
        setProductData(snapShot.data())
      })
    return ()=>{unsub()}
  }, [])

  return (
    <div className='Product'>
      <div className='product_container'>
        <ProductSlider imgUrls={productData.imgUrls} />
        <ProductInfo productData={productData} />
      </div>
      <div className='middle' />
      <div className='big_img_container'>
        {productData &&
          productData.imgUrls.map((imgurl, index) => (
            <img src={imgurl} key={index} />
          ))}
      </div>
    </div>
  )
}
