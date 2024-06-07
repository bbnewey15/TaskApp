
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    completed = db.Column(db.Boolean, default=False)

    