from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.auth.role_required import role_required
from database.exams import create_exam

create_exam_route = Blueprint("create_exam_route", __name__)


@create_exam_route.route("/teacher/create-exam", methods=["POST"])
@jwt_required()
@role_required("teacher")
def create_exam_api():

    data = request.json

    exam_name = data["exam_name"]
    class_name = data["class"]
    max_marks = data["max_marks"]
    date = data["date"]
    valuation_type = data["valuation_type"]

    teacher_id = get_jwt_identity()

    exam = create_exam(
        exam_name,
        class_name,
        teacher_id,
        max_marks,
        date,
        valuation_type
    )

    # convert Mongo ObjectId to string if present
    if "_id" in exam:
        exam["_id"] = str(exam["_id"])

    return jsonify({
        "message": "Exam created successfully",
        "exam": exam
    })