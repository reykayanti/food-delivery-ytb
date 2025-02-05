import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

export const PlaceOrder = () => {

  //Mengambil nilai dari StoreContext
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  // Menginisialisasi state untuk menyimpan data form pengguna
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state : "",
    zipcode : "",
    country : "",
    phone : "",
  })

  // Fungsi untuk menangani perubahan pada input form
  const onChangeHandler = (event) => {
    const name = event.target.name; // Mengambil nama input yang berubah
    const value = event.target.value; // Mengambil nilai input yang baru
    setData(data=>({...data, [name]:value})) // Memperbarui state dengan nilai baru, menjaga nilai yang sudah ada
  }

  // cek perubahan data pada console. hanya untuk cek saja
  // useEffect(()=>{
  //   console.log(data);
  // }, [data])

  const placeOrder = async (event) => {
    event.preventDefault(); // mencegah browser melakukan reload halaman ketika form disubmit
    let orderItems = []; //Inisialisasi array kosong untuk menyimpan item pesanan\

    //Mengiterasi setiap item dalam food_list
    food_list.map((item) => {
      if (cartItems[item._id]>0) { // jika item lebih dari 0
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id] // Menambahkan properti 'quantity' ke itemInfo dengan jumlah dari cartItems
        orderItems.push(itemInfo) // Menambahkan itemInfo yang telah dimodifikasi ke dalam array orderItems
      }
    })

    //Membuat objek orderData yang berisi informasi pesanan
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+2,
    }

    //// Mengirimkan permintaan POST ke server untuk membuat pesanan baru
    let response = await axios.post(url+"/api/order/place", orderData, {
      headers:{token} /// Menyertakan token dalam header untuk otentikasi
    })
    if (response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error")
    }
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">
          Delivery Information
        </p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Adress' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
          <div className="cart-total-details">
                <p>Sub Total</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>$
                  {getTotalCartAmount()===0
                    ?0
                    :2}
                </p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total </b>
                <b>$
                  {getTotalCartAmount()===0
                  ?0
                  :getTotalCartAmount()+2}
                </b>
              </div>
          </div>
          <button type='submit'>PROCESS TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}
