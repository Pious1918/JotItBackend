import { IArticle } from "./iarticle.interface";
import { IUser, IUserdata } from "./iuser.interface";

interface IArticleService {
    getArticlesFromservice(page: number, limit: number): Promise<any[]>;
    getStoryById(id: string): Promise<IArticle | null>;
    countAllArticles(): Promise<number>;
    getuserPublishedStories(userId: string): Promise<any[]>;
    getuserDraftStories(userId: string): Promise<any[]>;
    getCurrentuserDetails(userId: string): Promise<any | null>;
    loginUser(loginData: IUserdata): Promise<{ success: boolean; message: string; data?: any }>;
    registerUser(userData: IUser): Promise<{ success: boolean; message: string; data?: any }>;
    updateStoryById(storyid: string, content: string): Promise<IArticle>;
    updateDraftById(storyid: string, content: string): Promise<IArticle>;
    updateProfilePicture(userId: string, s3Url: string): Promise<any>;
    updateUsername(userId: string, name: string): Promise<any>;
    deleteStoryById(storyId: string): Promise<void>;
  }


  export {IArticleService}