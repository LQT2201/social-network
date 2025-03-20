const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
const passport = require("passport");
const session = require("express-session");

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

// Routes
const routes = require("./routes/index.js");
app.use("", routes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
