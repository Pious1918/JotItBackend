import { IUser, IUserdata } from "../interfaces/iuser.interface";
import { articleRepository } from "../repositories/articleRepo";
import bcrypt from 'bcryptjs'
import { userRepository } from "../repositories/userRepo";
import { visibility } from "../enums/articlevisibility.enum";
import { IArticleService } from "../interfaces/article.service.interface";
import { IUserRepository } from "../interfaces/article.userreop.interface";
import { IArticleRepository } from "../interfaces/articlerepo.interface";


export class ArticleService implements IArticleService {




    constructor(private _userRepository: IUserRepository, private _articleRepository: IArticleRepository) { }

    async getArticlesFromservice(page: number, limit: number) {
        try {
            const offset = (page - 1) * limit
            return await this._articleRepository.getAllArticles(limit, offset)
        } catch (error) {

            throw error
        }
    }

    public async getStoryById(id: string) {
        try {
            const story = await this._articleRepository.findArticlebyId(id);
            if (!story) {
                throw new Error("Story not found");
            }
            return story;
        } catch (err) {
            throw err;
        }
    }


    async countAllArticles(): Promise<number> {
        try {
            return await this._articleRepository.countArticles();
        } catch (error) {
            console.error("Error counting articles in the service:", error);
            throw new Error("Error counting articles in the service");
        }
    }


    async getuserPublishedStories(userId: string): Promise<any[]> {
        try {
            const visibility = "public"; 
            return await this._articleRepository.getUserPublishedStories(userId, visibility);
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }


    async getuserDraftStories(userId: string): Promise<any[]> {
        try {
            const visibility = "private"; 
            return await this._articleRepository.getUserPublishedStories(userId, visibility);
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }



    async getCurrentuserDetails(userId: string) {
        try {
            return await this._userRepository.getCurrentUser(userId)
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }

    async loginUser(loginData: IUserdata) {

        try {

            const existingUser = await this._userRepository.findbyEmail(loginData.email)
            if (!existingUser) {
                console.log("no such user")
                return { success: false, message: 'Ivalid Email' }
            }

            const validpassword = await bcrypt.compare(loginData.password, existingUser.password)

            if (!validpassword) {
                return { success: false, message: "Invalid Password" };
            }

            const payload = { userId: existingUser._id, email: existingUser.email, name: existingUser.name }

            return {
                success: true,
                message: "Login Successfull",
                data: payload
            }


        } catch (error) {

            console.error("Error in loginUser service", error)
            throw new Error("Service error occured")
        }
    }


    async registerUser(userData: IUser) {
        try {

            const existingUser = await this._userRepository.findbyEmail(userData.email)
            if (existingUser) {
                return { success: false, message: 'User Already exists' }
            }

            const hashpassword = await bcrypt.hash(userData.password, 10)
            const newUser = await this._userRepository.createUser({
                name: userData.name,
                email: userData.email,
                password: hashpassword,
                phone: userData.phone
            })

            return { success: true, message: "User Registered successfully", data: newUser }


        } catch (error) {
            console.error("Error in registerUser", error)
            throw new Error("Failed to register user")
        }
    }


    async updateStoryById(storyid: string, content: string) {
        const story = await this._articleRepository.findArticlebyId(storyid);
        if (!story) {
            throw new Error('Story not found');
        }
        story.content = content;
        return await this._articleRepository.updateArticleById(storyid, content);
    }


    async updateDraftById(storyid: string, content: string) {
        const story = await this._articleRepository.findDraftbyId(storyid);

        if (!story) {
            throw new Error('Story not found');
        }

        story.content = content;
        story.visibility = 'public'; 

        return await this._articleRepository.saveDraftById(storyid, content, 'public');
    }


    async updateProfilePicture(userId: string, s3Url: string): Promise<any> {
        try {
            const updatedUser = await this._userRepository.updateProfilePic(userId, { profileImage: s3Url });
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating profile image');
        }
    }

    
    async updateUsername(userId: string, name: string): Promise<any> {
        try {
            const updatedUser = await this._userRepository.updateName(userId, { name: name });
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating profile image');
        }
    }



    public async deleteStoryById(storyId: string): Promise<void> {
        const story = await this._articleRepository.deleteStoryById(storyId);

        if (!story) {
            throw new Error(`Story with ID ${storyId} not found`);
        }

        return await this._articleRepository.deleteStoryById(storyId);
    }



}