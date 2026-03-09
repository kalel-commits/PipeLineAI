# CI/CD Failure Prediction System Frontend

This is the React frontend for the CI/CD Failure Prediction System. It provides dashboards for Developers, Analysts, Admins, and Guests to interact with the backend APIs.

## Setup (Development)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

## Docker

Build and run with Docker Compose (recommended):
```bash
docker-compose -f ../docker/docker-compose.yml up --build
```

## Features
- Secure login/logout, JWT session management
- Role-based dashboards (Developer, Analyst, Admin, Guest)
- Dataset upload, model training, prediction, metrics visualization
- Model comparison, report export (PDF/CSV)
- Responsive UI with charts (confusion matrix, metrics)

## Folder Structure
- `src/components/`: UI components
- `src/pages/`: Dashboard pages
- `src/services/`: API calls
- `src/utils/`: Helpers (auth, validation, etc.)

---
See project root README for full-stack setup.
