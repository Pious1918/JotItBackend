import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/iuser.interface";



const userSchema :Schema<IUser> = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    profileImage: {
        type: String,
        default: 'https://jotit-article-buck.s3.ap-south-1.amazonaws.com/avathar.jpg',
    },
})


export default mongoose.model<IUser>('User', userSchema)