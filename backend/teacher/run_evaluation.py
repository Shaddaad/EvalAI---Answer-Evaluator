from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from backend.auth.role_required import role_required

from database.exams import get_exam_by_id
from database.db import db, users
from bson.objectid import ObjectId
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

    answer_key = exam.get("answer_key", {}).get("questions", [])
    if not answer_key:
        return jsonify({"error": "No answer key found for this exam"}), 400

    student_sheets = exam.get("student_sheets", {})
    if not student_sheets:
        return jsonify({"error": "No student sheets uploaded yet"}), 400

    all_results = []

    for student_id, image_paths in student_sheets.items():

        print(f"\n--- Evaluating student: {student_id} ---")

        # Resolve student name
        try:
            student = users.find_one({"_id": ObjectId(student_id)})
            student_name = student.get("name", "Unknown") if student else "Unknown"
        except Exception:
            student_name = "Unknown"

        # OCR all pages for this student
        full_text = ""
        processed_count = 0

        # Sort image paths to maintain page order
        def sort_key(p):
            fname = os.path.basename(p)
            if fname.startswith("page_") and fname.endswith(".jpg"):
                try:
                    return int(fname.split("_")[1].split(".")[0])
                except ValueError:
                    return 0
            return 0

        sorted_paths = sorted(image_paths, key=sort_key)

        for path in sorted_paths:
            if not os.path.exists(path):
                print(f"  File not found: {path}")
                continue

            try:
                text = extract_text(path)
                full_text += f"\n--- Page {os.path.basename(path)} ---\n{text}\n"
                processed_count += 1
                print(f"  OCR done: {os.path.basename(path)}")
            except Exception as e:
                print(f"  OCR error on {path}: {str(e)}")

        if not full_text:
            all_results.append({
                "student_id": student_id,
                "student_name": student_name,
                "error": "No text could be extracted from uploaded pages"
            })
            continue

        # Run AI evaluation
        print(f"  Running AI evaluation for {student_name}...")

        try:
            evaluation = evaluate_answer(answer_key, full_text)

            total_score = 0
            total_max = 0
            if isinstance(evaluation, dict) and "results" in evaluation:
                for q in evaluation["results"]:
                    total_score += q.get("marks_awarded", 0)
                    total_max += q.get("max_marks", 0)

            all_results.append({
                "student_id": student_id,
                "student_name": student_name,
                "page_count": processed_count,
                "score": f"{total_score}/{total_max}",
                "total_score": total_score,
                "total_max": total_max,
                "evaluation": evaluation
            })
            print(f"  Score: {total_score}/{total_max}")

        except Exception as e:
            print(f"  Evaluation error: {str(e)}")
            all_results.append({
                "student_id": student_id,
                "student_name": student_name,
                "error": str(e)
            })

    print("\n===== EVALUATION FINISHED =====\n")

    # Save results to database
    db.exams.update_one(
        {"_id": ObjectId(exam_id)},
        {"$set": {"results": all_results}}
    )

    return jsonify({
        "message": "Evaluation completed successfully",
        "exam_id": exam_id,
        "students_evaluated": len(all_results),
        "results": all_results
    })


@run_evaluation_route.route("/teacher/results/<exam_id>", methods=["GET"])
@jwt_required()
@role_required("teacher")
def get_evaluation_results(exam_id):
    exam = get_exam_by_id(exam_id)
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    return jsonify({
        "exam_id": exam_id,
        "results": exam.get("results", [])
    })


from flask import request

@run_evaluation_route.route("/teacher/update-marks/<exam_id>", methods=["POST"])
@jwt_required()
@role_required("teacher")
def update_marks(exam_id):
    exam = get_exam_by_id(exam_id)
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    data = request.json
    student_id = data.get("student_id")
    updated_questions = data.get("updated_questions")

    if not student_id or not updated_questions:
        return jsonify({"error": "Missing student_id or updated_questions"}), 400

    results = exam.get("results", [])
    
    # Find the result for that student and update it
    updated = False
    for r in results:
        if r.get("student_id") == student_id:
            if "evaluation" in r:
                r["evaluation"]["results"] = updated_questions
                
                # Recalculate totals
                total_score = 0
                for q in updated_questions:
                    total_score += float(q.get("marks_awarded", 0))
                
                r["total_score"] = float(total_score)
                r["score"] = f"{total_score}/{r.get('total_max', 0)}"
                updated = True
                break

    if not updated:
        return jsonify({"error": "Student evaluation results not found"}), 404

    # Save the updated results list back to the DB
    db.exams.update_one(
        {"_id": ObjectId(exam_id)},
        {"$set": {"results": results}}
    )

    return jsonify({"message": "Marks updated successfully", "results": results})