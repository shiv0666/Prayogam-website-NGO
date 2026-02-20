import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/settings'),
          api.get('/content/home'),
          api.get('/programs'),
          api.get('/announcements'),
          api.get('/events')
        ]);

        const [settingsRes, contentRes, programRes, announcementRes, eventRes] = results;

        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value.data);
        }
        if (contentRes.status === 'fulfilled') {
          setContent(contentRes.value.data);
        }
        if (programRes.status === 'fulfilled') {
          setPrograms(programRes.value.data);
        }
        if (announcementRes.status === 'fulfilled') {
          setAnnouncements(announcementRes.value.data);
        }
        if (eventRes.status === 'fulfilled') {
          setEvents(eventRes.value.data);
        }

        if (results.some((result) => result.status === 'rejected')) {
          setError('Some sections failed to load.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Loader />;

  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = new Date(event.date).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <div className="d-grid gap-5">
      <section className="hero-split row g-0">
        <div className="col-lg-6 hero-panel p-5 d-flex flex-column justify-content-center">
          <p className="section-kicker text-white-50 mb-2">Prayogam Foundation</p>
          <h1 className="display-5 fw-bold mb-3">{content?.title || settings?.name || 'Your support shapes stronger communities'}</h1>
          <p className="text-white-50 fs-5 mb-4">
            {content?.body || 'We work with families and local leaders to improve education, health, and livelihoods where support is needed most.'}
          </p>
          <div className="d-flex flex-wrap gap-2">
            <a href="/contact" className="btn btn-primary">Support Our Work</a>
            <a href="/programs" className="btn btn-outline-light">Explore Programs</a>
          </div>
        </div>
        <div className="col-lg-6 hero-visual" />
      </section>

      <section>
        <div className="text-center mb-4">
          <p className="section-kicker mb-2">Our Impact</p>
          <h2 className="section-title mb-0">Every day, together, we help communities build better futures</h2>
        </div>
        <div className="row g-4">
          {(programs.length ? programs : [{ _id: 'p1', title: 'Program Reach', description: 'Local, high-touch interventions with measurable outcomes.' }, { _id: 'p2', title: 'Community Trust', description: 'Partnership with local leaders and volunteers.' }, { _id: 'p3', title: 'Resource Efficiency', description: 'Transparent usage of support and donations.' }, { _id: 'p4', title: 'Sustainable Impact', description: 'Long-term models that uplift families and youth.' }]).slice(0, 4).map((program) => (
            <div className="col-md-6" key={program._id}>
              <div className="impact-tile p-4 h-100 d-flex flex-column justify-content-end">
                <h4 className="mb-2">{program.title}</h4>
                <p className="text-muted mb-0">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="statement-section p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="statement-image" />
            </div>
            <div className="col-lg-7">
              <p className="section-kicker mb-2">What We Focus On</p>
              <h2 className="section-title display-6 mb-3">We work to support communities in the areas of hunger, health, education, and equality.</h2>
              <p className="text-muted mb-4">{settings?.domain || 'Our teams collaborate across neighborhoods and institutions to identify urgent needs, deploy support quickly, and sustain progress.'}</p>
              <a href="/mission" className="btn btn-primary">Learn About Our Mission</a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Latest Updates</h2>
          <a href="/contact" className="btn btn-sm btn-outline-secondary">Stay Connected</a>
        </div>
        <ErrorMessage message={error} />
        <div className="row g-4">
          {announcements.length === 0 && (
            <div className="col-12">
              <div className="content-card p-4 text-center text-muted">No announcements available.</div>
            </div>
          )}
          {announcements.slice(0, 4).map((announcement) => (
            <div className="col-md-6" key={announcement._id}>
              <div className="content-card h-100 p-4">
                <p className="section-kicker mb-2">Announcement</p>
                <h5>{announcement.title}</h5>
                <p className="text-muted">{announcement.message}</p>
                <small className="text-secondary">{new Date(announcement.date).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Upcoming Events</h2>
        <ErrorMessage message={error} />
        <div className="d-grid gap-3">
          {events.length === 0 && <div className="content-card p-4 text-muted">No events scheduled.</div>}
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="event-day p-3 p-lg-4">
              <h5 className="mb-3">{date}</h5>
              <div className="row g-3">
                {dateEvents.map((event) => (
                  <div className="col-lg-6" key={event._id}>
                    <div className="content-card h-100 p-3 p-lg-4">
                      <h5 className="mb-2">{event.title}</h5>
                      <p className="text-muted mb-2">{event.description}</p>
                      {event.location && <p className="event-meta mb-2">Location: {event.location}</p>}
                      <div className="d-flex flex-wrap gap-2">
                      {event.requirements?.volunteersNeeded > 0 && (
                        <span className="badge rounded-pill text-bg-primary">
                          Volunteers: {event.requirements.volunteersNeeded}
                        </span>
                      )}
                      {event.requirements?.fundsNeeded > 0 && (
                        <span className="badge rounded-pill text-bg-success">
                          Funds: {event.requirements.fundsNeeded}
                        </span>
                      )}
                      {event.requirements?.itemsNeeded && (
                        <span className="badge rounded-pill text-bg-secondary">
                          Items: {event.requirements.itemsNeeded}
                        </span>
                      )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stories-strip p-4 p-lg-5">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <p className="section-kicker text-white-50 mb-2">Stories That Matter</p>
            <h3 className="mb-2">Follow the people and programs driving change at Prayogam Foundation.</h3>
            <p className="mb-0 text-white-50">From grassroots action to long-term outcomes, our updates share what impact looks like on the ground.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <a href="/about" className="btn btn-primary">Read Our Journey</a>
          </div>
        </div>
      </section>

      <section className="cta-band p-4 p-lg-5 text-center">
        <h2 className="display-6 fw-bold mb-2">Your support can secure a family’s tomorrow</h2>
        <p className="mb-4">Join us with time, skills, partnerships, or contributions and help expand our community impact.</p>
        <a href="/contact" className="btn btn-light">Get Involved Today</a>
      </section>
    </div>
  );
};

export default Home;
