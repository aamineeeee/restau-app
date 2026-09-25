import jwt from "jsonwebtoken";

export function requireAuth(request, response, next) {
  const header = request.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ error: "Authentification requise." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return response.status(401).json({ error: "Token invalide ou expiré." });
  }
}
