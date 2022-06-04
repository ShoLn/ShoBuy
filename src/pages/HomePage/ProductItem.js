import React, { useState } from 'react'
import './ProductItem.scss'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

// image
import red_trash from '../../icon/red_trash.png'

export default function ProductItem({ product }) {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const { isManager } = useAuthContext()
  const [openDelete, setOpenDelete] = useState(false)
  const {dbDelete} = useFirestore()

  const confirmDelete = async (productId) =>{
    await dbDelete('products',productId)
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
      <Link to={`/Product/${product.productId}`}>
        <img
          className='product_item_img'
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
      {/* 確認刪除商品 跳出視窗 */}
      {openDelete && (
        <div className='delete_popout' onClick={(e) => {setOpenDelete(false)}}>
          <div>
            是否確認要刪除商品
            <button onClick={(e) => {confirmDelete(product.productId)}}>確認</button>
          </div>
        </div>
      )}
    </div>
  )
}
