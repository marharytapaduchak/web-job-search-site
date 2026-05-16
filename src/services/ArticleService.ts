import { BackendService } from "./BackendService";
import { Article } from "../models/Article";

interface ArticleApiResponse {
    id: number;
    title: string;
    tags: string[];
    excerpt: string;
    content: string;
    views: number;
    date: string;
    saved: boolean;
}

export type ArticleUpdates = Partial<Omit<ArticleApiResponse, "id">>;

export class ArticleService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getAll(): Promise<Article[]> {
        const data = await this.backend.get<ArticleApiResponse[]>("/articles");
        return data.map(item => this.mapToArticle(item));
    }

    async getSaved(): Promise<Article[]> {
        const data = await this.backend.get<ArticleApiResponse[]>("/articles?saved=true");
        return data.map(item => this.mapToArticle(item));
    }

    async getById(id: number): Promise<Article> {
        const data = await this.backend.get<ArticleApiResponse>(`/articles/${id}`);
        return this.mapToArticle(data);
    }

    async update(id: number, updates: ArticleUpdates): Promise<Article> {
        const data = await this.backend.patch<ArticleApiResponse>(`/articles/${id}`, updates);
        return this.mapToArticle(data);
    }

    async save(id: number): Promise<Article> {
        return this.update(id, { saved: true });
    }

    async unsave(id: number): Promise<Article> {
        return this.update(id, { saved: false });
    }

    private mapToArticle(item: ArticleApiResponse): Article {
        return new Article(
            item.id,
            item.title,
            item.tags ?? [],
            item.excerpt ?? "",
            item.content,
            item.views ?? 0,
            item.date ?? "",
            item.saved,
        );
    }
}
