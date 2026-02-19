from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.alert_controller import AlertController

alert_bp = Blueprint('alerts', __name__)


@alert_bp.route('/', methods=['GET'])
@jwt_required()
def get_alerts():
    severity    = request.args.get('severity')
    alert_type  = request.args.get('type')
    unread_only = request.args.get('unreadOnly', 'false').lower() == 'true'
    result, code = AlertController.get_alerts(severity, alert_type, unread_only)
    return jsonify(result), code


@alert_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def unread_count():
    result, code = AlertController.get_unread_count()
    return jsonify(result), code


@alert_bp.route('/<alert_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(alert_id):
    result, code = AlertController.mark_as_read(alert_id)
    return jsonify(result), code


@alert_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_read():
    result, code = AlertController.mark_all_as_read()
    return jsonify(result), code
