const AdminDashboard = () => {
  const sections = [
    { title: 'Programs', description: 'Manage active and inactive programs.' },
    { title: 'Announcements', description: 'Publish updates and announcements.' },
    { title: 'Events', description: 'Plan events and specify volunteer or funding requirements.' },
    { title: 'Content', description: 'Edit home, about, and mission content.' },
    { title: 'Messages', description: 'Review contact form submissions.' },
    { title: 'NGO Details', description: 'Update organization information shown on the public site.' },
    { title: 'Accounts', description: 'Create NGO admin and user accounts with roles.' }
  ];

  return (
    <section>
      <div className="page-hero mb-4">
        <p className="section-kicker text-white-50 mb-2">Admin Console</p>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="section-title mb-0 text-white">Admin Dashboard</h1>
          <span className="badge text-bg-light">Prayogam Foundation</span>
        </div>
        <p className="text-white-50 mb-0 mt-2">Manage programs, content, users, and operations from one place.</p>
      </div>
      <div className="row g-4">
        {sections.map((item) => (
          <div className="col-md-6 col-xl-4" key={item.title}>
            <div className="content-card h-100 p-4">
              <h5 className="mb-2">{item.title}</h5>
              <p className="text-muted mb-0">{item.description}</p>
            </div>
          </div>
        ))}
        </div>
    </section>
  );
};

export default AdminDashboard;
