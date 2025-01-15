import express from "express"
import { addFood, listFood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

// image Storage engine

const storage = multer.diskStorage({
    destination: "uploads", //uploads folder
    filename: (req, file, cb)=> {
        return cb(null, `${Date.now()}${file.originalname}`) //date now + file name
    }
})

const upload = multer({storage:storage}); //Menggunakan konfigurasi storage yang sudah ditentukan

foodRouter.post("/add", upload.single("image"), addFood)    //upload.single("image") adalah middleware yang akan menangani upload file, 
                                                            // Setelah file berhasil di-upload, fungsi addFood akan dipanggil untuk menangani sisa proses (misalnya menyimpan data makanan dan informasi file dalam database
foodRouter.get("/list", listFood )

export default foodRouter;