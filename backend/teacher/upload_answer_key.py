from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from evaluation.key_extractor import extract_answer_key
from database.db import db
import os

upload_key_route = Blueprint("upload_key_route", __name__)

UPLOAD_FOLDER = "uploads"


@upload_key_route.route("/teacher/upload-answer-key/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def upload_answer_key(exam_id):

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Run OCR + key extractor
    answer_key = extract_answer_key(filepath)

    # Save in MongoDB
    db.exams.update_one(
    {"_id": ObjectId(exam_id)},
    {"$set": {"answer_key": answer_key}}
)
    return jsonify({
        "message": "Answer key uploaded successfully",
        "answer_key": answer_key
    })