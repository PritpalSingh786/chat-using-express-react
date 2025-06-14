import express from "express";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import postRoutes from "./routes/postRoutes"
import { AppDataSource } from "./config/data-source";
import { MessageEntity } from "./entities/MessageEntity";
import { User } from "./entities/User";
import "reflect-metadata";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/post", postRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://192.168.0.115:3000", credentials: true },
});

const connectedUsers: Record<string, string> = {};

io.on("connection", (socket) => {
  socket.on("register", (connectionId: string) => {
    connectedUsers[connectionId] = socket.id;
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverConnectionId, receiverId, message }) => {
      const receiverSocketId = connectedUsers[receiverConnectionId];
      const now = Date.now().toString();
      const payload = {
        senderId,
        message,
        timestamp: now,
      };

      if (receiverSocketId)
        io.to(receiverSocketId).emit("receiveMessage", payload);
      socket.emit("receiveMessage", payload);

      // Save message
      const msgRepo = AppDataSource.getRepository(MessageEntity);
      const savedMessage = msgRepo.create({
        senderId,
        receiverId,
        message,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      });
      await msgRepo.save(savedMessage);
    }
  );

  socket.on("disconnect", () => {
    const disconnectedConnId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (disconnectedConnId) delete connectedUsers[disconnectedConnId];
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
    server.listen(5000, () =>
      console.log("Server running at http://localhost:5000")
    );
  })
  .catch(console.error);
