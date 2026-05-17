import { BackendService } from "./BackendService";
import type { Job } from "../models/Job";

export class JobService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getAll(): Promise<Job[]> {
        const data = await this.backend.get<Job[]>(`/job`);
        return data as Job[];
    }

    async getById(id: number): Promise<Job> {
        const data = await this.backend.get<Job>(`/job/${id}`);
        return data as Job;
    }
}
