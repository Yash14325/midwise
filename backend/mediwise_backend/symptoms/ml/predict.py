"""
predict.py — MediWise ML Prediction Engine

Uses a trained RandomForest model if available (model.pkl / mlb.pkl).
Falls back to a rule-based engine if no model is trained yet,
so the app works right out of the box.
"""

import os
import json
import numpy as np

# Try to load trained model
_model = None
_mlb = None

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

def _load_model():
    global _model, _mlb
    try:
        import joblib
        _model = joblib.load(os.path.join(MODEL_DIR, 'model.pkl'))
        _mlb = joblib.load(os.path.join(MODEL_DIR, 'mlb.pkl'))
        print("[MediWise] ML model loaded successfully.")
    except Exception as e:
        print(f"[MediWise] No trained model found, using rule-based engine. ({e})")
        _model = None
        _mlb = None


_load_model()

# ── Rule-based knowledge base ──────────────────────────────────────────────────

DISEASE_RULES = {
    "Viral Fever": {
        "symptoms": {"fever", "headache", "body_ache", "fatigue", "chills", "loss_of_appetite"},
        "min_match": 3,
        "tablets": [
            {"name": "Paracetamol", "dosage": "500mg", "frequency": "Every 6 hours"},
            {"name": "Cetirizine", "dosage": "10mg", "frequency": "Once at night"},
        ],
        "home_remedies": [
            "Drink warm fluids (ginger tea, turmeric milk)",
            "Rest for 2-3 days, avoid cold exposure",
            "Steam inhalation twice daily",
            "Keep forehead cool with a wet cloth",
        ],
        "doctor_recommendation": "Consult a General Physician if symptoms persist beyond 3 days or temperature exceeds 103°F.",
        "emergency_diseases": False,
    },
    "Common Cold": {
        "symptoms": {"runny_nose", "sore_throat", "cough", "sneezing", "headache", "fatigue"},
        "min_match": 3,
        "tablets": [
            {"name": "Cetirizine", "dosage": "10mg", "frequency": "Once daily"},
            {"name": "Paracetamol", "dosage": "500mg", "frequency": "As needed for fever/pain"},
        ],
        "home_remedies": [
            "Gargle with warm salt water twice daily",
            "Drink honey-lemon tea",
            "Steam inhalation with eucalyptus oil",
            "Stay hydrated with warm fluids",
        ],
        "doctor_recommendation": "See a doctor if symptoms last more than 10 days or worsen after initial improvement.",
        "emergency_diseases": False,
    },
    "Influenza": {
        "symptoms": {"fever", "body_ache", "headache", "fatigue", "chills", "cough", "sore_throat"},
        "min_match": 4,
        "tablets": [
            {"name": "Paracetamol", "dosage": "500mg-1g", "frequency": "Every 6 hours"},
            {"name": "Oseltamivir (Tamiflu)", "dosage": "75mg", "frequency": "Twice daily for 5 days (prescription needed)"},
        ],
        "home_remedies": [
            "Complete bed rest for at least 3-5 days",
            "Stay well hydrated",
            "Use a humidifier if available",
            "Warm chicken soup helps with congestion",
        ],
        "doctor_recommendation": "Seek medical attention promptly — antiviral medication is most effective within first 48 hours.",
        "emergency_diseases": False,
    },
    "Gastroenteritis": {
        "symptoms": {"nausea", "vomiting", "diarrhea", "abdominal_pain", "fever", "fatigue"},
        "min_match": 3,
        "tablets": [
            {"name": "ORS (Oral Rehydration Salts)", "dosage": "1 sachet per loose stool", "frequency": "After every loose motion"},
            {"name": "Domperidone", "dosage": "10mg", "frequency": "Before meals"},
            {"name": "Metronidazole", "dosage": "400mg", "frequency": "Thrice daily (prescription needed)"},
        ],
        "home_remedies": [
            "Stay hydrated with ORS, coconut water, or clear broth",
            "Follow a BRAT diet (Bananas, Rice, Applesauce, Toast)",
            "Avoid dairy, fatty, or spicy foods",
            "Rest and avoid strenuous activity",
        ],
        "doctor_recommendation": "See a doctor if vomiting/diarrhea persists beyond 48 hours or if there are signs of severe dehydration.",
        "emergency_diseases": False,
    },
    "Migraine": {
        "symptoms": {"headache", "nausea", "vomiting", "dizziness", "sensitivity_to_light"},
        "min_match": 3,
        "tablets": [
            {"name": "Ibuprofen", "dosage": "400mg", "frequency": "As needed (max 3x daily)"},
            {"name": "Sumatriptan", "dosage": "50mg", "frequency": "At onset of migraine (prescription needed)"},
        ],
        "home_remedies": [
            "Rest in a dark, quiet room",
            "Apply cold or warm compress on the forehead",
            "Stay hydrated",
            "Avoid screen time and bright lights",
        ],
        "doctor_recommendation": "Consult a neurologist if migraines occur more than 4 times per month.",
        "emergency_diseases": False,
    },
    "Hypertension Episode": {
        "symptoms": {"headache", "dizziness", "chest_pain", "shortness_of_breath", "blurred_vision"},
        "min_match": 3,
        "tablets": [
            {"name": "Amlodipine", "dosage": "5mg", "frequency": "Once daily (prescription required)"},
        ],
        "home_remedies": [
            "Sit or lie down immediately and rest",
            "Breathe slowly and deeply",
            "Avoid caffeine and stress",
            "Monitor blood pressure regularly",
        ],
        "doctor_recommendation": "Seek immediate medical care if BP is above 180/120 or if you have chest pain/vision changes.",
        "emergency_diseases": True,
    },
    "Allergic Reaction": {
        "symptoms": {"rash", "itching", "swelling", "runny_nose", "sneezing", "watery_eyes"},
        "min_match": 3,
        "tablets": [
            {"name": "Cetirizine", "dosage": "10mg", "frequency": "Once daily"},
            {"name": "Hydrocortisone cream", "dosage": "Apply thin layer", "frequency": "Twice daily on affected area"},
        ],
        "home_remedies": [
            "Identify and avoid the allergen",
            "Apply cold compress to reduce swelling/itching",
            "Keep the affected area clean",
            "Wear loose, breathable clothing",
        ],
        "doctor_recommendation": "Go to emergency immediately if you experience throat swelling or difficulty breathing (anaphylaxis).",
        "emergency_diseases": False,
    },
    "Urinary Tract Infection (UTI)": {
        "symptoms": {"painful_urination", "frequent_urination", "abdominal_pain", "fever", "fatigue"},
        "min_match": 3,
        "tablets": [
            {"name": "Nitrofurantoin", "dosage": "100mg", "frequency": "Twice daily for 5 days (prescription needed)"},
            {"name": "Phenazopyridine", "dosage": "200mg", "frequency": "Thrice daily for pain relief"},
        ],
        "home_remedies": [
            "Drink at least 2-3 litres of water daily",
            "Unsweetened cranberry juice may help",
            "Urinate frequently, do not hold it",
            "Maintain good hygiene",
        ],
        "doctor_recommendation": "See a doctor within 24-48 hours — antibiotics are required. If you have back/flank pain with fever, go to the ER.",
        "emergency_diseases": False,
    },
    "Diabetes Symptoms": {
        "symptoms": {"frequent_urination", "excessive_thirst", "fatigue", "blurred_vision", "weight_loss", "slow_healing"},
        "min_match": 3,
        "tablets": [
            {"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily with meals (prescription required)"},
        ],
        "home_remedies": [
            "Monitor blood sugar levels regularly",
            "Follow a low-sugar, low-carb diet",
            "Exercise 30 minutes daily",
            "Stay hydrated with water",
        ],
        "doctor_recommendation": "Consult an endocrinologist or physician immediately. Diabetes requires proper diagnosis and a long-term management plan.",
        "emergency_diseases": False,
    },
    "Asthma Attack": {
        "symptoms": {"shortness_of_breath", "wheezing", "chest_tightness", "cough", "fatigue"},
        "min_match": 3,
        "tablets": [
            {"name": "Salbutamol Inhaler", "dosage": "2 puffs", "frequency": "As needed during attack (prescription required)"},
            {"name": "Montelukast", "dosage": "10mg", "frequency": "Once daily (for prevention, prescription required)"},
        ],
        "home_remedies": [
            "Sit upright and stay calm",
            "Use prescribed rescue inhaler immediately",
            "Move away from triggers (dust, smoke, allergens)",
            "Breathe slowly through pursed lips",
        ],
        "doctor_recommendation": "Seek emergency care immediately if breathing does not improve after inhaler use.",
        "emergency_diseases": True,
    },
}

EMERGENCY_DISEASES = {"Heart Attack", "Stroke", "Sepsis", "Anaphylaxis", "Asthma Attack", "Hypertension Episode"}


def _severity_label(severity: int) -> str:
    if severity <= 3:
        return "Mild"
    elif severity <= 6:
        return "Moderate"
    elif severity <= 8:
        return "Severe"
    return "Critical"


def _rule_based_predict(symptoms: list, severity: int, age: int, duration_days: int) -> dict:
    symptom_set = set(symptoms)
    scores = {}

    for disease, rule in DISEASE_RULES.items():
        matches = len(symptom_set & rule["symptoms"])
        if matches >= rule["min_match"]:
            # Simple scoring: match ratio + severity weight
            score = (matches / len(rule["symptoms"])) * 0.7
            score += (severity / 10) * 0.15
            score += min(duration_days / 14, 1.0) * 0.15
            scores[disease] = round(score, 3)

    if not scores:
        # Generic fallback
        scores["General Illness"] = 0.5

    sorted_diseases = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_disease, top_score = sorted_diseases[0]

    rule_data = DISEASE_RULES.get(top_disease, {})

    all_predictions = [{"disease": d, "confidence": s} for d, s in sorted_diseases[:5]]

    return {
        "primary_prediction": top_disease,
        "confidence": top_score,
        "all_predictions": all_predictions,
        "severity_label": _severity_label(severity),
        "recommended_tablets": rule_data.get("tablets", []),
        "home_remedies": rule_data.get("home_remedies", [
            "Rest well and stay hydrated",
            "Monitor your symptoms closely",
            "Eat light, nutritious food",
        ]),
        "doctor_recommendation": rule_data.get(
            "doctor_recommendation",
            "Consult a General Physician if symptoms persist beyond 3 days or worsen significantly."
        ),
        "emergency_flag": (severity >= 9) or (top_disease in EMERGENCY_DISEASES),
    }


def _ml_predict(symptoms: list, severity: int, age: int, duration_days: int) -> dict:
    """Use trained sklearn model if loaded."""
    age_group = 0 if age <= 12 else (1 if age <= 17 else (2 if age <= 59 else 3))
    symptom_vector = _mlb.transform([symptoms])
    meta = np.array([[severity, age_group, duration_days]])
    X = np.hstack([symptom_vector, meta])

    proba = _model.predict_proba(X)[0]
    classes = _model.classes_
    top_indices = proba.argsort()[::-1][:5]

    top_disease = classes[top_indices[0]]
    top_score = float(proba[top_indices[0]])

    all_predictions = [
        {"disease": classes[i], "confidence": round(float(proba[i]), 3)}
        for i in top_indices
    ]

    rule_data = DISEASE_RULES.get(top_disease, {})

    return {
        "primary_prediction": top_disease,
        "confidence": round(top_score, 3),
        "all_predictions": all_predictions,
        "severity_label": _severity_label(severity),
        "recommended_tablets": rule_data.get("tablets", []),
        "home_remedies": rule_data.get("home_remedies", [
            "Rest well and stay hydrated",
            "Monitor your symptoms closely",
        ]),
        "doctor_recommendation": rule_data.get(
            "doctor_recommendation",
            "Consult a General Physician if symptoms persist beyond 3 days."
        ),
        "emergency_flag": (severity >= 9) or (top_disease in EMERGENCY_DISEASES),
    }


def predict(symptoms: list, severity: int, age: int, duration_days: int) -> dict:
    """
    Main prediction entry point.
    Uses ML model if trained, otherwise falls back to rule-based engine.
    """
    if _model is not None and _mlb is not None:
        return _ml_predict(symptoms, severity, age, duration_days)
    return _rule_based_predict(symptoms, severity, age, duration_days)


# ── Available symptoms list (for frontend /api/symptoms/list/) ─────────────────

AVAILABLE_SYMPTOMS = {
    "Head & Neurological": [
        "headache", "dizziness", "confusion", "memory_loss", "blurred_vision",
        "sensitivity_to_light", "fainting",
    ],
    "Respiratory": [
        "cough", "shortness_of_breath", "runny_nose", "sore_throat",
        "sneezing", "wheezing", "chest_tightness",
    ],
    "Digestive": [
        "nausea", "vomiting", "diarrhea", "abdominal_pain", "bloating",
        "constipation", "heartburn", "loss_of_appetite",
    ],
    "Musculoskeletal": [
        "body_ache", "joint_pain", "back_pain", "muscle_weakness",
        "muscle_cramps", "stiffness",
    ],
    "Skin": [
        "rash", "itching", "swelling", "jaundice", "pale_skin",
        "bruising", "slow_healing",
    ],
    "Urinary": [
        "frequent_urination", "painful_urination", "blood_in_urine", "dark_urine",
    ],
    "General / Systemic": [
        "fever", "fatigue", "chills", "weight_loss", "weight_gain",
        "excessive_thirst", "night_sweats", "watery_eyes",
    ],
    "Cardiovascular": [
        "chest_pain", "palpitations", "rapid_heartbeat", "leg_swelling",
    ],
}
