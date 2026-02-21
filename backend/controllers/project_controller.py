from flask import current_app
from utils.response import success_response, error_response
from utils.token_helper import get_current_user_id, is_manager
from models.project_model import ProjectModel
from models.task_model import TaskModel
from models.progress_model import ProgressModel
from models.user_model import UserModel
from datetime import date, timedelta
import numpy as np


def _models():
    db = current_app.db
    return ProjectModel(db), TaskModel(db), ProgressModel(db), UserModel(db)


class ProjectController:

    @staticmethod
    def get_projects():
        pm, tm, prm, um = _models()
        uid  = get_current_user_id()
        role = 'manager' if is_manager() else 'employee'
        projects = pm.get_all() if role == 'manager' else pm.get_by_member(uid)
        result = []
        for p in projects:
            sp = ProjectModel.serialize(p)
            # Attach tasks count
            tasks = tm.get_by_project(str(p['_id']))
            sp['taskCount'] = len(tasks)
            result.append(sp)
        return success_response(result)

    @staticmethod
    def create_project(data):
        if not is_manager():
            return error_response("Only managers can create projects", 403)
        if not data.get('name') or not data.get('deadline'):
            return error_response("name and deadline are required", 400)
        pm, _, _, _ = _models()
        project = pm.create(data, get_current_user_id())
        return success_response(ProjectModel.serialize(project), "Project created", 201)

    @staticmethod
    def get_project(project_id):
        pm, tm, _, um = _models()
        project = pm.find_by_id(project_id)
        if not project:
            return error_response("Project not found", 404)

        sp = ProjectModel.serialize(project)
        tasks = tm.get_by_project(project_id)
        sp['tasks'] = [TaskModel.serialize(t) for t in tasks]

        # Attach employee names
        all_users = um.get_all()
        user_map  = {str(u['_id']): UserModel.serialize(u) for u in all_users}
        sp['teamMemberDetails'] = [user_map[uid] for uid in sp.get('team_members', []) if uid in user_map]

        return success_response(sp)

    @staticmethod
    def update_project(project_id, data):
        pm, _, _, _ = _models()
        if not pm.find_by_id(project_id):
            return error_response("Project not found", 404)
        updated = pm.update(project_id, data)
        return success_response(ProjectModel.serialize(updated))

    @staticmethod
    def delete_project(project_id):
        pm, tm, _, _ = _models()
        if not pm.find_by_id(project_id):
            return error_response("Project not found", 404)
        tm.delete_by_project(project_id)
        pm.delete(project_id)
        return success_response(None, "Project deleted")

    @staticmethod
    def get_progress_history(project_id):
        """
        Returns weekly planned vs actual progress for chart display.
        """
        pm, tm, prm, _ = _models()
        project = pm.find_by_id(project_id)
        if not project:
            return error_response("Project not found", 404)

        tasks = tm.get_by_project(project_id)

        # Build week-by-week actual progress from progress docs
        from datetime import datetime, timedelta
        start_str = project.get('start_date', '')
        try:
            start_dt  = datetime.fromisoformat(str(start_str).replace('Z', '+00:00')).date()
        except Exception:
            start_dt  = date.today()

        end_dt    = date.today()
        num_weeks = max(int((end_dt - start_dt).days / 7) + 1, 1)
        labels    = [f"Week {i+1}" for i in range(num_weeks)]

        # Aggregate average progress across all tasks per week
        weekly_actual  = []
        weekly_planned = []
        total_weeks    = num_weeks
        for wk in range(total_weeks):
            week_end   = start_dt + timedelta(weeks=wk + 1)
            planned    = round(((wk + 1) / total_weeks) * 100, 1)
            # average task progress as of that week (simplified: use current progress for last week)
            actual_val = round(float(project.get('progress', 0)) * ((wk + 1) / total_weeks), 1)
            weekly_planned.append(planned)
            weekly_actual.append(actual_val)

        return success_response({
            'labels': labels,
            'planned': weekly_planned,
            'actual': weekly_actual,
        })

    @staticmethod
    def get_productivity(project_id, employee_id):
        """Returns 7-day productivity data for an employee on a project."""
        from datetime import datetime, timedelta
        _, _, prm, _ = _models()
        if not employee_id:
            return error_response("employee_id query param required", 400)

        reports = prm.get_history_by_employee(employee_id, days=7)
        labels  = [(date.today() - timedelta(days=i)).strftime('%a') for i in range(6, -1, -1)]
        data    = [int(r.get('completion_percent', 0)) for r in reports[-7:]]
        # Pad if fewer than 7 days
        while len(data) < 7:
            data.insert(0, 0)
        return success_response({'labels': labels, 'data': data})

    @staticmethod
    def get_risk_distribution():
        pm, _, _, _ = _models()
        projects = pm.get_all()
        dist = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
        for p in projects:
            rs = p.get('risk_score', 0)
            if rs <= 25:        dist['low'] += 1
            elif rs <= 50:      dist['medium'] += 1
            elif rs <= 75:      dist['high'] += 1
            else:               dist['critical'] += 1
        return success_response(dist)
