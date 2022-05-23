import React from 'react'
import './ProductInfo.scss'

export default function ProductInfo({ productData }) {
  return (
    <div className='product_info'>
      <div className='title'>{productData.title}</div>
      <div className='sucForTool'>{productData.sucForTool}</div>
      <div className='sort1'>{productData.sort1}</div>
    </div>
  )
}
