import { apiRequest } from "./http.js";

export function createOrder(token, items) {
  return apiRequest("/orders", { method: "POST", token, body: { items } });
}

export function fetchMyOrders(token) {
  return apiRequest("/orders/mine", { token });
}

export function fetchAllOrders(token) {
  return apiRequest("/orders", { token });
}

export function updateOrderStatus(token, orderId, status) {
  return apiRequest(`/orders/${orderId}/status`, { method: "PATCH", token, body: { status } });
}
