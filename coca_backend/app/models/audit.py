from datetime import datetime, timezone
from app import db


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id         = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey("access_requests.id"), nullable=False)
    admin_id   = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    action     = db.Column(db.String(50), nullable=False)  # "approved" | "rejected"
    comment    = db.Column(db.Text, nullable=True)
    timestamp  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    request = db.relationship("AccessRequest", back_populates="logs")
    admin   = db.relationship("User", back_populates="audit_actions", foreign_keys=[admin_id])

    def to_dict(self):
        return {
            "id":         self.id,
            "request_id": self.request_id,
            "admin":      self.admin.name if self.admin else None,
            "action":     self.action,
            "comment":    self.comment,
            "timestamp":  self.timestamp.isoformat(),
        }