import { useEffect, useState } from 'react'
import React from 'react'
import './Signup.scss'
import { useSignup } from '../../hooks/useSignup'
import { Link } from 'react-router-dom'

//signup components
export default function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [wrongEmail, setWrongEmail] = useState('')

  const { signup, error, isPending } = useSignup()

  useEffect(() => {
    if (error === 'auth/email-already-in-use') {
      setWrongEmail('信箱已被使用')
      setEmail('')
    }
  }, [error])
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      signup(email, password, displayName, address, phone)
    } else {
      setWrongPassword(true)
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className='Signup'>
      <div className='create-account'>會 員 帳 戶 創 建</div>
      <form onSubmit={handleSubmit}>
        <label>
          <span>姓名：</span>
          <input
            type='text'
            required
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
            }}
          />
        </label>
        <label>
          <span>信箱：</span>
          <input
            type='email'
            required
            value={email}
            placeholder={wrongEmail ? '信箱已被使用' : undefined}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </label>
        <label>
          <span>密碼(至少六位)：</span>
          <input
            type='password'
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            placeholder={wrongPassword ? '請確認密碼輸入相同' : undefined}
          />
        </label>
        <label>
          <span>密碼確認：</span>
          <input
            type='password'
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
            placeholder={wrongPassword ? '請確認密碼輸入相同' : undefined}
          />
        </label>
        {!isPending && <button>建 立 帳 戶</button>}
        {isPending && <button disabled>建 立 中...</button>}
      </form>
      <Link to='/Login' className='link-to-login'>
        已經有會員帳號
      </Link>
    </div>
  )
}
