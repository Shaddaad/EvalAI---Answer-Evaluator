from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from backend.auth.auth_utils import hash_password
from database.users import get_teachers, get_students, create_user
from database.classes import get_classes, get_class_with_students, get_class_students_by_name
from database.db import users
from bson import ObjectId

dashboard_route = Blueprint("dashboard_route", __name__)


@dashboard_route.route("/admin/teachers", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_teachers():
    teachers = get_teachers()
    return jsonify({"teachers": teachers})


@dashboard_route.route("/admin/classes", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_classes():
    classes = get_classes()
    return jsonify({"classes": classes})


@dashboard_route.route("/admin/class/<class_id>", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_class_detail(class_id):
    cls = get_class_with_students(class_id)
    if not cls:
        return jsonify({"error": "Class not found"}), 404
    return jsonify({"class": cls})


@dashboard_route.route("/admin/students", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_students():
    students = get_students()
    return jsonify({"students": students})


@dashboard_route.route("/teacher/classes", methods=["GET"])
@jwt_required()
@role_required("teacher")
def teacher_list_classes():
    classes = get_classes()
    return jsonify({"classes": classes})


@dashboard_route.route("/teacher/subjects", methods=["GET"])
@jwt_required()
@role_required("teacher")
def teacher_list_subjects():
    teachers = list(users.find({"role": "teacher", "subject": {"$exists": True, "$ne": ""}}, {"subject": 1, "_id": 0}))
    subjects = list(set([t["subject"] for t in teachers if "subject" in t]))
    return jsonify({"subjects": subjects})


@dashboard_route.route("/teacher/class-students/<class_name>", methods=["GET"])
@jwt_required()
@role_required("teacher")
def teacher_class_students(class_name):
    students = get_class_students_by_name(class_name)
    return jsonify({"students": students})


@dashboard_route.route("/admin/teacher/<teacher_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_teacher(teacher_id):
    result = users.delete_one({"_id": ObjectId(teacher_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Teacher not found"}), 404
    return jsonify({"message": "Teacher removed successfully"})


@dashboard_route.route("/admin/create-student", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_student():
    data = request.json
    hashed = hash_password(data["password"])
    user = create_user(
        name=data["name"],
        email=data["email"],
        password=hashed,
        role="student"
    )
    return jsonify({"message": "Student created successfully"})


@dashboard_route.route("/admin/student/<student_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_student(student_id):
    result = users.delete_one({"_id": ObjectId(student_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Student not found"}), 404
    return jsonify({"message": "Student removed successfully"})
