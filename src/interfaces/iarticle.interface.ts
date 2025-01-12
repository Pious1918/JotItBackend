import { visibility } from "../enums/articlevisibility.enum";

import mongoose , {Document , Schema} from 'mongoose'

export interface IArticle extends Document{

    userId:any,
    content:string;
    images?:string[];
    visibility:visibility;
    createdAt:Date;
    updatedAt:Date;
}