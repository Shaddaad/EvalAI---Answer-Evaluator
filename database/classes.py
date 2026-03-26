from database.db import classes
from database.utils import serialize_list


def create_class(name, teacher_id):

    class_doc = {
        "name": name,
        "teacher_id": teacher_id,
        "students": []
    }

    classes.insert_one(class_doc)


def add_student_to_class(class_id, student_id):

    classes.update_one(
        {"_id": class_id},
        {"$push": {"students": student_id}}
    )


def get_classes():

    all_classes = classes.find()

    return serialize_list(list(all_classes))