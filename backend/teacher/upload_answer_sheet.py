from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from backend.utils.pdf_converter import pdf_to_images
import os

upload_answer_sheet_route = Blueprint("upload_answer_sheet_route", __name__)

UPLOAD_FOLDER = "uploads"


@upload_answer_sheet_route.route("/teacher/upload-answer-sheet/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def upload_answer_sheet(exam_id):

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    pdf_path = os.path.join(UPLOAD_FOLDER, file.filename)

    file.save(pdf_path)

    # convert PDF → images
    image_paths = pdf_to_images(pdf_path, UPLOAD_FOLDER)

    return jsonify({
        "message": "Student answer sheet uploaded",
        "exam_id": exam_id,
        "images": image_paths
    })