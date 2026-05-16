import { BackendService } from "./BackendService";
import { ArticleService } from "./ArticleService";
import { ProfileService } from "./ProfileService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const backend = new BackendService(API_BASE_URL);

export const CURRENT_USER_ID = 1;

export const articleService = new ArticleService(backend);
export const profileService = new ProfileService(backend, CURRENT_USER_ID);
