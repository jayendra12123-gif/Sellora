import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/users', label: 'Users' },
  { to: '/collections', label: 'Collections' },
  { to: '/content', label: 'Content' },
];

export default function AdminLayout({ onLogout, user }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="kicker">Sellora</div>
          <div className="title">Admin</div>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <button className="button secondary" onClick={onLogout} style={{ width: '100%'}}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="kicker">Control Center</div>
            <div className="headline">Manage Sellora</div>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
