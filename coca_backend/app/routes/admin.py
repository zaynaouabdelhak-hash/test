from functools import wraps
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.request import AccessRequest
from app.models.audit import AuditLog

admin_bp = Blueprint("admin", __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"error": "Accès réservé aux administrateurs."}), 403
        return fn(*args, **kwargs)
    return wrapper


# ── GET /admin/users/pending — comptes en attente d'approbation ───────────────
@admin_bp.route("/users/pending", methods=["GET"])
@admin_required
def pending_users():
    users = User.query.filter_by(is_approved=False, role="user").all()
    return jsonify({
        "users": [u.to_dict() for u in users],
        "total": len(users),
    }), 200


# ── PATCH /admin/users/<id>/approve — approuver un compte ────────────────────
@admin_bp.route("/users/<int:user_id>/approve", methods=["PATCH"])
@admin_required
def approve_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role == "admin":
        return jsonify({"error": "Impossible de modifier un admin."}), 400
    user.is_approved = True
    db.session.commit()
    return jsonify({"message": f"Compte de {user.name} approuvé."}), 200


# ── PATCH /admin/users/<id>/reject — rejeter et supprimer un compte ───────────
@admin_bp.route("/users/<int:user_id>/reject", methods=["DELETE"])
@admin_required
def reject_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role == "admin":
        return jsonify({"error": "Impossible de supprimer un admin."}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Compte de {user.name} rejeté et supprimé."}), 200


# ── GET /admin/requests ───────────────────────────────────────────────────────
@admin_bp.route("/requests", methods=["GET"])
@admin_required
def list_all_requests():
    status   = request.args.get("status")
    priority = request.args.get("priority")
    query = AccessRequest.query
    if status:
        query = query.filter_by(status=status)
    if priority:
        query = query.filter_by(priority=priority)
    items = query.order_by(AccessRequest.created_at.desc()).all()
    return jsonify({
        "requests": [r.to_dict(include_user=True) for r in items],
        "total": len(items),
    }), 200


# ── GET /admin/requests/stats ─────────────────────────────────────────────────
@admin_bp.route("/requests/stats", methods=["GET"])
@admin_required
def stats():
    total    = AccessRequest.query.count()
    pending  = AccessRequest.query.filter_by(status="pending").count()
    accepted = AccessRequest.query.filter_by(status="accepted").count()
    rejected = AccessRequest.query.filter_by(status="rejected").count()
    urgent   = AccessRequest.query.filter_by(priority="urgent", status="pending").count()
    pending_users = User.query.filter_by(is_approved=False, role="user").count()

    return jsonify({
        "total": total,
        "pending": pending,
        "accepted": accepted,
        "rejected": rejected,
        "urgent_pending": urgent,
        "pending_users": pending_users,  # ← comptes en attente
    }), 200


# ── PATCH /admin/requests/<id>/approve ───────────────────────────────────────
@admin_bp.route("/requests/<int:req_id>/approve", methods=["PATCH"])
@admin_required
def approve(req_id):
    admin_id = int(get_jwt_identity())
    req = AccessRequest.query.get_or_404(req_id)
    if req.status != "pending":
        return jsonify({"error": "Cette demande a déjà été traitée."}), 400
    data = request.get_json() or {}
    req.status   = "accepted"
    req.admin_id = admin_id
    log = AuditLog(request_id=req.id, admin_id=admin_id, action="approved", comment=data.get("comment"))
    db.session.add(log)
    db.session.commit()
    return jsonify({"message": "Demande acceptée.", "request": req.to_dict(include_user=True)}), 200


# ── PATCH /admin/requests/<id>/reject ────────────────────────────────────────
@admin_bp.route("/requests/<int:req_id>/reject", methods=["PATCH"])
@admin_required
def reject(req_id):
    admin_id = int(get_jwt_identity())
    req = AccessRequest.query.get_or_404(req_id)
    if req.status != "pending":
        return jsonify({"error": "Cette demande a déjà été traitée."}), 400
    data = request.get_json() or {}
    req.status   = "rejected"
    req.admin_id = admin_id
    log = AuditLog(request_id=req.id, admin_id=admin_id, action="rejected", comment=data.get("comment"))
    db.session.add(log)
    db.session.commit()
    return jsonify({"message": "Demande rejetée.", "request": req.to_dict(include_user=True)}), 200


# ── GET /admin/requests/<id>/logs ────────────────────────────────────────────
@admin_bp.route("/requests/<int:req_id>/logs", methods=["GET"])
@admin_required
def request_logs(req_id):
    req  = AccessRequest.query.get_or_404(req_id)
    logs = req.logs.order_by(AuditLog.timestamp.desc()).all()
    return jsonify({"logs": [l.to_dict() for l in logs]}), 200