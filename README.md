# CI/CD Failure Prediction System

## Overview
A full-stack, production-style academic project for predicting CI/CD pipeline failures using machine learning. Features:
- FastAPI backend, React frontend, PostgreSQL (or SQLite for dev), Dockerized
- JWT authentication, RBAC, secure password policy, session timeout, account lock
- Dataset upload, schema validation, cleaning, preprocessing, feature extraction
- ML module: Logistic Regression, Random Forest, Decision Tree, metrics, model comparison
- Dashboards: Developer (full ML lifecycle), Analyst (deep model comparison), Admin (user/audit/system monitoring)
- Audit logging, system analytics, exportable reports
- Responsive, modular UI with charts and tables

## Setup
1. Clone repo and install dependencies:
   ```bash
   python -m pip install -r backend/requirements.txt
   cd frontend && npm install
   ```
2. Configure environment variables (see backend/.env.example)
3. Run with Docker Compose:
   ```bash
   docker-compose -f docker/docker-compose.yml up --build
   ```
4. Access:
   - Backend API: http://localhost:8000/docs
   - Frontend: http://localhost:3000

## Testing
- Backend: `pytest backend/tests`
- Frontend: `npm test` in `frontend/`

## Documentation
- API docs: `/docs` (Swagger UI)
- See code comments and modular structure for details

## Security & Compliance
- All sensitive actions logged, RBAC enforced, strong password policy, session management, encrypted storage

## Authors
- Replace with your names and details

---
For academic evaluation and viva. See each module README for details.
