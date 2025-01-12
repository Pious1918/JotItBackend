import { IUser } from "./iuser.interface";

export interface IArticleRepository {
    getAllArticles(limit: number, offset: number): Promise<any[]>; 
    countArticles(): Promise<number>;
    getCurrentUser(userId: string): Promise<any | null>;
    getUserPublishedStories(userId: string, visibility: string): Promise<any[]>;
    findbyEmail(email: string): Promise<any | null>;
    findArticlebyId(id: string): Promise<any | null>;
    findDraftbyId(id: string): Promise<any | null>;
    createUser(userData: Partial<IUser>): Promise<IUser | null>;
    updateArticleById(storyid: string, content: string): Promise<any>;
    saveDraftById(storyid: string, content: string, visibility: string): Promise<any>;
    deleteStoryById(storyId: string): Promise<any>;
}