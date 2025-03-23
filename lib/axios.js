// src/lib/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL của API
  timeout: 10000, // Thời gian chờ tối đa cho mỗi request
});

export default instance;
