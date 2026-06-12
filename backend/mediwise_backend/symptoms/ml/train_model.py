"""
train_model.py — Train the MediWise disease prediction model.

Usage:
    python train_model.py

Expects a CSV file: symptom_disease_dataset.csv
with columns: symptoms (list as string), disease, severity, age_group, duration_days

Example row:
    "['fever', 'headache', 'body_ache']",Viral Fever,6,2,3
"""

import os
import ast
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'symptom_disease_dataset.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
MLB_PATH = os.path.join(BASE_DIR, 'mlb.pkl')


def train():
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Parse symptoms column (stored as string representation of list)
    df['symptoms_parsed'] = df['symptoms'].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else x
    )

    print(f"Dataset size: {len(df)} rows, {df['disease'].nunique()} diseases")

    # Feature engineering
    mlb = MultiLabelBinarizer()
    X_symptoms = mlb.fit_transform(df['symptoms_parsed'])
    X_meta = df[['severity', 'age_group', 'duration_days']].fillna(0).values
    X = np.hstack([X_symptoms, X_meta])
    y = df['disease']

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training RandomForest model...")
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=2,
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    # Evaluate
    y_pred = clf.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print(f"Accuracy: {clf.score(X_test, y_test):.2%}")

    # Save
    joblib.dump(clf, MODEL_PATH)
    joblib.dump(mlb, MLB_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")
    print(f"MLB saved to:   {MLB_PATH}")


if __name__ == '__main__':
    train()
