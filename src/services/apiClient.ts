import { BackendService } from "./BackendService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const backend = new BackendService(API_BASE_URL);

export const CURRENT_USER_ID = 1;