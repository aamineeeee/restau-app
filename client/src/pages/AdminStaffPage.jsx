import { useState } from "react";
import RoleHeader from "../components/RoleHeader.jsx";
import { initialStaffAccounts } from "../data/mockStaffAccounts.js";

const adminNavLinks = [
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/staff", label: "Équipe" },
];

let nextId = initialStaffAccounts.reduce((max, account) => Math.max(max, account.id), 0) + 1;

export default function AdminStaffPage() {
  const [accounts, setAccounts] = useState(initialStaffAccounts);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleAdd(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setAccounts((current) => [...current, { id: nextId++, name: name.trim(), email: email.trim() }]);
    setName("");
    setEmail("");
  }

  function handleDelete(id) {
    setAccounts((current) => current.filter((account) => account.id !== id));
  }

  return (
    <div className="placeholder-page">
      <RoleHeader roleLabel="ADMINISTRATION" navLinks={adminNavLinks} />
      <div className="content-narrow">
        <section className="page-intro compact-intro">
          <p className="eyebrow">GESTION DU STAFF</p>
          <h1>Comptes équipe</h1>
        </section>

        <form className="admin-form admin-form-inline" onSubmit={handleAdd}>
          <label>
            Nom
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button className="button button-small" type="submit">
            Ajouter
          </button>
        </form>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td className="admin-table-actions">
                  <button className="text-button admin-delete" onClick={() => handleDelete(account.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
