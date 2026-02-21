from flask_jwt_extended import get_jwt_identity
import json


def _parse_identity():
    """Parse JWT identity from JSON string or dict."""
    identity = get_jwt_identity()
    if isinstance(identity, str):
        try:
            return json.loads(identity)
        except (json.JSONDecodeError, TypeError):
            return {'id': identity, 'role': 'employee'}
    if isinstance(identity, dict):
        return identity
    return {'id': str(identity), 'role': 'employee'}


def get_current_user_id():
    """Return the user _id string from the JWT identity."""
    return _parse_identity().get('id')


def get_current_user_role():
    """Return the role from JWT identity."""
    return _parse_identity().get('role', 'employee')


def is_manager():
    return get_current_user_role() == 'manager'

