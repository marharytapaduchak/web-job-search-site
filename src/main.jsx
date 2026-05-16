import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ServicesContext } from './services/ServicesContext';
import { BackendService } from './services/BackendService';
import { ArticleService } from './services/ArticleService';
import { ProfileService } from './services/ProfileService';
import { JobService } from './services/JobService';
import { CompanyService } from './services/CompanyService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const CURRENT_USER_ID = 1;

const backend = new BackendService(API_BASE_URL);
const services = {
  articleService: new ArticleService(backend),
  profileService: new ProfileService(backend, CURRENT_USER_ID),
  jobService: new JobService(backend),
  companyService: new CompanyService(backend),
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ServicesContext.Provider value={services}>
        <App />
      </ServicesContext.Provider>
    </BrowserRouter>
  </React.StrictMode>
);
