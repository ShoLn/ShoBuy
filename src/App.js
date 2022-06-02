import React, { useState } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/footer/Footer'

// hooks
import { useAuthContext } from './hooks/useAuthContext'

// pages
import Home from './pages/HomePage/Home'
import Login from './pages/LoginPage/Login'
import Signup from './pages/SignupPage/Signup'
import Member from './pages/MemberPage/Member'
import Seller from './pages/SellerPage/Seller'
import Product from './pages/ProductPage/Product'
import Checkout from './pages/CheckoutPage/Checkout'

export default function App() {
  const { authIsReady, user } = useAuthContext()
  const [openSearch, setOpenSearch] = useState(false)

  return (
    <div
      className='APP_JS'
      onClick={(e) => {
        setOpenSearch(false)
      }}
    >
      {authIsReady && (
        <BrowserRouter>
          <Navbar openSearch={openSearch} setOpenSearch={setOpenSearch} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/searchSuc/:searchSuc' element={<Home />} />
            <Route path='/searchforest/:searchForest' element={<Home />} />
            <Route path='/searchTool/:searchTool' element={<Home />} />
            <Route path='/keySearch/:keySearch' element={<Home />} />
            <Route
              path='/Login'
              element={user ? <Navigate to='/member' /> : <Login />}
            />
            <Route
              path='/Signup'
              element={user ? <Navigate to='/member' /> : <Signup />}
            />
            <Route
              path='/Member'
              element={!user ? <Navigate to='/Login' /> : <Member />}
            />
            <Route path='/Seller' element={<Seller />} />
            <Route path='/Product/:productId' element={<Product />} />
            <Route path='/Checkout' element={<Checkout />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  )
}
