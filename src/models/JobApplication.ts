export interface JobApplication {
    id: number;
    job_id: number;
    user_id: number;
    motivation: string;
    resume_name: string;
    portfolio_name: string;
    applied_at: string;
    job_title: string;
    job_description: string;
    job_num_views: number;
    job_skills: string[];
    company_name: string;
    company_logo_url: string;
}
