// src/lib/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// only add the interceptor in the browser
if (typeof window !== "undefined") {
  instance.interceptors.request.use(
    (config) => {
      // now it's safe to use localStorage
      const clientId = localStorage.getItem("x-client-id");
      const accessToken = localStorage.getItem("accessToken");

      if (clientId) {
        config.headers["x-client-id"] = clientId;
      }
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default instance;
