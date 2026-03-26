from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from evaluation.key_extractor import extract_answer_key
from database.exams import update_answer_key
import os

upload_key_route = Blueprint("upload_key_route", __name__)

UPLOAD_FOLDER = "uploads"


@upload_key_route.route("/teacher/upload-answer-key/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def upload_answer_key(exam_id):

    file = request.files["file"]

    path = os.path.join("uploads", f"key_{exam_id}.jpg")

    file.save(path)

    # run key extractor
    key_data = extract_answer_key(path)

    # store structured key in DB
    update_answer_key(exam_id, key_data)

    return jsonify({
        "message": "Answer key extracted and stored",
        "questions": key_data["questions"]
    })