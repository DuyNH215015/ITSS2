const express = require("express");
const http = require("http");
const { sequelize } = require("./models");
const app = require("./index"); // index.js export Express instance

// Import controller để xử lý WebRTC
const videoCallController = require("./modules/videoCall/controllers/videoController");

const port = process.env.PORT || 8080;

// Tạo HTTP Server để dùng chung cho cả Express và WebSocket
const server = http.createServer(app);

// ⚡ Kết nối Socket.io để làm signaling server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Cho test, sau có thể giới hạn domain
    methods: ["GET", "POST"],
  },
});

// 🧠 Logic signaling WebRTC
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    videoCallController.handleJoinRoom(socket, roomId);
  });
  
  socket.on("offer", (data) => {
    videoCallController.handleOffer(socket, data);
  });

  socket.on("answer", (data) => {
    videoCallController.handleAnswer(socket, data);
  });

  socket.on("ice-candidate", (data) => {
    videoCallController.handleIceCandidate(socket, data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    await sequelize.sync({ alter: true });
    // hoặc: await sequelize.sync({ force: true });

    server.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

startServer();
