import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import logo from '../LOGOs/final.png';

const Header = ({ admin }) => {
  const { token, user, logout } = useAuth();
  const [orgName, setOrgName] = useState('Organization');
  const [loadError, setLoadError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileNav = () => {
    const navElement = document.getElementById('siteNav');
    if (!navElement) return;

    const bootstrapCollapse = window.bootstrap?.Collapse?.getOrCreateInstance(navElement);
    if (bootstrapCollapse) {
      bootstrapCollapse.hide();
      return;
    }

    navElement.classList.remove('show');
    setIsMenuOpen(false);
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const navElement = document.getElementById('siteNav');
    if (!navElement) return undefined;

    const onShow = () => setIsMenuOpen(true);
    const onHide = () => setIsMenuOpen(false);

    navElement.addEventListener('shown.bs.collapse', onShow);
    navElement.addEventListener('hidden.bs.collapse', onHide);

    return () => {
      navElement.removeEventListener('shown.bs.collapse', onShow);
      navElement.removeEventListener('hidden.bs.collapse', onHide);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const isMobile = window.innerWidth < 992;
    if (!isMobile) return undefined;

    const previousOverflow = document.body.style.overflow;
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

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
    { to: '/admin/volunteers', label: 'Volunteers' },
    { to: '/admin/impact-stats', label: 'Impact Stats' },
    { to: '/admin/content', label: 'Content' },
    { to: '/admin/messages', label: 'Messages' },
    { to: '/admin/donations', label: 'Donations' },
    { to: '/admin/stories', label: 'Stories' },
    { to: '/admin/settings', label: 'NGO Details' },
    { to: '/admin/accounts', label: 'Accounts' },
  ];

  return (
    <header className={`site-navbar sticky-top ${admin ? 'admin-navbar' : ''} ${isScrolled ? 'is-scrolled' : ''}`}>
      {!admin && (
        <button
          type="button"
          className={`site-nav-backdrop ${isMenuOpen ? 'is-visible' : ''}`}
          aria-label="Close menu"
          onClick={closeMobileNav}
        />
      )}
      <nav className={`navbar ${admin ? 'navbar-expand-xxl' : 'navbar-expand-lg'} py-3 ${isScrolled ? 'navbar-compact' : ''}`}>
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 site-brand" to={admin ? '/admin/dashboard' : '/'} onClick={closeMobileNav}>
            <img
              src={logo}
              alt="Prayogam Foundation logo"
              style={{ 
                height: '100%', 
                maxHeight: admin ? '58px' : '70px',
                width: 'auto', 
                objectFit: 'contain',
                minHeight: admin ? '34px' : '40px'
              }}
            />
            {!admin && <span className="fw-semibold">{orgName || 'Prayogam Foundation'}</span>}
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

          <div className="collapse navbar-collapse site-nav-collapse" id="siteNav">
            <div className={`navbar-nav ms-auto align-items-lg-center site-nav-shell gap-lg-2 ${admin ? 'admin-nav-wrap' : ''}`}>
              {!admin &&
                publicLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileNav}
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

              {!admin && (
                <NavLink
                  to="/donate"
                  onClick={closeMobileNav}
                  className={({ isActive }) => `nav-link donate-nav-btn ms-lg-2 mt-2 mt-lg-0 ${isActive ? 'active' : ''}`}
                >
                  Donate
                </NavLink>
              )}

              {!admin && !token && (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMobileNav}
                    className={({ isActive }) => `nav-link site-nav-link ${isActive ? 'active' : ''}`}
                  >
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={closeMobileNav} className="btn btn-outline-secondary ms-lg-2 mt-2 mt-lg-0">
                    Get Involved
                  </NavLink>
                </>
              )}

              {!admin && token && user?.role === 'user' && (
                <>
                  <button className="btn btn-outline-secondary ms-lg-2 mt-2 mt-lg-0" onClick={() => { closeMobileNav(); handleLogout(); }}>
                    Logout
                  </button>
                </>
              )}

              {admin && token && (
                <button className="btn btn-outline-secondary ms-lg-2 mt-2 mt-lg-0 admin-logout-btn" onClick={() => { closeMobileNav(); handleLogout(); }}>
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
