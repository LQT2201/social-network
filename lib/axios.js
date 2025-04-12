// src/lib/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Add request interceptor to include x-client-id header
instance.interceptors.request.use((config) => {
  const clientId = localStorage.getItem("x-client-id");
  const accessToken = localStorage.getItem("accessToken");
  if (clientId) {
    config.headers["x-client-id"] = clientId;
  }
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export default instance;
