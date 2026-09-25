import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";

const roleHome = {
  client: "/menu",
  staff: "/staff",
  admin: "/admin",
};

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? roleHome[user.role] : "/login"} replace />;
}

function ClientLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="page-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>La Table</span>
        <span>Une cuisine simple, préparée avec soin.</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/mes-commandes" element={<MyOrdersPage />} />
        </Route>
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <PlaceholderPage roleLabel="Équipe" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PlaceholderPage roleLabel="Administration" />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}