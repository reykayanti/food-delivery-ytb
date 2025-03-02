import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'


export const Add = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name:"",
    description:"",
    price:"",
    category:"Salad"
  })

  const onChangeHandler = (event) => {      // Fungsi onChangeHandler yang dipanggil setiap kali terjadi perubahan pada input
    const name = event.target.name;         // Mengambil nama (name) dari elemen input yang berubah
    const value = event.target.value;         // Mengambil nilai (value) dari elemen input yang berubah
    
    // Memperbarui state dengan nama dan nilai baru, menggunakan spread operator untuk memastikan
    // data sebelumnya tetap terjaga, dan hanya field yang diubah yang diperbarui 
    setData(data=>({...data, [name]:value}))
  }

  // untuk cek log real time data yang masuk
  // useEffect(()=>{
  //   console.log(data);
  // }, [data])


  //CALL API
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    formData.append("category", data.category)
    formData.append("image", image)
    const response = await axios.post(`${url}/api/food/add`, formData)

    //sukses atau tidak
    if (response.data.success) {
      setData({
        name:"",
        description:"",
        price:"",
        category:"Salad"
      })
      setImage(false)
      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)
    }
  }

  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
          <div className="add-img-upload flex-col">
            <p>Upload Image</p>
            <label htmlFor="image">
              <img src={
                image?URL.createObjectURL(image) // Jika ada gambar yang dipilih, tampilkan gambar tersebut
                :assets.upload_area} alt="" // Jika belum ada gambar, tampilkan gambar default
              /> 
            </label>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
          </div>
          <div className="add-product-name flex-col">
            <p>Product Name</p>
            <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' />
          </div>
          <div className="add-product-description flex-col">
            <p>Product Description</p>
            <textarea onChange={onChangeHandler} value={data.description} name="description" row="6" placeholder='Write content here' required></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product Category</p>
              <select onChange={onChangeHandler} name="category" >
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Product Price</p>
              <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='$20' />
            </div>
          </div>
          <button type='submit' className='add-btn'>Add</button>
        </form>
    </div>
  )
}

export default Add