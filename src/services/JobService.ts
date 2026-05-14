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
  work_conditions: string[] | string;
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
    const data = await this.backend.get<JobApiResponse[]>("/jobs");

    return data.map((item) => this.mapToJob(item));
  }

  async getById(id: number): Promise<Job> {
    const item = await this.backend.get<JobApiResponse>(`/jobs/${id}`);

    return this.mapToJob(item);
  }

  private mapToJob(item: JobApiResponse): Job {
    return new Job(
      item.id,
      item.title,
      item.company_id,
      Number(item.salary),
      item.level,
      item.format,
      item.employment_type,
      item.location,
      item.english_level,
      item.description,
      Array.isArray(item.work_conditions)
        ? item.work_conditions
        : item.work_conditions.split(",").map((value) => value.trim()),
      item.skills,
      item.benefits,
      item.num_views,
      new Date(item.date_added),
    );
  }
}