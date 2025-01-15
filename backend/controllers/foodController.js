import foodModel from "../models/foodModel.js";
import fs from "fs"; //nakan untuk berinteraksi dengan sistem file, seperti membaca, menulis, menghapus, dan memodifikasi file 


// add food item
const addFood = async (req, res) => { // add data to database


    if(!req.file){ // if no file uploaded
        res.json({
            success:false, message:"No File Uploaded"
        }) 
        return;
    }

    // save file name that uploaded to variable 'image_filename'
    let image_filename = `${req.file.filename}`; 

    const food = new foodModel({ 
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try{
        await food.save(); // save food Data into database
        res.json({
            success:true, message:"Food Added"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false, message:"Error"
        })
    }
}

// all food list
const listFood = async(req, res) => {
    try{
        const foods = await foodModel.find({});
        res.json({
            success: true,
            data: foods
        })
    } catch (error){
        console.log({
            success: false,
            message: "Error"
        })
    }
}


export {addFood, listFood}