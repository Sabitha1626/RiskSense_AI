import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient

from config import Config

# ── Shared extensions ─────────────────────────────────────────────────────────
jwt = JWTManager()
bcrypt = Bcrypt()
db = None   # will be set in create_app()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS — allow React dev server
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Extensions
    jwt.init_app(app)
    bcrypt.init_app(app)

    # MongoDB
    global db
    client = MongoClient(app.config['MONGO_URI'])
    db = client.get_default_database()
    app.db = db

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # ── Register blueprints ────────────────────────────────────────────────────
    from routes.auth_routes import auth_bp
    from routes.project_routes import project_bp
    from routes.task_routes import task_bp
    from routes.progress_routes import progress_bp
    from routes.risk_routes import risk_bp
    from routes.alert_routes import alert_bp
    from routes.employee_routes import employee_bp
    from routes.report_routes import report_bp

    app.register_blueprint(auth_bp,     url_prefix='/api/auth')
    app.register_blueprint(project_bp,  url_prefix='/api/projects')
    app.register_blueprint(task_bp,     url_prefix='/api/tasks')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(risk_bp,     url_prefix='/api/risk')
    app.register_blueprint(alert_bp,    url_prefix='/api/alerts')
    app.register_blueprint(employee_bp, url_prefix='/api/employees')
    app.register_blueprint(report_bp,   url_prefix='/api/reports')

    # ── Scheduler ─────────────────────────────────────────────────────────────
    from scheduler.daily_jobs import start_scheduler
    start_scheduler(app)

    # ── Health check ──────────────────────────────────────────────────────────
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'AI Risk Prediction API is running'}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)
