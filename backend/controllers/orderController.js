import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173"

    try {
        //Membuat instance baru dari model order dengan data yang diterima dari request body
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })

        // Menyimpan order baru ke database
        await newOrder.save(); 

        // Menghapus keranjang belanja pengguna setelah memesan
        await userModel.findByIdAndUpdate(req.body.userId, {cartData : {}}) 

        // Membuat array line_items untuk Stripe Checkout berdasarkan item yang dipesan
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency: "idr", // Mata uang yang digunakan
                product_data:{
                    name:item.name // Nama produk
                },
                unit_amount:item.price*100*16000 // Menghitung harga dalam satuan terkecil
            },
            quantity:item.quantity // Jumlah item yang dipesan
        }))

        // Menambahkan biaya pengiriman ke dalam line_items
        line_items.push({
            price_data: {
                currency: "idr", // Mata uang yang digunakan
                product_data: {
                    name: "Delivery Charges" // Nama untuk biaya pengiriman
                },
                unit_amount: 2 * 100 * 16000 // Menghitung biaya pengiriman dalam satuan terkecil
            },
            quantity: 1 // Jumlah biaya pengiriman (biasanya 1)
        });

        // Membuat sesi checkout baru di Stripe dengan line_items yang telah disiapkan
        const session = await stripe.checkout.sessions.create({
            line_items: line_items, // Item yang akan ditampilkan di checkout
            mode: 'payment', // Mode pembayaran
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`, // URL untuk sukses
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}` // URL untuk pembatalan
        });

        // Mengirimkan respons JSON dengan status sukses dan URL sesi checkout
        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body; // Mengambil orderId dan status success dari body permintaan
    try {
        if (success==="true") { // Memeriksa apakah status pembayaran adalah "true"
            await orderModel.findByIdAndUpdate(orderId, {payment:true}) // Memperbarui status pembayaran menjadi true
            res.json({success:true, message:"Paid"}) // Mengirimkan respons sukses
        } else {
            await orderModel.findByIdAndDelete(orderId) // Menghapus order jika pembayaran tidak berhasil
            res.json({success:false, message:"Not Paid"}) // Mengirimkan respons gagal
        }
    } catch (error) {
        console.log(error); // Mencetak kesalahan ke konsol
        res.json({success:false, message:"Error"}); // Mengirimkan respons kesalahan
    }
}

export {placeOrder, verifyOrder};