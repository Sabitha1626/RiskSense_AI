from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.progress_controller import ProgressController

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_progress():
    data = request.get_json() or {}
    result, code = ProgressController.submit(data)
    return jsonify(result), code


@progress_bp.route('/today', methods=['GET'])
@jwt_required()
def get_today():
    task_id = request.args.get('task_id')
    result, code = ProgressController.get_today(task_id)
    return jsonify(result), code


@progress_bp.route('/today/all', methods=['GET'])
@jwt_required()
def get_all_today():
    result, code = ProgressController.get_all_today()
    return jsonify(result), code


@progress_bp.route('/<task_id>/history', methods=['GET'])
@jwt_required()
def task_history(task_id):
    result, code = ProgressController.get_task_history(task_id)
    return jsonify(result), code
