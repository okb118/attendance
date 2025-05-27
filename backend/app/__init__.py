from flask import Flask
from flask_cors import CORS  # ← 追加
from app.db import db
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///logs.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ★ CORS設定（Reactと同じlocalhost:3000を許可）
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    db.init_app(app)
    register_routes(app)

    return app
