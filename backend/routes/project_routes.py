from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.project_controller import ProjectController

project_bp = Blueprint('projects', __name__)


@project_bp.route('/', methods=['GET'])
@jwt_required()
def get_projects():
    result, code = ProjectController.get_projects()
    return jsonify(result), code


@project_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json() or {}
    result, code = ProjectController.create_project(data)
    return jsonify(result), code


@project_bp.route('/risk-distribution', methods=['GET'])
@jwt_required()
def risk_distribution():
    result, code = ProjectController.get_risk_distribution()
    return jsonify(result), code


@project_bp.route('/<project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    result, code = ProjectController.get_project(project_id)
    return jsonify(result), code


@project_bp.route('/<project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    data = request.get_json() or {}
    result, code = ProjectController.update_project(project_id, data)
    return jsonify(result), code


@project_bp.route('/<project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    result, code = ProjectController.delete_project(project_id)
    return jsonify(result), code


@project_bp.route('/<project_id>/progress-history', methods=['GET'])
@jwt_required()
def progress_history(project_id):
    result, code = ProjectController.get_progress_history(project_id)
    return jsonify(result), code


@project_bp.route('/<project_id>/productivity', methods=['GET'])
@jwt_required()
def productivity(project_id):
    employee_id = request.args.get('employee_id')
    result, code = ProjectController.get_productivity(project_id, employee_id)
    return jsonify(result), code
