import { BackendService } from "./BackendService";
import type { Job } from "../models/Job";

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
        return data.map(item => ({
            id: item.id,
            title: item.title,
            company_id: item.company_id,
            salary: parseFloat(item.salary),
            level: item.level,
            format: item.format,
            employment_type: item.employment_type,
            location: item.location,
            english_level: item.english_level,
            description: item.description,
            work_conditions: item.work_conditions.split(',').map(s => s.trim()),
            skills: item.skills,
            benefits: item.benefits,
            num_views: item.num_views,
            date_added: new Date(item.date_added),
            tags: [],
        }));
    }

    async getById(id: number): Promise<Job> {
        const data = await this.backend.get<JobApiResponse>(`/api/job/${id}`);
        return {
            id: data.id,
            title: data.title,
            company_id: data.company_id,
            salary: parseFloat(data.salary),
            level: data.level,
            format: data.format,
            employment_type: data.employment_type,
            location: data.location,
            english_level: data.english_level,
            description: data.description,
            work_conditions: data.work_conditions.split(',').map(s => s.trim()),
            skills: data.skills,
            benefits: data.benefits,
            num_views: data.num_views,
            date_added: new Date(data.date_added),
            tags: [],
        };
    }
}
