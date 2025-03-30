import axios from "@/lib/axios";

export const AuthService = {
  async register(userData) {
    const response = await axios.post("/auth/signup", userData);
    this.setTokens(response.data.metadata.tokens);
    return response.data.metadata;
  },

  async login(credentials) {
    const response = await axios.post("/auth/signin", credentials);
    this.setTokens(response.data.metadata.tokens);
    return response.data.metadata;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post("/auth/handlerefreshtoken", {
      refreshToken,
    });
    this.setTokens(response.data.metadata.tokens);
    return response.data.metadata;
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("x-client-id");
  },

  setTokens(tokens) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },

  getTokens() {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};
