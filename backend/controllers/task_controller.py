from flask import current_app
from utils.response import success_response, error_response
from utils.token_helper import get_current_user_id, is_manager
from models.task_model import TaskModel
from models.project_model import ProjectModel
from models.user_model import UserModel


def _models():
    db = current_app.db
    return TaskModel(db), ProjectModel(db), UserModel(db)


class TaskController:

    @staticmethod
    def get_tasks(project_id=None, employee_id=None):
        tm, pm, um = _models()
        if project_id:
            tasks = tm.get_by_project(project_id)
        elif employee_id:
            tasks = tm.get_by_assignee(employee_id)
        else:
            # employee sees their own tasks; manager sees all (via project_id filter)
            uid   = get_current_user_id()
            tasks = tm.get_by_assignee(uid) if not is_manager() else []

        # Enrich with project name and assignee name
        all_users = um.get_all()
        user_map  = {str(u['_id']): u.get('name', '') for u in all_users}
        all_projs = pm.get_all()
        proj_map  = {str(p['_id']): p.get('name', '') for p in all_projs}

        result = []
        for t in tasks:
            st = TaskModel.serialize(t)
            st['projectName'] = proj_map.get(st.get('project_id', ''), '')
            st['assigneeName'] = user_map.get(st.get('assignee_id', ''), 'Unassigned')
            result.append(st)
        return success_response(result)

    @staticmethod
    def create_task(data):
        if not all([data.get('title'), data.get('project_id'), data.get('deadline')]):
            return error_response("title, project_id, and deadline are required", 400)
        tm, pm, _ = _models()
        if not pm.find_by_id(data['project_id']):
            return error_response("Project not found", 404)
        task = tm.create(data)
        return success_response(TaskModel.serialize(task), "Task created", 201)

    @staticmethod
    def get_task(task_id):
        tm, pm, um = _models()
        task = tm.find_by_id(task_id)
        if not task:
            return error_response("Task not found", 404)
        st = TaskModel.serialize(task)
        # Enrich
        proj = pm.find_by_id(st.get('project_id', ''))
        if proj:
            st['projectName'] = proj.get('name')
        user = um.find_by_id(st.get('assignee_id', ''))
        if user:
            st['assigneeName'] = user.get('name')
        return success_response(st)

    @staticmethod
    def update_task(task_id, data):
        tm, _, _ = _models()
        if not tm.find_by_id(task_id):
            return error_response("Task not found", 404)
        updated = tm.update(task_id, data)
        return success_response(TaskModel.serialize(updated))

    @staticmethod
    def delete_task(task_id):
        tm, _, _ = _models()
        if not tm.find_by_id(task_id):
            return error_response("Task not found", 404)
        tm.delete(task_id)
        return success_response(None, "Task deleted")
