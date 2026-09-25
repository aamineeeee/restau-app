import { apiRequest } from "./http.js";

export function login(email, password) {
  return apiRequest("/auth/login", { method: "POST", body: { email, password } });
}

export async function getCurrentUser(token) {
  const data = await apiRequest("/auth/me", { token });
  return data.user;
}
