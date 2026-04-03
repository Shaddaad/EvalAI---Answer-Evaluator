from database.db import db
from database.utils import serialize_list
from bson import ObjectId
from database.db import exams


def get_exam_by_id(exam_id):

    exam = exams.find_one({"_id": ObjectId(exam_id)})

    if exam:
        exam["_id"] = str(exam["_id"])

    return exam

def update_answer_key(exam_id, key_data):

    exams.update_one(
        {"_id": ObjectId(exam_id)},
        {"$set": {"answer_key": key_data}}
    )

exams = db.exams


def create_exam(exam_name, class_name, subject, teacher_id, max_marks, date, valuation_type):

    exam = {
        "exam_name": exam_name,
        "class": class_name,
        "subject": subject,
        "teacher_id": teacher_id,
        "max_marks": max_marks,
        "date": date,
        "valuation_type": valuation_type,
        "answer_key": None
    }

    exams.insert_one(exam)

    return exam


def get_exams():

    result = exams.find()

    return serialize_list(list(result))

def get_exams_by_teacher(teacher_id):
    
    result = exams.find({"teacher_id": teacher_id})
    return serialize_list(list(result))

def delete_exam(exam_id):
    result = exams.delete_one({"_id": ObjectId(exam_id)})
    return result.deleted_count > 0