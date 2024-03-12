import { BACKEND_URL } from "../env";

// default backend
export const backendAuthAxios = axios.create({
  baseURL: BACKEND_URL,
});
