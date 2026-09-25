import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/menu" aria-label="La Table, menu">
          <span className="brand-mark" aria-hidden="true">LT</span>
          <span>
            <strong>la table</strong>
            <small>CUISINE DE SAISON</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Navigation principale">
          <NavLink to="/menu">Le menu</NavLink>
          <NavLink to="/panier" className="cart-nav-link">
            Mon panier
            <span className="cart-count" aria-label={`${itemCount} articles`}>
              {itemCount}
            </span>
          </NavLink>
          <NavLink to="/mes-commandes">Mes commandes</NavLink>
        </nav>

        <div className="account-area">
          <span className="user-greeting">Bonjour, {user?.name.split(" ")[0]}</span>
          <button className="text-button logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}