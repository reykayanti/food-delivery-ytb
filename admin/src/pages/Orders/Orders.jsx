import React from 'react'
import './Orders.css'
import {toast} from "react-toastify"
import { useEffect } from 'react'
import { useState } from 'react'
import axios from "axios"
import {assets} from "../../assets/assets"

const Order = ({url}) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => { // Fungsi untuk mengambil semua pesanan dari server
    const response = await axios.get(url + "/api/order/list") //mengambil daftar pesanan
    if (response.data.success){ //Memeriksa apakah response berhasil
      setOrders(response.data.data) // Jika sukses, set state dengan data pesanan yang diterima
      console.log(response.data.data); 
    } else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => { // Fungsi untuk mengubah status pesanan
    const response = await axios.post(url + "/api/order/status", {
      orderId, // ID pesanan yang ingin diubah statusnya
      status: event.target.value // Status baru yang dipilih dari event
    })
    if (response.data.success){ // Memeriksa apakah perubahan status berhasil
      fetchAllOrders() // Jika berhasil, memanggil fungsi fetchAllOrders untuk memperbarui daftar pesanan
    }
  }

  useState(()=>{
    fetchAllOrders()
  },[])

  return (
    <div className='order add'>
      <h3>Order Page</h3> 
      <div className="order-list">
        {orders.map((order, index)=>(
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if(index===order.items.length-1){
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order