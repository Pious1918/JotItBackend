import {NextFunction , Request, Response , Router} from "express"
import express from 'express'
import { ArticleController } from "../controllers/articleController"
import { Middleware } from "../middlewares/authMiddleware"
import { ArticleService } from "../services/articleService"
import { userRepository } from "../repositories/userRepo"
import { articleRepository } from "../repositories/articleRepo"

const middleWare = new Middleware()


const userRepo = new userRepository(); 
const articleRepo = new articleRepository();

const articleService = new ArticleService(userRepo, articleRepo);

const articleController = new ArticleController(articleService)
const router = Router()

router.get('/getuserdetails', middleWare.authorize, articleController.getCurrentUser);
router.get('/userPublished', middleWare.authorize, articleController.getuserPublishedStories);
router.get('/userDraft', middleWare.authorize, articleController.getuserDraftStories);
router.get('/allarticles', middleWare.authorize, articleController.getAllarticles);
router.get('/stories/:id', middleWare.authorize, articleController.getStorybyid);
router.delete('/delete/:storyId', middleWare.authorize, articleController.deleteStoryById);

router.post('/updatearticle', middleWare.authorize, articleController.updateStoryById);
router.put('/upateImage', middleWare.authorize, articleController.updateProfileImage);
router.put('/updatename', middleWare.authorize, articleController.updatename);
router.post('/savedraft', middleWare.authorize, articleController.saveDraftById);
router.post('/registeruser', articleController.registerUser)
router.post('/login', articleController.loginUser)
router.post('/generatepresigned', articleController.genPresignedURL)

export default router