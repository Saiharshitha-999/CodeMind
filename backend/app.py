import os
from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime,timezone

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    problem = db.Column(db.String(200), nullable=False)
    language = db.Column(db.String(50), nullable=False)
    code = db.Column(db.Text, nullable=False)
    result = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

@app.route("/")
def home():
    return "CodeMind Backend is running!"


@app.route("/api/health")
def health():
    return {
        "status": "Backend connected successfully"
    }

@app.route("/api/submissions",methods = ["POST"])
def create_submission():
    data = request.get_json()
    submission = Submission(problem = data["problem"],
                            language = data["language"],
                            code = data["code"],
                            result = data["result"]
                            )
    db.session.add(submission)
    db.session.commit()

    return {
        "message": "Submission saved successfully",
        "id": submission.id
    },201

@app.route("/api/submissions",methods = ["GET"])
def get_submissions():
    submissions = Submission.query.all()
    return [{
        "id": submission.id,
        "problem": submission.problem,
        "language": submission.language,
        "code": submission.code,
        "result": submission.result,
        "created_at": submission.created_at.isoformat()
    }
    for submission in submissions
    ]

@app.route("/api/submissions/<int:id>", methods=["DELETE"])
def delete_submission(id):
    submission = Submission.query.get(id)

    if submission is None:
        return {
            "message": "Submission not found"
        }, 404

    db.session.delete(submission)
    db.session.commit()

    return {
        "message": "Submission deleted successfully"
    }, 200

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)