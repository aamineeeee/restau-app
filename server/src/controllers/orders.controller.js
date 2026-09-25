import { pool } from "../db/pool.js";

const STATUS_ORDER = ["recue", "en_preparation", "prete"];

function toPublicOrder(order, items) {
  return {
    id: order.id,
    status: order.status,
    total: Number(order.total),
    createdAt: order.created_at,
    ...(order.customer_name ? { customerName: order.customer_name } : {}),
    items: items.map((item) => ({
      menuItemId: item.menu_item_id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
    })),
  };
}

async function attachItems(orders) {
  if (orders.length === 0) return [];

  const { rows: items } = await pool.query(
    "SELECT * FROM order_items WHERE order_id = ANY($1::int[])",
    [orders.map((order) => order.id)],
  );
  const itemsByOrder = new Map();
  for (const item of items) {
    if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
    itemsByOrder.get(item.order_id).push(item);
  }

  return orders.map((order) => toPublicOrder(order, itemsByOrder.get(order.id) ?? []));
}

export async function createOrder(request, response) {
  const { items } = request.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ error: "Le panier est vide." });
  }
  if (items.some((item) => !Number.isInteger(item?.menuItemId))) {
    return response.status(400).json({ error: "Article invalide." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const menuItemIds = items.map((item) => item.menuItemId);
    const { rows: menuRows } = await client.query(
      "SELECT id, name, price, is_available FROM menu_items WHERE id = ANY($1::int[])",
      [menuItemIds],
    );
    const menuById = new Map(menuRows.map((row) => [row.id, row]));

    const orderItems = [];
    let total = 0;
    for (const { menuItemId, quantity } of items) {
      const menuItem = menuById.get(menuItemId);
      const parsedQuantity = Number(quantity);
      if (
        !menuItem ||
        !menuItem.is_available ||
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity < 1
      ) {
        throw Object.assign(new Error("Article indisponible ou quantité invalide."), { status: 400 });
      }
      const price = Number(menuItem.price);
      total += price * parsedQuantity;
      orderItems.push({ menu_item_id: menuItemId, name: menuItem.name, price, quantity: parsedQuantity });
    }

    const { rows: orderRows } = await client.query(
      "INSERT INTO orders (user_id, status, total) VALUES ($1, 'recue', $2) RETURNING *",
      [request.user.id, total],
    );
    const order = orderRows[0];

    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.menu_item_id, item.name, item.price, item.quantity],
      );
    }

    await client.query("COMMIT");
    response.status(201).json(toPublicOrder(order, orderItems));
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.status === 400) {
      return response.status(400).json({ error: error.message });
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function listMyOrders(request, response) {
  const { rows: orders } = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [request.user.id],
  );
  response.json(await attachItems(orders));
}

export async function getAllOrders(_request, response) {
  const { rows: orders } = await pool.query(
    `SELECT orders.*, users.name AS customer_name
     FROM orders
     JOIN users ON users.id = orders.user_id
     ORDER BY orders.created_at DESC`,
  );
  response.json(await attachItems(orders));
}

export async function updateOrderStatus(request, response) {
  const orderId = Number(request.params.id);
  const { status } = request.body ?? {};

  if (!Number.isInteger(orderId)) {
    return response.status(404).json({ error: "Commande introuvable." });
  }

  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
  const order = rows[0];
  if (!order) {
    return response.status(404).json({ error: "Commande introuvable." });
  }

  const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(order.status) + 1];
  if (status !== nextStatus) {
    return response.status(400).json({ error: "Transition de statut invalide." });
  }

  const { rows: updatedRows } = await pool.query(
    "UPDATE orders SET status = $1, updated_at = now() WHERE id = $2 RETURNING *",
    [status, orderId],
  );
  const [publicOrder] = await attachItems([updatedRows[0]]);
  response.json(publicOrder);
}
