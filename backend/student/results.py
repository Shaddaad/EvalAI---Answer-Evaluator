from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.auth.role_required import role_required
from database.db import exams

student_route = Blueprint("student_route", __name__)

@student_route.route("/student/my-results", methods=["GET"])
@jwt_required()
@role_required("student")
def my_results():
    student_id = get_jwt_identity()
    
    # Securely fetch all exams where this student_id is present inside the results array
    exams_cursor = exams.find({"results.student_id": student_id})
    
    student_exams = []
    for ex in exams_cursor:
        # Extract only this student's result to avoid leaking other classmates' marks!
        my_result = next((r for r in ex.get("results", []) if r["student_id"] == student_id), None)
        
        if my_result:
            student_exams.append({
                "_id": str(ex["_id"]),
                "exam_name": ex.get("exam_name"),
                "subject": ex.get("subject", ""),
                "date": ex.get("date", ""),
                "max_marks": ex.get("max_marks", 0),
                "my_result": my_result
            })
            
    return jsonify({"exams": student_exams})
