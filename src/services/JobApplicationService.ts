import { BackendService } from "./BackendService";
import type { JobApplication } from "../models/JobApplication";

export class JobApplicationService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getByUserId(userId: number): Promise<JobApplication[]> {
        const data = await this.backend.get<JobApplication[]>(`/applications?userId=${userId}`);
        return data as JobApplication[];
    }
}
