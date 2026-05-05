import {Company} from './Company'; 

export interface Job {
    id: number;
    title: string;
    company: Company;
    salary: number;
    level: string;
    format: string;
    employment_type: string;
    location: string;
    english_level: string;
    description: string;
    work_conditions: string[];
    skills: string[];
    benefits: string[];
    num_views: number;
    date_added: Date;
    tags: string[];
}
