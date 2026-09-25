import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const roleHome = {
  client: "/menu",
  staff: "/staff",
  admin: "/admin/menu",
};

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate(roleHome[user.role] ?? "/", { replace: true });
  }, [user, navigate]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(roleHome[result.user.role], { replace: true });
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Bienvenue à La Table">
        <div className="login-story-top">
          <span className="brand-mark brand-mark-light" aria-hidden="true">LT</span>
          <span className="story-label">MAISON DE CUISINE · DEPUIS 2018</span>
        </div>
        <div className="login-story-copy">
          <p className="eyebrow eyebrow-light">À TABLE, TOUT SIMPLEMENT</p>
          <h1>Les bons moments commencent par un bon repas.</h1>
          <p>Découvrez notre cuisine de saison et commandez en toute simplicité.</p>
        </div>
        <div className="story-bottom">
          <span>Des produits frais, chaque jour.</span>
          <span>01 — 03</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          <div className="login-mobile-brand">
            <span className="brand-mark" aria-hidden="true">LT</span>
            <strong>la table</strong>
          </div>
          <p className="eyebrow">VOTRE ESPACE CLIENT</p>
          <h2>Ravi de vous revoir.</h2>
          <p className="login-intro">Connectez-vous pour découvrir le menu du jour.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button login-submit" type="submit">
              Se connecter <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="demo-accounts">
            <p>Comptes de démonstration</p>
            <div>
              <span>Client</span>
              <code>client@test.com · client123</code>
            </div>
            <div>
              <span>Équipe</span>
              <code>staff@test.com · staff123</code>
            </div>
            <div>
              <span>Admin</span>
              <code>admin@test.com · admin123</code>
            </div>
          </div>
          <p className="login-footnote">
            Vous serez dirigé vers votre espace après connexion.
            {location.state?.from ? " Votre page vous attend." : ""}
          </p>
        </div>
      </section>
    </main>
  );
}