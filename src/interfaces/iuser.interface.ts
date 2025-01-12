import { Document } from "mongoose";


export interface IUser{
    name:string;
    email:string;
    phone:string;
    password:string;
    createdAt?:Date;
    profileImage?:string

}
export interface IUserdata{
    
    email:string;
    password:string;

}

export interface IusePayload{
    userId:string,
    name:string,
    email:string
}