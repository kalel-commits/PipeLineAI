# CI/CD Failure Prediction System Backend

This is the FastAPI backend for the CI/CD Failure Prediction System. It provides APIs for authentication, dataset management, ML model training, prediction, logging, and admin operations.

## Setup (Development)

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables (see .env.example).
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## Docker

Build and run with Docker Compose (recommended):
```bash
docker-compose -f ../docker/docker-compose.yml up --build
```

## Features
- JWT authentication (bcrypt, strong password, session timeout, account lock, RBAC)
- Dataset upload, cleaning, preprocessing
- ML model training, prediction, metrics
- Logging and admin endpoints
- Swagger docs at `/docs`

## Folder Structure
- `main.py`: FastAPI entrypoint
- `models/`: SQLAlchemy models
- `routes/`: API endpoints
- `services/`: Business logic
- `ml/`: ML pipeline and utilities
- `utils/`: Helpers (security, validation, etc.)

## Testing
```bash
pytest
```

---
See project root README for full-stack setup.
