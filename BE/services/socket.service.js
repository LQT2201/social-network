const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

class SocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });

    this.onlineUsers = new Map();

    this.io.use(this.authenticateSocket);
    this.setupSocketHandlers();
  }

  authenticateSocket(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      // Add user to online users
      this.onlineUsers.set(socket.user.id, socket.id);

      // Handle private messages
      socket.on("private-message", async (data) => {
        const recipientSocket = this.onlineUsers.get(data.recipientId);
        if (recipientSocket) {
          this.io.to(recipientSocket).emit("new-message", {
            senderId: socket.user.id,
            message: data.message,
          });
        }
      });

      // Handle typing status
      socket.on("typing", (data) => {
        const recipientSocket = this.onlineUsers.get(data.recipientId);
        if (recipientSocket) {
          this.io.to(recipientSocket).emit("user-typing", {
            senderId: socket.user.id,
            isTyping: data.isTyping,
          });
        }
      });

      // Pin/Unpin conversation
      socket.on("pin-conversation", async (data) => {
        // Handle pinning logic
      });

      socket.on("disconnect", () => {
        this.onlineUsers.delete(socket.user.id);
      });
    });
  }
}

module.exports = SocketService;
