from database.users import create_user, get_teachers

create_user(
    "Teacher1",
    "teacher@test.com",
    "123",
    "teacher",
    {"subjects": ["Physics"]}
)

print(get_teachers())