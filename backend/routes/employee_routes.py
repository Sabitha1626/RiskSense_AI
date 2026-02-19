from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.employee_controller import EmployeeController

employee_bp = Blueprint('employees', __name__)


@employee_bp.route('/', methods=['GET'])
@jwt_required()
def get_employees():
    result, code = EmployeeController.get_all()
    return jsonify(result), code


@employee_bp.route('/<employee_id>/tasks', methods=['GET'])
@jwt_required()
def get_tasks(employee_id):
    result, code = EmployeeController.get_tasks(employee_id)
    return jsonify(result), code


@employee_bp.route('/<employee_id>/score', methods=['GET'])
@jwt_required()
def get_score(employee_id):
    result, code = EmployeeController.get_score(employee_id)
    return jsonify(result), code


@employee_bp.route('/<employee_id>/performance', methods=['GET'])
@jwt_required()
def get_performance(employee_id):
    result, code = EmployeeController.get_performance(employee_id)
    return jsonify(result), code


@employee_bp.route('/<employee_id>/work-hours', methods=['GET'])
@jwt_required()
def get_work_hours(employee_id):
    result, code = EmployeeController.get_work_hours(employee_id)
    return jsonify(result), code


@employee_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    result, code = EmployeeController.upload_file()
    return jsonify(result), code
