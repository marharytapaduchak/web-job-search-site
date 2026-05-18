import { Job } from '../models/Job';
import { User } from '../models/User';
import { UserSkill } from '../models/UserSkill';

/**
 * Calculates a match score between a job and a user profile.
 * Max score is 100.
 * @param job The job vacancy
 * @param user The user profile
 * @param userSkills List of user's skills
 * @returns A number between 0 and 100
 */
export function calculateMatchScore(job: Job, user: User | null, userSkills: UserSkill[] = []): number {
    if (!user) return 0;

    let score = 0;

    // 1. Qualification Level (20 points)
    // Map levels to numbers for better comparison
    const levelMap: Record<string, number> = {
        'junior': 1,
        'middle': 2,
        'senior': 3,
        'lead': 4
    };

    const jobLevel = job.level?.toLowerCase() || '';
    const userLevel = user.qualificationLevel?.toLowerCase() || '';

    if (jobLevel === userLevel) {
        score += 20;
    } else if (levelMap[userLevel] > levelMap[jobLevel]) {
        // User is overqualified, still a good match but maybe less points? 
        // Let's give partial points or full if user is okay with it.
        score += 15;
    }

    // 2. English Level (10 points)
    if (job.english_level?.toLowerCase() === user.englishLevel?.toLowerCase()) {
        score += 10;
    }

    // 3. Work Format (10 points)
    const jobFormat = job.format?.toLowerCase() || '';
    const userFormat = user.workFormat?.toLowerCase() || '';
    if (jobFormat.includes(userFormat) || userFormat.includes(jobFormat)) {
        score += 10;
    }

    // 4. Employment Type (10 points)
    if (job.employment_type?.toLowerCase() === user.employmentType?.toLowerCase()) {
        score += 10;
    }

    // 5. Location (10 points)
    if (job.location?.toLowerCase() === user.city?.toLowerCase()) {
        score += 10;
    } else if (job.format?.toLowerCase().includes('віддалено') || job.format?.toLowerCase().includes('remote')) {
        // If remote, location matters less
        score += 10;
    }

    // 6. Skills overlap (40 points)
    if (job.skills && job.skills.length > 0) {
        const userSkillNames = userSkills.map(s => s.name.toLowerCase());
        const matchedSkills = job.skills.filter(jobSkill => 
            userSkillNames.some(userSkill => 
                userSkill.includes(jobSkill.toLowerCase()) || 
                jobSkill.toLowerCase().includes(userSkill)
            )
        );
        const skillPercentage = matchedSkills.length / job.skills.length;
        score += Math.round(skillPercentage * 40);
    } else {
        // No skills required in job description, don't penalize
        score += 40;
    }

    return Math.min(100, Math.round(score));
}
