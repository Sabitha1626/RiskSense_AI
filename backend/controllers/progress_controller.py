from flask import current_app
from utils.response import success_response, error_response
from utils.token_helper import get_current_user_id
from models.progress_model import ProgressModel
from models.task_model import TaskModel
from models.alert_model import AlertModel
from ml.anomaly_detection import check_progress_report


def _models():
    db = current_app.db
    return ProgressModel(db), TaskModel(db), AlertModel(db)


class ProgressController:

    @staticmethod
    def submit(data):
        task_id = data.get('task_id')
        if not task_id:
            return error_response("task_id is required", 400)

        prm, tm, am = _models()
        uid  = get_current_user_id()

        # Get previous progress for anomaly comparison
        prev_docs = prm.get_history_by_task(task_id)
        prev_pct  = float(prev_docs[-1].get('completion_percent', 0)) if prev_docs else 0.0

        # Run anomaly detection
        anomaly = check_progress_report(data, prev_pct)

        # Save the report
        doc = prm.submit(data, uid, is_anomaly=anomaly['is_anomaly'])

        # Update task progress in tasks collection
        new_pct = float(data.get('completion_percent', 0))
        task    = tm.find_by_id(task_id)
        if task:
            updates = {'progress': new_pct}
            if new_pct >= 100:
                updates['status'] = 'completed'
            elif new_pct > 0:
                updates['status'] = 'in_progress'
            tm.update(task_id, updates)

        # If anomalous, create an alert
        if anomaly['is_anomaly']:
            employee_name = data.get('employee_name', 'An employee')
            task_name     = task.get('title', task_id) if task else task_id
            am.create(
                alert_type='fraud_detection',
                severity='warning',
                title=f'Suspicious Report Detected',
                message=f'{employee_name} submitted a flagged report on "{task_name}". {anomaly.get("reason", "")}',
                task_id=task_id,
                employee_id=uid,
            )

        result = ProgressModel.serialize(doc)
        result['anomalyDetected'] = anomaly['is_anomaly']
        result['anomalyReason']   = anomaly.get('reason')

        return success_response(result, "Daily report submitted successfully", 201)

    @staticmethod
    def get_today(task_id):
        if not task_id:
            return error_response("task_id query param required", 400)
        prm, _, _ = _models()
        uid  = get_current_user_id()
        doc  = prm.get_today(task_id, uid)
        return success_response(ProgressModel.serialize(doc) if doc else None)

    @staticmethod
    def get_all_today():
        prm, _, _ = _models()
        uid   = get_current_user_id()
        docs  = prm.get_all_today_for_employee(uid)
        by_task = {d['task_id']: ProgressModel.serialize(d) for d in docs}
        return success_response(by_task)

    @staticmethod
    def get_task_history(task_id):
        prm, _, _ = _models()
        docs = prm.get_all_by_task(task_id)
        return success_response([ProgressModel.serialize(d) for d in docs])
