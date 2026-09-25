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

  console.log("Comptes de test créés/à jour :", testAccounts.map((account) => account.email).join(", "));
  await pool.end();
}

run().catch((error) => {
  console.error("Échec du seed :", error);
  process.exit(1);
});
