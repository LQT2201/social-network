const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối MongoDB
connectDB();

// Cấu hình CORS
app.use(cors());

// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes/index.js");
app.use("", routes);

// Chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
