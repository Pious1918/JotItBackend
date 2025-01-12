import express from "express"
import dotenv from 'dotenv'
import morgan from "morgan"
import logger from "./utils/logger";
import cors from "cors";
import connectDB from "./config/db";
import articleRoutes from './routes/articleRoutes'
dotenv.config()
connectDB()



const app = express()

const morganFormat = ":method :url :status :response-time ms";
app.use(express.json());
app.use(cors())

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


app.use('/', articleRoutes)



export default app;