import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem(item, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className="menu-card">
      <div className={`dish-art dish-art-${item.id}`} aria-hidden="true">
        <span className="dish-art-index">0{item.id}</span>
        <span className="dish-art-category">{item.category}</span>
      </div>
      <div className="menu-card-body">
        <div className="menu-card-heading">
          <h3>{item.name}</h3>
          <span className="menu-price">{formatPrice(item.price)}</span>
        </div>
        <p>{item.description}</p>
        <div className="menu-card-actions">
          <label className="quantity-label">
            <span className="visually-hidden">Quantité pour {item.name}</span>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.min(20, Math.max(1, Number(event.target.value) || 1)))
              }
            />
          </label>
          <button className="button button-small" onClick={handleAdd}>
            {justAdded ? "Ajouté" : "Ajouter au panier"}
          </button>
        </div>
        <span className="visually-hidden" aria-live="polite">
          {justAdded ? `${item.name} ajouté au panier` : ""}
        </span>
      </div>
    </article>
  );
}