import { Request, Response, NextFunction } from 'express';
import { IusePayload } from '../interfaces/iuser.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel from '../models/userModel';



export default interface IAuthRequest extends Request{

    user?:IusePayload
}

export class Middleware{


    public async authorize(req:IAuthRequest , res:Response ,next :NextFunction):Promise<any>{

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("hit but no token");
            return res.status(403).json({ error: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as IusePayload;

            req.user = {
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email,
            };

            const userId = decoded.userId; // Access userId from the decoded payload
            const userDetails = await userModel.findById(userId);

            if (!userDetails) {
                return res.status(404).json({ message: 'User not found' });
            }

            console.log("token is here")

            next();
        } catch (error) {
           
            if(error instanceof jwt.TokenExpiredError){
                console.log("token expired")
                return res.status(401).json({ message: 'Token expired' });

            }
            
            console.log("hit but no token")
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
}