import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL : "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
  login: (email, password) =>
    api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
};

export const requestsAPI = {
  getMyRequests: (status = null) =>
    api.get("/requests/", { params: status ? { status } : {} }),
  createRequest: (type_access, reason, priority = "normal") =>
    api.post("/requests/new", { type_access, reason, priority }),
  getRequest: (id) => api.get(`/requests/${id}`),
  cancelRequest: (id) => api.delete(`/requests/${id}`),
};

export const adminAPI = {
  getAllRequests: (filters = {}) =>
    api.get("/admin/requests", { params: filters }),
  getStats: () => api.get("/admin/requests/stats"),
  approve: (id, comment = "") =>
    api.patch(`/admin/requests/${id}/approve`, { comment }),
  reject: (id, comment = "") =>
    api.patch(`/admin/requests/${id}/reject`, { comment }),
  getLogs: (id) => api.get(`/admin/requests/${id}/logs`),

  // ← nouveau : gestion des comptes utilisateurs
  getPendingUsers: () => api.get("/admin/users/pending"),
  approveUser: (id) => api.patch(`/admin/users/${id}/approve`),
  rejectUser: (id) => api.delete(`/admin/users/${id}/reject`),
};

export const saveToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");
export const getToken = () => localStorage.getItem("token");

export default api;



export const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};