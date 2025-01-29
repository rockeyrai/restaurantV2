"use client";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./database/Mongoose");
const { connectMySql, mysqlPool } = require("./database/MySql");
const userRouter = require("./router/user");
const menuRouter = require("./router/menu");
const tableRouter = require("./router/table");
require("dotenv").config();

// Import socket.io and http
const http = require("http");
const { Server } = require("socket.io");

// Connect to databases
connectMongoDB();
connectMySql();

const app = express();
const server = http.createServer(app); // Create an HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies
  },
});

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies
  })
);
app.use(express.raw({ type: "application/json" }));

app.use(userRouter);
app.use(menuRouter);
app.use(tableRouter);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Example: Sending a message to the client
  socket.emit("welcome", "Welcome to the Socket.io server!");

  // Example: Receiving a message from the client
  socket.on("message", (data) => {
    console.log("Message from client:", data);
    // Broadcast message to all clients
    io.emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Set port with fallback if the environment variable is not set
const PORT = process.env.MY_PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
