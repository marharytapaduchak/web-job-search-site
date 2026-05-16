import { BackendService } from "./BackendService";
import { Job } from "../models/Job";

interface JobApiResponse {
    id: number;
    title: string;
    company_id: number;
    salary: string;
    level: string;
    format: string;
    employment_type: string;
    location: string;
    english_level: string;
    description: string;
    work_conditions: string;
    skills: string[];
    benefits: string[];
    num_views: number;
    date_added: string;
}

export class JobService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async getAll(): Promise<Job[]> {
        const data = await this.backend.get<JobApiResponse[]>(`/api/job`);
        return data.map(item => new Job(
            item.id,
            item.title,
            item.company_id,
            parseFloat(item.salary),
            item.level,
            item.format,
            item.employment_type,
            item.location,
            item.english_level,
            item.description,
            item.work_conditions.split(',').map(s => s.trim()),
            item.skills,
            item.benefits,
            item.num_views,
            new Date(item.date_added),
        ));
    }

    async getById(id: number): Promise<Job> {
        const data = await this.backend.get<JobApiResponse>(`/api/job/${id}`);
        return new Job(
            data.id,
            data.title,
            data.company_id,
            parseFloat(data.salary),
            data.level,
            data.format,
            data.employment_type,
            data.location,
            data.english_level,
            data.description,
            data.work_conditions.split(',').map(s => s.trim()),
            data.skills,
            data.benefits,
            data.num_views,
            new Date(data.date_added),
        );
    }
}
