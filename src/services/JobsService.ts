import express, { Request, Response } from 'express';

import { Job } from '../models/Job';
import { Company } from '../models/Company.ts';

const app = express();
const PORT = 3000;

app.get('/jobs/get-all', async (req: Request, res: Response) => {
  try {

    const response = await fetch('...');

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `External API error: ${response.statusText}`
      });
    }

    const rawData = await response.json() as any[];

    const jobs: Job[] = rawData.map(item => {
        const company = new Company(
            item.comany.name,
            item.company.logo,
            item.company.location,
            item.company.description
        );

        return new Job(
            item.title,
            company,
            item.salary,
            item.level,
            item.format,
            item.employment_type,
            item.location,
            item.english_level,
            item.description,
            item.work_conditions,
            item.skills,
            item.benefits,
            item.num_views,
            new Date(item.date_added)
        );
    });

        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

app.listen(PORT, () => {
  console.log(`Fetch running at http://localhost:${PORT}`);
});
})
