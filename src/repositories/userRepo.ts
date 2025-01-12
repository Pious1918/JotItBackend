import { IUser } from "../interfaces/iuser.interface";
import articleModel from "../models/articleModel";
import userModel from "../models/userModel";
import { BaseRepository } from "./baseRepo";


export class userRepository extends BaseRepository<any> {
    constructor() {
        super(userModel)
    }

    async getAllarticle() {
        return await this.findAll()
    }

    async findbyEmail(email: string) {
        return await this.findOne({ email })
    }

    async createUser(userData: Partial<IUser>): Promise<IUser | null> {
        return this.save(userData)
    }


    async getCurrentUser(userId: string) {
        return await this.findById(userId)
    }

    async updateProfilePic(userId: string, updateData: { profileImage: string }) {
        return this.updateById(userId, updateData); 
    }

    async updateName(userId: string, updateData: { name: string }) {
        return this.updateById(userId, updateData); 
    }
}