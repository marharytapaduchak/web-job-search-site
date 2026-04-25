export class Company {
    name: string;
    logo: string;
    location: string;
    description: string;

    constructor(name: string, logo: string, location: string, description: string) {
        this.name = name;
        this.logo = logo;
        this.location = location;
        this.description = description;
    }
}
