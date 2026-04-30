from datetime import datetime, timezone
import hashlib
from app import db


class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(120), nullable=False)
    email         = db.Column(db.String(180), unique=True, nullable=False, index=True)
    email_hash    = db.Column(db.String(64), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role          = db.Column(db.String(20), nullable=False, default="user")
    is_approved   = db.Column(db.Boolean, default=False)  # ← admin doit approuver
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    requests = db.relationship("AccessRequest", back_populates="user",
                                foreign_keys="AccessRequest.user_id", lazy="dynamic")
    approved_requests = db.relationship("AccessRequest", back_populates="admin",
                                         foreign_keys="AccessRequest.admin_id", lazy="dynamic")
    audit_actions = db.relationship("AuditLog", back_populates="admin",
                                     foreign_keys="AuditLog.admin_id", lazy="dynamic")

    @staticmethod
    def hash_email(email):
        return hashlib.sha256(email.lower().strip().encode()).hexdigest()

    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "email":       self.email,
            "role":        self.role,
            "is_approved": self.is_approved,
            "created_at":  self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.email} [{self.role}]>"