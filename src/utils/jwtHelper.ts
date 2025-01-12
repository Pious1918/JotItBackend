import jwt from "jsonwebtoken"
import { IusePayload } from "../interfaces/iuser.interface"


export const generateToken = (payload:IusePayload , expiresIn:string = "1h"):string=>{
    const secret = process.env.JWT_SECRET

    if(!secret){
        throw new Error("JWT_SECRET is not defined in environmental variables")
    }

    return jwt.sign(payload, secret , {expiresIn})

}


export const verifyToken = (token:string):IusePayload=>{
    const secret = process.env.JWT_SECRET!
    return jwt.verify(token , secret) as IusePayload
}