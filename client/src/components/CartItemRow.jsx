import { formatPrice } from "../utils/format.js";

export default function CartItemRow({ item, onChangeQuantity, onRemove }) {
  return (
    <article className="cart-item">
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>{formatPrice(item.price)} <span>par article</span></p>
      </div>
      <label className="cart-quantity">
        <span>Qté</span>
        <input
          type="number"
          min="1"
          max="99"
          value={item.quantity}
          aria-label={`Quantité de ${item.name}`}
          onChange={(event) => {
            const quantity = Number(event.target.value);
            if (Number.isInteger(quantity) && quantity >= 1 && quantity <= 99) {
              onChangeQuantity(quantity);
            }
          }}
        />
      </label>
      <strong className="cart-line-total">
        {formatPrice(item.price * item.quantity)}
      </strong>
      <button
        className="remove-button"
        type="button"
        onClick={onRemove}
        aria-label={`Supprimer ${item.name} du panier`}
      >
        Supprimer
      </button>
    </article>
  );
}