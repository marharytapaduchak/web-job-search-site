export interface UserPosition {
  id: number | string;
  title: string;
  qualificationLevel: string;
}

export interface UserLanguage {
  id: number | string;
  name: string;
  level: string;
}

export interface UserCertificate {
  id: number | string;
  title: string;
  url: string;
  addedAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegram: string;
  linkedin: string;
  position: string;
  qualificationLevel: string;
  englishLevel: string;
  city: string;
  salary: string;
  hourlyRate: string;
  portfolioUrl: string;
  workFormat: string;
  employmentType: string;
  locationScope: string;
  about: string;
  positions?: UserPosition[];
  languages?: UserLanguage[];
  workFormats?: string[];
  employmentTypes?: string[];
  canRelocate?: boolean;
  resumeTitle?: string;
  resumeUrl?: string;
  resumeAddedAt?: string;
  certificates?: UserCertificate[];
  avatarStyle?: string;
  avatarSeed?: string;
}
