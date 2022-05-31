import React from 'react'
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

 

  return (
    <div>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
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
