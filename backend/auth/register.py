from flask import Blueprint, request, jsonify
from database.users import create_user
from backend.auth.auth_utils import hash_password

register_route = Blueprint("register", __name__)


@register_route.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]
    role = data["role"]

    hashed_password = hash_password(password)

    create_user(
        name,
        email,
        hashed_password,
        role
    )

    return jsonify({"message": "User created successfully"})