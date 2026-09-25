import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../api/orders.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/format.js";

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MyOrdersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchMyOrders(token)
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
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

  if (status === "loading") {
    return (
      <div className="content-narrow">
        <p className="page-status">Chargement de vos commandes…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="content-narrow">
        <p className="page-status page-status-error">Impossible de charger vos commandes pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="content-narrow">
      <section className="page-intro compact-intro">
        <p className="eyebrow">VOTRE HISTORIQUE</p>
        <h1>Mes commandes</h1>
        <p>Retrouvez ici toutes vos commandes passées.</p>
      </section>

      {orders.length === 0 ? (
        <section className="empty-state orders-empty">
          <span className="empty-mark" aria-hidden="true">02</span>
          <h2>Pas encore de commande.</h2>
          <p>Votre prochaine belle assiette n’est qu’à quelques clics.</p>
          <button className="button" onClick={() => navigate("/menu")}>
            Voir le menu <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : (
        <section className="orders-list" aria-label="Historique des commandes">
          {orders.map((order, index) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <span className="order-reference">COMMANDE N° {String(order.id).padStart(6, "0")}</span>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={`${order.id}-${item.menuItemId}`}>
                    <span>
                      <strong>{item.quantity}</strong> × {item.name}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="order-card-bottom">
                <span>{order.items.length} référence{order.items.length > 1 ? "s" : ""}</span>
                <span>
                  Total <strong>{formatPrice(order.total)}</strong>
                </span>
              </div>
              <span className="order-list-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
