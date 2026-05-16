export class Article {
    id: number;
    title: string;
    tags: string[];
    excerpt: string;
    content: string;
    views: number;
    date: string;
    saved: boolean;

    constructor(
        id: number,
        title: string,
        tags: string[],
        excerpt: string,
        content: string,
        views: number,
        date: string,
        saved: boolean,
    ) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.excerpt = excerpt;
        this.content = content;
        this.views = views;
        this.date = date;
        this.saved = saved;
    }
}
