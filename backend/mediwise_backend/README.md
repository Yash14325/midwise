# MediWise Backend — Setup Guide

## Stack
- Django 4.2 + Django REST Framework
- SQLite (local storage — no Supabase needed)
- scikit-learn for ML predictions (rule-based fallback if no model trained)
- pytesseract for OCR (optional — demo mode if not installed)

---

## Quick Start

### 1. Create virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Apply migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create a superuser (optional, for /admin panel)
```bash
python manage.py createsuperuser
```

### 5. Run the server
```bash
python manage.py runserver
```

API is now running at: http://localhost:8000/api/

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register/ | Register new user |
| POST | /api/auth/login/ | Login |
| POST | /api/auth/logout/ | Logout |
| GET | /api/auth/me/ | Get current user |
| GET | /api/profile/ | Get profile |
| POST | /api/profile/create/ | Create/update profile |
| PUT | /api/profile/update/ | Update profile |
| POST | /api/symptoms/predict/ | Predict disease from symptoms |
| GET | /api/symptoms/list/ | Get all available symptoms |
| GET | /api/history/ | List symptom check history |
| GET | /api/history/:id/ | Get single check |
| DELETE | /api/history/:id/delete/ | Delete a check |
| POST | /api/prescriptions/scan/ | Upload & scan prescription |
| GET | /api/prescriptions/ | List prescriptions |
| GET | /api/prescriptions/:id/ | Get prescription detail |

---

## Symptom Predict — Request Body
```json
{
  "symptoms": ["fever", "headache", "body_ache"],
  "severity": 7,
  "duration_days": 3,
  "age": 25,
  "notes": "Started after getting wet in rain"
}
```

---

## ML Model (Optional)

The app ships with a **rule-based engine** that works without training.

To train the RandomForest model:
1. Place your `symptom_disease_dataset.csv` in `symptoms/ml/`
2. Run:
```bash
cd symptoms/ml
python train_model.py
```
3. Restart the server — it will auto-load `model.pkl`.

---

## OCR (Optional)

Install Tesseract:
- Ubuntu: `sudo apt install tesseract-ocr`
- Windows: https://github.com/UB-Mannheim/tesseract/wiki

Without Tesseract, the prescription scanner runs in **demo mode** and returns sample data.

---

## Frontend .env
```
VITE_API_BASE_URL=http://localhost:8000/api
```

> ⚠️ This tool provides informational suggestions only. Always consult a qualified healthcare provider.
