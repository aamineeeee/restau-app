import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testAccounts = [
  { name: "Amine Client", email: "client@test.com", password: "client123", role: "client" },
  { name: "Amine Staff", email: "staff@test.com", password: "staff123", role: "staff" },
  { name: "Amine Admin", email: "admin@test.com", password: "admin123", role: "admin" },
];

const menuItems = [
  {
    name: "Burrata & tomates",
    description: "Tomates anciennes, basilic frais et huile d’olive.",
    price: 8.5,
    category: "Entrées",
    imageUrl: null,
    isAvailable: true,
  },
  {
    name: "Velouté du marché",
    description: "Légumes de saison, crème légère et croûtons dorés.",
    price: 7,
    category: "Entrées",
    imageUrl: null,
    isAvailable: true,
  },
  {
    name: "Poulet rôti fermier",
    description: "Jus court, pommes grenailles et herbes du jardin.",
    price: 17.5,
    category: "Plats",
    imageUrl: null,
    isAvailable: true,
  },
  {
    name: "Risotto aux champignons",
    description: "Riz arborio, champignons bruns et parmesan affiné.",
    price: 16,
    category: "Plats",
    imageUrl: null,
    isAvailable: true,
  },
  {
    name: "Tarte au citron",
    description: "Crème acidulée, pâte sablée et meringue légère.",
    price: 7.5,
    category: "Desserts",
    imageUrl: null,
    isAvailable: true,
  },
  {
    name: "Mousse au chocolat",
    description: "Chocolat noir, pointe de fleur de sel.",
    price: 7,
    category: "Desserts",
    imageUrl: null,
    isAvailable: true,
  },
];

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);

  for (const account of testAccounts) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      [account.name, account.email, passwordHash, account.role],
    );
  }

  for (const item of menuItems) {
    await pool.query(
      `INSERT INTO menu_items (name, description, price, category, image_url, is_available)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name) DO UPDATE
       SET description = EXCLUDED.description, price = EXCLUDED.price, category = EXCLUDED.category,
           image_url = EXCLUDED.image_url, is_available = EXCLUDED.is_available`,
      [item.name, item.description, item.price, item.category, item.imageUrl, item.isAvailable],
    );
  }

  console.log("Comptes de test créés/à jour :", testAccounts.map((account) => account.email).join(", "));
  console.log("Articles de menu créés/à jour :", menuItems.length);
  await pool.end();
}

run().catch((error) => {
  console.error("Échec du seed :", error);
  process.exit(1);
});
