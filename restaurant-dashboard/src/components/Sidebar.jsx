import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ownerLinks = [
  { label: "Dashboard", to: "/owner" },
  { label: "Orders", to: "/owner/orders" },
  { label: "Menu", to: "/owner/menu" },
  { label: "Inventory", to: "/owner/inventory" },
  { label: "Staff", to: "/owner/staff" },
  { label: "Reports", to: "/owner/reports" },
  { label: "Settings", to: "/owner/settings" }
];

const workerLinks = [
  { label: "Live Board", to: "/worker" },
  { label: "Tables", to: "/worker/tables" },
  { label: "Create Order", to: "/worker/create-order" },
  { label: "Order Status", to: "/worker/status" },
  { label: "Kitchen Updates", to: "/worker/kitchen" }
];

export default function Sidebar({ role, restaurantName }) {
  const { logout, user, demoMode } = useAuth();
  const links = role === "worker" ? workerLinks : ownerLinks;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">RF</span>
        <div>
          <h2>{restaurantName || "RestoFlow"}</h2>
          <p className="muted">Ops Console</p>
        </div>
      </div>
      <nav>
        {links.map((link) => (
          <NavLink key={link.label} to={link.to} className="nav-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {user && (
          <div style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", color: "#666" }}>
            <div>{user.name}</div>
            {demoMode && <div style={{ fontSize: "0.75rem" }}>Demo Mode</div>}
          </div>
        )}
        <button
          className="ghost"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
