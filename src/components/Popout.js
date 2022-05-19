import React from 'react'
import './Popout.scss'

export default function Popout({setFinishedUpload, message}) {
  return (
    <div
      className='popout'
      onClick={(e) => {
        setFinishedUpload(false)
      }}
    >
      <div>
        {message}
        <button
          onClick={(e) => {
            setFinishedUpload(false)
          }}
        >
          確認
        </button>
      </div>
    </div>
  )
}
