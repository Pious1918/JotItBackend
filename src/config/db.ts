
import mongoose from "mongoose";

import dotenv from 'dotenv'

dotenv.config()

const connectDB = async()=>{
    
    console.log("mongourl is ",process.env.MONGO_URL)
    try {
        await mongoose.connect(process.env.MONGO_URL as string , {})
        console.log("mongodb connected")
    } catch (error) {
        console.log("Mongo db connection in jotit failed",error)
    }
}


export default connectDB