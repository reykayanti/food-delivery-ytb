import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState("")
    const [food_list, setfoodList] = useState([])

    const addToCart = async (itemId) =>  {
        if(!cartItems[itemId]) {
            setCartItems((prev)=>({...prev, [itemId]:1}))
        }
        else {
            setCartItems((prev)=>({...prev, [itemId]:prev[itemId] + 1}))
        }
        if (token) {
            await axios.post(url+ "/api/cart/add", {itemId}, {headers:{token}})
        }
    }

    const removeFromCart = async (itemId) =>  {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}))
        if (token) {
            await axios.post(url+ "/api/cart/remove", {itemId}, {headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if (cartItems[item]>0){
                let itemInfo = food_list.find((product)=>product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
            
        }
        return totalAmount;
    }

    // useEffect(()=> {
    //     console.log(cartItems); // Menampilkan nilai terbaru 
    // }, [cartItems]) // // Efek ini hanya akan dijalankan jika cartItems berubah

    const fetchFoodList =  async () => {
        const response = await axios.get(url + "/api/food/list")
        setfoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, {headers: {token}})
        setCartItems(response.data.cartData)
    }


    useEffect(()=>{
        async function loadData() { // Mendeklarasikan fungsi async untuk memuat data
            await fetchFoodList(); // Menunggu hasil dari pemanggilan fetchFoodLis
            if (localStorage.getItem("token")) {  // Memeriksa apakah ada "token" yang tersimpan di localStorage
                setToken(localStorage.getItem("token"))  // Jika ada, set nilai token ke state setToken
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData(); //memanggil fungsi loadData
    },[]) // Efek ini hanya dijalankan sekali, saat komponen pertama kali di-render

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
        
}

export default StoreContextProvider;