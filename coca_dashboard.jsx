import { useState, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USER = { id: 1, name: "Karim Benali", email: "k.benali@coca-cola.ma", role: "user" };
const MOCK_ADMIN = { id: 2, name: "Sara Idrissi", email: "s.idrissi@coca-cola.ma", role: "admin" };

const INITIAL_REQUESTS = [
  { id: 1, type: "Accès SAP Production", reason: "Migration données Q2", status: "accepted", date: "2025-04-20", admin: "Sara Idrissi" },
  { id: 2, type: "VPN Site Casablanca", reason: "Travail à distance", status: "pending", date: "2025-04-25", admin: null },
  { id: 3, type: "SharePoint Finance", reason: "Audit trimestriel", status: "rejected", date: "2025-04-18", admin: "Sara Idrissi" },
];

const ACCESS_TYPES = [
  "Accès SAP Production",
  "VPN Site Casablanca",
  "SharePoint Finance",
  "Base de données ERP",
  "Portail RH",
  "Tableau de bord Analytics",
  "Accès serveur FTP",
  "Active Directory",
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:  { label: "En attente", bg: "#FFF3CD", color: "#856404", dot: "#F5A623" },
    accepted: { label: "Accepté",    bg: "#D4EDDA", color: "#155724", dot: "#28A745" },
    rejected: { label: "Rejeté",     bg: "#F8D7DA", color: "#721C24", dot: "#DC3545" },
  };
  const s = map[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: s.bg, color: s.color,
      padding: "4px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    if (isSignup && !name) { setError("Le nom est requis."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Admin login demo
      if (email === "admin@coca-cola.ma") { onLogin(MOCK_ADMIN); return; }
      onLogin({ ...MOCK_USER, name: isSignup ? name : MOCK_USER.name });
    }, 900);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", fontFamily: "'Georgia', serif",
      background: "#0D0D0D",
    }}>
      {/* Left panel – branding */}
      <div style={{
        width: "45%", background: "#CC0000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        {[400, 300, 200].map((s, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            width: s, height: s,
            border: "1px solid rgba(255,255,255,0.08)",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
          }} />
        ))}
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Coca-Cola wordmark style */}
          <div style={{
            fontSize: 64, color: "#fff", lineHeight: 1,
            fontFamily: "'Georgia', serif", letterSpacing: "-2px",
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            marginBottom: 8,
          }}>
            Coca‑Cola
          </div>
          <div style={{
            color: "rgba(255,255,255,0.75)", fontSize: 13,
            letterSpacing: "4px", textTransform: "uppercase",
            fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 300,
            marginBottom: 48,
          }}>
            Access Management
          </div>
          <div style={{
            background: "rgba(0,0,0,0.2)", borderRadius: 16,
            padding: "24px 32px", color: "rgba(255,255,255,0.9)",
            fontSize: 14, lineHeight: 1.8,
            fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 300,
          }}>
            Faites votre demande d'accès<br />
            et suivez son statut en temps réel.<br />
            <span style={{ opacity: 0.6, fontSize: 12 }}>Fini les emails et les appels.</span>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 48px", background: "#0D0D0D",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              color: "#fff", fontSize: 28, fontWeight: 400,
              fontFamily: "'Georgia', serif", margin: 0, marginBottom: 8,
            }}>
              {isSignup ? "Créer un compte" : "Bon retour"}
            </h1>
            <p style={{ color: "#666", fontSize: 14, margin: 0, fontFamily: "sans-serif" }}>
              {isSignup ? "Rejoignez le portail d'accès Coca-Cola" : "Connectez-vous à votre espace"}
            </p>
          </div>

          {error && (
            <div style={{
              background: "#2A0A0A", border: "1px solid #CC0000",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20,
              color: "#FF6B6B", fontSize: 13, fontFamily: "sans-serif",
            }}>{error}</div>
          )}

          {isSignup && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6, fontFamily: "sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nom complet</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Karim Benali"
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6, fontFamily: "sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@coca-cola.ma"
              style={inputStyle}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6, fontFamily: "sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>Mot de passe</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 10,
              background: loading ? "#880000" : "#CC0000",
              color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontSize: 15, fontWeight: 600, letterSpacing: "0.03em",
              fontFamily: "sans-serif", transition: "all 0.2s",
            }}
          >
            {loading ? "Connexion..." : isSignup ? "Créer le compte" : "Se connecter"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              style={{
                background: "none", border: "none", color: "#CC0000",
                cursor: "pointer", fontSize: 13, fontFamily: "sans-serif",
              }}
            >
              {isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
            </button>
          </div>

          <div style={{ marginTop: 32, padding: "16px", background: "#1A1A1A", borderRadius: 8, fontFamily: "sans-serif" }}>
            <p style={{ color: "#555", fontSize: 11, margin: 0, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Comptes de démo</p>
            <p style={{ color: "#888", fontSize: 12, margin: 0 }}>Utilisateur : <span style={{ color: "#CC0000" }}>n'importe quel email</span></p>
            <p style={{ color: "#888", fontSize: 12, margin: 0 }}>Admin : <span style={{ color: "#CC0000" }}>admin@coca-cola.ma</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, requests, onNewRequest, onLogout, onApprove, onReject }) {
  const isAdmin = user.role === "admin";
  const myRequests = isAdmin ? requests : requests.filter(r => true); // admin sees all
  const pending = requests.filter(r => r.status === "pending").length;
  const accepted = requests.filter(r => r.status === "accepted").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F0", fontFamily: "sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: "#CC0000", padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(204,0,0,0.3)",
      }}>
        <span style={{ color: "#fff", fontSize: 20, fontFamily: "'Georgia', serif", letterSpacing: "-0.5px" }}>
          Coca‑Cola <span style={{ opacity: 0.7, fontSize: 13, fontFamily: "sans-serif", fontWeight: 300 }}>Access Portal</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {isAdmin ? "Administrateur" : "Employé"}
            </div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, fontWeight: 700,
          }}>
            {user.name.charAt(0)}
          </div>
          <button onClick={onLogout} style={{
            background: "rgba(0,0,0,0.2)", border: "none", color: "#fff",
            padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12,
          }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ padding: "40px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontFamily: "'Georgia', serif", color: "#1A1A1A" }}>
              {isAdmin ? "Tableau de bord Admin" : "Mes demandes d'accès"}
            </h1>
            <p style={{ margin: 0, marginTop: 4, color: "#888", fontSize: 14 }}>
              {isAdmin ? "Gérez et approuvez les demandes d'accès" : "Suivez l'état de vos demandes en temps réel"}
            </p>
          </div>
          {!isAdmin && (
            <button onClick={onNewRequest} style={{
              background: "#CC0000", color: "#fff", border: "none",
              padding: "12px 24px", borderRadius: 10, cursor: "pointer",
              fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(204,0,0,0.3)",
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nouvelle demande
            </button>
          )}
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "En attente", value: pending, color: "#F5A623", bg: "#FFFBF0" },
            { label: "Acceptées", value: accepted, color: "#28A745", bg: "#F0FFF4" },
            { label: "Rejetées", value: rejected, color: "#DC3545", bg: "#FFF5F5" },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 14, padding: "24px",
              border: `1px solid ${s.color}22`,
            }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: s.color, fontFamily: "'Georgia', serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Requests list */}
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>
              {isAdmin ? "Toutes les demandes" : "Historique des demandes"}
            </h2>
            <span style={{ fontSize: 12, color: "#999" }}>{myRequests.length} demande{myRequests.length > 1 ? "s" : ""}</span>
          </div>

          {myRequests.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#999" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <p style={{ margin: 0 }}>Aucune demande pour l'instant</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  {["Type d'accès", "Motif", "Date", "Statut", isAdmin ? "Actions" : "Traité par"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myRequests.map((req, i) => (
                  <tr key={req.id} style={{ borderTop: "1px solid #F5F5F5", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>{req.type}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "#666", maxWidth: 200 }}>{req.reason}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "#999" }}>{req.date}</td>
                    <td style={{ padding: "16px 24px" }}><StatusBadge status={req.status} /></td>
                    <td style={{ padding: "16px 24px" }}>
                      {isAdmin && req.status === "pending" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => onApprove(req.id)} style={{
                            background: "#D4EDDA", color: "#155724", border: "none",
                            padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}>✓ Accepter</button>
                          <button onClick={() => onReject(req.id)} style={{
                            background: "#F8D7DA", color: "#721C24", border: "none",
                            padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}>✗ Rejeter</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: "#999" }}>{req.admin || "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REQUEST FORM ─────────────────────────────────────────────────────────────
function RequestForm({ onSubmit, onCancel }) {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState("normal");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!type || !reason) { setError("Veuillez remplir tous les champs obligatoires."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => onSubmit({ type, reason, priority }), 1800);
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F0", fontFamily: "sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: "#CC0000", padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: "0 2px 12px rgba(204,0,0,0.3)",
      }}>
        <button onClick={onCancel} style={{ background: "rgba(0,0,0,0.2)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>←</button>
        <span style={{ color: "#fff", fontSize: 18, fontFamily: "'Georgia', serif" }}>Coca‑Cola <span style={{ opacity: 0.7, fontSize: 13, fontFamily: "sans-serif" }}>· Nouvelle demande</span></span>
      </nav>

      <div style={{ padding: "40px", maxWidth: 680, margin: "0 auto" }}>
        {submitted ? (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "60px 40px",
            textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Georgia', serif", color: "#1A1A1A", margin: 0, marginBottom: 8 }}>Demande envoyée !</h2>
            <p style={{ color: "#888", fontSize: 14 }}>Vous serez notifié dès qu'un administrateur aura traité votre demande.</p>
            <div style={{
              background: "#FFF3CD", border: "1px solid #F5A62344",
              borderRadius: 10, padding: "12px 20px", marginTop: 24,
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#856404", fontSize: 13,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5A623", display: "inline-block" }} />
              Statut : En attente de validation
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Form header */}
            <div style={{ background: "#1A1A1A", padding: "32px 40px" }}>
              <h1 style={{ margin: 0, color: "#fff", fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: 400 }}>
                Demande d'accès
              </h1>
              <p style={{ margin: 0, marginTop: 6, color: "#888", fontSize: 13 }}>
                Remplissez ce formulaire pour demander un accès à un système Coca-Cola.
              </p>
            </div>

            <div style={{ padding: "40px" }}>
              {error && (
                <div style={{ background: "#FFF5F5", border: "1px solid #FFCDD2", borderRadius: 8, padding: "12px 16px", marginBottom: 24, color: "#C62828", fontSize: 13 }}>{error}</div>
              )}

              {/* Type d'accès */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Type d'accès <span style={{ color: "#CC0000" }}>*</span></label>
                <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
                  <option value="">Sélectionnez un type d'accès...</option>
                  {ACCESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Priorité */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Priorité</label>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { value: "low", label: "Basse", color: "#28A745" },
                    { value: "normal", label: "Normale", color: "#F5A623" },
                    { value: "urgent", label: "Urgente", color: "#CC0000" },
                  ].map(p => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
                        border: `2px solid ${priority === p.value ? p.color : "#E5E5E5"}`,
                        background: priority === p.value ? `${p.color}15` : "#fff",
                        color: priority === p.value ? p.color : "#888",
                        fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motif */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Motif de la demande <span style={{ color: "#CC0000" }}>*</span></label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous avez besoin de cet accès..."
                  rows={4}
                  style={{ ...selectStyle, resize: "vertical", minHeight: 100 }}
                />
              </div>

              {/* Info box */}
              <div style={{
                background: "#F5F5F0", border: "1px solid #E5E5E0",
                borderRadius: 10, padding: "16px", marginBottom: 32,
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 18 }}>ℹ️</span>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                  Votre demande sera examinée par un administrateur. Vous verrez le statut mis à jour directement dans votre dashboard.
                  <strong style={{ color: "#1A1A1A" }}> Aucun email ni appel nécessaire.</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={onCancel} style={{
                  flex: 1, padding: "14px", borderRadius: 10,
                  background: "#fff", color: "#666", border: "1px solid #E5E5E5",
                  cursor: "pointer", fontSize: 14, fontWeight: 500,
                }}>
                  Annuler
                </button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex: 2, padding: "14px", borderRadius: 10,
                  background: loading ? "#880000" : "#CC0000",
                  color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 14, fontWeight: 600, boxShadow: "0 4px 14px rgba(204,0,0,0.3)",
                }}>
                  {loading ? "Envoi en cours..." : "Soumettre la demande →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 8,
  background: "#1A1A1A", border: "1px solid #2A2A2A",
  color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "sans-serif",
  transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block", marginBottom: 8,
  fontSize: 12, fontWeight: 600, color: "#555",
  textTransform: "uppercase", letterSpacing: "0.05em",
};

const selectStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 8,
  background: "#fff", border: "1px solid #E5E5E5",
  color: "#1A1A1A", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "sans-serif",
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("login"); // login | dashboard | form
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleLogin = (u) => { setUser(u); setPage("dashboard"); };
  const handleLogout = () => { setUser(null); setPage("login"); };

  const handleSubmitRequest = ({ type, reason, priority }) => {
    const newReq = {
      id: Date.now(), type, reason, priority,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      admin: null,
    };
    setRequests(prev => [newReq, ...prev]);
    setPage("dashboard");
  };

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted", admin: user.name } : r));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected", admin: user.name } : r));
  };

  if (page === "login") return <LoginPage onLogin={handleLogin} />;
  if (page === "form") return <RequestForm onSubmit={handleSubmitRequest} onCancel={() => setPage("dashboard")} />;
  return (
    <Dashboard
      user={user}
      requests={requests}
      onNewRequest={() => setPage("form")}
      onLogout={handleLogout}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
