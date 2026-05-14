export class Company {
    id: number;
    name: string;
    logo: string;
    location: string;
    description: string;

    constructor(
        id: number,
        name: string,
        logo: string,
        location: string,
        description: string,
    ) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.location = location;
        this.description = description;
    }
}