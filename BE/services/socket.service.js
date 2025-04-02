const socketIO = require("socket.io");
const JWT = require("jsonwebtoken");
const { AuthFailureError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

class SocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    console.log("Initialize socket");

    this.onlineUsers = new Map();
    this.io.use(this.authenticateSocket);
    this.setupSocketHandlers();
  }

  authenticateSocket = async (socket, next) => {
    try {
      const userId = socket.handshake.auth["x-client-id"];
      const authHeader = socket.handshake.auth.authorization;

      if (!userId || !authHeader) {
        return next(new AuthFailureError("Missing authentication credentials"));
      }

      if (!authHeader.startsWith("Bearer ")) {
        return next(new AuthFailureError("Invalid authorization format"));
      }

      const accessToken = authHeader.split(" ")[1];

      // Find keyStore for user
      const keyStore = await KeyTokenService.findByUserId(userId);
      if (!keyStore) {
        return next(new AuthFailureError("Invalid authentication"));
      }

      // Verify token
      try {
        const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodedUser.userId) {
          throw new Error("User ID mismatch");
        }

        // Attach user data to socket
        socket.user = {
          userId: decodedUser.userId,
          keyStore,
        };
        console.log("Socket authenticated");

        next();
      } catch (error) {
        return next(new AuthFailureError("Invalid access token"));
      }
    } catch (error) {
      return next(new AuthFailureError(error.message));
    }
  };

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      const userId = socket.user.userId;

      // Handle user connection
      this.handleUserConnection(socket, userId);

      // Handle message events
      this.setupMessageHandlers(socket, userId);

      // Handle disconnect
      socket.on("disconnect", () => {
        this.handleDisconnect(userId);
      });
    });
  }

  handleUserConnection(socket, userId) {
    // Add user to online users
    this.onlineUsers.set(userId, socket.id);

    console.log(this.onlineUsers);

    // Join user's personal room
    socket.join(userId);

    // Broadcast user online status
    this.broadcastOnlineStatus(userId, true);

    // Send current online users to the new user
    socket.emit("onlineUsers", Array.from(this.onlineUsers.keys()));
  }

  setupMessageHandlers(socket, userId) {
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined room ${conversationId}`);
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${userId} left room ${conversationId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { conversationId, content, media, replyTo } = data;

        if (!conversationId || !content) {
          throw new Error("Invalid message data");
        }

        const message = {
          sender: userId,
          content,
          isEdited: false,
          reactions: [],
          media: media || [],
          replyTo: replyTo || null,
          createdAt: new Date(),
        };

        this.io.to(conversationId).emit("newMessage", {
          conversationId,
          message,
        });
      } catch (error) {
        socket.emit("messageError", { error: error.message });
      }
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit("userTyping", {
        userId,
        conversationId,
        isTyping,
      });
    });

    socket.on("markAsRead", ({ conversationId }) => {
      socket.to(conversationId).emit("messagesRead", {
        userId,
        conversationId,
        timestamp: new Date(),
      });
    });
  }

  handleDisconnect(userId) {
    this.onlineUsers.delete(userId);
    this.broadcastOnlineStatus(userId, false);
  }

  // Helper methods for external use
  emitToUser(userId, event, data) {
    const socketId = this.onlineUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  emitToConversation(conversationId, event, data) {
    this.io.to(conversationId).emit(event, data);
  }

  broadcastOnlineStatus(userId, isOnline) {
    this.io.emit("userStatus", { userId, isOnline });
  }

  getOnlineUsers() {
    return Array.from(this.onlineUsers.keys());
  }

  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }
}

module.exports = SocketService;
