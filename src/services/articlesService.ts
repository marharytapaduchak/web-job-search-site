import { Article } from "../models/Article";
import { BackendService } from "./BackendService";

interface ArticleApiResponse {
    id: number;
    title: string;
    content: string;
    saved: boolean;
}

export type ArticleUpdates =
    Partial<Omit<ArticleApiResponse, "id">>;

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3001";

const backend = new BackendService(API_BASE_URL);

function mapToArticle(
    item: ArticleApiResponse,
): Article {
    return new Article(
        item.id,
        item.title,
        item.content,
        item.saved,
    );
}

export function getAllArticles(): Promise<Article[]> {
  return backend.get<Article[]>("/articles");
}

export function getSavedArticles(): Promise<Article[]> {
  return backend.get<Article[]>("/articles?saved=true");
}

export function getArticleById(id: number): Promise<Article> {
  return backend.get<Article>(`/articles/${id}`);
}

export function updateArticle(id: number, updates: ArticleUpdates): Promise<Article> {
  return backend.patch<Article>(`/articles/${id}`, updates);
}

export function saveArticle(id: number): Promise<Article> {
  return updateArticle(id, { saved: true });
}

export function unsaveArticle(id: number): Promise<Article> {
  return updateArticle(id, { saved: false });
}
