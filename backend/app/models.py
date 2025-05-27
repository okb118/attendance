from datetime import datetime
from app.db import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, index=True)
    password_hash = db.Column(db.String)
    is_admin = db.Column(db.Integer, default=0)

class AttendanceLog(db.Model):
    __tablename__ = "logs"
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String, index=True)
    action = db.Column(db.String)
    time = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String, index=True)
    title = db.Column(db.String)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    all_day = db.Column(db.Boolean, default=False)
    color = db.Column(db.String, default="#3182ce")

class Todo(db.Model):
    __tablename__ = "todos"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    completed = db.Column(db.Boolean, default=False)
    user = db.Column(db.String(120))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "completed": self.completed,
            "user": self.user
        }
