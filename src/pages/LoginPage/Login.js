import React, { useEffect } from 'react'
import { useState } from 'react'
import './Login.scss'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { auth } from '../../firebase/config'

// img
import x_icon from '../../icon/x.png'
import email_icon from '../../icon/email.png'

export default function Login() {
  const [email, setEmail] = useState('test666@gmail.com')
  const [password, setPassword] = useState('test666')
  const { login, error, isPending } = useLogin()
  //forget password state
  const [isForgetPass, setIsForgetPass] = useState(false)
  const [resetEmail, setRestEmail] = useState('')
  const [emailSendResult, setEmailSendResult] = useState('')
  const [isEmailPending, setIsEmailPending] = useState(false)
  const [wrongEmail, setWrongEmail] = useState('')
  const [wrongPassword, setWrongPassword] = useState('')

  useEffect(() => {
    if (error === 'auth/user-not-found') {
      setEmail('')
      setWrongEmail('信箱 輸入錯誤')
    } else if (error === 'auth/wrong-password') {
      setPassword('')
      setWrongPassword('密碼 輸入錯誤')
    }
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  // reset password email
  const handleReset = (e) => {
    e.preventDefault()
    setIsEmailPending(true)
    auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setIsEmailPending(false)
        setEmailSendResult('郵件已寄送，請前往信箱（或垃圾郵件中）查看！')
      })
      .catch(() => {
        setIsEmailPending(false)
        setEmailSendResult('郵件寄送失敗，請確認信箱地址！')
      })
  }

  return (
    <div className='Login'>
      <div className='account-login'>會 員 登 入</div>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          className={wrongEmail ? 'email wrong' : 'email'}
          placeholder={wrongEmail ? wrongEmail : '請輸入信箱'}
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <input
          type='password'
          className={wrongPassword ? 'password wrong' : 'password'}
          placeholder={wrongPassword ? wrongPassword : '請輸入密碼'}
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        {!isPending && <button>登 入 帳 號</button>}
        {isPending && <button>登 入 中...</button>}
      </form>
      <Link to='/Signup' className='create-account'>
        創建會員帳號
      </Link>
      <div
        className='forget-password'
        onClick={(e) => {
          setIsForgetPass(true)
        }}
      >
        忘記密碼?
      </div>
      {/* forget password form */}
      {isForgetPass && (
        <div
          className='fp-container'
          onClick={(e) => {
            setIsForgetPass(false)
          }}
        >
          <form
            className='fp-form'
            onSubmit={handleReset}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <img
              src={x_icon}
              title='關閉'
              onClick={(e) => {
                setIsForgetPass(false)
              }}
            />
            <div>
              請輸入當初註冊會員帳號時的電子信箱，我們將寄送密碼重設郵件至您的信箱。
            </div>
            <label>
              <img src={email_icon} />
              <input
                type='email'
                value={resetEmail}
                onChange={(e) => {
                  setRestEmail(e.target.value)
                  setEmailSendResult('')
                }}
              />
            </label>
            {!isEmailPending && <button className='fp-button'>寄送</button>}
            {isEmailPending && (
              <button className='fp-button' disabled>
                寄送中...
              </button>
            )}
            <div className='email-send-result'>{emailSendResult}</div>
          </form>
        </div>
      )}
    </div>
  )
}
