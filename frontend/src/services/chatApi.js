import api from "./api";

export const chatApi = {
  sendQuery: (data) => api.post("/chat/query", data),
  getHistory: ()    => api.get("/chat/history"),
  getSession: (id)  => api.get(`/chat/session/${id}`),
  clearHistory: ()  => api.delete("/chat/history"),
};