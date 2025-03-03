import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

// Setting up the Socket.io server
const io = new Server(server, {
    cors: {
        origin: 'https://instagram-clone-mu-weld.vercel.app',
        methods: ["GET", "POST"]
    }
});

// Creating an object to store userId -> socketId mappings
const userSocketMap = {}; // Changed from [] to {}


export const getReceiverSocketId = (receiverId) => {
   return userSocketMap[receiverId]
}
// Establishing connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id; // Store userId with corresponding socketId
        console.log(`User connected: userId = ${userId}, socketId = ${socket.id}`);
    }

    // Sending online users list to frontend
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handling user disconnect
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId]; // Correct way to delete a key from an object
            console.log(`User disconnected: userId = ${userId}, socketId = ${socket.id}`);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Fixed event name (was "getOnLineUsers")
    });
});

export { app, server, io };
