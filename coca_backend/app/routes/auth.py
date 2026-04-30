from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

ALLOWED_DOMAINS = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"]

def is_valid_email_domain(email):
    try:
        domain = email.strip().lower().split("@")[1]
        return domain in ALLOWED_DOMAINS
    except:
        return False


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required = ["name", "email", "password"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Champs manquants : {', '.join(missing)}"}), 400

    if len(data["password"]) < 8:
        return jsonify({"error": "Le mot de passe doit contenir au moins 8 caractères."}), 400

    if not is_valid_email_domain(data["email"]):
        return jsonify({"error": "Seuls les emails gmail.com, outlook.com, hotmail.com et yahoo.com sont acceptés."}), 400

    email_hash = User.hash_email(data["email"])

    if User.query.filter_by(email_hash=email_hash).first():
        return jsonify({"error": "Cet email est déjà utilisé."}), 409

    # ← is_approved=False par défaut, l'admin doit approuver
    user = User(
        name=data["name"].strip(),
        email=data["email"].lower().strip(),
        email_hash=email_hash,
        password_hash=bcrypt.generate_password_hash(data["password"]).decode("utf-8"),
        role="user",
        is_approved=False,
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Compte créé. En attente de validation par l'administrateur."
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email et mot de passe requis."}), 400

    email_hash = User.hash_email(data["email"])
    user = User.query.filter_by(email_hash=email_hash).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Email ou mot de passe incorrect."}), 401

    # ← bloque si pas approuvé
    if not user.is_approved:
        return jsonify({"error": "Votre compte est en attente de validation par l'administrateur."}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    return jsonify({"user": user.to_dict()}), 200