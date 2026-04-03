from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from backend.utils.pdf_converter import pdf_to_images
from database.db import db
from bson.objectid import ObjectId
import os
import shutil

upload_answer_sheet_route = Blueprint("upload_answer_sheet_route", __name__)

UPLOAD_FOLDER = "uploads"


@upload_answer_sheet_route.route("/teacher/upload-answer-sheet/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def upload_answer_sheet(exam_id):

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    student_id = request.form.get("student_id")
    if not student_id:
        return jsonify({"error": "student_id is required"}), 400

    file = request.files["file"]

    # Create student-specific folder: uploads/<exam_id>/<student_id>/
    student_folder = os.path.join(UPLOAD_FOLDER, exam_id, student_id)

    # Replace mode: clear old uploads for this student
    if os.path.exists(student_folder):
        shutil.rmtree(student_folder)

    os.makedirs(student_folder, exist_ok=True)

    pdf_path = os.path.join(student_folder, file.filename)
    file.save(pdf_path)

    # Convert PDF → images into the student folder
    image_paths = pdf_to_images(pdf_path, student_folder)

    # Store the mapping in exam.student_sheets
    db.exams.update_one(
        {"_id": ObjectId(exam_id)},
        {"$set": {f"student_sheets.{student_id}": image_paths}}
    )

    return jsonify({
        "message": "Answer sheet uploaded for student",
        "exam_id": exam_id,
        "student_id": student_id,
        "images": image_paths
    })


@upload_answer_sheet_route.route("/teacher/exam-sheets/<exam_id>", methods=["GET"])
@jwt_required()
@role_required("teacher")
def get_exam_sheets(exam_id):
    """Return which students have uploaded sheets for this exam."""
    from database.db import users

    exam = db.exams.find_one({"_id": ObjectId(exam_id)})
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    student_sheets = exam.get("student_sheets", {})
    uploaded = []

    for sid, paths in student_sheets.items():
        try:
            student = users.find_one({"_id": ObjectId(sid)})
            name = student.get("name", "Unknown") if student else "Unknown"
        except Exception:
            name = "Unknown"
        uploaded.append({
            "student_id": sid,
            "student_name": name,
            "page_count": len(paths)
        })

    return jsonify({"uploaded_students": uploaded})