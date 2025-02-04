import userModel from "../models/userModel.js"

//add items to user cart
const addToCart = async (req, res) => {
    try {
        // let userData = await userModel.findOne({_id:req.body.userId})
        let userData = await userModel.findById(req.body.userId)

        if (!userData) { // Cek apakah userData null atau tidak ditemukan
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        let cartData = await userData.cartData; // Mengambil data keranjang belanja (cartData) dari data pengguna yang ditemukan
        
        if (!cartData[req.body.itemId]){ // Mengecek apakah item yang ingin ditambahkan sudah ada di keranjang
            cartData[req.body.itemId] = 1; // Jika item belum ada, tambahkan item dengan kuantitas 1
        } else {
            cartData[req.body.itemId] += 1; // Jika item sudah ada, tambahkan kuantitas item tersebut
        }

         // Menyimpan pembaruan cartData ke dalam database
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})

        res.json({success:true, message: "Added to cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
        
    }
}

// remove items from User cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId) // Ambil userId dari token
        let cartData = await userData.cartData; //Ambil data cart pengguna
        if (cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData}) // Update data cart pengguna di database
        res.json({success:true, message: "Removed from cart"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

//fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        res.json({success:true, cartData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}


export {addToCart, removeFromCart, getCart}