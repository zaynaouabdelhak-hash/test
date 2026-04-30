import os
from datetime import timedelta

class Config:
    # ── Sécurité ──────────────────────────────────────────────
    SECRET_KEY = os.getenv("SECRET_KEY", "coca-secret-change-in-prod")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    # ── Base de données ───────────────────────────────────────
    # PostgreSQL en prod : postgresql://user:password@localhost/coca_db
    # SQLite en dev       : sqlite:///coca.db
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///coca.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ── CORS ──────────────────────────────────────────────────
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}