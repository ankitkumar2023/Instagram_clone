import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

// Setting up the Socket.io server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Adjust this if your frontend runs on a different port
        methods: ["GET", "POST"]
    }
});

// Storing userId -> socketId mappings
const userSocketMap = {};

// Function to get receiver socketId
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId] || null;
};

// Socket connection handling
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id; // Store userId with corresponding socketId
        console.log(`✅ User Connected -> userId: ${userId}, socketId: ${socket.id}`);
        
        // Emit updated online users list **after a short delay** to ensure stability
        setTimeout(() => {
            console.log("🔄 Updated Online Users List:", Object.keys(userSocketMap));
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }, 500);
    }

    // Handling user disconnect
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId]; // Remove user from online list
            console.log(`❌ User Disconnected -> userId: ${userId}, socketId: ${socket.id}`);
        }
        console.log("🔄 Updated Online Users List after disconnect:", Object.keys(userSocketMap));
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Notify clients of updated online users
    });
});

export { app, server, io };
