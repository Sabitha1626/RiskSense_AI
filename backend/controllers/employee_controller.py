from flask import current_app, request
from utils.response import success_response, error_response
from utils.token_helper import get_current_user_id
from models.user_model import UserModel
from models.task_model import TaskModel
from models.progress_model import ProgressModel
from datetime import date
import os


def _models():
    db = current_app.db
    return UserModel(db), TaskModel(db), ProgressModel(db)


def _allowed_extension(filename: str) -> bool:
    from config import Config
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS


class EmployeeController:

    @staticmethod
    def get_all():
        um, _, _ = _models()
        employees = um.get_all_employees()
        return success_response([UserModel.serialize(e) for e in employees])

    @staticmethod
    def get_tasks(employee_id):
        um, tm, _ = _models()
        tasks = tm.get_by_assignee(employee_id)
        from models.project_model import ProjectModel
        pm = ProjectModel(current_app.db)
        proj_map = {str(p['_id']): p.get('name', '') for p in pm.get_all()}

        result = []
        for t in tasks:
            st = TaskModel.serialize(t)
            st['projectName'] = proj_map.get(st.get('project_id', ''), '')
            result.append(st)
        return success_response(result)

    @staticmethod
    def get_score(employee_id):
        _, _, prm = _models()

        docs     = prm.get_history_by_employee(employee_id, days=30)
        history  = [float(d.get('completion_percent', 0)) for d in docs]

        # Generate 30-day date labels
        from datetime import timedelta
        labels = [(date.today() - timedelta(days=i)).strftime('%b %d') for i in range(29, -1, -1)]

        while len(history) < 30:
            history.insert(0, 0)

        # Score = average of recent completion %
        current_score = round(sum(history[-7:]) / max(len(history[-7:]), 1), 1) if history else 70.0

        return success_response({
            'current': current_score,
            'labels': labels,
            'history': history[-30:],
        })

    @staticmethod
    def get_performance(employee_id):
        um, tm, prm = _models()

        user = um.find_by_id(employee_id)
        if not user:
            return error_response("Employee not found", 404)

        completed_tasks = [t for t in tm.get_by_assignee(employee_id) if t.get('status') == 'completed']
        delayed_tasks   = []  # Tasks completed after deadline

        from datetime import datetime, timedelta
        for t in completed_tasks:
            dl_str = t.get('deadline', '')
            try:
                dl = datetime.fromisoformat(str(dl_str).replace('Z', '+00:00')).date()
                if dl < date.today():
                    delayed_tasks.append({
                        'task': t.get('title', ''),
                        'daysDelayed': (date.today() - dl).days,
                        'reason': 'No reason provided',
                    })
            except Exception:
                pass

        docs = prm.get_history_by_employee(employee_id, days=30)
        from datetime import timedelta as td
        labels           = [(date.today() - td(days=i)).strftime('%b %d') for i in range(29, -1, -1)]
        productivity_data = [float(d.get('completion_percent', 0)) for d in docs]
        while len(productivity_data) < 30:
            productivity_data.insert(0, 0)

        trust_score = float(user.get('trust_score', 80))
        label = ('Reliable' if trust_score >= 75
                 else 'Watch' if trust_score >= 55
                 else 'Flagged')

        return success_response({
            'trustScore': trust_score,
            'label': label,
            'completedTasks': [TaskModel.serialize(t) for t in completed_tasks],
            'delays': delayed_tasks,
            'productivityData': productivity_data[-30:],
            'teamAverage': [65] * 30,   # placeholder team average
            'labels': labels,
        })

    @staticmethod
    def get_work_hours(employee_id):
        _, _, prm = _models()
        from datetime import timedelta

        docs   = prm.get_history_by_employee(employee_id, days=7)
        labels = [(date.today() - timedelta(days=i)).strftime('%a') for i in range(6, -1, -1)]
        actual = [float(d.get('hours_worked', 0)) for d in docs[-7:]]
        while len(actual) < 7:
            actual.insert(0, 0)

        expected = [8, 8, 8, 8, 8, 4, 0]   # Mon–Sun standard hours

        return success_response({
            'labels': labels,
            'expected': expected,
            'actual': actual,
        })

    @staticmethod
    def upload_file():
        if 'file' not in request.files:
            return error_response("No file part in request", 400)

        file = request.files['file']
        if file.filename == '':
            return error_response("No file selected", 400)

        if not _allowed_extension(file.filename):
            return error_response("File type not allowed", 400)

        from werkzeug.utils import secure_filename
        import uuid
        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        upload_dir  = current_app.config['UPLOAD_FOLDER']
        filepath    = os.path.join(upload_dir, unique_name)
        file.save(filepath)

        return success_response({
            'success': True,
            'url': f"/uploads/{unique_name}",
            'filename': unique_name,
        }, "File uploaded", 201)
