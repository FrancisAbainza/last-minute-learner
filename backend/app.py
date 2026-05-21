import os
import uuid
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

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
# MODEL (snake_case)
# =========================
class Reviewer(db.Model):
    __tablename__ = "reviewers"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(255), nullable=False)

    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    field = db.Column(db.String(255), nullable=False)

    reviewer = db.Column(db.JSON, nullable=False)
    flashcards = db.Column(db.JSON, nullable=False)
    quiz = db.Column(db.JSON, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())


# =========================
# CREATE
# POST /reviewers
# =========================
@app.route("/reviewers", methods=["POST"])
def create_reviewer():
    data = request.get_json()

    new_reviewer = Reviewer(
        user_id=data["user_id"],
        title=data["title"],
        description=data["description"],
        field=data["field"],
        reviewer=data["reviewer"],
        flashcards=data["flashcards"],
        quiz=data["quiz"],
    )

    db.session.add(new_reviewer)
    db.session.commit()

    return jsonify({
        "message": "Created",
        "id": new_reviewer.id
    }), 201

# =========================
# READ ALL
# GET /reviewers
# =========================
@app.route("/reviewers", methods=["GET"])
def get_reviewers():
    reviewers = Reviewer.query.all()

    return jsonify([
        {
            "id": r.id,
            "user_id": r.user_id,
            "title": r.title,
            "description": r.description,
            "field": r.field,
            "reviewer": r.reviewer,
            "flashcards": r.flashcards,
            "quiz": r.quiz,
            "created_at": r.created_at,
        }
        for r in reviewers
    ])

# =========================
# READ ONE
# GET /reviewers/<id>
# =========================
@app.route("/reviewers/<string:id>", methods=["GET"])
def get_reviewer(id):
    reviewer = Reviewer.query.get(id)

    if not reviewer:
        return jsonify({"message": "Not found"}), 404

    return jsonify({
        "id": reviewer.id,
        "user_id": reviewer.user_id,
        "title": reviewer.title,
        "description": reviewer.description,
        "field": reviewer.field,
        "reviewer": reviewer.reviewer,
        "flashcards": reviewer.flashcards,
        "quiz": reviewer.quiz,
        "created_at": reviewer.created_at,
    })

# =========================
# DELETE
# DELETE /reviewers/<id>
# =========================
@app.route("/reviewers/<string:id>", methods=["DELETE"])
def delete_reviewer(id):
    reviewer = Reviewer.query.get(id)

    if not reviewer:
        return jsonify({"message": "Not found"}), 404

    db.session.delete(reviewer)
    db.session.commit()

    return jsonify({"message": "Deleted"})
    
# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)