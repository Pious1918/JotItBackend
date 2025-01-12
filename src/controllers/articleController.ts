import { NextFunction, Request, Response, Router } from "express"
import { ArticleService } from "../services/articleService";
import { IUser, IUserdata } from "../interfaces/iuser.interface";
import { generateToken } from "../utils/jwtHelper";
import { generatepresigned } from "../utils/genPresigned";
import IAuthRequest from "../middlewares/authMiddleware";
import { IArticleControllerInterface } from "../interfaces/article.controller.interface";
import { IArticleService } from "../interfaces/article.service.interface";
import { StatusCode } from "../enums/statuscode.enum";



export class ArticleController implements IArticleControllerInterface{


  constructor(private _articleService:IArticleService) {
  }


  public getCurrentUser = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }
      const currentUser = await this._articleService.getCurrentuserDetails(userId);
      res.json({ success: true, data: currentUser });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  };


  public getAllarticles = async (req: Request, res: Response): Promise<void> => {
    try {

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6
      const allArticles = await this._articleService.getArticlesFromservice(page, limit);
      const totalArticles = await this._articleService.countAllArticles()
      const totalPages = Math.ceil(totalArticles / limit)
      res.json({ success: true, data: allArticles, totalPages, currentPage: page });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  };



  public getStorybyid = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.startsWith(":") ? req.params.id.slice(1) : req.params.id;

      const story = await this._articleService.getStoryById(id);
      res.status(StatusCode.OK).json({ success: true, data: story });


    } catch (err) {
      console.error("Error in getStorybyid:", err);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal server error" });
    }
  };

  public deleteStoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const storyId = req.params.storyId.startsWith(':')
        ? req.params.storyId.slice(1)
        : req.params.storyId;

      if (!storyId) {
        res.status(StatusCode.BadRequest).json({ success: false, message: 'Story ID is required' });
        return;
      }

      await this._articleService.deleteStoryById(storyId);
      res.status(StatusCode.OK).json({ success: true, message: `Story with ID ${storyId} deleted successfully` });
    } catch (err) {
      console.error('Error in deleteStoryById:', err);
      res.status(StatusCode.InternalServerError).json({ success: false, message: 'Internal server error' });
    }
  };


  public getuserPublishedStories = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const currentUser = await this._articleService.getuserPublishedStories(userId);
      res.json({ success: true, data: currentUser });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  };


  public getuserDraftStories = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const currentUser = await this._articleService.getuserDraftStories(userId);
      res.json({ success: true, data: currentUser });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  };


  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {

      const { name, email, phone, password } = req.body.registerData

      const userData: IUser = {
        name: name,
        email: email,
        phone: phone,
        password: password
      }

      const result = await this._articleService.registerUser(userData)

      if (result.success) {
        res.status(StatusCode.OK).json({ success: true, message: result.message, data: result.data })
      }
      else {
        res.status(StatusCode.BadRequest).json({ success: false, message: result.message })
      }

    } catch (error) {
      console.error("Error registering the user:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  };


  public loginUser = async (req: Request, res: Response): Promise<void> => {

    try {

      const { email, password } = req.body.loginData
      const userData: IUserdata = {
        email: email,
        password: password
      }
      const result = await this._articleService.loginUser(userData)

      if (!result.success) {
        res.status(StatusCode.BadRequest).json({ message: result.message })
      }
      else {
        const token = generateToken({ userId: result.data?.userId, name: result.data?.name, email: result.data?.email })
        res.status(StatusCode.OK).json({ success: result.success, message: result.message, token })
      }

    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
    }
  }

  public genPresignedURL = async (req: Request, res: Response) => {
    const { fileName, fileType } = req.body
    try {
      const presignedURL = await generatepresigned(fileName, fileType)
      res.json({ presignedURL })
    } catch (error) {
      console.error("Error in presignedurl:", error);
      res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
    }
  }


  public updateStoryById = async (req: Request, res: Response) => {
    const { storyid, content } = req.body;

    if (!storyid || !content) {
      res.status(StatusCode.BadRequest).json({ success: false, message: 'Invalid request data' });
      return;
    }

    try {

      const updatedStory = await this._articleService.updateStoryById(storyid, content);
      res.status(StatusCode.OK).json({ success: true, data: updatedStory });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };


  public updateProfileImage = async (req: IAuthRequest, res: Response) => {
    const { s3Url } = req.body;
    try {

      const userId = req.user?.userId;

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const updateUser = await this._articleService.updateProfilePicture(userId , s3Url)
      res.status(StatusCode.OK).json({ success: true });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };

  public updatename = async (req: IAuthRequest, res: Response) => {
    const { name } = req.body;
    try {

      const userId = req.user?.userId;

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const updateUser = await this._articleService.updateUsername(userId,name)
      res.status(StatusCode.OK).json({ success: true });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };


  public saveDraftById = async (req: Request, res: Response) => {
    const { storyid, content } = req.body;

    if (!storyid || !content) {
      res.status(StatusCode.BadRequest).json({ success: false, message: 'Invalid request data' });
      return;
    }

    try {
      const updatedStory = await this._articleService.updateDraftById(storyid, content);
      res.status(StatusCode.OK).json({ success: true, data: updatedStory });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };

}