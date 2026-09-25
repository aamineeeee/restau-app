const statusLabels = {
  recue: "Reçue",
  en_preparation: "En préparation",
  prete: "Prête",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {statusLabels[status] ?? status}
    </span>
  );
}