import React, { useEffect, useState } from 'react'
import './Checkout.scss'
import { db, timestamp, FieldValue } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { stores } from '../../711/711Store'
import { v4 as uuidv4 } from 'uuid'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'

//imgs
import seven_logo from '../../icon/seven_logo.png'

export default function Checkout() {
  const { user } = useAuthContext()
  const [name, setName] = useState(user.displayName)
  const [phone, setPhone] = useState(user.phone)
  const [storeState, setStoreState] = useState('')
  const [checkoutObj, setCheckoutObj] = useState({
    products: [],
    total: 0
  })
  const [isPending, setIsPending] = useState(false)
  const { dbSet, dbDelete, dbUpdate } = useFirestore()
  const navigate = useNavigate()

  // 從checkout 資料庫抓取資料
  useEffect(() => {
    const unsub = db
      .collection('checkout')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setCheckoutObj(doc.data())
        }
      })
    return () => unsub()
  }, [])

  // 提交訂單
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (checkoutObj.products.length === 0) {
      navigate('/')
      return
    } else {
      setIsPending(true)
      let oid = uuidv4()
      const doc = {
        uid: user.uid,
        oid,
        products: checkoutObj.products,
        total: checkoutObj.total,
        order_date: timestamp.fromDate(new Date()),
        name,
        phone,
        store: `7-11 ${storeState}門市 店號：${
          stores.filter((store) => store.店名 === storeState)[0]['店號']
        }`,
        isSend: false,
        done: false
      }
      await dbSet('orders', oid, doc)
      await dbDelete('carts', user.uid)
      await dbDelete('checkout', user.uid)

      for (let p of checkoutObj.products) {
        await dbUpdate('products', p.productId, {
          productNumber: FieldValue.increment(-p.buyNumber)
        })
      }
      setIsPending(false)
      navigate('/member')
    }
  }

  return (
    <form className='checkout' onSubmit={handleSubmit}>
      {/* 左半部商品呈現區塊 */}
      <div className='product_container'>
        <div className='product_top'>訂單商品</div>
        {checkoutObj.products.map((product) => (
          <div key={product.productId} className='product_item'>
            <div className='buy_number'>{product.buyNumber}</div>
            {/* 照片 */}
            <img src={product.imgUrls[0]} className='product_img' />
            {/* 商品資訊 */}
            <div className='info'>
              <div className='title'>【{product.title}】</div>
              <div className='sucForTool'>
                {product.sucForTool}｜{product.sort1}
              </div>
              <div className='size'>尺寸：{product.size}吋</div>
              {/* 價格 */}
              <div className='price'>
                NT${' '}
                {new Intl.NumberFormat('en-US').format(
                  product.buyNumber * product.price
                )}
              </div>
            </div>
          </div>
        ))}
        <hr className='row' />
        <div className='total'>
          總金額:
          <span className='nt'>NT</span>
          <span className='number'>
            ${new Intl.NumberFormat('en-US').format(checkoutObj.total)}
          </span>
        </div>
      </div>
      {/* 右半部寄送資訊 */}
      <div className='send_info'>
        <div className='send_title'>填寫收件人資訊</div>
        {/* 姓名 */}
        <label className='name'>
          <span>收件人姓名：</span>
          <input
            type='text'
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
            required
          />
          <span className='notification'>
            請填入收件人真實姓名，以確保順利收件
          </span>
        </label>
        {/* 電話 */}
        <label className='phone'>
          <span>收件人手機號碼：</span>
          <input
            type='text'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
            }}
            required
          />
          <span className='notification'>
            請確認手機號碼，
            <br />
            如因號碼有誤導致遺漏收件通知，買家請自行吸收損失
          </span>
        </label>
        {/* 門市 */}
        <div className='store'>
          <div className='store_way'>
            物流配送方式：711-取貨付款{' '}
            <img src={seven_logo} className='seven_logo' />
          </div>
          <label>
            <span>取件門市：</span>
            <input
              type='text'
              list='store_list'
              value={storeState}
              onChange={(e) => {
                setStoreState(e.target.value)
              }}
              placeholder='請輸入 門市名稱 或 地址'
              required
            />
            <datalist id='store_list'>
              {stores.map((store, index) => {
                if (
                  store.地址.includes(storeState) ||
                  store.店名.includes(storeState)
                ) {
                  return (
                    <option key={index} value={store.店名}>
                      {store.地址}
                    </option>
                  )
                }
              })}
            </datalist>
            {stores.filter((store) => store.店名 === storeState)[0] && (
              <span className='notification'>
                {stores.filter((store) => store.店名 === storeState)[0]['地址']}
              </span>
            )}
          </label>
        </div>
        {/* 提交訂單 */}
        <button>提 交 訂 單</button>
      </div>
    </form>
  )
}
