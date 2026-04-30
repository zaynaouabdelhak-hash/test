from datetime import datetime, timezone
from app import db


class AccessRequest(db.Model):
    __tablename__ = "access_requests"

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    type_access = db.Column(db.String(200), nullable=False)
    reason      = db.Column(db.Text, nullable=False)
    priority    = db.Column(db.String(20), default="normal")   # low | normal | urgent
    status      = db.Column(db.String(20), default="pending")  # pending | accepted | rejected
    admin_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))

    # Relations
    user  = db.relationship("User", back_populates="requests",           foreign_keys=[user_id])
    admin = db.relationship("User", back_populates="approved_requests",  foreign_keys=[admin_id])
    logs  = db.relationship("AuditLog", back_populates="request", lazy="dynamic")

    def to_dict(self, include_user=False):
        data = {
            "id":          self.id,
            "type_access": self.type_access,
            "reason":      self.reason,
            "priority":    self.priority,
            "status":      self.status,
            "admin":       self.admin.name if self.admin else None,
            "created_at":  self.created_at.isoformat(),
            "updated_at":  self.updated_at.isoformat(),
        }
        if include_user and self.user:
            data["user"] = {"id": self.user.id, "name": self.user.name, "email": self.user.email}
        return data

    def __repr__(self):
        return f"<AccessRequest #{self.id} [{self.status}]>"