import React, { useState } from 'react'
import './ProductItem.scss'
import { Link } from 'react-router-dom'

export default function ProductItem({ product }) {
  const [isMouseOver, setIsMouseOver] = useState(false)

  return (
    <div className='product_item'>
      <Link to={`/Product/${product.productId}`}>
        <img
          src={isMouseOver ? product.imgUrls[1] : product.imgUrls[0]}
          onMouseEnter={(e) => {
            setIsMouseOver(true)
          }}
          onMouseLeave={(e) => {
            setIsMouseOver(false)
          }}
        />
        <div className='title'>{product.title}</div>
      </Link>

      <div className='sucForTool_sort1'>
        {product.sucForTool} | {product.sort1}
      </div>
      <div className='price'>
        NT$ {new Intl.NumberFormat('en-US').format(product.price)}
      </div>
    </div>
  )
}
