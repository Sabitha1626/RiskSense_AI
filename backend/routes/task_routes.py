from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.task_controller import TaskController

task_bp = Blueprint('tasks', __name__)


@task_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    project_id  = request.args.get('project_id')
    employee_id = request.args.get('employee_id')
    result, code = TaskController.get_tasks(project_id, employee_id)
    return jsonify(result), code


@task_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json() or {}
    result, code = TaskController.create_task(data)
    return jsonify(result), code


@task_bp.route('/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    result, code = TaskController.get_task(task_id)
    return jsonify(result), code


@task_bp.route('/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    data = request.get_json() or {}
    result, code = TaskController.update_task(task_id, data)
    return jsonify(result), code


@task_bp.route('/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    result, code = TaskController.delete_task(task_id)
    return jsonify(result), code
