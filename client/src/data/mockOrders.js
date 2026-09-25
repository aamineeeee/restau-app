export const mockOrders = [
  {
    id: 1001,
    status: "recue",
    total: 25.5,
    createdAt: "2026-09-25T11:42:00.000Z",
    customerName: "Julie Morel",
    items: [
      { menuItemId: 3, name: "Poulet rôti fermier", price: 17.5, quantity: 1 },
      { menuItemId: 5, name: "Tarte au citron", price: 7.5, quantity: 1 },
    ],
  },
  {
    id: 1002,
    status: "en_preparation",
    total: 23,
    createdAt: "2026-09-25T11:35:00.000Z",
    customerName: "Julie Morel",
    items: [
      { menuItemId: 4, name: "Risotto aux champignons", price: 16, quantity: 1 },
      { menuItemId: 2, name: "Velouté du marché", price: 7, quantity: 1 },
    ],
  },
  {
    id: 1003,
    status: "recue",
    total: 32.5,
    createdAt: "2026-09-25T11:50:00.000Z",
    customerName: "Nabil Haddad",
    items: [
      { menuItemId: 1, name: "Burrata & tomates", price: 8.5, quantity: 2 },
      { menuItemId: 3, name: "Poulet rôti fermier", price: 17.5, quantity: 1 },
    ],
  },
  {
    id: 1004,
    status: "prete",
    total: 14,
    createdAt: "2026-09-25T11:20:00.000Z",
    customerName: "Nabil Haddad",
    items: [{ menuItemId: 6, name: "Mousse au chocolat", price: 7, quantity: 2 }],
  },
];
