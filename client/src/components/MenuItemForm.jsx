import { useState } from "react";

export default function MenuItemForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [price, setPrice] = useState(initialValues?.price ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [isAvailable, setIsAvailable] = useState(initialValues?.isAvailable ?? true);

  function handleSubmit(event) {
    event.preventDefault();
    const parsedPrice = Number(price);
    if (!name.trim() || !category.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      price: parsedPrice,
      category: category.trim(),
      imageUrl: initialValues?.imageUrl ?? null,
      isAvailable,
    });
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Nom
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Catégorie
        <input value={category} onChange={(event) => setCategory(event.target.value)} required />
      </label>
      <label>
        Prix (€)
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>
      <label className="admin-form-description">
        Description
        <input value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="admin-form-checkbox">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => setIsAvailable(event.target.checked)}
        />
        Disponible
      </label>
      <div className="admin-form-actions">
        <button className="button button-small" type="submit">
          {submitLabel}
        </button>
        <button className="text-button" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
