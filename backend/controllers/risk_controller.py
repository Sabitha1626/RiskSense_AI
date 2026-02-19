from flask import current_app
from utils.response import success_response, error_response
from models.project_model import ProjectModel
from models.task_model import TaskModel
from models.progress_model import ProgressModel
from models.user_model import UserModel
from ml.predict import predict_project_risk


def _models():
    db = current_app.db
    return ProjectModel(db), TaskModel(db), ProgressModel(db), UserModel(db)


class RiskController:

    @staticmethod
    def list_projects():
        pm, _, _, _ = _models()
        projects = pm.get_all()
        result = [{'_id': str(p['_id']), 'name': p['name']} for p in projects]
        return success_response(result)

    @staticmethod
    def get_project_risk(project_id):
        pm, tm, prm, um = _models()

        project = pm.find_by_id(project_id)
        if not project:
            return error_response("Project not found", 404)

        tasks = tm.get_by_project(project_id)

        # Build progress map: {task_id: [progress_docs...]}
        progress_map = {}
        for task in tasks:
            tid = str(task['_id'])
            progress_map[tid] = prm.get_history_by_task(tid)

        # Build user map: {user_id: user_doc}
        all_users = um.get_all()
        user_map  = {str(u['_id']): u for u in all_users}

        try:
            risk_result = predict_project_risk(project, tasks, progress_map, user_map)
        except FileNotFoundError:
            return error_response(
                "ML model not trained. Run: python ml/train_model.py", 503
            )
        except Exception as e:
            return error_response(f"Prediction error: {str(e)}", 500)

        # Persist updated risk score
        pm.update_risk_score(project_id, risk_result['riskPercent'])

        return success_response(risk_result)
