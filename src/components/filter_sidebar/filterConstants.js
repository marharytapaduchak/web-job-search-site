export const QUAL_OPTIONS = [
    { value: 'junior', label: 'Junior' },
    { value: 'middle', label: 'Middle' },
    { value: 'senior', label: 'Senior' }
];

export const ENGLISH_OPTIONS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'pre-intermediate', label: 'Pre-intermediate' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'upper-Intermediate', label: 'Upper-Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'proficient', label: 'Proficient' }
];

export const EMPLOYMENT_TYPES = [
    { id: 'fullTime', label: 'Повна зайнятість' },
    { id: 'partTime', label: 'Часткова зайнятість' },
    { id: 'project', label: 'Проєктна робота' },
    { id: 'internship', label: 'Стажування' }
];

export const WORK_FORMATS = [
    { id: 'remote', label: 'Віддалена' },
    { id: 'hybrid', label: 'Віддалена/офіс' },
    { id: 'office', label: 'Офіс' }
];

export const INITIAL_FILTER_STATE = {
    sortBy: '',
    employmentType: { fullTime: false, partTime: false, project: false, internship: false },
    workFormat: { remote: false, hybrid: false, office: false },
    qualification: '',
    location: '',
    salary: 0,
    englishLevel: ''
};
