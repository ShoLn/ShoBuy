import React from 'react'
import { useState } from 'react'
import './Member.scss'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

// img
import pen from '../../icon/pen.png'
import upload_img from '../../icon/upload_img.png'

export default function Member() {
  const { user, dispatch } = useAuthContext()
  const [displayName, setDisplayName] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)
  const [address, setAddress] = useState(user.address)
  const [phone, setPhone] = useState(user.phone)
  const [readonly, setReadonly] = useState(true)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState('')
  const [tempURL, setTempURL] = useState('../../icon/thumb_nail.png')

  const { dbUpdate, isPending } = useFirestore()

  // 變更文字資料
  const handleSubmit = (e) => {
    e.preventDefault()

    // update firestore user data
    dbUpdate('members', user.uid, { displayName, address, phone })

    // update authContext
    dispatch({
      type: 'LOGIN',
      payload: { ...user, email, displayName, address, phone }
    })

    setReadonly(true)
  }

  // 處理大頭貼相關事件
  const handleFileChange = (e) => {
    let tempURL = URL.createObjectURL(e.target.files[0])
    setTempURL(tempURL)
  }

  return (
    <form className='member' onSubmit={handleSubmit}>
      {/*  筆的icon */}
      <img
        className='pen'
        src={pen}
        title='編輯會員資料'
        onClick={(e) => {
          setReadonly(!readonly)
        }}
      />
      <div className={`thumb-nail ${dragOver}`} style={{backgroundImage:`url(${tempURL})`}}>
        {/* 大頭照input file */}
        <input
          type='file'
          className='file-upload'
          onChange={handleFileChange}
          onDragEnter={(e) => {
            e.preventDefault()
            setDragOver('drag-over')
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragOver('')
          }}
        />
        <img src={upload_img} className='upload-img' />
      </div>
      <div className='email'>{user.email}</div>
      <label>
        <span>姓名：</span>
        <input
          type='text'
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value)
          }}
          readOnly={readonly}
        />
      </label>
      <label>
        <span>手機：</span>
        <input
          type='text'
          minLength='10'
          maxLength='10'
          pattern='[0-9]+'
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
          }}
          readOnly={readonly}
        />
      </label>
      <label>
        <span>地址：</span>
        <input
          type='text'
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
          }}
          readOnly={readonly}
        />
      </label>
      {!isPending && <button>更 新 資 料</button>}
      {isPending && <button disabled>資 料 更 新 中.....</button>}
    </form>
  )
}
