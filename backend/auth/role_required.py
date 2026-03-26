from flask_jwt_extended import get_jwt
from flask import jsonify

def role_required(required_role):

    def wrapper(fn):

        def decorator(*args, **kwargs):

            claims = get_jwt()

            if claims["role"] != required_role:
                return jsonify({"error": "Unauthorized"}), 403

            return fn(*args, **kwargs)

        decorator.__name__ = fn.__name__
        return decorator

    return wrapper