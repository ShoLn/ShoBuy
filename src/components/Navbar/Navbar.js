import React from 'react'
import './Navbar.scss'
import Navitem from './Navitem'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
// img
import magnifier from '../../icon/magnifier.png'
import member from '../../icon/member.png'
import cart from '../../icon/cart.png'

export default function Navbar() {
  const [item1, setItem1] = useState([
    '多肉植物',
    '龍舌蘭',
    '景天',
    '塊根',
    '百合科-12卷屬'
  ])
  const [item2, setItem2] = useState(['雨林植物', '雨林1', '雨林2'])
  const [item3, setItem3] = useState([
    '盆栽大小',
    '大 SIZE',
    '中 SIZE',
    '小 SIZE'
  ])

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
          <Link to='/Cart'>
            <img src={cart} className='cart' title='購物車' />
          </Link>
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
    </div>
  )
}
