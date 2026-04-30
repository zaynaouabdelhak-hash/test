from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.request import AccessRequest

requests_bp = Blueprint("requests", __name__)

VALID_PRIORITIES = {"low", "normal", "urgent"}
VALID_TYPES = [
    "Accès SAP Production",
    "VPN Site Casablanca",
    "SharePoint Finance",
    "Base de données ERP",
    "Portail RH",
    "Tableau de bord Analytics",
    "Accès serveur FTP",
    "Active Directory",
]


# ── GET /requests  — liste des demandes de l'utilisateur connecté ─────────────
@requests_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_requests():
    user_id = int(get_jwt_identity())
    status  = request.args.get("status")          # filtre optionnel

    query = AccessRequest.query.filter_by(user_id=user_id)
    if status:
        query = query.filter_by(status=status)

    items = query.order_by(AccessRequest.created_at.desc()).all()
    return jsonify({"requests": [r.to_dict() for r in items]}), 200


# ── POST /requests/new  — créer une demande ───────────────────────────────────
@requests_bp.route("/new", methods=["POST"])
@jwt_required()
def create_request():
    user_id = int(get_jwt_identity())
    data    = request.get_json()

    # Validation
    if not data.get("type_access"):
        return jsonify({"error": "Le type d'accès est requis."}), 400
    if not data.get("reason") or len(data["reason"].strip()) < 10:
        return jsonify({"error": "Le motif doit contenir au moins 10 caractères."}), 400
    priority = data.get("priority", "normal")
    if priority not in VALID_PRIORITIES:
        return jsonify({"error": f"Priorité invalide. Valeurs : {VALID_PRIORITIES}"}), 400

    req = AccessRequest(
        user_id=user_id,
        type_access=data["type_access"].strip(),
        reason=data["reason"].strip(),
        priority=priority,
        status="pending",
    )
    db.session.add(req)
    db.session.commit()

    return jsonify({"message": "Demande créée avec succès.", "request": req.to_dict()}), 201


# ── GET /requests/<id>  — détail d'une demande ───────────────────────────────
@requests_bp.route("/<int:req_id>", methods=["GET"])
@jwt_required()
def get_request(req_id):
    user_id = int(get_jwt_identity())
    req = AccessRequest.query.get_or_404(req_id)

    # Un utilisateur ne peut voir que ses propres demandes
    user = User.query.get(user_id)
    if user.role != "admin" and req.user_id != user_id:
        return jsonify({"error": "Accès refusé."}), 403

    return jsonify({"request": req.to_dict()}), 200


# ── DELETE /requests/<id>  — annuler une demande en attente ──────────────────
@requests_bp.route("/<int:req_id>", methods=["DELETE"])
@jwt_required()
def cancel_request(req_id):
    user_id = int(get_jwt_identity())
    req = AccessRequest.query.get_or_404(req_id)

    if req.user_id != user_id:
        return jsonify({"error": "Accès refusé."}), 403
    if req.status != "pending":
        return jsonify({"error": "Seules les demandes en attente peuvent être annulées."}), 400

    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Demande annulée."}), 200