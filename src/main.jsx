import React, { useMemo } from 'react';
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
import { JobApplicationService } from './services/JobApplicationService';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const backend = new BackendService(API_BASE_URL);
const articleService = new ArticleService(backend);
const jobService = new JobService(backend);
const companyService = new CompanyService(backend);
const jobApplicationService = new JobApplicationService(backend);

function AppServices({ children }) {
  const { user } = useAuth();
  const services = useMemo(() => ({
    articleService,
    profileService: new ProfileService(backend, user?.id ?? 0),
    jobService,
    companyService,
    jobApplicationService,
  }), [user?.id]);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppServices>
          <SearchProvider>
            <App />
          </SearchProvider>
        </AppServices>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
