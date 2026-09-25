import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../api/orders.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import RoleHeader from "../components/RoleHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/format.js";

const nextStatusOf = { recue: "en_preparation", en_preparation: "prete" };
const actionLabel = { recue: "Démarrer la préparation", en_preparation: "Marquer prête" };

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function StaffDashboardPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchAllOrders(token)
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

  async function advanceStatus(order) {
    const next = nextStatusOf[order.status];
    if (!next) return;
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(token, order.id, next);
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      // La commande garde son statut précédent si la mise à jour échoue.
    } finally {
      setUpdatingId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="placeholder-page">
        <RoleHeader roleLabel="ÉQUIPE" />
        <div className="content-narrow">
          <p className="page-status">Chargement des commandes…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="placeholder-page">
        <RoleHeader roleLabel="ÉQUIPE" />
        <div className="content-narrow">
          <p className="page-status page-status-error">Impossible de charger les commandes pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="placeholder-page">
      <RoleHeader roleLabel="ÉQUIPE" />
      <div className="content-narrow">
        <section className="page-intro compact-intro">
          <p className="eyebrow">TABLEAU DE BORD</p>
          <h1>Commandes en cours</h1>
        </section>

        {orders.length === 0 ? (
          <section className="empty-state">
            <span className="empty-mark" aria-hidden="true">01</span>
            <h2>Aucune commande pour le moment.</h2>
          </section>
        ) : (
          <section className="orders-list" aria-label="Commandes des clients">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-top">
                  <div>
                    <span className="order-reference">
                      COMMANDE N° {String(order.id).padStart(6, "0")} · {order.customerName}
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
                  {nextStatusOf[order.status] && (
                    <button
                      className="button button-small"
                      onClick={() => advanceStatus(order)}
                      disabled={updatingId === order.id}
                    >
                      {updatingId === order.id ? "…" : actionLabel[order.status]}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
