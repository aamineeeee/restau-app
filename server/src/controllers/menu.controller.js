import { pool } from "../db/pool.js";

function toPublicMenuItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    imageUrl: row.image_url,
    isAvailable: row.is_available,
  };
}

export async function listMenu(_request, response) {
  const { rows } = await pool.query(
    "SELECT * FROM menu_items WHERE is_available = true ORDER BY category, name",
  );
  response.json(rows.map(toPublicMenuItem));
}
