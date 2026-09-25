import { useNavigate } from "react-router-dom";
import CartItemRow from "../components/CartItemRow.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";

function readOrders(userId) {
  try {
    const orders = JSON.parse(localStorage.getItem(`la-table-orders-${userId}`));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function writeOrders(userId, orders) {
  localStorage.setItem(`la-table-orders-${userId}`, JSON.stringify(orders));
}

export default function CartPage() {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  function placeOrder() {
    if (items.length === 0) return;

    const existingOrders = readOrders(user.id);
    const lastId = existingOrders.reduce(
      (highest, order) => Math.max(highest, Number(order.id) || 0),
      0,
    );
    const order = {
      id: Math.max(Date.now(), lastId + 1),
      status: "recue",
      total,
      createdAt: new Date().toISOString(),
      items: items.map(({ menuItemId, name, price, quantity }) => ({
        menuItemId,
        name,
        price,
        quantity,
      })),
    };

    writeOrders(user.id, [order, ...existingOrders]);
    clearCart();
    navigate("/mes-commandes");
  }

  return (
    <div className="content-narrow">
      <section className="page-intro compact-intro">
        <p className="eyebrow">VOTRE SÉLECTION</p>
        <h1>Mon panier</h1>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <span className="empty-mark" aria-hidden="true">01</span>
          <h2>Votre panier est encore vide.</h2>
          <p>Parcourez le menu et choisissez ce qui vous ferait plaisir.</p>
          <button className="button" onClick={() => navigate("/menu")}>
            Découvrir le menu <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-list" aria-label="Articles de votre panier">
            <div className="cart-list-heading">
              <span>{items.reduce((count, item) => count + item.quantity, 0)} article(s)</span>
              <span>Prix</span>
            </div>
            {items.map((item) => (
              <CartItemRow
                key={item.menuItemId}
                item={item}
                onChangeQuantity={(quantity) =>
                  updateQuantity(item.menuItemId, quantity)
                }
                onRemove={() => removeItem(item.menuItemId)}
              />
            ))}
          </section>
          <aside className="order-summary">
            <p className="eyebrow">RÉCAPITULATIF</p>
            <div className="summary-row">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Préparation</span>
              <span>Incluse</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="button checkout-button" onClick={placeOrder}>
              Valider la commande <span aria-hidden="true">→</span>
            </button>
            <p className="summary-note">Votre commande sera transmise à notre équipe.</p>
          </aside>
        </div>
      )}
    </div>
  );
}