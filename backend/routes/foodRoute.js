import express from "express"
import { addFood, listFood, removeFood } from "../controllers/foodController.js"
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
foodRouter.get("/list", listFood )
foodRouter.post("/remove", removeFood)

export default foodRouter;