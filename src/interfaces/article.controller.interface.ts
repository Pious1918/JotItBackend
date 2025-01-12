import { Request, Response } from 'express';
import IAuthRequest from '../middlewares/authMiddleware';

export interface IArticleControllerInterface {
  getCurrentUser(req: IAuthRequest, res: Response): Promise<void>;
  getAllarticles(req: Request, res: Response): Promise<void>;
  getStorybyid(req: Request, res: Response): Promise<void>;
  deleteStoryById(req: Request, res: Response): Promise<void>;
  getuserPublishedStories(req: IAuthRequest, res: Response): Promise<void>;
  getuserDraftStories(req: IAuthRequest, res: Response): Promise<void>;
  registerUser(req: Request, res: Response): Promise<void>;
  loginUser(req: Request, res: Response): Promise<void>;
  genPresignedURL(req: Request, res: Response): Promise<void>;
  updateStoryById(req: Request, res: Response): Promise<void>;
  updateProfileImage(req: IAuthRequest, res: Response): Promise<void>;
  updatename(req: IAuthRequest, res: Response): Promise<void>;
  saveDraftById(req: Request, res: Response): Promise<void>;
}
