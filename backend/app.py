from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from passlib.hash import bcrypt
from sqlalchemy import create_engine, Column, Integer, String, DateTime, desc
from sqlalchemy.orm import declarative_base, sessionmaker

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# SQLite DB設定
engine = create_engine("sqlite:///logs.db", connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

# DBモデル定義
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_admin = Column(Integer, default=0)

class AttendanceLog(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    action = Column(String)
    time = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    title = Column(String)
    start = Column(DateTime)
    end = Column(DateTime)
    color = Column(String, default="#3182ce")

Base.metadata.create_all(bind=engine)

# 初期管理者自動追加
with SessionLocal() as db:
    if not db.query(User).filter(User.username == "admin").first():
        admin = User(username="admin", password_hash=bcrypt.hash("admin123"), is_admin=1)
        db.add(admin)
        db.commit()

@app.route("/register", methods=["POST"])
def register():
    db = SessionLocal()
    data = request.json
    if db.query(User).filter(User.username == data["username"]).first():
        return jsonify({"detail": "そのユーザー名は既に存在します"}), 400
    user = User(username=data["username"], password_hash=bcrypt.hash(data["password"]))
    db.add(user)
    db.commit()
    return jsonify({"message": "登録完了", "user": user.username})

@app.route("/login", methods=["POST"])
def login():
    db = SessionLocal()
    data = request.json
    user = db.query(User).filter(User.username == data["username"]).first()
    if not user or not bcrypt.verify(data["password"], user.password_hash):
        return jsonify({"detail": "ユーザー名またはパスワードが間違っています"}), 401
    return jsonify({"message": "ログイン成功", "user": user.username, "is_admin": user.is_admin})

@app.route("/clock-in", methods=["POST"])
def clock_in():
    db = SessionLocal()
    username = request.args.get("username")
    db.add(AttendanceLog(user=username, action="出勤"))
    db.commit()
    return jsonify({"message": f"{username} が出勤しました"})

@app.route("/clock-out", methods=["POST"])
def clock_out():
    db = SessionLocal()
    username = request.args.get("username")
    db.add(AttendanceLog(user=username, action="退勤"))
    db.commit()
    return jsonify({"message": f"{username} が退勤しました"})

@app.route("/logs", methods=["GET"])
def get_logs():
    db = SessionLocal()
    username = request.args.get("username")
    logs = db.query(AttendanceLog).filter(AttendanceLog.user == username).all()
    return jsonify([{"action": log.action, "time": log.time.isoformat()} for log in logs])

@app.route("/status", methods=["GET"])
def get_status():
    db = SessionLocal()
    users = db.query(User).all()
    result = []
    for user in users:
        latest = db.query(AttendanceLog).filter(
            AttendanceLog.user == user.username
        ).order_by(desc(AttendanceLog.time)).first()
        status = "不明"
        if latest:
            status = "出勤中" if latest.action == "出勤" else "離席中"
        result.append({"username": user.username, "status": status})
    return jsonify(result)

@app.route("/admin/users", methods=["GET"])
def list_users():
    db = SessionLocal()
    admin = request.args.get("admin")
    if not db.query(User).filter(User.username == admin, User.is_admin == 1).first():
        return jsonify({"detail": "管理者権限がありません"}), 403
    users = db.query(User).all()
    return jsonify([
        {"id": u.id, "username": u.username, "is_admin": u.is_admin}
        for u in users
    ])

@app.route("/admin/users", methods=["POST"])
def create_user():
    db = SessionLocal()
    admin = request.args.get("admin")
    if not db.query(User).filter(User.username == admin, User.is_admin == 1).first():
        return jsonify({"detail": "管理者権限がありません"}), 403
    data = request.json
    if db.query(User).filter(User.username == data["username"]).first():
        return jsonify({"detail": "既に存在するユーザーです"}), 400
    db.add(User(username=data["username"], password_hash=bcrypt.hash(data["password"])))
    db.commit()
    return jsonify({"message": "登録成功"})

@app.route("/admin/users/<username>", methods=["DELETE"])
def delete_user(username):
    db = SessionLocal()
    admin = request.args.get("admin")
    if username == "admin":
        return jsonify({"detail": "管理者アカウントは削除できません"}), 403
    if not db.query(User).filter(User.username == admin, User.is_admin == 1).first():
        return jsonify({"detail": "管理者権限がありません"}), 403
    target = db.query(User).filter(User.username == username).first()
    if not target:
        return jsonify({"detail": "ユーザーが見つかりません"}), 404
    db.delete(target)
    db.commit()
    return jsonify({"message": "削除成功"})

@app.route("/events", methods=["GET"])
def get_events():
    db = SessionLocal()
    user = request.args.get("user")
    query = db.query(Event)
    if user:
        query = query.filter(Event.user == user)
    events = query.all()
    return jsonify([
        {
            "id": e.id,
            "user": e.user,
            "title": e.title,
            "start": e.start.isoformat(),
            "end": e.end.isoformat(),
            "color": e.color
        } for e in events
    ])

@app.route("/events", methods=["POST"])
def create_event():
    db = SessionLocal()
    data = request.json
    e = Event(
        user=data["user"],
        title=data["title"],
        start=datetime.fromisoformat(data["start"]),
        end=datetime.fromisoformat(data["end"]),
        color=data.get("color", "#3182ce")
    )
    db.add(e)
    db.commit()
    db.refresh(e)
    return jsonify({
        "id": e.id,
        "user": e.user,
        "title": e.title,
        "start": e.start.isoformat(),
        "end": e.end.isoformat(),
        "color": e.color
    })

@app.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    db = SessionLocal()
    e = db.query(Event).filter(Event.id == event_id).first()
    if not e:
        return jsonify({"detail": "イベントが見つかりません"}), 404
    db.delete(e)
    db.commit()
    return jsonify({"message": "削除しました"})

if __name__ == "__main__":
    app.run(debug=True)