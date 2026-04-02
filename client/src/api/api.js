import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Laptops ----
export const fetchLaptops = (params) => API.get("/laptops", { params });
export const fetchLaptopById = (id) => API.get(`/laptops/${id}`);
export const fetchRecommendations = (id) =>
  API.get(`/laptops/${id}/recommendations`);

// ---- Auth ----
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getProfile = () => API.get("/auth/profile");

// ---- Reviews ----
export const addReview = (data) => API.post("/reviews", data);
export const getReviews = (laptopId) => API.get(`/reviews/${laptopId}`);

// ---- Chatbot ----
export const chatbotQuery = (message) => API.post("/chatbot", { message });

export default API;
