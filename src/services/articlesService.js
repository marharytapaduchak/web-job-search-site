import { BackendService } from "./BackendService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const backend = new BackendService(API_BASE_URL);

export function getAllArticles() {
  return backend.get("/articles");
}

export function getSavedArticles() {
  return backend.get("/articles?saved=true");
}

export function getArticleById(id) {
  return backend.get(`/articles/${id}`);
}

export function updateArticle(id, updates) {
  return backend.patch(`/articles/${id}`, updates);
}

export function saveArticle(id) {
  return updateArticle(id, { saved: true });
}

export function unsaveArticle(id) {
  return updateArticle(id, { saved: false });
}