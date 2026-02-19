from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.auth_controller import AuthController

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    result, code = AuthController.register(data)
    return jsonify(result), code


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    result, code = AuthController.login(data)
    return jsonify(result), code


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    result, code = AuthController.get_profile()
    return jsonify(result), code


@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    result, code = AuthController.get_all_users()
    return jsonify(result), code
