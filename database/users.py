from database.db import users
from database.utils import serialize_list


def create_user(name, email, password, role, **extra_data):

    user = {
        "name": name,
        "email": email,
        "password": password,
        "role": role
    }

    if extra_data:
        user.update(extra_data)

    users.insert_one(user)
    return user


def get_user_by_email(email):
    return users.find_one({"email": email})


def get_teachers():
    teachers = users.find({"role": "teacher"})
    return serialize_list(list(teachers))


def get_students():

    students = list(users.find({"role": "student"})

)

    for s in students:
        s["_id"] = str(s["_id"])

    return students