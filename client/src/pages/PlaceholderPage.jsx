import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PlaceholderPage({ roleLabel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="placeholder-page">
      <div className="placeholder-top">
        <Link className="brand" to="/" aria-label="La Table, accueil">
          <span className="brand-mark" aria-hidden="true">LT</span>
          <span><strong>la table</strong><small>CUISINE DE SAISON</small></span>
        </Link>
        <div className="account-area">
          <span className="user-greeting">{user?.name}</span>
          <button className="text-button" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
      <section className="placeholder-content">
        <p className="eyebrow">ESPACE {roleLabel.toUpperCase()}</p>
        <span className="placeholder-number">02</span>
        <h1>Bientôt disponible.</h1>
        <p>Cet espace est en cours de préparation.</p>
      </section>
    </main>
  );
}