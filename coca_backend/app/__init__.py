from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app(config_name="default"):
    app = Flask(__name__)

    from config import config
    app.config.from_object(config[config_name])

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    from app.routes.auth import auth_bp
    from app.routes.requests import requests_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp,     url_prefix="/auth")
    app.register_blueprint(requests_bp, url_prefix="/requests")
    app.register_blueprint(admin_bp,    url_prefix="/admin")

    with app.app_context():
        db.create_all()
        _seed_admin()

    @app.route("/health")
    def health():
        return {"status": "ok", "service": "CBGS Access Portal"}

    return app


def _seed_admin():
    from app.models.user import User
    from app import bcrypt

    existing = User.query.filter_by(email="zanouch72@gmail.com").first()
    if existing:
        print("✅ Admin déjà existant, rien à faire.")
        return  # ← on ne touche à rien

    admin = User(
        name="zanouch",
        email="zanouch72@gmail.com",
        email_hash=User.hash_email("zanouch72@gmail.com"),
        password_hash=bcrypt.generate_password_hash("Admin123").decode("utf-8"),
        role="admin",
        is_approved=True,
    )
    db.session.add(admin)
    db.session.commit()
    print("✅ Admin créé : zanouch / Admin123")