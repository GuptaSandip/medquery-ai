import api from "./api";

export const adminApi = {
  getStats:           ()       => api.get("/admin/stats"),
  getAllUsers:         ()       => api.get("/admin/users"),
  deleteUser:         (id)     => api.delete(`/admin/users/${id}`),
  uploadSharedDoc:    (formData) => api.post("/admin/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};