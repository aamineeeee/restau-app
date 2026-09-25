import { apiRequest } from "./http.js";

export function createOrder(token, items) {
  return apiRequest("/orders", { method: "POST", token, body: { items } });
}

export function fetchMyOrders(token) {
  return apiRequest("/orders/mine", { token });
}
