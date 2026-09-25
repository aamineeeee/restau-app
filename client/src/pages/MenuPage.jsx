import { useEffect, useMemo, useState } from "react";
import { fetchMenu } from "../api/menu.js";
import MenuItemCard from "../components/MenuItemCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function MenuPage() {
  const { token } = useAuth();
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchMenu(token)
      .then((data) => {
        if (!cancelled) {
          setMenu(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const categories = useMemo(() => [...new Set(menu.map((item) => item.category))], [menu]);

  if (status === "loading") {
    return (
      <div className="content-narrow">
        <p className="page-status">Chargement du menu…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="content-narrow">
        <p className="page-status page-status-error">Impossible de charger le menu pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="content-narrow">
      <section className="page-intro menu-intro">
        <p className="eyebrow">CUISINÉ AU FIL DES SAISONS</p>
        <h1>Le menu</h1>
        <p>Des produits choisis avec soin, des assiettes faites maison.</p>
      </section>
      {categories.map((category, index) => (
        <section className="menu-category" key={category}>
          <div className="section-heading">
            <div>
              <span className="section-index">0{index + 1}</span>
              <h2>{category}</h2>
            </div>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="menu-grid">
            {menu
              .filter((item) => item.category === category)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
