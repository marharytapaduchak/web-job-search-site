export class Job {
    id: number;
    title: string;
    company_id: number;
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

    constructor(
        id: number,
        title: string,
        company_id: number,
        salary: number,
        level: string,
        format: string,
        employment_type: string,
        location: string,
        english_level: string,
        description: string,
        work_conditions: string[],
        skills: string[],
        benefits: string[],
        num_views: number,
        date_added: Date,
    ) {
        this.id = id;
        this.title = title;
        this.company_id = company_id;
        this.salary = salary;
        this.level = level;
        this.format = format;
        this.employment_type = employment_type;
        this.location = location;
        this.english_level = english_level;
        this.description = description;
        this.work_conditions = work_conditions;
        this.skills = skills;
        this.benefits = benefits;
        this.num_views = num_views;
        this.date_added = date_added;
    }
}
