from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.risk_controller import RiskController

risk_bp = Blueprint('risk', __name__)


@risk_bp.route('/projects', methods=['GET'])
@jwt_required()
def list_projects():
    result, code = RiskController.list_projects()
    return jsonify(result), code


@risk_bp.route('/<project_id>', methods=['GET'])
@jwt_required()
def get_risk(project_id):
    result, code = RiskController.get_project_risk(project_id)
    return jsonify(result), code
