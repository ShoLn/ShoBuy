import React from 'react'
import './Seller.scss'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useFirestore } from '../../hooks/useFirestore'
import { storage, timestamp } from '../../firebase/config'

// image
import arrow_down from '../../icon/arrow_down.png'
import upload_img from '../../icon/upload_img.png'
import trash_can from '../../icon/trash_can.png'

// component
import Popout from '../../components/Popout'

export default function Seller() {
  const [title, setTitle] = useState('')
  const [sucFor, setSucFor] = useState('default')
  const [sort1, setSort1] = useState('default')
  const [size, setSize] = useState('default')
  const [price, setPrice] = useState('')
  const [productNumber, setProductNumber] = useState(0)
  const [description, setDiscription] = useState('')

  const [imgFiles, setImgFiles] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [finishedUpload, setFinishedUpload] = useState(false)

  const { dbSet } = useFirestore()

  // 照片 CHANGE 事件
  const handleChange = (e) => {
    console.log(e)
    if (e.target.files.length) {
      let files = Array.from(e.target.files)
      files = files.filter((file) => {
        return file.type.split('/')[0] === 'image'
      })
      files = files.map((file) => {
        return { file, fid: uuidv4(), viewUrl: URL.createObjectURL(file) }
      })

      setImgFiles((prevImgFiles) => [...prevImgFiles, ...files])
    } else {
      setImgFiles((prevImgFiles) => [...prevImgFiles])
    }
  }
  // 照片 delete 事件
  const handleDelete = (deleteId) => {
    if (imgFiles.length === 1) {
      setImgFiles('')
    } else {
      setImgFiles((prevImgFiles) =>
        [...prevImgFiles].filter((prevImgFile) => prevImgFile.fid !== deleteId)
      )
    }
  }

  // 上架商品 submit 事件
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)
    const productId = uuidv4()
    const creatAt = timestamp.fromDate(new Date())
    let imgUrls = []
    const storageUpload = async (imgFile, index) => {
      const uploadPath = `products/${sucFor}/${sort1}/${size}/${productId}/${index}`
      const ImgStorage = await storage.ref(uploadPath).put(imgFile.file)
      const ImgStorageUrl = await ImgStorage.ref.getDownloadURL()
      imgUrls.push(ImgStorageUrl)
    }

    for (let i = 0; i < imgFiles.length; i++) {
      await storageUpload(imgFiles[i], i)
    }

    const doc = {
      creatAt,
      productId,
      title,
      sucFor,
      sort1,
      size,
      price,
      productNumber,
      imgUrls,
      description
    }
    await dbSet('products', productId, doc)
    setIsPending(false)

    // 清空表格
    setTitle('')
    setSucFor('default')
    setSort1('default')
    setSize('default')
    setPrice('')
    setProductNumber(0)
    setDiscription('')
    setImgFiles('')

    setFinishedUpload(true)
  }

  return (
    <form className='seller' onSubmit={handleSubmit}>
      <div className='product'>
        {/* 上傳照片及照片預覽區塊 */}
        <div className='product_img'>
          {/* 上傳及主頁顯示圖片 */}
          <div className='main'>
            {imgFiles && (
              <div className='first no_border'>
                <img src={imgFiles[0].viewUrl} className='first' />
                <img
                  src={trash_can}
                  className='delete'
                  onClick={(e) => {
                    handleDelete(imgFiles[0].fid)
                  }}
                />
              </div>
            )}
            {!imgFiles && (
              <div className='first'>
                <img className='prev' src={upload_img} />
              </div>
            )}
            <input
              type='file'
              multiple='multiple'
              accept='image/*'
              onChange={handleChange}
              required
            />
          </div>
          {/* 其他次要圖片顯示區域 */}
          <div className='secondary'>
            {imgFiles.slice(1) &&
              imgFiles.slice(1).map((imgfile) => (
                <div key={imgfile.fid} className='second'>
                  <img src={imgfile.viewUrl} className='second' />
                  <img
                    src={trash_can}
                    className='delete'
                    onClick={(e) => {
                      handleDelete(imgfile.fid)
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
        {/* 輸入商品名稱分類數量描述 */}
        <div className='information'>
          {/* 商品名稱 */}
          <input
            type='text'
            placeholder='商品名稱'
            value={title}
            required
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />

          {/* 多肉或雨林 */}
          <div className='select_div'>
            <select
              value={sucFor}
              onChange={(e) => {
                setSucFor(e.target.value)
              }}
            >
              <option value='default' disabled>
                請選擇植物類別
              </option>
              <option value='多肉植物'>多肉植物</option>
              <option value='雨林植物'>雨林植物</option>
            </select>
            <img src={arrow_down} />
          </div>

          {/* 子分類1 */}
          <div className='select_div'>
            <select
              value={sort1}
              required
              onChange={(e) => {
                setSort1(e.target.value)
              }}
            >
              {sucFor === '多肉植物' ? (
                <>
                  <option value='default' disabled>
                    請選擇子類別
                  </option>
                  <option value='多肉1'>多肉1</option>
                  <option value='多肉2'>多肉2</option>
                  <option value='多肉3'>多肉3</option>
                  <option value='多肉4'>多肉4</option>
                  <option value='多肉5'>多肉5</option>
                </>
              ) : (
                <>
                  <option value='default' disabled>
                    請選擇子類別
                  </option>
                  <option value='雨林1'>雨林1</option>
                  <option value='雨林2'>雨林2</option>
                  <option value='雨林3'>雨林3</option>
                  <option value='雨林4'>雨林4</option>
                  <option value='雨林5'>雨林5</option>
                </>
              )}
            </select>
            <img src={arrow_down} />
          </div>

          {/* 盆栽大小 */}
          <div className='select_div'>
            <select
              value={size}
              onChange={(e) => {
                setSize(e.target.value)
              }}
            >
              <option value='default' disabled>
                請選擇盆栽大小
              </option>
              <option value='小'>小</option>
              <option value='中'>中</option>
              <option value='大'>大</option>
            </select>
            <img src={arrow_down} />
          </div>

          {/* 商品價格 */}
          <input
            type='number'
            placeholder='商品價格'
            value={price}
            required
            onChange={(e) => {
              setPrice(parseInt(e.target.value, 10))
            }}
          />

          {/* 商品數量部分 */}
          <div className='number'>
            <div>商品數量：</div>
            <span
              className='left'
              onClick={(e) => {
                setProductNumber((prevNum) => {
                  if (prevNum > 0) {
                    return prevNum - 1
                  } else {
                    return 0
                  }
                })
              }}
            >
              -
            </span>
            <input
              type='number'
              placeholder='數量'
              value={productNumber}
              onChange={(e) => {
                setProductNumber(parseInt(e.target.value, 10))
              }}
            />
            <span
              className='right'
              onClick={(e) => {
                setProductNumber((prevNum) => {
                  return prevNum + 1
                })
              }}
            >
              +
            </span>
          </div>
          {/* 商品描述部分 */}
          <textarea
            cols='30'
            rows='12'
            placeholder='商品描述'
            className='description'
            required
            value={description}
            onChange={(e) => {
              setDiscription(e.target.value)
            }}
          ></textarea>
        </div>
      </div>
      {!isPending && <button>上 架 商 品</button>}
      {isPending && <button>商 品 上 架 中....</button>}
      {finishedUpload && (
        <Popout setFinishedUpload={setFinishedUpload} message='商品上架成功' />
      )}
    </form>
  )
}
