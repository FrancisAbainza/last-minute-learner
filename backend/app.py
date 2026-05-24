import os
import uuid
import functools
from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# =========================
# DATABASE (Neon)
# =========================
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}

db = SQLAlchemy(app)

# =========================
# SERVER-TO-SERVER AUTH
# Clerk verifies the user in Next.js; Flask trusts Next.js via a shared secret.
# This avoids short-lived Clerk JWT expiry issues on long-running AI operations.
# =========================
_SERVICE_SECRET = os.getenv("INTERNAL_SERVICE_SECRET")

def require_auth(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        secret  = request.headers.get("X-Service-Secret", "")
        user_id = request.headers.get("X-User-Id", "")
        if not secret or secret != _SERVICE_SECRET or not user_id:
            return jsonify({"message": "Unauthorized"}), 401
        g.user_id = user_id
        return f(*args, **kwargs)
    return wrapper


# =========================
# MODEL
# =========================
class Reviewer(db.Model):
    __tablename__ = "reviewers"

    id          = db.Column(db.String,       primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id     = db.Column(db.String(255),  nullable=False)
    title       = db.Column(db.Text,         nullable=False)
    description = db.Column(db.Text,         nullable=False)
    field       = db.Column(db.String(255),  nullable=False)
    reviewer    = db.Column(db.JSON,         nullable=False)
    flashcards  = db.Column(db.JSON,         nullable=False)
    quiz        = db.Column(db.JSON,         nullable=False)
    created_at  = db.Column(db.DateTime,     server_default=db.func.now())

    def to_dict(self):
        return {
            "id":          self.id,
            "user_id":     self.user_id,
            "title":       self.title,
            "description": self.description,
            "field":       self.field,
            "reviewer":    self.reviewer,
            "flashcards":  self.flashcards,
            "quiz":        self.quiz,
            "created_at":  self.created_at.isoformat(),
        }


# =========================
# REQUIRED FIELDS
# =========================
REQUIRED_FIELDS = ["title", "description", "field", "reviewer", "flashcards", "quiz"]


# =========================
# CREATE  —  POST /reviewers
# =========================
@app.route("/reviewers", methods=["POST"])
@require_auth
def create_reviewer():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "Invalid or missing JSON body"}), 400

    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        return jsonify({"message": f"Missing fields: {missing}"}), 400

    entry = Reviewer(
        user_id=g.user_id,
        title=data["title"],
        description=data["description"],
        field=data["field"],
        reviewer=data["reviewer"],
        flashcards=data["flashcards"],
        quiz=data["quiz"],
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify({"message": "Created", "id": entry.id}), 201


# =========================
# READ BY USER  —  GET /reviewers
# =========================
@app.route("/reviewers", methods=["GET"])
@require_auth
def get_user_reviewers():
    reviewers = Reviewer.query.filter_by(user_id=g.user_id).order_by(Reviewer.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviewers])


# =========================
# READ ONE  —  GET /reviewers/<id>
# =========================
@app.route("/reviewers/<string:id>", methods=["GET"])
@require_auth
def get_reviewer(id):
    reviewer = db.session.get(Reviewer, id)
    if not reviewer:
        return jsonify({"message": "The reviewer you are looking for does not exist in the database."}), 404
    if reviewer.user_id != g.user_id:
        return jsonify({"message": "You are not authorized to access this reviewer."}), 403
    return jsonify(reviewer.to_dict())


# =========================
# DELETE  —  DELETE /reviewers/<id>
# =========================
@app.route("/reviewers/<string:id>", methods=["DELETE"])
@require_auth
def delete_reviewer(id):
    reviewer = db.session.get(Reviewer, id)
    if not reviewer:
        return jsonify({"message": "The reviewer you are looking for does not exist in the database."}), 404
    if reviewer.user_id != g.user_id:
        return jsonify({"message": "You are not authorized to delete this reviewer."}), 403

    db.session.delete(reviewer)
    db.session.commit()
    return jsonify({"message": "Deleted"})


# =========================
# STARTUP
# =========================
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
