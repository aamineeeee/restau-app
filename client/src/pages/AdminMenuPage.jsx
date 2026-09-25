import { useState } from "react";
import MenuItemForm from "../components/MenuItemForm.jsx";
import RoleHeader from "../components/RoleHeader.jsx";
import { initialMenuItems } from "../data/mockAdminMenu.js";
import { formatPrice } from "../utils/format.js";

const adminNavLinks = [
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/staff", label: "Équipe" },
];

let nextId = initialMenuItems.reduce((max, item) => Math.max(max, item.id), 0) + 1;

export default function AdminMenuPage() {
  const [items, setItems] = useState(initialMenuItems);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAdd(values) {
    setItems((current) => [...current, { id: nextId++, ...values }]);
    setShowAddForm(false);
  }

  function handleUpdate(id, values) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...values } : item)));
    setEditingId(null);
  }

  function handleDelete(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="placeholder-page">
      <RoleHeader roleLabel="ADMINISTRATION" navLinks={adminNavLinks} />
      <div className="content-narrow">
        <section className="page-intro compact-intro admin-page-intro">
          <div>
            <p className="eyebrow">GESTION DU MENU</p>
            <h1>Articles du menu</h1>
          </div>
          <button
            className="button"
            onClick={() => {
              setEditingId(null);
              setShowAddForm((value) => !value);
            }}
          >
            {showAddForm ? "Annuler" : "Ajouter un article"}
          </button>
        </section>

        {showAddForm && (
          <MenuItemForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} submitLabel="Ajouter" />
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Disponible</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) =>
              editingId === item.id ? (
                <tr key={item.id}>
                  <td colSpan={5}>
                    <MenuItemForm
                      initialValues={item}
                      onSubmit={(values) => handleUpdate(item.id, values)}
                      onCancel={() => setEditingId(null)}
                      submitLabel="Enregistrer"
                    />
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.isAvailable ? "Oui" : "Non"}</td>
                  <td className="admin-table-actions">
                    <button
                      className="text-button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(item.id);
                      }}
                    >
                      Modifier
                    </button>
                    <button className="text-button admin-delete" onClick={() => handleDelete(item.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
