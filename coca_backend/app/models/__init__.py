from app.models.user import User
from app.models.request import AccessRequest
from app.models.audit import AuditLog


def _seed_admin():
    from app.models.user import User
    from app import bcrypt

    old = User.query.filter_by(role="admin").first()
    if old:
        db.session.delete(old)
        db.session.commit()

    admin = User(
        name="zanouch",
        email="zanouch72@gmail.com",
        email_hash=User.hash_email("zanouch72@gmail.com"),
        password_hash=bcrypt.generate_password_hash("Admin123").decode("utf-8"),
        role="admin",
        is_approved=True,              # ← cette ligne manquait !
    )
    db.session.add(admin)
    db.session.commit()
    print("✅ Admin créé : zanouch72@gmail.com / Admin123")