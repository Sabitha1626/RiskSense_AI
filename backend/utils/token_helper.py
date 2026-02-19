from flask_jwt_extended import get_jwt_identity
import json


def get_current_user_id():
    """Return the user _id string from the JWT identity."""
    identity = get_jwt_identity()
    if isinstance(identity, dict):
        return identity.get('id')
    return identity


def get_current_user_role():
    """Return the role from JWT identity."""
    identity = get_jwt_identity()
    if isinstance(identity, dict):
        return identity.get('role', 'employee')
    return 'employee'


def is_manager():
    return get_current_user_role() == 'manager'
