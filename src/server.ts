import app from "./app";
import { Server } from 'socket.io'
import http from 'http'
import articleModel from "./models/articleModel";
import mongoose, { Schema } from "mongoose";


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'https://jotit-frontend.vercel.app'
    }
})


io.on('connection', (socket) => {
    console.log('Client connected');
  
    let currentDraftId:any = null; 
  
    socket.on('save-draft', async (data) => {
      const {userId, content, images, visibility } = data;
  
      try {

        const userObjectId = new mongoose.Types.ObjectId(userId); 

        if (!currentDraftId) {
          const newDraft = await articleModel.create({
            userId :userObjectId,
            content,
            images,
            visibility,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
  
          currentDraftId = newDraft._id;
  
          console.log("New draft created:", newDraft);
  
          socket.emit('draft-saved', newDraft);
        } else {
          const existingDraft = await articleModel.findById(currentDraftId);
  
          if (existingDraft) {

            existingDraft.userId = userObjectId;
            existingDraft.content = content;
            existingDraft.images = images;
            existingDraft.visibility = visibility;
            existingDraft.updatedAt = new Date();
  
            await existingDraft.save();
  
            console.log("Draft updated:", existingDraft);
  
            socket.emit('draft-saved', existingDraft);
          } else {
            const newDraft = await articleModel.create({
              content,
              images,
              visibility,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
  
            currentDraftId = newDraft._id; 
  
            console.log("New draft created after missing draft:", newDraft);
  
            socket.emit('draft-saved', newDraft);
          }
        }
      } catch (err) {
        console.error('Error saving draft:', err);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      currentDraftId = null; 
    });
  });
  


const port = process.env.SERVER_PORT || 3000

server.listen(port, () => {
    console.log(`Server running on ${port}`)
})