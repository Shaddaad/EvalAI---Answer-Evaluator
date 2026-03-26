import bcrypt
from database.db import db


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


users = [
    {
        "name": "Admin",
        "email": "admin",
        "password": "123",
        "role": "admin"
    },
    {
        "name": "Sreekumar K",
        "email": "sk@test.com",
        "password": "123",
        "role": "teacher",
        "subject": "Computer Science"
    },
    {
        "name": "Arya",
        "email": "arya@test.com",
        "password": "123",
        "role": "teacher",
        "subject": "Computer Networks"
    },
    {
        "name": "Shaddaad",
        "email": "shadd@test.com",
        "password": "123",
        "role": "student",
        "roll_number": "01",
        "class": "CS6B"
    },
    {
        "name": "Aflah",
        "email": "aflah@test.com",
        "password": "123",
        "role": "student",
        "roll_number": "02",
        "class": "CS6B"
    },
    {
        "name": "Minza",
        "email": "minza@test.com",
        "password": "123",
        "role": "student",
        "roll_number": "03",
        "class": "CS6B"
    }
]


db.users.delete_many({})

for user in users:
    user["password"] = hash_password(user["password"])
    db.users.insert_one(user)

print("Users seeded successfully.")