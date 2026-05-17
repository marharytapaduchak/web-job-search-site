import { BackendService } from "./BackendService";
import { Article } from "../models/Article";

export type ArticleUpdates = Partial<Omit<Article, "id">>;

export class ArticleService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getAll(): Promise<Article[]> {
        const data = await this.backend.get<Article[]>("/articles");
        return data as Article[];
    }

    async getSaved(): Promise<Article[]> {
        const data = await this.backend.get<Article[]>("/articles?saved=true");
        return data as Article[];
    }

    async getById(id: number): Promise<Article> {
        const data = await this.backend.get<Article>(`/articles/${id}`);
        return data as Article;
    }

    async update(id: number, updates: ArticleUpdates): Promise<Article> {
        const data = await this.backend.patch<Article>(`/articles/${id}`, updates);
        return data as Article;
    }

    async save(id: number): Promise<Article> {
        return this.update(id, { saved: true });
    }

    async unsave(id: number): Promise<Article> {
        return this.update(id, { saved: false });
    }
}
