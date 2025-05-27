from flask import request, jsonify
from passlib.hash import bcrypt
from sqlalchemy import desc
from datetime import datetime
from app.db import db
from app.models import User, AttendanceLog, Event, Todo

def register_routes(app):

    @app.route("/register", methods=["POST"])
    def register():
        data = request.json
        if User.query.filter_by(username=data["username"]).first():
            return jsonify({"message": "そのユーザー名は既に存在します"}), 400
        user = User(
            username=data["username"],
            password_hash=bcrypt.hash(data["password"])
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "登録完了", "user": user.username})

    @app.route("/login", methods=["POST"])
    def login():
        data = request.json
        user = User.query.filter_by(username=data["username"]).first()
        if not user or not bcrypt.verify(data["password"], user.password_hash):
            return jsonify({"message": "ユーザー名またはパスワードが間違っています"}), 401
        return jsonify({"message": "ログイン成功", "user": user.username, "is_admin": user.is_admin})

    @app.route("/clock-in", methods=["POST"])
    def clock_in():
        data = request.json
        username = data.get("username")
        if not username:
            return jsonify({"message": "usernameが指定されていません"}), 400
        db.session.add(AttendanceLog(user=username, action="出勤"))
        db.session.commit()
        return jsonify({"message": f"{username} が出勤しました"})

    @app.route("/clock-out", methods=["POST"])
    def clock_out():
        data = request.json
        username = data.get("username")
        if not username:
            return jsonify({"message": "usernameが指定されていません"}), 400
        db.session.add(AttendanceLog(user=username, action="退勤"))
        db.session.commit()
        return jsonify({"message": f"{username} が退勤しました"})

    @app.route("/logs", methods=["GET"])
    def get_logs():
        username = request.args.get("username")
        if not username:
            return jsonify({"message": "usernameパラメータが必要です"}), 400
        logs = AttendanceLog.query.filter_by(user=username).all()
        return jsonify([{"action": log.action, "time": log.time.isoformat()} for log in logs])

    @app.route("/status", methods=["GET"])
    def get_status():
        users = User.query.all()
        result = []
        for user in users:
            latest = AttendanceLog.query.filter_by(user=user.username)\
                        .order_by(desc(AttendanceLog.time)).first()
            status = "出勤中" if latest and latest.action == "出勤" else "離席中"
            result.append({"username": user.username, "status": status})
        return jsonify(result)

    @app.route("/events", methods=["POST"])
    def create_event():
        data = request.json
        try:
            start = datetime.fromisoformat(data["start"])
            end = datetime.fromisoformat(data["end"])
        except (KeyError, ValueError):
            return jsonify({"message": "無効な日付形式"}), 400

        event = Event(
            user=data["user"],
            title=data["title"],
            start=start,
            end=end,
            all_day=data.get("all_day", False),
            color=data.get("color", "#3182ce")
        )
        db.session.add(event)
        db.session.commit()
        db.session.refresh(event)
        return jsonify({
            "id": event.id,
            "user": event.user,
            "title": event.title,
            "start": event.start.isoformat(),
            "end": event.end.isoformat(),
            "all_day": event.all_day,
            "color": event.color
        })

    @app.route("/events", methods=["GET"])
    def get_events():
        events = Event.query.all()
        return jsonify([
            {
                "id": e.id,
                "user": e.user,
                "title": e.title,
                "start": e.start.isoformat(),
                "end": e.end.isoformat(),
                "all_day": e.all_day,
                "color": e.color
            } for e in events
        ])

    @app.route("/todos", methods=["GET"])
    def get_todos():
        user = request.args.get("user")
        todos = Todo.query.filter_by(user=user).all()
        return jsonify([
            {"id": t.id, "title": t.title, "completed": t.completed}
            for t in todos
        ])

    @app.route("/todos", methods=["POST"])
    def add_todo():
        data = request.json
        todo = Todo(
            title=data["title"],
            user=data["user"],
            completed=False
        )
        db.session.add(todo)
        db.session.commit()
        return jsonify({"message": "追加しました"})

    @app.route("/todos/<int:todo_id>", methods=["PUT"])
    def toggle_todo(todo_id):
        todo = Todo.query.get(todo_id)
        if not todo:
            return jsonify({"message": "該当ToDoが見つかりません"}), 404
        todo.completed = not todo.completed
        db.session.commit()
        return jsonify({"message": "完了状態を更新しました"})

    @app.route("/todos/<int:todo_id>", methods=["DELETE"])
    def delete_todo(todo_id):
        todo = Todo.query.get(todo_id)
        if not todo:
            return jsonify({"message": "該当ToDoが見つかりません"}), 404
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "削除しました"})
