from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt

protected_route = Blueprint("protected", __name__)


@protected_route.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    claims = get_jwt()

    return jsonify({
        "message": "Authenticated",
        "role": claims["role"]
    })