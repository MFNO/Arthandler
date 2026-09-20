import axios from "axios";
import type { AxiosInstance } from "axios";
import { getToken } from "./auth";

const withAuth = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return client;
};

export const projectsApi = withAuth(
  axios.create({ baseURL: import.meta.env.VITE_APP_PROJECTS_API_URL }),
);

export const usersApi = withAuth(
  axios.create({ baseURL: import.meta.env.VITE_APP_USERS_API_URL }),
);
