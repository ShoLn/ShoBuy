import React from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// pages
import Home from './pages/HomePage/Home'
import Login from './pages/LoginPage/Login'
import Signup from './pages/SignupPage/Signup'
import Cart from './pages/CartPage/Cart'
import Member from './pages/MemberPage/Member'
import Seller from './pages/SellerPage/Seller'

// components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/footer/Footer'

// hooks
import { useAuthContext } from './hooks/useAuthContext'

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
              path='/member'
              element={!user ? <Navigate to='/Login' /> : <Member />}
            />
            <Route
              path='/Cart'
              element={!user ? <Navigate to='/Login' /> : <Cart />}
            />
            <Route path='/Seller' element={<Seller />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  )
}
