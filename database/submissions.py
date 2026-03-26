from database.db import submissions
from database.utils import serialize_list
from bson import ObjectId


def submit_answer(exam_id, roll_number, answers):

    submission = {
        "exam_id": exam_id,
        "roll_number": roll_number,
        "answers": answers,
        "marks": None,
        "status": "submitted"
    }

    result = submissions.insert_one(submission)

    return str(result.inserted_id)


def update_marks(submission_id, marks):

    submissions.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"marks": marks, "status": "evaluated"}}
    )


def get_submissions(exam_id):

    subs = submissions.find({"exam_id": exam_id})

    return serialize_list(list(subs))