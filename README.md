<p align="center">
  <img src="frontend/src/assets/logo.png" alt="PipelineAI Logo" width="200" />
</p>

# 🚀 PipelineAI: Real-Time Predictive CI/CD Intelligence

**Predict failures, don't just observe them.**

PipelineAI is a predictive developer-experience layer designed for the **GitLab AI Challenge**. It bridges the gap between code commits and pipeline execution by identifying high-risk changes *before* they are pushed, saving developer time, cloud compute costs, and energy.

---

### 🏆 Winning Potential ($30,000 Target)
We are specifically architected to qualify for the following GitLab AI Hackathon prize tracks:
*   **🌿 Green Agents ($3,000)**: By preventing failing builds, PipelineAI significantly reduces redundant cloud compute energy consumption. Our real-time **Sustainability Impact** card tracks CO₂ emissions saved.
*   **🧠 Anthropic x GitLab Duo ($13,500)**: Our **AI Mentor** refactoring suggestions are powered by **Anthropic Claude**, providing human-level insights into fixing risky code.
*   **☁️ Google Cloud x GitLab ($13,500)**: Our production backend is designed for **Google Cloud Run** and utilizes **BigQuery** for high-volume behavioral data analysis.

---

### 🔥 Core Features
*   **Real-Time Risk Gauge**: Instantly see the probability of build failure (87% High Risk in Demo) based on 7 behavioral signals.
*   **Explainable AI (XAI)**: Integrated **SHAP** feature importance charts that show *why* the AI is predicting a failure (e.g., Code Churn, Midnight Factor).
*   **AI Mentor**: Sophisticated, Claude-powered refactoring advice to mitigate risks.
*   **🌱 Sustainability Tracker**: Real-time monitoring of CO₂ emissions prevented by avoiding failed cycles.
*   **Admin Command Center**: Enterprise-grade monitoring of 1,200+ users, system health, and audit logs.

---

### 💻 Local Setup
1. **Clone & Install**:
   ```bash
   python -m pip install -r backend/requirements.txt
   cd frontend && npm install
   ```
2. **Launch Developer Mode**:
   - Backend: `python -m uvicorn main:app --reload` (Port 8000)
   - Frontend: `npm start` (Port 3000)
3. **Magic Demo Toggle**: Navigate to `http://localhost:3000/dashboard?demo=high` to see the high-risk predictive model in action with full mock data.

---

### 🏗️ Technology Stack
*   **Intelligence**: Scikit-Learn (Random Forest), SHAP (XAI), Anthropic Claude
*   **Architecture**: FastAPI (Python), Create React App (Material-UI)
*   **Cloud Ecosystem**: Google Cloud, GitLab CI, Render, Vercel
*   **Data Science**: Pandas, Joblib, SQLite, BigQuery (planned)

---

### 🛡️ Security & Compliance
*   **RBAC**: Role-Based Access Control for Developer, Analyst, and Admin.
*   **Audit Logging**: Every prediction and system event is tracked for compliance.
*   **Data Privacy**: All behavioral data is processed with encryption at rest.

---
**Build Smarter. Push Greener. This is PipelineAI.**

