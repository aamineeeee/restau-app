import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest } from "../api/auth.js";

const STORAGE_KEY = "la-table-session";
const AuthContext = createContext(null);

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (session?.token && session?.user?.id && session?.user?.role) return session;
  } catch {
    // Une session locale invalide ne doit pas empêcher l'écran de connexion de s'afficher.
  }
  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [initializing, setInitializing] = useState(() => Boolean(readSession()));

  useEffect(() => {
    const stored = readSession();
    if (!stored) {
      setInitializing(false);
      return;
    }

    let cancelled = false;
    getCurrentUser(stored.token)
      .then((user) => {
        if (!cancelled) setSession({ token: stored.token, user });
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
        }
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      initializing,
      async login(email, password) {
        try {
          const data = await loginRequest(email, password);
          const nextSession = { token: data.token, user: data.user };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
          setSession(nextSession);
          return { ok: true, user: nextSession.user };
        } catch (error) {
          return { ok: false, error: error.message };
        }
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
    }),
    [session, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return context;
}
