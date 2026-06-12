"""
ocr_utils.py — OCR and medicine analysis for MediWise prescriptions.

Uses pytesseract for OCR. Falls back to a simulated result if Tesseract
is not installed (so the app runs in demo mode without Tesseract).
"""

import re

# Medicine knowledge base (name → info)
MEDICINE_DB = {
    "paracetamol": {
        "name": "Paracetamol",
        "purpose": "Pain relief and fever reduction",
        "side_effects": ["Nausea", "Liver damage (overdose)", "Allergic reactions (rare)"],
        "common_brands": ["Crocin", "Dolo", "Calpol"],
    },
    "ibuprofen": {
        "name": "Ibuprofen",
        "purpose": "Anti-inflammatory, pain relief, fever reduction",
        "side_effects": ["Stomach upset", "GI bleeding (long-term use)", "Kidney issues", "Increased blood pressure"],
        "common_brands": ["Brufen", "Advil", "Nurofen"],
    },
    "amoxicillin": {
        "name": "Amoxicillin",
        "purpose": "Antibiotic — treats bacterial infections",
        "side_effects": ["Diarrhea", "Nausea", "Rash", "Allergic reaction"],
        "common_brands": ["Novamox", "Moxikind"],
    },
    "metformin": {
        "name": "Metformin",
        "purpose": "Type 2 Diabetes management — lowers blood sugar",
        "side_effects": ["Nausea", "Diarrhea", "Stomach upset", "Lactic acidosis (rare)"],
        "common_brands": ["Glycomet", "Glucophage"],
    },
    "cetirizine": {
        "name": "Cetirizine",
        "purpose": "Antihistamine — treats allergies, hay fever, urticaria",
        "side_effects": ["Drowsiness", "Dry mouth", "Headache"],
        "common_brands": ["Zyrtec", "Alerid", "Okacet"],
    },
    "omeprazole": {
        "name": "Omeprazole",
        "purpose": "Reduces stomach acid — treats GERD, ulcers",
        "side_effects": ["Headache", "Diarrhea", "Nausea", "Bone fractures (long-term)"],
        "common_brands": ["Omez", "Prilosec"],
    },
    "azithromycin": {
        "name": "Azithromycin",
        "purpose": "Antibiotic — treats respiratory and other bacterial infections",
        "side_effects": ["Nausea", "Diarrhea", "Stomach pain", "Cardiac arrhythmia (rare)"],
        "common_brands": ["Azithral", "Zithromax"],
    },
    "amlodipine": {
        "name": "Amlodipine",
        "purpose": "Calcium channel blocker — treats hypertension and angina",
        "side_effects": ["Swelling in ankles", "Headache", "Flushing", "Dizziness"],
        "common_brands": ["Amlip", "Norvasc"],
    },
    "metronidazole": {
        "name": "Metronidazole",
        "purpose": "Antibiotic/antiprotozoal — treats bacterial and parasitic infections",
        "side_effects": ["Nausea", "Metallic taste", "Headache", "Dizziness"],
        "common_brands": ["Flagyl", "Metrogyl"],
    },
    "pantoprazole": {
        "name": "Pantoprazole",
        "purpose": "Proton pump inhibitor — treats acid reflux, ulcers",
        "side_effects": ["Headache", "Diarrhea", "Nausea", "Low magnesium (long-term)"],
        "common_brands": ["Pan", "Pantocid", "Protonix"],
    },
    "dolo": {
        "name": "Dolo (Paracetamol)",
        "purpose": "Pain relief and fever reduction",
        "side_effects": ["Nausea", "Liver damage (overdose)"],
        "common_brands": ["Dolo 650"],
    },
    "aspirin": {
        "name": "Aspirin",
        "purpose": "Pain relief, fever reduction, blood thinner (cardiac use)",
        "side_effects": ["GI bleeding", "Stomach irritation", "Reye's syndrome (children)"],
        "common_brands": ["Ecosprin", "Disprin"],
    },
}


def extract_text_from_image(image_path: str) -> str:
    """Run OCR on the uploaded prescription image."""
    try:
        import pytesseract
        from PIL import Image
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img)
        return text.strip()
    except ImportError:
        return "[DEMO MODE] Tesseract not installed. Install pytesseract and Tesseract-OCR for real OCR."
    except Exception as e:
        return f"[OCR Error] {str(e)}"


def analyze_medicines(ocr_text: str) -> list:
    """
    Parse OCR text and identify medicines.
    Returns a list of dicts with name, purpose, side_effects, common_brands.
    """
    if not ocr_text or ocr_text.startswith('['):
        # Demo mode — return a sample result
        return [
            {
                "name": "Paracetamol",
                "dosage_found": "500mg",
                "purpose": "Pain relief and fever reduction",
                "side_effects": ["Nausea", "Liver damage (overdose)"],
                "common_brands": ["Crocin", "Dolo", "Calpol"],
            },
            {
                "name": "Cetirizine",
                "dosage_found": "10mg",
                "purpose": "Antihistamine — treats allergies",
                "side_effects": ["Drowsiness", "Dry mouth"],
                "common_brands": ["Zyrtec", "Alerid"],
            },
        ]

    found = []
    text_lower = ocr_text.lower()

    for key, info in MEDICINE_DB.items():
        if key in text_lower or info['name'].lower() in text_lower:
            # Try to extract dosage near the medicine name
            pattern = rf"{re.escape(key)}[\s\S]{{0,30}}?(\d+\s*(?:mg|ml|mcg|g))"
            match = re.search(pattern, text_lower)
            dosage = match.group(1) if match else "Not specified"

            found.append({
                "name": info['name'],
                "dosage_found": dosage,
                "purpose": info['purpose'],
                "side_effects": info['side_effects'],
                "common_brands": info['common_brands'],
            })

    if not found:
        # Generic fallback — couldn't identify specific medicines
        found.append({
            "name": "Unknown Medicine",
            "dosage_found": "—",
            "purpose": "Could not identify medicine from the scan. Please consult your pharmacist.",
            "side_effects": [],
            "common_brands": [],
        })

    return found
