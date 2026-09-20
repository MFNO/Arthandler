import axios from "axios";
import { getToken } from "./auth";

export const projectsApi = axios.create({
  baseURL: import.meta.env.VITE_APP_PROJECTS_API_URL,
});

export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_APP_USERS_API_URL,
});

projectsApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
