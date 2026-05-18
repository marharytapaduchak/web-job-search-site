import { createContext, useContext, useState } from "react";

const SavedJobsContext = createContext(null);

export const SavedJobsProvider = ({ children }) => {
    const [savedJobs, setSavedJobs] = useState([]);

    const addSavedJob = (job) => {
        setSavedJobs((prevJobs) => {
            const alreadySaved = prevJobs.some(
                (savedJob) => savedJob.id === job.id
            );

            if (alreadySaved) {
                return prevJobs;
            }

            return [...prevJobs, job];
        });
    };

    const removeSavedJob = (jobId) => {
        setSavedJobs((prevJobs) =>
            prevJobs.filter((savedJob) => savedJob.id !== jobId)
        );
    };

    const isJobSaved = (jobId) => {
        return savedJobs.some((savedJob) => savedJob.id === jobId);
    };

    const toggleSavedJob = (job) => {
        if (isJobSaved(job.id)) {
            removeSavedJob(job.id);
        } else {
            addSavedJob(job);
        }
    };

    return (
        <SavedJobsContext.Provider
            value={{
                savedJobs,
                addSavedJob,
                removeSavedJob,
                isJobSaved,
                toggleSavedJob,
            }}
        >
            {children}
        </SavedJobsContext.Provider>
    );
};

export const useSavedJobs = () => {
    const context = useContext(SavedJobsContext);

    if (!context) {
        throw new Error("useSavedJobs must be used inside SavedJobsProvider");
    }

    return context;
};