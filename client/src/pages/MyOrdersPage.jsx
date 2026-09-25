import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/format.js";

function readOrders(userId) {
  try {
    const orders = JSON.parse(localStorage.getItem(`la-table-orders-${userId}`));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(() => readOrders(user.id));

  useEffect(() => {
    setOrders(readOrders(user.id));
  }, [user.id]);

  const sortedOrders = [...orders].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  );

  return (
    <div className="content-narrow">
      <section className="page-intro compact-intro">
        <p className="eyebrow">VOTRE HISTORIQUE</p>
        <h1>Mes commandes</h1>
        <p>Retrouvez ici toutes vos commandes passées.</p>
      </section>

      {sortedOrders.length === 0 ? (
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
          {sortedOrders.map((order, index) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <span className="order-reference">COMMANDE N° {String(order.id).slice(-6)}</span>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={`${order.id}-${item.menuItemId}`}>
                    <span><strong>{item.quantity}</strong> × {item.name}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="order-card-bottom">
                <span>{order.items.length} référence{order.items.length > 1 ? "s" : ""}</span>
                <span>Total <strong>{formatPrice(order.total)}</strong></span>
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