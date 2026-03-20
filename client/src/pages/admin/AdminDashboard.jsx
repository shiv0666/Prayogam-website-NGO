import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaBullhorn,
  FaChartLine,
  FaDonate,
  FaFileAlt,
  FaHome,
  FaHandsHelping,
  FaImage,
  FaNewspaper,
  FaRegCheckCircle,
  FaTasks,
  FaUsers,
  FaUserShield
} from 'react-icons/fa';
import api from '../../services/api.js';

const dashboardCards = [
  {
    title: 'Programs',
    description: 'Manage active and inactive programs.',
    to: '/admin/programs',
    icon: FaTasks,
    tone: 'blue'
  },
  {
    title: 'Announcements',
    description: 'Publish updates and announcements.',
    to: '/admin/announcements',
    icon: FaBullhorn,
    tone: 'orange'
  },
  {
    title: 'Events',
    description: 'Plan events and manage requirements.',
    to: '/admin/events',
    icon: FaNewspaper,
    tone: 'green'
  },
  {
    title: 'Volunteers',
    description: 'Review and approve volunteer registrations.',
    to: '/admin/volunteers',
    icon: FaRegCheckCircle,
    tone: 'orange'
  },
  {
    title: 'Impact Stats',
    description: 'Manage impact statistics shown publicly.',
    to: '/admin/impact',
    activeAliases: ['/admin/impact-stats'],
    icon: FaChartLine,
    tone: 'blue'
  },
  {
    title: 'Content',
    description: 'Edit home, about, and mission content.',
    to: '/admin/content',
    icon: FaFileAlt,
    tone: 'orange'
  },
  {
    title: 'Messages',
    description: 'Review contact form submissions.',
    to: '/admin/messages',
    icon: FaHandsHelping,
    tone: 'green'
  },
  {
    title: 'Donations',
    description: 'Track donor records and payment status.',
    to: '/admin/donations',
    icon: FaDonate,
    tone: 'blue'
  },
  {
    title: 'NGO Details',
    description: 'Update public organization information.',
    to: '/admin/ngo-details',
    activeAliases: ['/admin/settings'],
    icon: FaHome,
    tone: 'green'
  },
  {
    title: 'Accounts',
    description: 'Create and manage user/admin accounts.',
    to: '/admin/accounts',
    icon: FaUserShield,
    tone: 'orange'
  }
];

const sidebarItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: FaHome },
  { label: 'Programs', to: '/admin/programs', icon: FaTasks },
  { label: 'Announcements', to: '/admin/announcements', icon: FaBullhorn },
  { label: 'Events', to: '/admin/events', icon: FaNewspaper },
  { label: 'Volunteers', to: '/admin/volunteers', icon: FaRegCheckCircle },
  { label: 'Impact Stats', to: '/admin/impact', activeAliases: ['/admin/impact-stats'], icon: FaChartLine },
  { label: 'Donations', to: '/admin/donations', icon: FaDonate },
  { label: 'Stories', to: '/admin/stories', icon: FaImage },
  { label: 'NGO Details', to: '/admin/ngo-details', activeAliases: ['/admin/settings'], icon: FaHandsHelping },
  { label: 'Accounts', to: '/admin/accounts', icon: FaUsers }
];

const getCount = (data) => {
  if (typeof data?.totalItems === 'number') return data.totalItems;
  if (typeof data?.total === 'number') return data.total;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data?.data)) return data.data.length;
  if (Array.isArray(data?.donations)) return data.donations.length;
  if (Array.isArray(data?.messages)) return data.messages.length;
  if (Array.isArray(data?.programs)) return data.programs.length;
  if (Array.isArray(data?.events)) return data.events.length;
  if (Array.isArray(data?.items)) return data.items.length;
  if (Array.isArray(data?.results)) return data.results.length;
  return 0;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quickStats, setQuickStats] = useState({ programs: 0, donations: 0, messages: 0, events: 0, volunteers: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const [programsRes, donationsRes, messagesRes, eventsRes, volunteersRes] = await Promise.allSettled([
        api.get('/programs?all=true'),
        api.get('/donations?page=1&limit=1'),
        api.get('/contact?page=1&limit=1'),
        api.get('/events?all=true'),
        api.get('/volunteers?page=1&limit=1')
      ]);

      setQuickStats({
        programs: programsRes.status === 'fulfilled' ? getCount(programsRes.value?.data) : 0,
        donations: donationsRes.status === 'fulfilled' ? getCount(donationsRes.value?.data) : 0,
        messages: messagesRes.status === 'fulfilled' ? getCount(messagesRes.value?.data) : 0,
        events: eventsRes.status === 'fulfilled' ? getCount(eventsRes.value?.data) : 0,
        volunteers: volunteersRes.status === 'fulfilled' ? getCount(volunteersRes.value?.data) : 0
      });
    };

    loadStats();

    const intervalId = window.setInterval(loadStats, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const statItems = useMemo(
    () => [
      { label: 'Total Programs', value: quickStats.programs },
      { label: 'Total Donations', value: quickStats.donations },
      { label: 'Total Messages', value: quickStats.messages },
      { label: 'Total Events', value: quickStats.events },
      { label: 'Registered Volunteers', value: quickStats.volunteers }
    ],
    [quickStats]
  );

  const isActivePath = (to, aliases = []) => {
    if (location.pathname === to) return true;
    if (aliases.includes(location.pathname)) return true;
    return false;
  };

  return (
    <section className="admin-dashboard-shell">
      <div className="page-hero mb-4 admin-dashboard-hero">
        <p className="section-kicker text-white-50 mb-2">Admin Console</p>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="section-title mb-0 text-white">Admin Dashboard</h1>
          <span className="badge text-bg-light">Prayogam Foundation</span>
        </div>
        <p className="text-white-50 mb-0 mt-2">Manage programs, content, users, and operations from one place.</p>
      </div>

      <div className="admin-dashboard-layout">
        <aside className="admin-dashboard-sidebar content-card p-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.to, item.activeAliases || []);
            return (
              <button
                key={item.to}
                type="button"
                className={`admin-side-link ${active ? 'active' : ''}`}
                onClick={() => navigate(item.to)}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <div className="admin-dashboard-main">
          <div className="admin-quick-stats">
            {statItems.map((item) => (
              <div className="admin-stat-pill" key={item.label}>
                <span className="admin-stat-label">{item.label}</span>
                <strong className="admin-stat-value">{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="admin-dashboard-grid">
            {dashboardCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  className={`admin-dash-card tone-${item.tone}`}
                  onClick={() => navigate(item.to)}
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <div className="admin-dash-card-top">
                    <span className="admin-dash-indicator" />
                    <Icon className="admin-dash-icon" aria-hidden="true" />
                  </div>
                  <h5 className="mb-2">{item.title}</h5>
                  <p className="text-muted mb-0">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
