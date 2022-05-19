import React, { useEffect, useState } from 'react'
import './Home.scss'
import { Link } from 'react-router-dom'

// hooks
import { db } from '../../firebase/config'

export default function Home() {
  const [products, setProducts] = useState([])
  console.log(products)

  useEffect(() => {
    const unsub = db
      .collection('products')
      .orderBy('creatAt', 'desc')
      .onSnapshot((snapshot) => {
        let data = []
        snapshot.docs.forEach((doc) => {
          data.push(doc.data())
        })
        setProducts(data)
      })
    return () => unsub()
  }, [])

  return (
    <div className='home'>
      <div className='product_container'>
        {products.map((product) => (
          <div className='product_item' key={product.productId}>
            <img src={product.imgUrls[0]} />
            <div className='title'>{product.title}</div>
            <div className='sucFor'>{product.sucFor}</div>
            <div className='price'>${product.price} NT</div>
          </div>
        ))}
      </div>
    </div>
  )
}
