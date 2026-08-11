from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return "CodeMind Backend is running!"


@app.route("/api/health")
def health():
    return {
        "status": "Backend connected successfully"
    }


if __name__ == "__main__":
    app.run(debug=True)