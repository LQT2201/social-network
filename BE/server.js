const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
const passport = require("passport");
const session = require("express-session");
const http = require("http");
const SocketService = require("./services/socket.service");

require("dotenv").config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(handleUploadError);

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production", // Set to true in production if using HTTPS
    },
  })
);

// Initialize Passport
require("./config/passport.config");
app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Routes
const routes = require("./routes/index.js");
app.use("", routes);

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Sever Error",
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const socketService = new SocketService(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
