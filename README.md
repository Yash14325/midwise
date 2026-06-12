# MediWise

MediWise is a full-stack health support web app that helps users track symptoms, get AI-assisted guidance, scan prescriptions, and review their health history. The project combines a React + Vite frontend with a Django REST API backend.

## Features
- User authentication and profile setup
- Symptom checking with severity and duration input
- AI assistant support for general health guidance
- Prescription scanning workflow
- History tracking for previous symptom checks

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Django, Django REST Framework, SQLite
- Optional AI support: Anthropic API key for richer assistant responses

## Prerequisites
- Python 3.10+ or 3.11+
- Node.js 18+
- npm or yarn

## 1) Clone and enter the project
```bash
git clone <your-github-repo-url>
cd mediwise
```

## 2) Backend setup
```bash
cd backend/mediwise_backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

Optional:
```bash
python manage.py createsuperuser
```

Run the backend:
```bash
python manage.py runserver 127.0.0.1:8000
```

## 3) Frontend setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:
```text
http://127.0.0.1:5173/
```

## 4) Optional AI assistant setup
If you want richer AI responses, set an environment variable in the backend shell:
```bash
set ANTHROPIC_API_KEY=your_api_key_here
```

If no key is provided, the assistant will use a safe local fallback response.

## Project Structure
```text
backend/mediwise_backend/   # Django backend
frontend/                   # React frontend
```

## Useful commands

Backend checks:
```bash
python manage.py check
```

Frontend build:
```bash
npm run build
```

## GitHub push commands
If this is a new repository, run:
```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mediwise.git
git push -u origin main
```

If you already have a GitHub repository connected, use:
```bash
git add .
git commit -m "Update README and project setup"
git push origin main
```

## Notes
This project is intended for local development and demonstration use. For production deployment, additional security, environment, and hosting configuration are recommended.
