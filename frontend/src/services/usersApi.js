import api from "./api";

export const usersApi = {
  getProfile:    ()     => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getUserStats:  ()     => api.get("/users/stats"),
};