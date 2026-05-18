# web-job-search-site

A full-stack job search platform that allows users to browse vacancies, manage their profile, upload resume links, receive recommendations, and interact with job-related content.

## Technologies Used

### Frontend
- [React](https://react.dev/) — UI library
- [React Router DOM](https://reactrouter.com/) — client-side routing
- Context API — global state management
- CSS Modules / custom CSS styling

### Backend
- REST API
- [Gin Framework](https://gin-gonic.com/) — Go web framework
- [PostgreSQL](https://www.postgresql.org/) — relational database

### DevOps & Tools
- [Docker](https://www.docker.com/) — containerization
- [Vite](https://vitejs.dev/) — frontend build tool
- ESLint — code linting

---

# Features

## Authentication
- User registration
- Login/logout system
- Protected routes
- Persistent session using local storage

## Profile Management
- Edit personal information
- Avatar selection system
- Resume link management
- Portfolio links
- Certificates & recommendations
- Skills and languages management
- Notification settings

## Vacancies
- Vacancy search
- Filtering by multiple parameters
- Dynamic vacancy pages
- Company information pages

## Interactive Features
- SPA navigation without page reload
- Dynamic UI updates
- Recommendation system
- Search synchronization using global state

---

# Project Architecture

## Frontend Structure

```shell
src/
├── components/
├── contexts/
├── img/
├── models/
├── pages/
├── services/
├── App.jsx
└── main.jsx
```

## Main Frontend Concepts

### Routing
Implemented with React Router DOM:
- multi-page SPA structure
- dynamic routes
- protected pages
- navigation without page reload

### State Management
- React Context API for global state
- useState for local component state
- shared search state
- reactive UI updates

### Services Layer
Frontend communicates with backend using service classes:
- ProfileService
- JobService
- CompanyService
- ArticleService
- JobApplicationService

---

# Backend

The backend is built with Go and Gin Framework.

Main backend responsibilities:
- REST API endpoints
- authentication
- profile management
- vacancies
- notifications
- recommendations
- PostgreSQL integration

---

# Database

The project uses PostgreSQL.

Example entities:
- users
- jobs
- companies
- notifications
- recommendations
- resumes
- certificates

---

# Local Development Setup

## Prerequisites

Install:
- Node.js 22
- npm
- Docker Desktop
- PostgreSQL (optional if using Docker)

---

# Installation

## 1. Clone the repository

```shell
git clone <repository-url>
cd web-job-search-site
```

## 2. Install dependencies

```shell
npm install
```

Install React Router DOM:

```shell
npm install react-router-dom
```

---

# Environment Variables

Create a `.env` file:

```shell
VITE_API_BASE_URL=http://localhost:8080/api
```

---

# Running the Project

# Build

```shell
docker compose build
```

---

## Backend

Run backend containers:

```shell
docker compose up
```

or

```shell
docker-compose up
```

---


# Useful Materials

## React
- Official guide: https://react.dev/learn
- Cheatsheet: https://devhints.io/react

## JavaScript
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction
- https://www.geeksforgeeks.org/introduction-to-javascript/

## CSS & HTML
- https://internetingishard.netlify.app/

## Git
- https://training.github.com/downloads/github-git-cheat-sheet.pdf

## TailwindCSS
- https://tailwindcss.com/docs/styling-with-utility-classes
