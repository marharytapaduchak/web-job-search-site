export class Company {
    id: number;
    name: string;
    logoURL: string;
    location: string;
    description: string;

    constructor(id: number, name: string, logoURL: string, location: string, description: string) {
        this.id = id,
        this.name = name;
        this.logoURL = logoURL;
        this.location = location;
        this.description = description;
    }
}
