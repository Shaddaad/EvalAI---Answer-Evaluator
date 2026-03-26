from database.db import db
from database.utils import serialize_list

exams = db.exams


def create_exam(exam_name, class_name, teacher_id, max_marks, date, valuation_type):

    exam = {
        "exam_name": exam_name,
        "class": class_name,
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