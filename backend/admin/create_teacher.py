from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from backend.auth.role_required import role_required
from backend.auth.auth_utils import hash_password
from database.users import create_user

create_teacher_route = Blueprint("create_teacher", __name__)


@create_teacher_route.route("/admin/create-teacher", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_teacher():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]
    subject = data["subject"]

    hashed_password = hash_password(password)

    create_user(
        name,
        email,
        hashed_password,
        role="teacher",
        subject=subject
    )

    return jsonify({"message": "Teacher created successfully"})