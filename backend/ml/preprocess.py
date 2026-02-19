"""
Feature engineering: converts raw MongoDB docs into a numeric feature matrix
that the Random Forest and Isolation Forest models can consume.
"""
import numpy as np
import pandas as pd
from datetime import datetime, timezone, date


PRIORITY_MAP = {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}


def _days_remaining(deadline_str: str) -> float:
    """Return days from today to deadline (negative if overdue)."""
    try:
        if isinstance(deadline_str, str):
            dl = datetime.fromisoformat(deadline_str.replace('Z', '+00:00')).date()
        else:
            dl = deadline_str.date() if hasattr(deadline_str, 'date') else date.today()
        return (dl - date.today()).days
    except Exception:
        return 0


def build_task_features(task: dict, progress_docs: list, employee_trust_score: float = 80.0) -> dict:
    """
    Build a flat feature dict for a single task.
    progress_docs: list of daily_progress docs ordered by date (oldest first)
    """
    progress = float(task.get('progress', 0))
    days_rem = _days_remaining(task.get('deadline', ''))
    priority_score = PRIORITY_MAP.get(task.get('priority', 'medium'), 2)

    # Planned progress based on elapsed time
    total_days = max(_days_remaining(task.get('deadline', '')) * -1 +
                     max(days_rem, 0) + max(-days_rem, 0), 1)
    elapsed_ratio = max(1 - (days_rem / total_days), 0) if total_days > 0 else 1
    expected_progress = elapsed_ratio * 100
    progress_gap = progress - expected_progress   # negative = behind

    # Average daily progress velocity
    if len(progress_docs) >= 2:
        prog_values = [d.get('completion_percent', 0) for d in progress_docs]
        avg_daily = np.mean(np.diff(prog_values)) if len(prog_values) > 1 else 0
    elif len(progress_docs) == 1:
        avg_daily = progress_docs[0].get('completion_percent', 0)
    else:
        avg_daily = 0

    # Required daily velocity to finish on time
    needed_daily = (100 - progress) / max(days_rem, 1) if days_rem > 0 else 99

    # Average hours worked per day
    avg_hours = np.mean([d.get('hours_worked', 0) for d in progress_docs]) if progress_docs else 0

    return {
        'progress': progress,
        'days_remaining': days_rem,
        'progress_gap': progress_gap,
        'avg_daily_progress': avg_daily,
        'needed_daily_velocity': needed_daily,
        'priority_score': priority_score,
        'employee_trust_score': employee_trust_score,
        'avg_hours_worked': avg_hours,
        'overdue': 1 if days_rem < 0 and progress < 100 else 0,
    }


def build_feature_vector(features: dict) -> np.ndarray:
    """Return a 1D numpy array in the canonical feature order."""
    cols = [
        'progress', 'days_remaining', 'progress_gap', 'avg_daily_progress',
        'needed_daily_velocity', 'priority_score', 'employee_trust_score',
        'avg_hours_worked', 'overdue',
    ]
    return np.array([features.get(c, 0) for c in cols], dtype=float)


def build_anomaly_features(report: dict) -> np.ndarray:
    """
    Features for anomaly detection on a daily progress report.
    We flag reports where hours vs progress ratio is implausible.
    """
    hours = float(report.get('hours_worked', 0))
    pct = float(report.get('completion_percent', 0))
    prev_pct = float(report.get('prev_completion_percent', 0))
    progress_delta = pct - prev_pct
    hours_per_pct = hours / max(progress_delta, 0.1)   # hours per % completed

    return np.array([
        hours,
        progress_delta,
        hours_per_pct,
        min(hours, 24),   # sanity cap
    ], dtype=float).reshape(1, -1)
