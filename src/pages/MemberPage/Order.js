import React, { useState, useEffect } from 'react'
import './Order.scss'
import { useAuthContext } from '../../hooks/useAuthContext'
import { db, timestamp } from '../../firebase/config'

//img
import deliver from '../../icon/deliver.png'

export default function Order() {
  const [needSend, setNeedSend] = useState(true)
  const [alreadySend, setAlreadySend] = useState(false)
  const [done, setDone] = useState(false)
  const { user, isManager } = useAuthContext()
  const [orders, setOrders] = useState([])
  const [reget, setReget] = useState(false)

  // 獲取該會員所有訂單資料
  useEffect(() => {
    let orders = []
    if (isManager) {
      db.collection('orders')
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            orders.push(doc.data())
          })
          setOrders(orders)
        })
    } else {
      db.collection('orders')
        .where('uid', '==', user.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            orders.push(doc.data())
          })
          setOrders(orders)
        })
    }
  }, [reget])

  // 訂單按建立日期排序
  orders.sort((a, b) => {
    return b.order_date - a.order_date
  })

  // 日期轉換
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  // 已出貨到已完成
  const handleToDone = async (oid) => {
    await db
      .collection('orders')
      .doc(oid)
      .update({
        order_date: timestamp.fromDate(new Date()),
        isSend: false,
        done: true
      })
    setReget(!reget)
  }

  // 未出貨到已出貨
  const handleToAlreadySend = async (oid) => {
    await db
      .collection('orders')
      .doc(oid)
      .update({
        order_date: timestamp.fromDate(new Date()),
        isSend: true,
        done: false
      })
    setReget(!reget)
  }

  

  return (
    <div className='order'>
      {/* 上方選單 */}
      <div className='delever_type'>
        <div
          className={`${needSend ? 'click_type' : ''} `}
          onClick={(e) => {
            setNeedSend(true)
            setAlreadySend(false)
            setDone(false)
          }}
        >
          待出貨
        </div>
        <div
          className={`${alreadySend ? 'click_type' : ''} `}
          onClick={(e) => {
            setNeedSend(false)
            setAlreadySend(true)
            setDone(false)
          }}
        >
          已出貨
        </div>
        <div
          className={`${done ? 'click_type' : ''} `}
          onClick={(e) => {
            setNeedSend(false)
            setAlreadySend(false)
            setDone(true)
          }}
        >
          已完成
        </div>
      </div>
      {/* 下方訂單資料 */}
      <div className='all_orders'>
        {/* 待出貨 */}
        {needSend &&
          orders
            .filter((order) => order.isSend === false && order.done === false)
            .map((order) => (
              <div key={order.oid} className='order_item'>
                {/* 訂單編號 */}
                <div className='oid'>
                  <span>訂單編號:</span>
                  {order.oid.slice(-15, -1)}
                </div>
                {/* 收件者資訊 */}
                <div className='deliver_info'>
                  <div className='deliver'>
                    <img src={deliver} />
                    寄送資訊
                  </div>
                  <div className='name info'>
                    <span>訂單日期：</span>
                    {formatDate(order.order_date.toDate().toDateString())}
                  </div>
                  <div className='name info'>
                    <span>收件人：</span>
                    {order.name}
                  </div>
                  <div className='phone info'>
                    <span>電話：</span>
                    {order.phone}
                  </div>
                  <div className='store info'>{order.store}</div>
                </div>
                {/* 商品資訊 */}
                <hr />
                <div className='products'>
                  {order.products.map((product, index) => (
                    <div key={index} className='product'>
                      <img src={product.imgUrls[0]} />
                      <div className='product_info'>
                        <div className='pro_name'>【{product.title}】</div>
                        <div className='sort1'>{product.sort1}</div>
                        <div className='size'>{product.size}</div>
                      </div>
                      <div className='number'>
                        <div className='buy_number'>{`x ${product.buyNumber}`}</div>
                        <div className='price'>{`$ ${new Intl.NumberFormat(
                          'en-US'
                        ).format(product.price)}`}</div>
                      </div>
                      <hr />
                    </div>
                  ))}
                  <hr />
                  <div className='total'>
                    <div className='t1'>訂單金額</div>
                    <div className='t2'>{`$${new Intl.NumberFormat(
                      'en-US'
                    ).format(order.total)}`}</div>
                  </div>
                  <div
                    className='move_to_next'
                    onClick={(e) => {
                      handleToAlreadySend(order.oid)
                    }}
                  >
                    確 認 出 貨
                  </div>
                </div>
              </div>
            ))}
        {/* 已出貨 */}
        {alreadySend &&
          orders
            .filter((order) => order.isSend === true && order.done === false)
            .map((order) => (
              <div key={order.oid} className='order_item'>
                {/* 訂單編號 */}
                <div className='oid'>
                  <span>訂單編號:</span>
                  {order.oid.slice(-15, -1)}
                </div>
                {/* 收件者資訊 */}
                <div className='deliver_info'>
                  <div className='deliver'>
                    <img src={deliver} />
                    寄送資訊
                  </div>
                  <div className='name info'>
                    <span>寄送日期：</span>
                    {formatDate(order.order_date.toDate().toDateString())}
                  </div>
                  <div className='name info'>
                    <span>收件人：</span>
                    {order.name}
                  </div>
                  <div className='phone info'>
                    <span>電話：</span>
                    {order.phone}
                  </div>
                  <div className='store info'>{order.store}</div>
                </div>
                {/* 商品資訊 */}
                <hr />
                <div className='products'>
                  {order.products.map((product, index) => (
                    <div key={index} className='product'>
                      <img src={product.imgUrls[0]} />
                      <div className='product_info'>
                        <div className='pro_name'>【{product.title}】</div>
                        <div className='sort1'>{product.sort1}</div>
                        <div className='size'>{product.size}</div>
                      </div>
                      <div className='number'>
                        <div className='buy_number'>{`x ${product.buyNumber}`}</div>
                        <div className='price'>{`$ ${new Intl.NumberFormat(
                          'en-US'
                        ).format(product.price)}`}</div>
                      </div>
                      <hr />
                    </div>
                  ))}
                  <hr />
                  <div className='total'>
                    <div className='t1'>訂單金額</div>
                    <div className='t2'>{`$${new Intl.NumberFormat(
                      'en-US'
                    ).format(order.total)}`}</div>
                  </div>
                  <div
                    className='move_to_next'
                    onClick={(e) => {
                      handleToDone(order.oid)
                    }}
                  >
                    確 認 收 貨
                  </div>
                </div>
              </div>
            ))}
        {/* 已完成 */}
        {done &&
          orders
            .filter((order) => order.done === true)
            .map((order) => (
              <div key={order.oid} className='order_item'>
                {/* 訂單編號 */}
                <div className='oid'>
                  <span>訂單編號:</span>
                  {order.oid.slice(-15, -1)}
                </div>
                {/* 收件者資訊 */}
                <div className='deliver_info'>
                  <div className='deliver'>
                    <img src={deliver} />
                    寄送資訊
                  </div>
                  <div className='name info'>
                    <span>完成日期：</span>
                    {formatDate(order.order_date.toDate().toDateString())}
                  </div>
                  <div className='name info'>
                    <span>收件人：</span>
                    {order.name}
                  </div>
                  <div className='phone info'>
                    <span>電話：</span>
                    {order.phone}
                  </div>
                  <div className='store info'>{order.store}</div>
                </div>
                {/* 商品資訊 */}
                <hr />
                <div className='products'>
                  {order.products.map((product, index) => (
                    <div key={index} className='product'>
                      <img src={product.imgUrls[0]} />
                      <div className='product_info'>
                        <div className='pro_name'>【{product.title}】</div>
                        <div className='sort1'>{product.sort1}</div>
                        <div className='size'>{product.size}</div>
                      </div>
                      <div className='number'>
                        <div className='buy_number'>{`x ${product.buyNumber}`}</div>
                        <div className='price'>{`$ ${new Intl.NumberFormat(
                          'en-US'
                        ).format(product.price)}`}</div>
                      </div>
                      <hr />
                    </div>
                  ))}
                  <hr />
                  <div className='total'>
                    <div className='t1'>訂單金額</div>
                    <div className='t2'>{`$${new Intl.NumberFormat(
                      'en-US'
                    ).format(order.total)}`}</div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
