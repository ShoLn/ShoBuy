import React, { useState } from 'react'
import './ProductInfo.scss'

export default function ProductInfo({ productData }) {
  const [BuyNumber, setBuyNumber] = useState(1)
  return (
    <div className='product_info'>
      {/* 商品名稱 */}
      <div className='title'>【 {productData.title} 】</div>
      {/* 商品價格 */}
      <div className='price'>
        NT$ {new Intl.NumberFormat('en-US').format(productData.price)}
      </div>
      {/* 商品分類 */}
      <div className='sucForTool_container'>
        <div className='sucForTool1'>商品分類: </div>
        <div className='sucForTool'>{productData.sucForTool}</div>
        {/* 子分類1 */}
        <div className='sort1'>{productData.sort1}</div>
      </div>
      {/* 商品尺寸 */}
      <div className='size_container'>
        <div className='size1'>商品尺寸：</div>
        <div className='size'>{productData.size}</div>
      </div>
      {/* 商品購買數量 */}
      <div className='buy_number'>
        <div>購買數量：</div>
        <span
          className='left'
          onClick={(e) => {
            setBuyNumber((prevNum) => {
              if (prevNum > 1) {
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
          type='number'
          placeholder='數量'
          value={BuyNumber}
          onChange={(e) => {
            setBuyNumber(parseInt(e.target.value, 10))
          }}
        />
        <span
          className='right'
          onClick={(e) => {
            setBuyNumber((prevNum) => {
              return prevNum + 1
            })
          }}
        >
          +
        </span>
        <div className='last_number'>
          剩最後 <span>{productData.productNumber}</span> 件
        </div>
      </div>
    </div>
  )
}
