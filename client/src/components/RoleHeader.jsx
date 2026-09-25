import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RoleHeader({ roleLabel, navLinks }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="placeholder-top">
      <Link className="brand" to="/" aria-label="La Table, accueil">
        <span className="brand-mark" aria-hidden="true">LT</span>
        <span>
          <strong>la table</strong>
          <small>{roleLabel}</small>
        </span>
      </Link>
      {navLinks && (
        <nav className="admin-nav" aria-label="Navigation">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
      <div className="account-area">
        <span className="user-greeting">{user?.name}</span>
        <button className="text-button" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}
