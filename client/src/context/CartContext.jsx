import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "la-table-cart";
const CartContext = createContext(null);

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      Array.isArray(cart) &&
      cart.every(
        (item) =>
          Number.isInteger(item.menuItemId) &&
          typeof item.name === "string" &&
          Number.isFinite(item.price) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      )
    ) {
      return cart;
    }
  } catch {
    // Ignore invalid local data and start with an empty cart.
  }
  return [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      total: items.reduce(
        (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
        0,
      ) / 100,
      addItem(menuItem, quantity = 1) {
        setItems((current) => {
          const existing = current.find(
            (item) => item.menuItemId === menuItem.id,
          );
          if (existing) {
            return current.map((item) =>
              item.menuItemId === menuItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [
            ...current,
            {
              menuItemId: menuItem.id,
              name: menuItem.name,
              price: menuItem.price,
              quantity,
            },
          ];
        });
      },
      updateQuantity(menuItemId, quantity) {
        if (!Number.isInteger(quantity) || quantity < 1) return;
        setItems((current) =>
          current.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item,
          ),
        );
      },
      removeItem(menuItemId) {
        setItems((current) =>
          current.filter((item) => item.menuItemId !== menuItemId),
        );
      },
      clearCart() {
        setItems([]);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider.");
  return context;
}