import {Job} from './Job'

export interface JobWrapper {
    job: Job;
    matchScore: number;
}
