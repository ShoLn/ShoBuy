import React, { useEffect, useState } from 'react'
import './Home.scss'
import { useParams } from 'react-router-dom'

// hooks
import { db } from '../../firebase/config'

// components
import ProductItem from './ProductItem'

export default function Home() {
  const [products, setProducts] = useState([])
  const [sortType, setSortType] = useState('latest')
  const { searchSuc } = useParams()
  const { searchForest } = useParams()
  const { searchTool } = useParams()
  const { keySearch } = useParams()

  // 從firestore抓取所有商品資料
  useEffect(() => {
    const unsub = db.collection('products').onSnapshot((snapshot) => {
      let data = []
      snapshot.docs.forEach((doc) => {
        data.push(doc.data())
      })
      // 檢查sort1更新 data
      if (typeof searchSuc !== 'undefined') {
        data = data.filter((d) => d.sort1 === searchSuc)
      } else if (typeof searchForest !== 'undefined') {
        data = data.filter((d) => d.sort1 === searchForest)
      } else if (typeof searchTool !== 'undefined') {
        data = data.filter((d) => d.sort1 === searchTool)
      } else if (typeof keySearch !== 'undefined') {
        data = data.filter(
          (d) => d.title.includes(keySearch) || d.sort1.includes(keySearch) || d.sucForTool.includes
        )
      }
      setProducts(data)
    })
    return () => unsub()
  }, [searchSuc, searchForest, searchTool,keySearch])

  // 商品排列順序
  products.sort((a, b) => {
    switch (sortType) {
      case 'latest': {
        return b.creatAt - a.creatAt
      }
      case 'oldest': {
        return a.creatAt - b.creatAt
      }
      case 'priceHighest': {
        return b.price - a.price
      }
      case 'priceLowest': {
        return a.price - b.price
      }
    }
  })

  return (
    <div className='home'>
      {/* 商品排序邏輯 */}
      <select
        value={sortType}
        onChange={(e) => {
          setSortType(e.target.value)
        }}
      >
        <option value='latest'>上架時間新到舊</option>
        <option value='oldest'>上架時間舊到新</option>
        <option value='priceHighest'>價格高到低</option>
        <option value='priceLowest'>價格低到高</option>
      </select>

      {/* 商品container */}
      <div className='product_container'>
        {products.map((product) => (
          <ProductItem product={product} key={product.productId} />
        ))}
      </div>
    </div>
  )
}
