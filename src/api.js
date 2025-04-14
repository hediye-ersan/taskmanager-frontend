import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Token'ı localStorage'dan alıp header'a ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // veya sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
