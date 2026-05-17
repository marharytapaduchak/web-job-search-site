export interface Job {
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
    tags?: string[];
}
