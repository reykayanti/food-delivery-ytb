import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext} from '../../context/StoreContext'
import axios from "axios"

export const LoginPopup = ({setShowLogin}) => {

    const {url, setToken} = useContext(StoreContext)

    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name : "",
        email : "",
        password : ""
    })

    const onChangeHandler = (event) => {

        // Mengambil nama elemen yang sedang diubah
        const name = event.target.name;
        const value = event.target.value;

        // Memperbarui state 'data' dengan cara menyebarkan nilai sebelumnya dan mengganti nilai properti sesuai nama input
        setData(data=>({...data, [name]:value}))
    }

    const onLogin = async (event) => {
        event.preventDefault(); // mencegah browser melakukan reload halaman ketika form disubmit
        let newUrl = url;

        // Jika currState adalah 'Login', menambahkan '/api/user/login' ke URL untuk login
        if (currState==="Login") { 

            //Menyimpan nilai URL dasar (https://localhost:4000) ke dalam variabel 'newUrl'
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data) //Mengirimkan request POST ke URL yang sudah disesuaikan
    
        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            setShowLogin(false)
        } else {
            alert(response.data.message)
        }
    
    }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currState==="Login"
                    ?<></>
                    :<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required />
                }
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
            </div>
            <button type='submit'>{currState==="Sign Up"?"Create Account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, rerum!</p>
            </div>
            {currState==="Login"
                ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click Here</span> </p>
                :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login Here</span> </p>
            }
        </form>
    </div>
  )
}
