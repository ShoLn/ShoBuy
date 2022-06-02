import React, { useEffect, useState } from 'react'
import './Navbar.scss'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import { db } from '../../firebase/config'

// components
import Navitem from './Navitem'
import Cart from './Cart'

// img
import magnifier from '../../icon/magnifier.png'
import member from '../../icon/member.png'
import cart from '../../icon/cart.png'


export default function Navbar() {
  const [item1, setItem1] = useState([
    '多肉植物',
    '景天',
    '12之卷',
    '番杏科',
    '龍舌蘭',
    '虎尾蘭',
    '塊根',
    '仙人掌',
    '大戟'
  ])
  const [item2, setItem2] = useState([
    '雨林植物',
    '蔓綠絨',
    '彩葉芋',
    '水芋',
    '合果芋',
    '觀音蓮',
    '龜背芋',
    '秋海棠',
    '電光蘭'
  ])
  const [item3, setItem3] = useState([
    '園藝工具',
    '多肉植物介質',
    '雨林植物介質',
    '圓盆',
    '分盆',
    '鏟子',
    '端盤',
    '肥料'
  ])
  const [buyNum, setBuyNum] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { user } = useAuthContext()
  const { logout } = useLogout()

  useEffect(() => {
    if(user === null) {
      setBuyNum('')
      return
    }
    const unsub = db
      .collection('carts')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let buyNum = doc.data().productId.length
          setBuyNum(buyNum)
        } else {
          setBuyNum('')
        }
      })
    return () => unsub()
  }, [user])


  return (
    <div className='Navbar'>
      <div className='nav-container'>
        {/* 左半部 */}
        <div className='left'>
          <Link to='/' title='返回首頁'>
            <div className='logo'>ShoBuy</div>
          </Link>
        </div>
        {/* 下拉選單 */}
        <div className='nav'>
          <Navitem item={item1} />
          <Navitem item={item2} />
          <Navitem item={item3} />
        </div>
        {/* 右半部 */}
        <div className='right'>
          {/* 搜尋商品 */}
          <div className='search'>
            <input className='mag' type='text' />
            <img src={magnifier} className='magnifier' title='搜尋商品' />
          </div>
          {/* 會員頁面 */}
          <Link to='/Login'>
            <img src={member} className='member' title='會員頁面' />
          </Link>
          {/* 購物車 */}
          <div
            className='cart_icon_container'
            onClick={(e) => {
              setIsCartOpen(true)
            }}
          >
            <div className='cart_number' style={{opacity: buyNum? '1' :'0'}}>{buyNum}</div>
            <img src={cart} className='cart_icon' title='購物車' />
          </div>
          {/* 登出功能 */}
          {user && (
            <div
              className='logout'
              onClick={(e) => {
                logout()
              }}
            >
              登出
            </div>
          )}
        </div>
      </div>
      {/* 購物車component */}
      <Cart setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} />
    </div>
  )
}
