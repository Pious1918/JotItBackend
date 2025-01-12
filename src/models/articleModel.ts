import mongoose, {Document , Schema} from "mongoose";
import { IArticle } from "../interfaces/iarticle.interface";
import { visibility } from "../enums/articlevisibility.enum";

const articleSchema :Schema<IArticle> = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'

    },
    content:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        default:[]
    },
    visibility:{
        type:String,
        enum:Object.values(visibility),
        default:visibility.PRIVATE
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model<IArticle>('Article', articleSchema)