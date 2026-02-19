from flask import current_app
from utils.response import success_response, error_response
from models.alert_model import AlertModel


def _model():
    return AlertModel(current_app.db)


class AlertController:

    @staticmethod
    def get_alerts(severity=None, alert_type=None, unread_only=False):
        am     = _model()
        alerts = am.get_all(severity=severity, alert_type=alert_type, unread_only=unread_only)
        return success_response([AlertModel.serialize(a) for a in alerts])

    @staticmethod
    def get_unread_count():
        am    = _model()
        count = am.get_unread_count()
        return success_response({'count': count})

    @staticmethod
    def mark_as_read(alert_id):
        am = _model()
        am.mark_as_read(alert_id)
        return success_response(None, "Alert marked as read")

    @staticmethod
    def mark_all_as_read():
        am = _model()
        am.mark_all_as_read()
        return success_response(None, "All alerts marked as read")
