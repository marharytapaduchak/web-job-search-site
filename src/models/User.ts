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

export class User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public telegram: string,
    public linkedin: string,
    public position: string,
    public qualificationLevel: string,
    public englishLevel: string,
    public city: string,
    public salary: string,
    public hourlyRate: string,
    public portfolioUrl: string,
    public workFormat: string,
    public employmentType: string,
    public locationScope: string,
    public about: string,
    public positions: UserPosition[] = [],
    public languages: UserLanguage[] = [],
    public workFormats: string[] = [],
    public employmentTypes: string[] = [],
    public canRelocate: boolean = false,
    public resumeTitle: string = "",
    public resumeUrl: string = "",
    public resumeAddedAt: string = "",
    public certificates: UserCertificate[] = [],
  ) {}
}
