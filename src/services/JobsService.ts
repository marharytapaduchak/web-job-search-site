import express, { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Company } from '../models/Company';

const app = express();
const PORT = 3000;

app.get('/jobs/get-all', async (req: Request, res: Response) => {
    try {
        const response = await fetch('...');

        if (!response.ok) {
            res.status(response.status).json({
                success: false,
                message: `External API error: ${response.statusText}`
            });
            return;
        }

        const rawData = await response.json() as any[];

        const jobs: Job[] = rawData.map(item => {
            const company: Company = {
                id: item.company.id,
                name: item.company.name,
                logoURL: item.company.logo || item.company.logoURL,
                location: item.company.location,
                description: item.company.description
            };

            return {
                id: item.id,
                title: item.title,
                company: company,
                salary: item.salary,
                level: item.level,
                format: item.format,
                employment_type: item.employment_type,
                location: item.location,
                english_level: item.english_level,
                description: item.description,
                work_conditions: item.work_conditions,
                skills: item.skills,
                benefits: item.benefits,
                num_views: item.num_views,
                date_added: new Date(item.date_added),
                tags: item.tags || []
            };
        });

        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
