from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.hash import bcrypt
from sqlalchemy import create_engine, Column, Integer, String, DateTime, desc
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///logs.db", connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

# データベースモデル
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

# Pydanticモデル
class LoginData(BaseModel):
    username: str
    password: str

class RegisterData(BaseModel):
    username: str
    password: str

class EventCreate(BaseModel):
    user: str
    title: str
    start: datetime
    end: datetime
    color: str = "#3182ce"

class EventOut(BaseModel):
    id: int
    user: str
    title: str
    start: datetime
    end: datetime
    color: str

    class Config:
        from_attributes = True

# DBセッション依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 初期管理者追加（削除されていたら再生成）
with SessionLocal() as db:
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        db.add(User(username="admin", password_hash=bcrypt.hash("admin123"), is_admin=1))
        db.commit()

# 登録API
@app.post("/register")
def register(data: RegisterData, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="そのユーザー名は既に存在します")
    db.add(User(username=data.username, password_hash=bcrypt.hash(data.password)))
    db.commit()
    return {"message": "登録完了", "user": data.username}

# ログインAPI
@app.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not bcrypt.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが間違っています")
    return {"message": "ログイン成功", "user": user.username, "is_admin": user.is_admin}

# 出勤・退勤
@app.post("/clock-in")
def clock_in(username: str, db: Session = Depends(get_db)):
    db.add(AttendanceLog(user=username, action="出勤"))
    db.commit()
    return {"message": f"{username} が出勤しました"}

@app.post("/clock-out")
def clock_out(username: str, db: Session = Depends(get_db)):
    db.add(AttendanceLog(user=username, action="退勤"))
    db.commit()
    return {"message": f"{username} が退勤しました"}

# 出退勤ログ取得（個人）
@app.get("/logs")
def get_logs(username: str, db: Session = Depends(get_db)):
    return db.query(AttendanceLog).filter(AttendanceLog.user == username).all()

# 出退勤ステータス（全員）
@app.get("/status")
def get_status(db: Session = Depends(get_db)):
    users = db.query(User).all()
    result = []
    for user in users:
        log = db.query(AttendanceLog).filter(AttendanceLog.user == user.username).order_by(desc(AttendanceLog.time)).first()
        status = "不明"
        if log:
            status = "出勤中" if log.action == "出勤" else "離席中"
        result.append({"username": user.username, "status": status})
    return result

# 管理者：ユーザー一覧
@app.get("/admin/users")
def list_users(admin: str, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.username == admin, User.is_admin == 1).first():
        raise HTTPException(status_code=403, detail="管理者権限がありません")
    return db.query(User).all()

# 管理者：ユーザー登録
@app.post("/admin/users")
def create_user(data: RegisterData, admin: str, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.username == admin, User.is_admin == 1).first():
        raise HTTPException(status_code=403, detail="管理者権限がありません")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="既に存在するユーザーです")
    db.add(User(username=data.username, password_hash=bcrypt.hash(data.password)))
    db.commit()
    return {"message": "登録成功"}

# 管理者：ユーザー削除（admin本人は削除不可）
@app.delete("/admin/users/{username}")
def delete_user(username: str, admin: str, db: Session = Depends(get_db)):
    if username == "admin":
        raise HTTPException(status_code=403, detail="管理者アカウントは削除できません")
    if not db.query(User).filter(User.username == admin, User.is_admin == 1).first():
        raise HTTPException(status_code=403, detail="管理者権限がありません")
    target = db.query(User).filter(User.username == username).first()
    if not target:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    db.delete(target)
    db.commit()
    return {"message": "削除成功"}

# カレンダー：イベント取得
@app.get("/events", response_model=List[EventOut])
def get_events(user: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Event)
    if user:
        query = query.filter(Event.user == user)
    return query.all()

# カレンダー：イベント登録
@app.post("/events", response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    e = Event(**event.dict())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e

# カレンダー：イベント削除
@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    target = db.query(Event).filter(Event.id == event_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="イベントが見つかりません")
    db.delete(target)
    db.commit()
    return {"message": "削除しました"}
