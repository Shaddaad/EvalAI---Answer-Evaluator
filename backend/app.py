from flask import Flask
from flask_jwt_extended import JWTManager
from backend.admin.create_teacher import create_teacher_route
from backend.admin.create_class import create_class_route
from backend.admin.add_student import add_student_route
from backend.admin.dashboard import dashboard_route
from backend.teacher.create_exam import create_exam_route
from backend.teacher.upload_answer_key import upload_key_route
from backend.teacher.upload_answer_sheet import upload_answer_sheet_route
from backend.teacher.run_evaluation import run_evaluation_route
from backend.student.results import student_route
from flask import render_template


from backend.auth.login import login_route
from backend.auth.register import register_route
from backend.auth.logout import logout_route
from backend.auth.protected import protected_route
from backend.teacher.run_evaluation import run_evaluation_route

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])



from datetime import timedelta

app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
app.config['TEMPLATES_AUTO_RELOAD'] = True

jwt = JWTManager(app)

app.register_blueprint(login_route)
app.register_blueprint(register_route)
app.register_blueprint(logout_route)
app.register_blueprint(protected_route)
app.register_blueprint(create_teacher_route)
app.register_blueprint(create_class_route)
app.register_blueprint(add_student_route)
app.register_blueprint(create_exam_route)
app.register_blueprint(upload_key_route)
app.register_blueprint(upload_answer_sheet_route)
app.register_blueprint(run_evaluation_route)
app.register_blueprint(dashboard_route)
app.register_blueprint(student_route)

@app.route("/")
def home():
    return render_template("login.html")


@app.route("/admin")
def admin_page():
    return render_template("admin.html")


@app.route("/teacher")
def teacher_page():
    return render_template("teacher.html")



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)