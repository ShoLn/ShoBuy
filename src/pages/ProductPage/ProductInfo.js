import React, { useState } from 'react'
import './ProductInfo.scss'
import { useAuthContext } from '../../hooks/useAuthContext'
import { db, FieldValue } from '../../firebase/config'
import { useNavigate } from 'react-router-dom'

export default function ProductInfo({ productData }) {
  const [buyNumber, setBuyNumber] = useState(1)
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (user === null) {
      navigate('/member')
    } else {
      let cartsRef = db.collection('carts').doc(user.uid)
      cartsRef.set(
        {
          productId: FieldValue.arrayUnion(productData.productId)
        },
        { merge: true }
      )
    }
  }

  return (
    <form className='product_info' onSubmit={handleAddToCart}>
      {/* 商品名稱 */}
      <div className='title'>【 {productData.title} 】</div>
      {/* 商品價格 */}
      <div className='price'>
        NT$ {new Intl.NumberFormat('en-US').format(productData.price)}
      </div>
      {/* 商品分類 */}
      <div className='sucForTool_container'>
        <div className='sucForTool1'>商品分類：</div>
        <div className='sucForTool'>{productData.sucForTool} |&nbsp;</div>
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
        <div>商品數量：</div>
        <div className='last_number'>
          剩最後 <span>{productData.productNumber}</span> 件
        </div>
      </div>
      {productData.productNumber === 0 ? (
        <button disabled>商 品 已 完 售</button>
      ) : (
        <button>加 入 購 物 車</button>
      )}
      <hr />
      <div className='description_container'>
        <div className='description'>{productData.description}</div>
      </div>
    </form>
  )
}
