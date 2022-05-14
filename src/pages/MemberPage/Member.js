import React from 'react'
import { useState } from 'react'
import './Member.scss'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { storage } from '../../firebase/config'

// img
import pen from '../../icon/pen.png'
import cloud_icon from '../../icon/cloud_icon.png'

export default function Member() {
  const { user, dispatch } = useAuthContext()
  const [displayName, setDisplayName] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)
  const [address, setAddress] = useState(user.address)
  const [phone, setPhone] = useState(user.phone)
  const [readonly, setReadonly] = useState(true)
  const [thumbFile, setThumbFile] = useState(null)
  const [dragOver, setDragOver] = useState('')
  const [prevUrl, setPrevUrl] = useState(user.thumbNail)
  const [isPending, setIsPending] = useState(false)
  const [finishedUpload, setFinishedUpload] = useState(false)
  const { dbUpdate } = useFirestore()

  // 提交變更
  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsPending(true)
    setFinishedUpload(false)

    // 若有上傳新的大頭貼
    if (thumbFile) {
      const uploadPath = `initial_thumb_nail/${user.uid}/thumb_nail`
      const actualImg = await storage.ref(uploadPath).put(thumbFile)
      const actualImgUrl = await actualImg.ref.getDownloadURL()
      // update firestore user data
      dbUpdate('members', user.uid, {
        displayName,
        address,
        phone,
        thumbNail: actualImgUrl
      })

      // update authContext
      dispatch({
        type: 'LOGIN',
        payload: {
          ...user,
          email,
          displayName,
          address,
          phone,
          thumbNail: actualImgUrl
        }
      })
      // 若無上傳新的大頭貼
    } else {
      // update firestore user data
      dbUpdate('members', user.uid, {
        displayName,
        address,
        phone
      })

      // update authContext
      dispatch({
        type: 'LOGIN',
        payload: {
          ...user,
          email,
          displayName,
          address,
          phone
        }
      })
    }

    setReadonly(true)
    setIsPending(false)
    setFinishedUpload(true)
  }

  // 大頭貼變更觸發事件
  const handleFileChange = (e) => {
    let file = e.target.files[0]
    if (file.type.split('/')[0] === 'image') {
      console.log(e.target.files)
      let tempUrl = URL.createObjectURL(e.target.files[0])
      setPrevUrl(tempUrl)
      setThumbFile(file)
    } else {
      alert('wrong img type')
    }
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
      {/* 大頭照PART */}
      <div className={`thumb-nail ${dragOver}`}>
        <img src={prevUrl} alt='' className='previmg' />
        {/* 大頭照input file */}
        <input
          type='file'
          accept='image/*'
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
          onDrop={(e) => {
            setDragOver('')
          }}
        />
        <img src={cloud_icon} className='cloud_icon' />
      </div>

      {/* 個人資訊 */}
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
      {finishedUpload && (
        <div
          className='finished_upload'
          onClick={(e) => {
            setFinishedUpload(!finishedUpload)
          }}
        >
          <div>
            資料更新成功
            <button
              onClick={(e) => {
                setFinishedUpload(!finishedUpload)
              }}
            >
              確認
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
