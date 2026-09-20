import axios from "axios";

export const projectsApi = axios.create({
  baseURL: import.meta.env.VITE_APP_PROJECTS_API_URL,
});

export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_APP_USERS_API_URL,
});
