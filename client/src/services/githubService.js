import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/github",
  timeout: 15000,
});

export const fetchUser = (username) => api.get(`/${username}`);
export const fetchRepos = (username, sort = "updated", page = 1) =>
  api.get(`/${username}/repos`, { params: { sort, page } });
