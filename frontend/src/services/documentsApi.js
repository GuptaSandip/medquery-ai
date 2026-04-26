import api from "./api";

export const documentsApi = {
  uploadDocument: (formData) =>
    api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),

  getMyDocuments: () => api.get("/documents/my"),

  getSharedDocuments: () => api.get("/documents/shared"),

  deleteDocument: (id) => api.delete(`/documents/${id}`),
};