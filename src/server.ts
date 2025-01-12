import app from "./app";
import { Server } from 'socket.io'
import http from 'http'
import articleModel from "./models/articleModel";
import mongoose, { Schema } from "mongoose";


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200'
    }
})


io.on('connection', (socket) => {
    console.log('Client connected');
  
    let currentDraftId:any = null; // Variable to hold the current draft's _id
  
    // Handle the 'save-draft' event
    socket.on('save-draft', async (data) => {
      const {userId, content, images, visibility } = data;
  
      try {

        const userObjectId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

        // Create a new draft document every time the socket connects
        if (!currentDraftId) {
          const newDraft = await articleModel.create({
            userId :userObjectId,
            content,
            images,
            visibility,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
  
          // Save the _id of the newly created draft
          currentDraftId = newDraft._id;
  
          console.log("New draft created:", newDraft);
  
          // Emit the new draft to the client
          socket.emit('draft-saved', newDraft);
        } else {
          // If currentDraftId exists, update the existing draft by _id
          const existingDraft = await articleModel.findById(currentDraftId);
  
          if (existingDraft) {

            existingDraft.userId = userObjectId;
            existingDraft.content = content;
            existingDraft.images = images;
            existingDraft.visibility = visibility;
            existingDraft.updatedAt = new Date();
  
            await existingDraft.save();
  
            console.log("Draft updated:", existingDraft);
  
            // Emit the updated draft to the client
            socket.emit('draft-saved', existingDraft);
          } else {
            // If the draft no longer exists (e.g., deleted), create a new one
            const newDraft = await articleModel.create({
              content,
              images,
              visibility,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
  
            currentDraftId = newDraft._id; // Update currentDraftId
  
            console.log("New draft created after missing draft:", newDraft);
  
            // Emit the new draft to the client
            socket.emit('draft-saved', newDraft);
          }
        }
      } catch (err) {
        console.error('Error saving draft:', err);
      }
    });
  
    // Handle the 'disconnect' event
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      currentDraftId = null; // Reset the draft ID when client disconnects
    });
  });
  






const port = process.env.SERVER_PORT || 8000

server.listen(port, () => {
    console.log(`Server running on ${port}`)
})