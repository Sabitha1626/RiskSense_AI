"""
Load the saved Random Forest model and produce per-project risk predictions.
"""
import os
import joblib
import numpy as np
from datetime import datetime, date

from ml.preprocess import build_task_features, build_feature_vector

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
RISK_MODEL_PATH = os.path.join(MODELS_DIR, 'risk_model.pkl')

_model_cache = None


def _load_model():
    global _model_cache
    if _model_cache is None:
        if not os.path.exists(RISK_MODEL_PATH):
            raise FileNotFoundError(
                "risk_model.pkl not found. Run: python ml/train_model.py"
            )
        _model_cache = joblib.load(RISK_MODEL_PATH)
    return _model_cache


RISK_LEVEL_SCORE = {'Low': 15, 'Medium': 40, 'High': 70, 'Critical': 90}
SEVERITY_MAP     = {'Low': 'Safe', 'Medium': 'Warning', 'High': 'High Risk', 'Critical': 'Critical'}


def predict_project_risk(project: dict, tasks: list, progress_map: dict, user_map: dict) -> dict:
    """
    progress_map: {task_id: [progress_doc, ...]}
    user_map:     {user_id: user_doc}

    Returns the frontend-compatible risk payload:
    {
        projectName, overallRisk, riskPercent, confidence,
        tasks: [{_id, name, employee, completionPercent, daysRemaining,
                 predictedCompletion, riskLevel, reason, suggestedActions}]
    }
    """
    bundle = _load_model()
    clf = bundle['model']
    label_map = bundle['label_map']

    task_results = []
    risk_scores  = []

    for task in tasks:
        tid = str(task.get('_id', ''))
        progress_docs = progress_map.get(tid, [])

        assignee = user_map.get(str(task.get('assignee_id', '')))
        employee_name  = assignee['name'] if assignee else 'Unassigned'
        trust_score    = float(assignee.get('trust_score', 80)) if assignee else 80.0

        feats  = build_task_features(task, progress_docs, trust_score)
        vector = build_feature_vector(feats).reshape(1, -1)

        label_idx   = clf.predict(vector)[0]
        proba       = clf.predict_proba(vector)[0]
        confidence  = round(float(np.max(proba)) * 100, 1)
        risk_level  = label_map[label_idx]
        risk_score  = RISK_LEVEL_SCORE[risk_level]
        risk_scores.append(risk_score)

        days_rem = int(feats['days_remaining'])
        predicted_completion = _estimate_completion_date(
            task.get('progress', 0), feats['avg_daily_progress'], days_rem
        )

        reason, actions = _generate_insight(feats, risk_level, employee_name)

        task_results.append({
            '_id': tid,
            'name': task.get('title', ''),
            'employee': employee_name,
            'completionPercent': int(task.get('progress', 0)),
            'daysRemaining': max(days_rem, 0),
            'predictedCompletion': predicted_completion,
            'riskLevel': risk_level,
            'reason': reason,
            'suggestedActions': actions,
        })

    # Sort: highest risk first
    task_results.sort(key=lambda t: RISK_LEVEL_SCORE.get(t['riskLevel'], 0), reverse=True)

    overall_score = round(float(np.mean(risk_scores)), 1) if risk_scores else 0
    overall_risk_label = (
        'Critical' if overall_score >= 80
        else 'High Risk' if overall_score >= 60
        else 'Warning' if overall_score >= 35
        else 'Safe'
    )
    avg_confidence = round(float(np.mean([t.get('confidence', 85) for t in task_results])), 1) if task_results else 85

    return {
        'projectName': project.get('name', ''),
        'overallRisk': overall_risk_label,
        'riskPercent': overall_score,
        'confidence': avg_confidence,
        'tasks': task_results,
    }


def _estimate_completion_date(current_progress: float, avg_daily: float, days_remaining: int) -> str:
    """Estimate ISO date when task will finish at current velocity."""
    remaining_pct = 100 - current_progress
    if avg_daily <= 0:
        days_needed = max(days_remaining + 10, 30)
    else:
        days_needed = int(remaining_pct / avg_daily)
    from datetime import timedelta
    est = date.today() + timedelta(days=max(days_needed, 0))
    return est.isoformat()


def _generate_insight(feats: dict, risk_level: str, employee_name: str):
    """Return a human-readable reason string and list of suggested actions."""
    days_rem  = feats['days_remaining']
    gap       = feats['progress_gap']
    velocity  = feats['avg_daily_progress']
    needed    = feats['needed_daily_velocity']
    trust     = feats['employee_trust_score']

    reasons = []
    actions = []

    if feats['overdue']:
        reasons.append(f"Task is past its deadline with only {int(feats['progress'])}% completion.")
        actions.append("Immediately escalate to project manager")

    if gap < -20:
        reasons.append(f"Progress is {abs(int(gap))}% behind the expected plan for this date.")
        actions.append("Schedule a daily standup to unblock issues")

    if needed > velocity * 1.5 and days_rem > 0:
        reasons.append(
            f"Current velocity ({velocity:.1f}%/day) needs to increase to {needed:.1f}%/day to meet the deadline."
        )
        actions.append("Assign additional resources to accelerate delivery")

    if trust < 60:
        reasons.append(f"{employee_name}'s trust score is low ({int(trust)}), indicating inconsistent reporting.")
        actions.append(f"Conduct a progress review with {employee_name}")

    if days_rem < 5 and feats['progress'] < 70:
        actions.append("Consider scope reduction or deadline extension")

    if not reasons:
        if risk_level in ('Low',):
            reasons.append("Task is progressing on schedule. No immediate concerns.")
        else:
            reasons.append("Moderate risk factors detected. Close monitoring recommended.")

    return ' '.join(reasons), actions[:3]  # cap at 3 actions
