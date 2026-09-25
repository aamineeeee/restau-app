import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

function toPublicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export async function login(request, response) {
  const { email, password } = request.body ?? {};
  if (!email || !password) {
    return response.status(400).json({ error: "Email et mot de passe requis." });
  }

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email.trim().toLowerCase(),
  ]);
  const account = rows[0];
  const passwordMatches = account ? await bcrypt.compare(password, account.password_hash) : false;

  if (!account || !passwordMatches) {
    return response.status(401).json({ error: "Identifiants invalides" });
  }

  const token = jwt.sign({ sub: account.id, role: account.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  response.json({ token, user: toPublicUser(account) });
}

export async function me(request, response) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [request.user.id]);
  const account = rows[0];
  if (!account) {
    return response.status(401).json({ error: "Utilisateur introuvable." });
  }
  response.json({ user: toPublicUser(account) });
}
