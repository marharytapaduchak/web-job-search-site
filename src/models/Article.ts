export class Article {
    id: number;
    title: string;
    content: string;
    saved: boolean;

    constructor(
        id: number,
        title: string,
        content: string,
        saved: boolean,
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.saved = saved;
    }
}