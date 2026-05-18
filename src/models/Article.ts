export interface Article {
    id: number;
    title: string;
    tags: string[];
    excerpt: string;
    content: string;
    views: number;
    date: string;
    saved: boolean;
}
