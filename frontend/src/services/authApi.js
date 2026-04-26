import api from "./api";

export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  refresh: (data) => api.post("/auth/refresh", data),
  googleLogin: () => {
    window.location.href = "http://localhost:8000/auth/google";
  },
};