import { visibility } from "../enums/articlevisibility.enum";
import { IUser } from "../interfaces/iuser.interface";
import articleModel from "../models/articleModel";
import { BaseRepository } from "./baseRepo";


export class articleRepository extends BaseRepository<any> {
    constructor() {
        super(articleModel)
    }

    async getAllArticles(limit: number, offset: number): Promise<any[]> {
        return await this.findWithPagination({ visibility: 'public' }, limit, offset);
    }

    async countArticles(): Promise<number> {
        return await this.countDocuments({ visibility: 'public' });
    }

    async getCurrentUser(userId: string) {
        return await this.findById(userId)
    }


    async getUserPublishedStories(userId: string, visibility: string): Promise<any[]> {
        try {
            return await this.findByFilter({ userId, visibility });
        } catch (error) {
            console.error("Error in getUserPublishedStories:", error);
            throw error;
        }
    }


    async findbyEmail(email: string) {
        return await this.findOne({ email })
    }

    async findArticlebyId(id: string) {
        return await this.findByIdd(id)
    }

    async findDraftbyId(id: string) {
        return await this.findById(id)
    }

    async createUser(userData: Partial<IUser>): Promise<IUser | null> {
        return this.save(userData)
    }

    async updateArticleById(storyid: string, content: string): Promise<any> {
        return await this.updateById(storyid, { content });
    }


    async saveDraftById(storyid: string, content: string, visibility: string): Promise<any> {
        return await this.updateById(storyid, { content, visibility });
    }


    async deleteStoryById(storyId: string) {
        return await this.deleteById(storyId)
    }

}