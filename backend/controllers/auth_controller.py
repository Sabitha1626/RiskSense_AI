import json
from flask import current_app
from flask_jwt_extended import create_access_token
from utils.response import success_response, error_response
from utils.token_helper import get_current_user_id, is_manager
from models.user_model import UserModel


def _user_model():
    return UserModel(current_app.db)


class AuthController:

    @staticmethod
    def register(data):
        name     = data.get('name', '').strip()
        email    = data.get('email', '').strip().lower()
        password = data.get('password', '')
        role     = data.get('role', 'employee')

        if not all([name, email, password]):
            return error_response("name, email, and password are required", 400)
        if role not in ('manager', 'employee'):
            return error_response("role must be 'manager' or 'employee'", 400)

        um = _user_model()
        if um.find_by_email(email):
            return error_response("This email is already registered. Please log in instead.", 409)

        from app import bcrypt
        hashed = bcrypt.generate_password_hash(password).decode('utf-8')
        user = um.create(name, email, hashed, role)

        return success_response(
            {'message': 'Registration successful! Please log in.'},
            "Registered successfully",
            201
        )

    @staticmethod
    def login(data):
        email    = data.get('email', '').strip().lower()
        password = data.get('password', '')
        role     = data.get('role', 'employee')

        if not all([email, password]):
            return error_response("email and password are required", 400)

        from app import bcrypt
        um = _user_model()
        user = um.find_by_email(email)

        if not user:
            # Auto-register: create the account on the fly
            hashed = bcrypt.generate_password_hash(password).decode('utf-8')
            name = email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
            user = um.create(name, email, hashed, role or 'employee')

        else:
            # Existing user → verify password
            if not bcrypt.check_password_hash(user['password_hash'], password):
                return error_response("Invalid email or password", 401)

        identity = json.dumps({'id': str(user['_id']), 'role': user['role']})
        token    = create_access_token(identity=identity)
        safe_user = UserModel.serialize(user)

        return success_response({'token': token, 'user': safe_user}, "Login successful")

    @staticmethod
    def get_profile():
        uid = get_current_user_id()
        um  = _user_model()
        user = um.find_by_id(uid)
        if not user:
            return error_response("User not found", 404)
        return success_response(UserModel.serialize(user))

    @staticmethod
    def get_all_users():
        um    = _user_model()
        users = um.get_all()
        return success_response([UserModel.serialize(u) for u in users])
