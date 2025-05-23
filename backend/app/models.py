from sqlalchemy import Column, Integer, String, DateTime, Boolean
from .db import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_admin = Column(Integer, default=0)

class AttendanceLog(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True)
    user = Column(String, index=True)
    action = Column(String)
    time = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    user = Column(String, index=True)         # 誰が作ったか
    title = Column(String)                    # イベント名
    start = Column(DateTime)                  # 開始時間
    end = Column(DateTime)                    # 終了時間
    all_day = Column(Boolean, default=False)  # 終日イベントか
    color = Column(String, default="#3182ce") # 色指定