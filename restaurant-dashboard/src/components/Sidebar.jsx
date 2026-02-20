import { NavLink } from "react-router-dom";

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
  { label: "Live Orders", to: "/worker" },
  { label: "My Tasks", to: "/worker/tasks" },
  { label: "Completed", to: "/worker/completed" }
];

export default function Sidebar({ role, restaurantName }) {
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
        <button
          className="ghost"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
