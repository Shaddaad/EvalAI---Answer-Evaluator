from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from database.classes import add_student_to_class

add_student_route = Blueprint("add_student_route", __name__)


@add_student_route.route("/admin/add-student", methods=["POST"])
@jwt_required()
@role_required("admin")
def add_student():

    data = request.json

    class_id = data["class_id"]
    student_id = data["student_id"]

    add_student_to_class(class_id, student_id)

    return jsonify({
        "message": "Student added to class"
    })