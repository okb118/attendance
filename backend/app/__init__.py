from flask import Flask
from flask_cors import CORS
from app.routes import register_routes
from app.db import init_db

def create_app():
    app = Flask(__name__)

    # CORS設定の強化：methods/headers を明示してトラブル回避
    CORS(app, resources={r"/*": {
        "origins": "http://localhost:3000",
        "supports_credentials": True,
        "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})

    init_db()
    register_routes(app)

    return app