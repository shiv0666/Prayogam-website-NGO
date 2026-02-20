import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const Header = ({ admin }) => {
  const { token, user, logout } = useAuth();
  const [orgName, setOrgName] = useState('Organization');
  const [loadError, setLoadError] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(admin ? '/admin/login' : '/');
  };

  useEffect(() => {
    if (admin) return;
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data?.name) {
          setOrgName(response.data.name);
        }
      } catch (error) {
        setLoadError(true);
      }
    };

    loadSettings();
  }, [admin]);

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/mission', label: 'Mission' },
    { to: '/programs', label: 'Programs' },
    { to: '/contact', label: 'Contact' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/programs', label: 'Programs' },
    { to: '/admin/announcements', label: 'Announcements' },
    { to: '/admin/events', label: 'Events' },
    { to: '/admin/content', label: 'Content' },
    { to: '/admin/messages', label: 'Messages' },
    { to: '/admin/settings', label: 'NGO Details' },
    { to: '/admin/accounts', label: 'Accounts' }
  ];

  return (
    <header className="site-navbar sticky-top">
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to={admin ? '/admin/dashboard' : '/'}>
            <span className="brand-mark">P</span>
            <span className="fw-semibold">{admin ? 'Prayogam Admin' : orgName || 'Prayogam Foundation'}</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#siteNav"
            aria-controls="siteNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="siteNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              {!admin &&
                publicLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link site-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

              {admin &&
                adminLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link site-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

              {!admin && !token && (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => `nav-link site-nav-link ${isActive ? 'active' : ''}`}
                  >
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn btn-primary ms-lg-2 mt-2 mt-lg-0">
                    Get Involved
                  </NavLink>
                </>
              )}

              {!admin && token && user?.role === 'user' && (
                <button className="btn btn-outline-secondary ms-lg-2 mt-2 mt-lg-0" onClick={handleLogout}>
                  Logout
                </button>
              )}

              {admin && token && (
                <button className="btn btn-outline-secondary ms-lg-2 mt-2 mt-lg-0" onClick={handleLogout}>
                  Logout
                </button>
              )}

              {!admin && loadError && <span className="navbar-text small text-muted ms-lg-2">Content settings unavailable</span>}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
