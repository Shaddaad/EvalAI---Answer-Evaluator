from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required

from database.exams import get_exam_by_id
from ocr.gemini_ocr import extract_text
from evaluation.grader import evaluate_answer

import os

run_evaluation_route = Blueprint("run_evaluation_route", __name__)

UPLOAD_FOLDER = "uploads"


@run_evaluation_route.route("/teacher/run-evaluation/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def run_evaluation(exam_id):

    print("\n===== EVALUATION STARTED =====")
    print("Exam ID:", exam_id)

    exam = get_exam_by_id(exam_id)

    if not exam:
        print("Exam not found")
        return jsonify({"error": "Exam not found"}), 404

    answer_key = exam["answer_key"]["questions"]

    results = []

    # SORT pages to maintain correct order
    files = sorted(os.listdir(UPLOAD_FOLDER))

    for file in files:

        if file.startswith("page_") and file.endswith(".jpg"):

            print("Processing file:", file)

            path = os.path.join(UPLOAD_FOLDER, file)

            try:

                # OCR extraction
                text = extract_text(path)

                print("OCR completed for:", file)

                # AI evaluation
                evaluation = evaluate_answer(answer_key, text)

                results.append({
                    "file": file,
                    "evaluation": evaluation
                })

            except Exception as e:

                print("Error while evaluating:", file)
                print(str(e))

                results.append({
                    "file": file,
                    "error": str(e)
                })

    print("===== EVALUATION FINISHED =====\n")

    return jsonify({
        "message": "Evaluation completed successfully",
        "exam_id": exam_id,
        "results": results
    })