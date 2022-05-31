import React from 'react'
import './Navbar.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'

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
    '多肉1',
    '多肉2',
    '多肉3',
    '多肉4',
    '多肉5'
  ])
  const [item2, setItem2] = useState([
    '雨林植物',
    '雨林1',
    '雨林2',
    '雨林3',
    '雨林4',
    '雨林5'
  ])
  const [item3, setItem3] = useState([
    '園藝工具',
    '工具1',
    '工具2',
    '工具3',
    '工具4',
    '工具5'
  ])

  const [isCartOpen, setIsCartOpen] = useState(false)

  const { user } = useAuthContext()
  const { logout } = useLogout()

  return (
    <div className='Navbar'>
      <div className='nav-container'>
        <div className='ham'></div>
        <div className='left'>
          <Link to='/' title='返回首頁'>
            <div className='logo'>ShoBuy</div>
          </Link>
        </div>
        <div className='nav'>
          <Navitem item={item1} />
          <Navitem item={item2} />
          <Navitem item={item3} />
        </div>
        <div className='right'>
          <div className='search'>
            <input className='mag' type='text' />
            <img src={magnifier} className='magnifier' title='搜尋商品' />
          </div>
          <Link to='/Login'>
            <img src={member} className='member' title='會員頁面' />
          </Link>
          <div
            className='cart_icon_container'
            onClick={(e) => {
              setIsCartOpen(true)
            }}
          >
            <img src={cart} className='cart_icon' title='購物車' />
          </div>
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
