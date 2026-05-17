import { Job } from './Job'

export interface JobWrapper {
    job: Job & { company: { name: string; logo_url: string } };
    matchScore: number;
}
