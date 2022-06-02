import React from 'react'
import './Navitem.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// img
import arrowDown from '../../icon/arrow_down.png'

export default function Navitem({ item }) {
  const navigate = useNavigate()

  return (
    <div className='nav-item'>
      <div className='main'>
        {item[0]}
        <img src={arrowDown} className='arrow-down' />
      </div>
      <div className='drop-down'>
        {item.slice(1).map((element, index) => {
          return (
            <div key={index}>
              <div
                className='drop-item'
                onClick={(e) => {
                  if (item[0] === '多肉植物') {
                    navigate(`/searchSuc/${element}`)
                  } else if (item[0] === '雨林植物') {
                    navigate(`/searchForest/${element}`)
                  } else {
                    navigate(`/searchTool/${element}`)
                  }
                }}
              >
                {element}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
