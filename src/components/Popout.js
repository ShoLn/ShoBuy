import React from 'react'
import './Popout.scss'

export default function Popout({
  setFinishedUpload,
  setImgLessTwo,
  imgLessTwo
}) {
  return (
    <div
      className='popout'
      onClick={(e) => {
        setFinishedUpload(false)
        setImgLessTwo(false)
      }}
    >
      <div>
        {imgLessTwo ? '請上傳至少 兩張 圖片' : '商品上架成功'}
        <button
          onClick={(e) => {
            setFinishedUpload(false)
            setImgLessTwo(false)
          }}
        >
          確認
        </button>
      </div>
    </div>
  )
}
