import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tomatoproject:Z6B4HnRnKQzzmLuv@cluster0.rjbam.mongodb.net/food-delivery-ytb').then(()=>console.log("DB Connected"));
}
