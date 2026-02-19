import os
from flask import current_app, send_file
from utils.response import success_response, error_response
from utils.token_helper import get_current_user_id
from models.report_model import ReportModel
from models.project_model import ProjectModel
from models.task_model import TaskModel
from models.progress_model import ProgressModel
from models.user_model import UserModel
from utils.pdf_generator import generate_project_report_pdf


def _models():
    db = current_app.db
    return (ReportModel(db), ProjectModel(db),
            TaskModel(db), ProgressModel(db), UserModel(db))


class ReportController:

    @staticmethod
    def get_reports(project_id=None):
        rm, _, _, _, _ = _models()
        if project_id:
            reports = rm.get_by_project(project_id)
        else:
            reports = rm.get_all()
        return success_response([ReportModel.serialize(r) for r in reports])

    @staticmethod
    def generate(data):
        project_id = data.get('project_id')
        if not project_id:
            return error_response("project_id is required", 400)

        rm, pm, tm, prm, um = _models()
        project = pm.find_by_id(project_id)
        if not project:
            return error_response("Project not found", 404)

        tasks = tm.get_by_project(project_id)

        # Fetch risk data via ML
        progress_map = {str(t['_id']): prm.get_history_by_task(str(t['_id'])) for t in tasks}
        all_users    = um.get_all()
        user_map     = {str(u['_id']): u for u in all_users}

        try:
            from ml.predict import predict_project_risk
            risk_data = predict_project_risk(project, tasks, progress_map, user_map)
        except Exception:
            risk_data = {
                'riskPercent': project.get('risk_score', 0),
                'overallRisk': 'Unknown',
                'confidence': 0,
                'tasks': [],
            }

        # Generate PDF
        safe_name   = project['name'].replace(' ', '_').replace('/', '_')
        from datetime import date
        filename    = f"report_{safe_name}_{date.today().isoformat()}.pdf"
        reports_dir = os.path.join(os.getcwd(), 'generated_reports')
        output_path = os.path.join(reports_dir, filename)

        generate_project_report_pdf(
            ProjectModel.serialize(project), risk_data, tasks, output_path
        )

        uid = get_current_user_id()
        summary = {
            'riskScore': risk_data.get('riskPercent'),
            'overallRisk': risk_data.get('overallRisk'),
            'confidence': risk_data.get('confidence'),
            'taskCount': len(tasks),
        }
        report_doc = rm.create(project_id, uid, output_path, summary)
        return success_response(ReportModel.serialize(report_doc), "Report generated", 201)

    @staticmethod
    def download(report_id):
        rm = ReportModel(current_app.db)
        report = rm.find_by_id(report_id)
        if not report:
            from flask import jsonify
            return jsonify({'status': 'error', 'message': 'Report not found'}), 404

        pdf_path = report.get('pdf_path', '')
        if not os.path.exists(pdf_path):
            from flask import jsonify
            return jsonify({'status': 'error', 'message': 'PDF file not found on server'}), 404

        return send_file(pdf_path, as_attachment=True, mimetype='application/pdf')
