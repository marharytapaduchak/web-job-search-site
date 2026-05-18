import express, { Request, Response } from 'express';
import { Job } from '../models/Job';

const app = express();
const PORT = 3000;

app.get('/jobs/get-all', async (_, res: Response) => {
    try {
        const response = await fetch('...');

        if (!response.ok) {
            res.status(response.status).json({
                success: false,
                message: `External API error: ${response.statusText}`
            });
            return;
        }

        const jobs: Job[] = await response.json() as Job[];
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
