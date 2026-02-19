from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from controllers.report_controller import ReportController

report_bp = Blueprint('reports', __name__)


@report_bp.route('/', methods=['GET'])
@jwt_required()
def get_reports():
    project_id = request.args.get('project_id')
    result, code = ReportController.get_reports(project_id)
    return jsonify(result), code


@report_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_report():
    data = request.get_json() or {}
    result, code = ReportController.generate(data)
    return jsonify(result), code


@report_bp.route('/<report_id>/download', methods=['GET'])
@jwt_required()
def download_report(report_id):
    return ReportController.download(report_id)
