import { createContext, useContext } from 'react';
import type { ArticleService } from './ArticleService';
import type { ProfileService } from './ProfileService';
import type { JobService } from './JobService';
import type { CompanyService } from './CompanyService';
import type { JobApplicationService } from './JobApplicationService';

export interface Services {
  articleService: ArticleService;
  profileService: ProfileService;
  jobService: JobService;
  companyService: CompanyService;
  jobApplicationService: JobApplicationService;
}

export const ServicesContext = createContext<Services | null>(null);

export function useServices(): Services {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used within ServicesContext.Provider');
  return ctx;
}
