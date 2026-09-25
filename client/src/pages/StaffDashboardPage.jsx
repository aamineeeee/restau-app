import { useState } from "react";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import RoleHeader from "../components/RoleHeader.jsx";
import { mockOrders } from "../data/mockOrders.js";
import { formatPrice } from "../utils/format.js";

const nextStatus = { recue: "en_preparation", en_preparation: "prete" };
const actionLabel = { recue: "Démarrer la préparation", en_preparation: "Marquer prête" };

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState(mockOrders);

  function advanceStatus(orderId) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId && nextStatus[order.status]
          ? { ...order, status: nextStatus[order.status] }
          : order,
      ),
    );
  }

  const sortedOrders = [...orders].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  );

  return (
    <div className="placeholder-page">
      <RoleHeader roleLabel="ÉQUIPE" />
      <div className="content-narrow">
        <section className="page-intro compact-intro">
          <p className="eyebrow">TABLEAU DE BORD</p>
          <h1>Commandes en cours</h1>
        </section>

        <section className="orders-list" aria-label="Commandes des clients">
          {sortedOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <span className="order-reference">
                    COMMANDE N° {String(order.id).slice(-6)} · {order.customerName}
                  </span>
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
                <span>
                  Total <strong>{formatPrice(order.total)}</strong>
                </span>
                {nextStatus[order.status] && (
                  <button className="button button-small" onClick={() => advanceStatus(order.id)}>
                    {actionLabel[order.status]}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
