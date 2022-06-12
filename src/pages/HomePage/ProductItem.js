import React, { useEffect, useState } from 'react'
import './ProductItem.scss'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { storage } from '../../firebase/config'

// image
import red_trash from '../../icon/red_trash.png'
import sold_out from '../../icon/sold_out.png'

export default function ProductItem({ product }) {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const { isManager } = useAuthContext()
  const [openDelete, setOpenDelete] = useState(false)
  const { dbDelete } = useFirestore()
  const [soldOut, setSoldOut] = useState(false)

  // 檢查商品是否售完
  useEffect(() => {
    if (product.productNumber === 0) {
      setSoldOut(true)
    } else {
      setSoldOut(false)
    }
  }, [product.productNumber])

  // 刪除商品
  const confirmDelete = async (length, sucForTool, sort1, size, productId) => {
    await dbDelete('products', productId)
    for (let i = 0; i < length; i++) {
      let storagePath = `products/${sucForTool}/${sort1}/${size}/${productId}/${i}`
      await storage.ref(storagePath).delete()
    }
    setOpenDelete(false)
  }

  return (
    <div className='product_item'>
      {isManager && (
        <img
          src={red_trash}
          className='trash_can'
          onClick={(e) => {
            setOpenDelete(true)
          }}
        />
      )}
      <Link to={`/Product/${product.productId}`} className='to_product'>
        {soldOut && (
          <div className='sold_out'>
            <img src={sold_out} className='sold_out' />
          </div>
        )}
        {/* 顯示圖片 */}
        <img
          className='product_item_img'
          src={product.imgUrls[0]}
          loading='lazy'
          style={isMouseOver ? { opacity: '0' } : { opacity: '1' }}
          onMouseEnter={(e) => {
            setIsMouseOver(true)
          }}
          onMouseLeave={(e) => {
            setIsMouseOver(false)
          }}
        />
        <img
          className='product_item_img_2'
          src={product.imgUrls[1]}
          loading='lazy'
          style={isMouseOver ? { opacity: '1' } : { opacity: '0' }}
          onMouseEnter={(e) => {
            setIsMouseOver(true)
          }}
          onMouseLeave={(e) => {
            setIsMouseOver(false)
          }}
        />
        {/* 名稱 */}
        <div className='title'>{product.title}</div>
      </Link>
      {/* 分類 */}
      <div className='sucForTool_sort1'>
        {product.sucForTool} | {product.sort1}
      </div>
      {/* 價格 */}
      <div className='price'>
        NT$ {new Intl.NumberFormat('en-US').format(product.price)}
      </div>
      {/* 確認刪除商品 跳出視窗 */}
      {openDelete && (
        <div
          className='delete_popout'
          onClick={(e) => {
            setOpenDelete(false)
          }}
        >
          <div>
            是否確認要刪除商品
            <button
              onClick={(e) => {
                confirmDelete(
                  product.imgUrls.length,
                  product.sucForTool,
                  product.sort1,
                  product.size,
                  product.productId
                )
              }}
            >
              確認
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
