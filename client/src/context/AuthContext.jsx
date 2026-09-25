import { createContext, useContext, useMemo, useState } from "react";
import { mockUsers } from "../data/mockUsers.js";

const STORAGE_KEY = "la-table-session";
const AuthContext = createContext(null);

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (session?.user?.id && session?.user?.role) return session;
  } catch {
    // An invalid saved session should not prevent the login screen from loading.
  }
  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      login(email, password) {
        const account = mockUsers.find(
          (candidate) =>
            candidate.email.toLowerCase() === email.trim().toLowerCase() &&
            candidate.password === password,
        );

        if (!account) {
          return { ok: false, error: "Identifiants invalides" };
        }

        const nextSession = {
          token: "mock-token",
          user: {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
        return { ok: true, user: nextSession.user };
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return context;
}