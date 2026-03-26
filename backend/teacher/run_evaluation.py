from bson import ObjectId
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required
from database.db import db
from ocr.gemini_ocr import extract_text
from evaluation.student_parser import split_student_answers
from evaluation.answer_evaluator import evaluate_answer
from database.submissions import submit_answer, update_marks
import os

run_evaluation_route = Blueprint("run_evaluation_route", __name__)

UPLOAD_FOLDER = "uploads"


@run_evaluation_route.route("/teacher/run-evaluation/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def run_evaluation(exam_id):

    exam = db.exams.find_one({"_id": ObjectId(exam_id)})
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    answer_key = exam.get("answer_key")

    if not answer_key:
        return jsonify({"error": "Answer key not uploaded"}), 400

    results = []

    # scan all student answer sheets
    for file in os.listdir(UPLOAD_FOLDER):
        roll_number = file.split(".")[0]
        if not file.endswith(".jpg") and not file.endswith(".png"):
            continue

        filepath = os.path.join(UPLOAD_FOLDER, file)

        student_text = extract_text(filepath)

        student_answers = split_student_answers(student_text)

        total_score = 0
        evaluation = []

        for q in answer_key["questions"]:

            qnum = q["question_number"]

            student_answer = student_answers.get(qnum, "")

            result = evaluate_answer(
                q["question"],
                q["model_answer"],
                student_answer,
                q["max_marks"]
            )

            evaluation.append({
                "question_number": qnum,
                "student_answer": student_answer,
                "marks": result["marks"],
                "reason": result["reason"]
            })

            total_score += result["marks"]

    student_id = file.replace(".jpg","").replace(".png","")

    submit_answer(
        exam_id,
        student_id,
        student_answers
)

    results.append({
        "student_file": file,
        "student_id": student_id,
        "score": total_score,
        "evaluation": evaluation
})

    return jsonify({
        "exam_id": exam_id,
        "results": results
    })