import { apiRequest } from "./http.js";

export function fetchMenu(token) {
  return apiRequest("/menu", { token });
}
