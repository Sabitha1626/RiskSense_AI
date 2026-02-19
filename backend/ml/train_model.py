"""
Train and save the two ML models:
  1. Random Forest Classifier  — predicts risk level per task
  2. Isolation Forest          — detects anomalous daily progress reports

Run once before starting the server:
    python ml/train_model.py
"""
import os
import sys
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ── ensure project root is on path ────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
os.makedirs(MODELS_DIR, exist_ok=True)

RISK_MODEL_PATH   = os.path.join(MODELS_DIR, 'risk_model.pkl')
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, 'anomaly_model.pkl')

# ── Risk model labels ─────────────────────────────────────────────────────────
# 0=Low  1=Medium  2=High  3=Critical
LABEL_MAP = {0: 'Low', 1: 'Medium', 2: 'High', 3: 'Critical'}


def _generate_risk_training_data(n=2000, seed=42):
    """
    Synthetic training data.
    Feature order (must match preprocess.build_feature_vector):
      progress, days_remaining, progress_gap, avg_daily_progress,
      needed_daily_velocity, priority_score, employee_trust_score,
      avg_hours_worked, overdue
    """
    rng = np.random.default_rng(seed)

    progress           = rng.uniform(0, 100, n)
    days_remaining     = rng.uniform(-10, 60, n)
    progress_gap       = rng.uniform(-50, 30, n)
    avg_daily          = rng.uniform(0, 15, n)
    needed_velocity    = rng.uniform(0, 25, n)
    priority_score     = rng.integers(1, 5, n).astype(float)
    trust_score        = rng.uniform(30, 100, n)
    avg_hours          = rng.uniform(0, 12, n)
    overdue            = (days_remaining < 0) & (progress < 100)

    X = np.column_stack([
        progress, days_remaining, progress_gap, avg_daily,
        needed_velocity, priority_score, trust_score, avg_hours,
        overdue.astype(float)
    ])

    # Rule-based label generation (deterministic ground truth)
    labels = []
    for i in range(n):
        score = 0
        if progress[i] < 25 and days_remaining[i] < 10:  score += 3
        if progress_gap[i] < -20:                          score += 2
        if needed_velocity[i] > avg_daily[i] * 2:         score += 2
        if overdue[i]:                                     score += 3
        if priority_score[i] >= 3 and progress_gap[i] < -10: score += 1
        if trust_score[i] < 50:                            score += 1
        if days_remaining[i] < 0:                          score += 1

        if score >= 6:    labels.append(3)   # Critical
        elif score >= 4:  labels.append(2)   # High
        elif score >= 2:  labels.append(1)   # Medium
        else:             labels.append(0)   # Low

    return X, np.array(labels)


def _generate_anomaly_training_data(n=2000, seed=99):
    """
    Normal reports: 1–9 hours, progress delta proportional to hours.
    Anomalous: extreme hours with low progress OR low hours with high progress jump.
    """
    rng = np.random.default_rng(seed)

    # Normal
    hours_n = rng.uniform(1, 9, n)
    delta_n = hours_n * rng.uniform(2, 6, n)          # progress% per hour
    ratio_n = hours_n / np.maximum(delta_n, 0.1)
    X_normal = np.column_stack([hours_n, delta_n, ratio_n, np.minimum(hours_n, 24)])

    # Anomalous type 1: very high hours, very low progress
    n_anom1 = n // 20
    hours_a1 = rng.uniform(12, 24, n_anom1)
    delta_a1 = rng.uniform(0, 3, n_anom1)
    ratio_a1 = hours_a1 / np.maximum(delta_a1, 0.1)
    X_anom1  = np.column_stack([hours_a1, delta_a1, ratio_a1, np.minimum(hours_a1, 24)])

    # Anomalous type 2: very low hours, suspiciously high progress
    n_anom2 = n // 20
    hours_a2 = rng.uniform(0.1, 1.0, n_anom2)
    delta_a2 = rng.uniform(40, 80, n_anom2)
    ratio_a2 = hours_a2 / np.maximum(delta_a2, 0.1)
    X_anom2  = np.column_stack([hours_a2, delta_a2, ratio_a2, np.minimum(hours_a2, 24)])

    return np.vstack([X_normal, X_anom1, X_anom2])


def train_risk_model():
    print("Training Risk Prediction Model (Random Forest)...")
    X, y = _generate_risk_training_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=list(LABEL_MAP.values())))

    joblib.dump({'model': clf, 'label_map': LABEL_MAP}, RISK_MODEL_PATH)
    print(f"  ✓ Risk model saved → {RISK_MODEL_PATH}")
    return clf


def train_anomaly_model():
    print("Training Anomaly Detection Model (Isolation Forest)...")
    X = _generate_anomaly_training_data()

    iso = IsolationForest(
        n_estimators=150,
        contamination=0.05,   # expect ~5% anomalies
        random_state=99,
        n_jobs=-1,
    )
    iso.fit(X)

    joblib.dump(iso, ANOMALY_MODEL_PATH)
    print(f"  ✓ Anomaly model saved → {ANOMALY_MODEL_PATH}")
    return iso


if __name__ == '__main__':
    train_risk_model()
    train_anomaly_model()
    print("\n✅  Both models trained and saved successfully.")
