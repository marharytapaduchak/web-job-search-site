import { Company } from "./Company";

export class Job {
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

constructor(
    title: string,
    company: Company,
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
    this.title = title;
    this.company = company;
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
