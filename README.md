# Workshop Job Tracker

A full-stack web application for managing fabrication and workshop jobs.

## Live Project

Frontend:  
https://gwapp187.github.io/workshop-/

Backend API:  
https://workshop-job-tracker-api.onrender.com

## About the Project

I built this project because I work in welding and fabrication and wanted to create something based on a real problem I understand.

The app is designed to make it easier to keep track of workshop jobs, materials, quantities, deadlines and job progress.

I started with a simple front-end version using browser storage, then developed it further by adding a Node.js and Express backend with a PostgreSQL database.

## Features

- Add new workshop jobs
- Edit existing jobs
- Delete jobs
- Track job status
- Record materials
- Record quantities
- Add due dates
- Store jobs in a PostgreSQL database
- Access the same job data from different devices
- Responsive design for mobile and desktop

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Fetch API
- GitHub Pages

### Backend
- Node.js
- Express
- REST API
- CORS

### Database
- PostgreSQL

### Deployment
- GitHub
- GitHub Pages
- Render

## How It Works

The frontend sends requests to the Express API hosted on Render.

The API handles creating, reading, updating and deleting workshop jobs.

The job data is stored permanently in a PostgreSQL database rather than being stored only in the user's browser.

## API Endpoints

```text
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
