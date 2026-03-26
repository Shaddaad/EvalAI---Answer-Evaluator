from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database.db import users
from backend.auth.auth_utils import verify_password

login_route = Blueprint("login", __name__)


@login_route.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    user = users.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not verify_password(password, user["password"]):
        return jsonify({"error": "Invalid password"}), 401

    token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]}
    )

    return jsonify({
        "token": token,
        "role": user["role"]
    })