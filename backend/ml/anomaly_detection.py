"""
Isolation Forest anomaly detection for daily progress reports.
A report is flagged if the hours_worked vs progress_delta ratio is implausible.
"""
import os
import joblib
import numpy as np

from ml.preprocess import build_anomaly_features

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, 'anomaly_model.pkl')

_anomaly_cache = None


def _load_anomaly_model():
    global _anomaly_cache
    if _anomaly_cache is None:
        if not os.path.exists(ANOMALY_MODEL_PATH):
            raise FileNotFoundError(
                "anomaly_model.pkl not found. Run: python ml/train_model.py"
            )
        _anomaly_cache = joblib.load(ANOMALY_MODEL_PATH)
    return _anomaly_cache


def check_progress_report(report: dict, prev_completion_percent: float = 0.0) -> dict:
    """
    report: dict with at least 'hours_worked' and 'completion_percent'
    prev_completion_percent: the last known completion % before this report

    Returns:
        {
            'is_anomaly': bool,
            'anomaly_score': float,   # raw Isolation Forest score (more negative = more anomalous)
            'reason': str | None
        }
    """
    try:
        iso = _load_anomaly_model()
    except FileNotFoundError:
        # If model not trained yet, skip anomaly check
        return {'is_anomaly': False, 'anomaly_score': 0.0, 'reason': None}

    report_with_prev = {**report, 'prev_completion_percent': prev_completion_percent}
    features = build_anomaly_features(report_with_prev)

    # predict returns -1 (anomaly) or 1 (normal)
    prediction   = iso.predict(features)[0]
    score        = float(iso.score_samples(features)[0])
    is_anomaly   = (prediction == -1)

    reason = None
    if is_anomaly:
        hours   = float(report.get('hours_worked', 0))
        delta   = float(report.get('completion_percent', 0)) - prev_completion_percent
        if hours > 12:
            reason = f"Claimed {hours:.0f} hours worked is unusually high."
        elif delta > 50:
            reason = f"Progress jump of {delta:.0f}% in a single day is statistically unlikely."
        elif hours > 0 and delta <= 0:
            reason = f"Reported {hours:.0f} hours but no progress increase detected."
        else:
            reason = "Report pattern deviates significantly from historical norms."

    return {
        'is_anomaly': is_anomaly,
        'anomaly_score': round(score, 4),
        'reason': reason,
    }
