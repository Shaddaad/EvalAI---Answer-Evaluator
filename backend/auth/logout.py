from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

logout_route = Blueprint("logout", __name__)


@logout_route.route("/logout", methods=["POST"])
@jwt_required()
def logout():

    return jsonify({"message": "Logout successful"})