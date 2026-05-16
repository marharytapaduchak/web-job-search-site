import { BackendService } from "./BackendService";
import { Company } from "../models/Company";

interface CompanyApiResponse {
    id: number;
    name: string;
    logo_url: string;
    location: string;
    description: string;
}

export class CompanyService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getById(id: number): Promise<Company> {
        const data = await this.backend.get<CompanyApiResponse>(`/api/company/${id}`);
        return new Company(data.name, data.logo_url, data.location, data.description);
    }
}
