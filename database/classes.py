from bson import ObjectId
from database.db import classes, users
from database.utils import serialize_list


def create_class(name):

    class_doc = {
        "name": name,
        "teachers": [],
        "students": []
    }

    classes.insert_one(class_doc)


def add_student_to_class(class_id, student_id):
    """Add a student (by string ID) to a class. Fixes the original bug where
    class_id was passed as a raw string instead of ObjectId."""

    classes.update_one(
        {"_id": ObjectId(class_id)},
        {"$push": {"students": student_id}}
    )


def get_classes():
    """Return all classes with teacher name and student count resolved."""

    all_classes = list(classes.find())
    result = []

    for c in all_classes:
        c["_id"] = str(c["_id"])

        # Resolve teachers
        c["teacher_name"] = "—" # Decoupled from class creation

        # Ensure students is a list and expose its count
        if not isinstance(c.get("students"), list):
            c["students"] = []
        c["student_count"] = len(c["students"])

        result.append(c)

    return result


def get_class_with_students(class_id):
    """Return a single class with full student documents resolved."""

    cls = classes.find_one({"_id": ObjectId(class_id)})
    if not cls:
        return None

    cls["_id"] = str(cls["_id"])

    # Resolve teacher name
    cls["teacher_name"] = "—" # Decoupled from single teacher requirement

    # Resolve student documents (stored as string IDs)
    student_ids = cls.get("students", [])
    student_docs = []
    for sid in student_ids:
        try:
            s = users.find_one({"_id": ObjectId(sid)})
            if s:
                student_docs.append({
                    "_id": str(s["_id"]),
                    "name": s.get("name", ""),
                    "email": s.get("email", "")
                })
        except Exception:
            pass
    cls["students"] = student_docs

    return cls


def get_class_students_by_name(class_name):
    """Look up a class by name and return resolved student documents."""

    cls = classes.find_one({"name": class_name})
    if not cls:
        return []

    student_ids = cls.get("students", [])
    student_docs = []
    for sid in student_ids:
        try:
            s = users.find_one({"_id": ObjectId(sid)})
            if s:
                student_docs.append({
                    "_id": str(s["_id"]),
                    "name": s.get("name", "")
                })
        except Exception:
            pass

    return student_docs