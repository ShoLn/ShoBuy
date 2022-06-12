import React, { useState } from 'react'
import './CartItem.scss'
import { useNavigate } from 'react-router-dom'

// images
import x from '../../icon/x.png'

export default function CartItem({
  product,
  deleteProduct,
  handleTotal,
  setIsCartOpen
}) {
  const [buyNumber, setBuyNumber] = useState(1)
  const navigate = useNavigate()
  const navToProduct = () => {
    setIsCartOpen(false)
    navigate(`/Product/${product.productId}`)
  }

  return (
    <div className='cart_item'>
      <div className='cart_container' key={product.productId}>
        {/* 刪除購物車商品 */}
        <img
          src={x}
          className='x'
          onClick={(e) => {
            deleteProduct(product.productId)
          }}
        />
        {/* 商品照片 */}
        <img
          src={product.imgUrls[0]}
          className='product_img'
          onClick={navToProduct}
        />
        <div className='info'>
          <div className='title'>【{product.title}】</div>
          {/* 商品購買數量 */}
          <div className='buy_number'>
            <div>數量：</div>
            <span
              className='left'
              onClick={(e) => {
                setBuyNumber((prevNum) => {
                  if (prevNum > 1) {
                    handleTotal(product.productId, prevNum - 1)
                    return prevNum - 1
                  } else {
                    return 1
                  }
                })
              }}
            >
              -
            </span>
            <input
              className='cartItem_buy_number'
              type='number'
              placeholder='數量'
              value={buyNumber}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10)
                if (
                  (value > product.productNumber) |
                  (value < 0) |
                  isNaN(value)
                ) {
                  setBuyNumber(1)
                } else {
                  setBuyNumber(value)
                }
              }}
            />
            <span
              className='right'
              onClick={(e) => {
                setBuyNumber((prevNum) => {
                  if (prevNum === product.productNumber) {
                    return prevNum
                  } else if (isNaN(prevNum)) {
                    return 1
                  } else {
                    handleTotal(product.productId, prevNum + 1)
                    return prevNum + 1
                  }
                })
              }}
            >
              +
            </span>
          </div>
          <div className='last_number'>
            剩最後 <span>{product.productNumber}</span> 件
          </div>
          <div className='price'>
            NT$ {new Intl.NumberFormat('en-US').format(product.price)}
          </div>
        </div>
      </div>
    </div>
  )
}
