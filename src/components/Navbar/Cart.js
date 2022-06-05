import React, { useEffect, useState } from 'react'
import './Cart.scss'
import { useAuthContext } from '../../hooks/useAuthContext'
import { db, FieldValue } from '../../firebase/config'

// images
import x from '../../icon/x.png'

//components
import CartItem from './CartItem'
import { useNavigate } from 'react-router-dom'

export default function Cart({ setIsCartOpen, isCartOpen }) {
  const { user } = useAuthContext()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState('')
  const [notEnoughProducts, setNotEnoughProducts] = useState('')
  const navigate = useNavigate()

  console.log(products)
  // 前往結賬
  const handleCheckout = async (e) => {
    e.preventDefault()
    // 前往提交訂單頁面前檢查是否有商品同時被其他買家買走導致數量不夠
    let enough = []
    let temProducts = products
    for (let i = 0; i < temProducts.length; i++) {
      await db
        .collection('products')
        .doc(temProducts[i].productId)
        .get()
        .then((doc) => {
          if (doc.data().productNumber < temProducts[i].buyNumber) {
            enough.push(temProducts[i].title)
            temProducts[i].productNumber = doc.data().productNumber
          }
        })
    }
    if (enough.length) {
      setProducts(temProducts)
      setNotEnoughProducts(enough)
      return
    }
    // 確認商品數量都足夠 建立訂單
    await db.collection('checkout').doc(user.uid).set({ products, total })
    setIsCartOpen(false)
    navigate('/Checkout')
  }

  // 總金額試算
  const handleTotal = (id, value) => {
    let arrProducts = products
    arrProducts = arrProducts.map((item) => {
      if (item.productId === id) {
        return { ...item, buyNumber: value }
      } else {
        return item
      }
    })
    setProducts(arrProducts)
    setTotal(
      arrProducts
        .map((product) => product.price * product.buyNumber)
        .reduce((partialSum, a) => partialSum + a, 0)
    )
  }

  // 刪除購物車項目
  const deleteProduct = async (id) => {
    await db
      .collection('carts')
      .doc(user.uid)
      .update({ productId: FieldValue.arrayRemove(id) })
  }

  // useEffect 觸發function
  const getProductById = async (cartItem) => {
    let arrProducts = []
    for (let productId of cartItem) {
      await db
        .collection('products')
        .doc(productId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            arrProducts.push({ ...doc.data(), buyNumber: 1 })
          }
        })
    }
    setProducts((prev) => {
      let prevPids = prev.map((p) => p.productId)
      let newP = arrProducts.filter((p) => !prevPids.includes(p.productId))
      let arrPids = arrProducts.map((p) => p.productId)
      let deleteP = prev.filter((p) => arrPids.includes(p.productId))
      if (newP.length === 0) {
        arrProducts = deleteP
        let total = arrProducts
          .map((product) => product.price * product.buyNumber)
          .reduce((partialSum, a) => partialSum + a, 0)
        setTotal(total)
        return arrProducts
      } else {
        arrProducts = [...prev, ...newP]
        let total = arrProducts
          .map((product) => product.price * product.buyNumber)
          .reduce((partialSum, a) => partialSum + a, 0)
        setTotal(total)
        return arrProducts.reverse()
      }
    })
  }

  // 從資料庫拿購物車資料
  useEffect(() => {
    console.log('effffff')
    if (user === null) {
      setProducts([])
      setTotal('')
      return
    } else {
      const unsub = db
        .collection('carts')
        .doc(user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            let cartItem = doc.data().productId
            getProductById(cartItem)
          } else {
            setProducts([])
            setTotal('')
            return
          }
        })
      return () => unsub()
    }
  }, [user])

  // 頁面render
  return (
    <div
      className={`cart ${isCartOpen ? 'cart_open' : ''}`}
      onClick={(e) => {
        setIsCartOpen(false)
      }}
    >
      <form
        className='cart_background'
        onClick={(e) => {
          e.stopPropagation()
        }}
        onSubmit={handleCheckout}
      >
        <img
          className='close'
          src={x}
          onClick={(e) => {
            setIsCartOpen(false)
          }}
        />
        <div className='cart_title'>購 物 車</div>
        <hr />
        {/* 單個商品 */}
        {products &&
          products.map((product) => (
            <CartItem
              product={product}
              setIsCartOpen={setIsCartOpen}
              deleteProduct={deleteProduct}
              handleTotal={handleTotal}
              key={product.productId}
            />
          ))}
        <hr />
        {/* 總金額 */}
        {products && (
          <div className='total'>
            總金額：NT$ {new Intl.NumberFormat('en-US').format(total)}
          </div>
        )}
        <button className='checkout'>前 往 結 賬</button>
      </form>
      {/* 商品數量不足跳出視窗 */}
      {notEnoughProducts && (
        <div
          className='delete_popout'
          onClick={(e) => {
            setNotEnoughProducts('')
          }}
        >
          <div>
            {`抱歉！ 商品 ${notEnoughProducts.join(' ')} 數量不足`}
            <button
              onClick={(e) => {
                setNotEnoughProducts('')
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
