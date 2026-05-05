import { Job } from '../../models/Job'; 
import { JobWrapper } from '../../models/JobWrapper';
import { Company } from '../../models/Company';

export const MOCK_RECOMMENDATIONS: JobWrapper[] = [
  {
    matchScore: 75,
    job: {
      id: 1,
      title: "UI / UX Designer",
      company: { 
        id: 101, 
        name: "AppFlow",
        logoURL: "https://via.placeholder.com/48",
        location: "Kyiv, Ukraine",
        description: "Innovative app development company."
      },
      salary: 15000,
      level: "Junior",
      format: "Офіс",
      employment_type: "Неповна зайнятість",
      location: "Київ",
      english_level: "Intermediate",
      description: "Mock description...",
      work_conditions: [],
      skills: [],
      benefits: [],
      num_views: 35,
      date_added: new Date('2023-09-12T10:00:00'),
      tags: ["Hot", "New"]
    }
  },
  {
    matchScore: 40,
    job: {
      id: 2,
      title: "UI / UX Designer",
      company: { 
        id: 102, 
        name: "Shop Sphere",
        logoURL: "https://via.placeholder.com/48",
        location: "Lviv, Ukraine",
        description: "E-commerce solutions provider."
      },
      salary: 20000,
      level: "Middle",
      format: "Офіс",
      employment_type: "Неповна зайнятість",
      location: "Львів",
      english_level: "Upper-Intermediate",
      description: "Mock description...",
      work_conditions: [],
      skills: [],
      benefits: [],
      num_views: 35,
      date_added: new Date('2023-09-12T10:00:00'),
      tags: ["Hot"]
    }
  },
  {
    matchScore: 32,
    job: {
      id: 3,
      title: "UI / UX Designer...",
      company: { 
        id: 103, 
        name: "BrandCraft",
        logoURL: "https://via.placeholder.com/48",
        location: "Kyiv, Ukraine",
        description: "Creative branding agency."
      },
      salary: 40000,
      level: "Middle",
      format: "Віддалено/офіс",
      employment_type: "Повна зайнятість",
      location: "Київ",
      english_level: "Advanced",
      description: "Mock description...",
      work_conditions: [],
      skills: [],
      benefits: [],
      num_views: 40,
      date_added: new Date('2023-11-12T10:00:00'),
      tags: ["Relocation"]
    }
  },
  {
    matchScore: 86,
    job: {
      id: 4,
      title: "UI / UX Designer...",
      company: { 
        id: 104, 
        name: "GameCloud",
        logoURL: "https://via.placeholder.com/48",
        location: "Dnipro, Ukraine",
        description: "Cloud gaming platform."
      },
      salary: 20000,
      level: "Junior",
      format: "Віддалено/офіс",
      employment_type: "Повна зайнятість", 
      location: "Дніпро",
      english_level: "Intermediate",
      description: "Mock description...",
      work_conditions: [],
      skills: [],
      benefits: [],
      num_views: 44,
      date_added: new Date('2023-09-01T10:00:00'),
      tags: ["Flexible"]
    }
  },
  {
    matchScore: 88,
    job: {
      id: 5,
      title: "UI / UX Designer...",
      company: { 
        id: 105, 
        name: "MedTech Innovations",
        logoURL: "https://via.placeholder.com/48",
        location: "Odesa, Ukraine",
        description: "Medical technology startup."
      },
      salary: 20000,
      level: "Middle",
      format: "Віддалено",
      employment_type: "Неповна зайнятість",
      location: "Одеса",
      english_level: "Upper-Intermediate",
      description: "Mock description...",
      work_conditions: [],
      skills: [],
      benefits: [],
      num_views: 23,
      date_added: new Date('2023-09-23T10:00:00'),
      tags: ["Part-time"]
    }
  }
];
