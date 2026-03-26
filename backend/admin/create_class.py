from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from database.classes import create_class

create_class_route = Blueprint("create_class_route", __name__)


@create_class_route.route("/admin/create-class", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_class_api():

    data = request.json

    name = data["name"]
    teacher_id = data["teacher_id"]

    create_class(name, teacher_id)

    return jsonify({
        "message": "Class created successfully"
    })