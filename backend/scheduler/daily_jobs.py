"""
APScheduler daily pipeline — runs every morning at 09:00.
  1. Fetches all in-progress projects
  2. Runs ML risk prediction
  3. Updates risk_score in MongoDB
  4. Generates alerts for high/critical projects and overdue tasks
"""
import logging
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)


def run_daily_risk_pipeline(app):
    """Core pipeline logic — called by scheduler with app context."""
    with app.app_context():
        try:
            from models.project_model import ProjectModel
            from models.task_model import TaskModel
            from models.progress_model import ProgressModel
            from models.user_model import UserModel
            from models.alert_model import AlertModel
            from ml.predict import predict_project_risk

            db = app.db
            project_model = ProjectModel(db)
            task_model    = TaskModel(db)
            progress_model = ProgressModel(db)
            user_model    = UserModel(db)
            alert_model   = AlertModel(db)

            projects = project_model.get_in_progress()
            logger.info(f"[Scheduler] Running risk pipeline for {len(projects)} projects")

            all_users = user_model.get_all()
            user_map  = {str(u['_id']): u for u in all_users}

            for project in projects:
                pid   = str(project['_id'])
                tasks = task_model.get_by_project(pid)

                progress_map = {}
                for task in tasks:
                    tid = str(task['_id'])
                    progress_map[tid] = progress_model.get_history_by_task(tid)

                try:
                    risk_result = predict_project_risk(project, tasks, progress_map, user_map)
                except Exception as e:
                    logger.warning(f"[Scheduler] ML prediction failed for project {pid}: {e}")
                    continue

                risk_score = risk_result['riskPercent']
                new_status = (
                    'at_risk'     if risk_score >= 60
                    else 'in_progress'
                )
                project_model.update_risk_score(pid, risk_score, new_status)

                # ── Generate alerts if needed ──────────────────────────────
                if risk_score >= 80:
                    alert_model.create(
                        alert_type='deadline_risk',
                        severity='critical',
                        title=f'{project["name"]} at Critical Risk',
                        message=f'Project "{project["name"]}" has {risk_score:.0f}% risk score — critical deadline threat detected by AI.',
                        project_id=pid,
                    )
                elif risk_score >= 60:
                    alert_model.create(
                        alert_type='deadline_risk',
                        severity='warning',
                        title=f'{project["name"]} Risk Elevated',
                        message=f'Project "{project["name"]}" risk score is {risk_score:.0f}%. Immediate attention required.',
                        project_id=pid,
                    )

                # Alert for individual critical tasks
                for task_result in risk_result.get('tasks', []):
                    if task_result['riskLevel'] == 'Critical' and task_result['daysRemaining'] <= 5:
                        alert_model.create(
                            alert_type='deadline_risk',
                            severity='critical',
                            title=f'{task_result["name"]} — Critical Task Alert',
                            message=task_result['reason'],
                            project_id=pid,
                            task_id=task_result['_id'],
                        )

            logger.info("[Scheduler] Daily risk pipeline completed.")
        except Exception as e:
            logger.error(f"[Scheduler] Pipeline error: {e}", exc_info=True)


def start_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=run_daily_risk_pipeline,
        args=[app],
        trigger='cron',
        hour=9,
        minute=0,
        id='daily_risk_pipeline',
        replace_existing=True,
    )
    scheduler.start()
    logger.info("[Scheduler] Daily risk pipeline scheduled at 09:00.")
    return scheduler
