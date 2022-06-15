import React, { useEffect, useState } from 'react'
import './Navbar.scss'
import { Link, useNavigate } from 'react-router-dom'
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
import hamber from '../../icon/hamber.png'
import add_product from '../../icon/add_product.png'

export default function Navbar({ openSearch, setOpenSearch }) {
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
  const [keySearch, setKeySearch] = useState('')
  const [openHam, setOpenHam] = useState(false)
  const navigate = useNavigate()

  const { user, isManager } = useAuthContext()
  const { logout } = useLogout()

  useEffect(() => {
    if (user === null) {
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
      <div
        className='nav-container'
        onClick={(e) => {
          setOpenHam(false)
        }}
      >
        <Link to='/' title='返回首頁' className='left'>
          <div className='logo'>ShoBuy</div>
        </Link>
        {/* 下拉選單 */}
        <div className={`nav ${openHam ? 'open_ham' : ''}`}>
          <Navitem item={item1} setOpenHam={setOpenHam} />
          <Navitem item={item2} setOpenHam={setOpenHam} />
          <Navitem item={item3} setOpenHam={setOpenHam} />
        </div>
        {/* 右半部 */}
        <div className='right'>
          {/* 漢堡 */}
          <img
            src={hamber}
            className='hamber'
            onClick={(e) => {
              e.stopPropagation()
              setOpenHam(!openHam)
            }}
          />
          {/* 搜尋商品 */}
          <div className='search'>
            {/* 展開input */}
            <input
              className={`mag ${openSearch ? 'open_search' : ''}`}
              type='text'
              placeholder='請輸入欲搜尋項目'
              value={keySearch}
              onChange={(e) => {
                setKeySearch(e.target.value)
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (keySearch === '') {
                    return
                  } else {
                    setOpenSearch(false)
                    setKeySearch('')
                    navigate(`/keySearch/${keySearch}`)
                  }
                }
              }}
            />
            {/* 放大鏡icon */}
            <img
              src={magnifier}
              className='magnifier'
              title='搜尋商品'
              onClick={(e) => {
                e.stopPropagation()
                setOpenHam(false)
                if (openSearch === true) {
                  if (keySearch === '') {
                    return
                  } else {
                    setKeySearch('')
                    navigate(`/keySearch/${keySearch}`)
                  }
                  setOpenSearch(false)
                } else {
                  setOpenSearch(true)
                }
              }}
            />
          </div>
          {/* 會員頁面 */}
          {user ? (
            <Link to='/Member'>
              <img src={member} className='member' title='會員頁面' />
            </Link>
          ) : (
            <Link to='/Login'>
              <img src={member} className='member' title='登入會員' />
            </Link>
          )}
          {/* 新增商品 */}
          {isManager && (
            <Link to='/Seller'>
              <img src={add_product} className='add_product' title='新增商品' />
            </Link>
          )}
          {/* 購物車 */}
          {!isManager && (
            <div
              className='cart_icon_container'
              onClick={(e) => {
                setIsCartOpen(true)
              }}
            >
              <div
                className='cart_number'
                style={{ opacity: buyNum ? '1' : '0' }}
              >
                {buyNum}
              </div>
              <img src={cart} className='cart_icon' title='購物車' />
            </div>
          )}
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
