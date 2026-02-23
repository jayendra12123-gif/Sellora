import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/transactions", label: "Transactions" },
  { to: "/users", label: "Users" },
  { to: "/collections", label: "Collections" },
  { to: "/content", label: "Content" },
];

export default function AdminLayout({ onLogout, user }) {
  const getInitialSidebarState = () => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  };
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);
  const closeSidebarOnMobile = () => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`admin-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-text">
            <div className="kicker">Sellora</div>
            <div className="title">Admin</div>
          </div>
          <button
            type="button"
            className="admin-close-button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeSidebarOnMobile}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <button
            className="button secondary"
            onClick={onLogout}
            style={{ width: "100%" }}
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-overlay"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className="admin-main">
        <div className="admin-header">
          <div className="admin-header-title">
            <button
              type="button"
              className="admin-menu-button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            >
              {sidebarOpen ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <div>
              <div className="kicker">Control Center</div>
              <div className="headline">Manage Sellora</div>
            </div>
          </div>
          <span className="admin-headline-icon" aria-hidden="true">
            S
          </span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
