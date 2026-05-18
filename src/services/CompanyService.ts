import { BackendService } from "./BackendService";
import type { Company } from "../models/Company";

export class CompanyService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getById(id: number): Promise<Company> {
        const data = await this.backend.get<Company>(`/company/${id}`);
        return data as Company;
    }
}
