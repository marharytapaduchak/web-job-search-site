import { BackendService } from "./BackendService";
import { Company } from "../models/Company";

/** Raw JSON shape returned by GET /api/company/:id. Internal — not exported. */
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

    async getAll(): Promise<Company[]> {
        const data = await this.backend.get<CompanyApiResponse[]>(`/companies`);

        return data.map(item => this.mapToCompany(item));
    }

    async getById(id: number): Promise<Company> {
        const data = await this.backend.get<CompanyApiResponse>(`/companies/${id}`);

        return this.mapToCompany(data);
    }

    private mapToCompany(item: CompanyApiResponse): Company {
        return new Company(
            item.id,
            item.name,
            item.logo_url,
            item.location,
            item.description,
        );
    }
}