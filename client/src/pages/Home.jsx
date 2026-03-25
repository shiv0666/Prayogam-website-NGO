import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ImpactStats from '../components/ImpactStats.jsx';
import indiaMapImage from '../extra/india map.jpg';
import heroImage from '../extra/sss.jpg';
import communityEmpowermentImage from '../extra/community-empowerment.svg';
import handsImage from '../random/hands.jpg';
import helpingHandsImage from '../random/helping hands.jpg';
import plantImage from '../random/plant.jpg';
import globeImage from '../random/globe.jpg';
import educationSupportImage from '../extra/education-support.svg';
import socialSupportImage from '../extra/social-support.svg';
import environmentCareImage from '../extra/environment-care.svg';
import healthcareSupportImage from '../extra/healthcare-support.svg';

const fieldsOfWork = [
  {
    title: 'Education',
    accentClass: 'education',
    symbol: 'EDU',
    image: educationSupportImage,
      backgroundImage: handsImage,
    description: 'Learning support, mentoring, and access to better educational opportunities for children and youth.'
  },
  {
    title: 'Social',
    accentClass: 'social',
    symbol: 'SOC',
    image: socialSupportImage,
    backgroundImage: helpingHandsImage,
    description: 'Community-centered programs that strengthen inclusion, awareness, and local participation.'
  },
  {
    title: 'Environment',
    accentClass: 'environment',
    symbol: 'ENV',
    image: environmentCareImage,
      backgroundImage: plantImage,
    description: 'Initiatives that encourage environmental responsibility and healthier surroundings for communities.'
  },
  {
    title: 'Healthcare',
    accentClass: 'healthcare',
    symbol: 'HLT',
    image: healthcareSupportImage,
      backgroundImage: globeImage,
    description: 'Support for health awareness, preventive care, and stronger well-being for families and children.'
  }
];

const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.DEV ? `http://${window.location.hostname}:5050` : '';
  return `${base}${path}`;
};

const initiativeImageMap = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/initiatives/*.{jpg,jpeg,png,webp,gif}', {
      eager: true,
      import: 'default'
    })
  ).map(([modulePath, moduleUrl]) => [modulePath.split('/').pop(), moduleUrl])
);

const resolveInitiativeImage = (image) => {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('/uploads')) {
    return getMediaUrl(image);
  }

  return initiativeImageMap[image] || '';
};

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(null);
  const [initiatives, setInitiatives] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [impactStats, setImpactStats] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [openInitiativeId, setOpenInitiativeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/settings'),
          api.get('/content/home'),
          api.get('/initiatives'),
          api.get('/programs'),
          api.get('/announcements'),
          api.get('/events'),
          api.get('/impact-stats'),
          api.get('/stories')
        ]);

        const [settingsRes, contentRes, initiativesRes, programRes, announcementRes, eventRes, impactStatsRes, storiesRes] = results;

        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value.data);
        }
        if (contentRes.status === 'fulfilled') {
          setContent(contentRes.value.data);
        }
        if (initiativesRes.status === 'fulfilled') {
          setInitiatives(Array.isArray(initiativesRes.value.data) ? initiativesRes.value.data : []);
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
        if (impactStatsRes.status === 'fulfilled') {
          setImpactStats(impactStatsRes.value.data);
        }
        if (storiesRes.status === 'fulfilled') {
          setStories(storiesRes.value.data);
        }

        if (results.some((result) => result.status === 'rejected')) {
          setError('Some sections failed to load.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const intervalId = window.setInterval(loadData, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  if (loading) return <Loader />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const groupedEvents = futureEvents.reduce((acc, event) => {
    const dateKey = new Date(event.date).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  const activeInitiatives = initiatives.filter(
    (initiative) => String(initiative.status || '').toLowerCase() === 'active'
  );

  return (
    <div className="d-grid gap-5">
      <section className="hero-split row g-0">
        <div className="col-lg-6 hero-panel p-4 d-flex flex-column justify-content-center">
          <p className="section-kicker text-white-50 mb-2">Prayogam Foundation</p>
          <h1 className="display-5 fw-bold mb-3 hero-heading">{content?.title || settings?.name || 'Your support shapes stronger communities'}</h1>
          <p className="text-white-50 fs-5 mb-4 hero-copy">
            {content?.body || 'We work with families and local leaders to improve education, health, and livelihoods where support is needed most.'}
          </p>
          <div className="d-flex flex-wrap gap-2 hero-actions">
            <a href="/contact" className="btn btn-primary hero-support-btn">Support Our Work</a>
            <a href="/programs" className="btn btn-outline-light hero-explore-btn">Explore Programs</a>
          </div>
        </div>
        <div className="col-lg-6 hero-visual">
          <img
            src={heroImage}
            alt="Children, healthcare and environment support"
            className="hero-image"
          />
        </div>
      </section>

      <ImpactStats stats={impactStats} />

      <section className="presence-section p-4 p-lg-5">
        <div className="row g-4 g-lg-5 align-items-center">
          <div className="col-lg-7">
            <p className="section-kicker mb-2">Our Presence in India</p>
            <h2 className="section-title mb-3">Our Work Across India</h2>
            <p className="text-muted mb-3">
              Prayogam Foundation is expanding its initiatives across India to support communities through education, awareness, and social development programs. Our mission is to empower underprivileged children and families by providing learning opportunities, mentorship, and community support.
            </p>
            <p className="text-muted mb-4">
              Currently, our initiatives are actively operating in <strong>Maharashtra</strong>, where we are working to improve access to education, community learning resources, and youth development programs.
            </p>

            <div className="presence-highlight">
              <p className="section-kicker mb-2">Current State of Operation</p>
              <h3 className="h4 mb-3">Maharashtra</h3>
              <p className="text-muted mb-0">
                Through our programs in Maharashtra, Prayogam Foundation supports students, communities, and families by promoting education, mentorship, and awareness initiatives that help build stronger and more inclusive learning environments.
              </p>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="presence-map-wrap mx-auto">
              <img
                src={indiaMapImage}
                alt="Map of India highlighting the current state where Prayogam Foundation operates"
                className="presence-map-image img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="focus-section p-4 p-lg-5">
        <div className="text-center mb-4 mb-lg-5">
          <p className="section-kicker mb-2">Our Fields of Work</p>
          <h2 className="section-title mb-0">Where We Focus Our Efforts</h2>
        </div>
        <div className="row g-4">
          {fieldsOfWork.map((field) => (
            <div className="col-sm-6 col-xl-3" key={field.title}>
              <div 
                className={`focus-card focus-card-${field.accentClass} h-100 p-4 text-center focus-card-with-bg`}
                style={{ backgroundImage: `url(${field.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="focus-card-bg-overlay"></div>
                <div className="focus-card-media mb-3 focus-card-media-hidden" style={{display: 'none'}}>
                  <img src={field.image} alt={field.title} className="focus-card-image" />
                </div>
                <div className="focus-symbol mx-auto mb-3 focus-card-relative">{field.symbol}</div>
                <h3 className="h4 mb-2 focus-card-relative" style={{color: '#141e2c', fontWeight: '700'}}>{field.title}</h3>
                <p className="mb-0 focus-card-relative focus-card-description" style={{color: '#2d3e52'}}>{field.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeInitiatives.length > 0 && (
        <section className="p-4 p-lg-5">
          <div className="text-center mb-4 mb-lg-5">
            <p className="section-kicker mb-2">Active Initiatives</p>
            <h2 className="section-title mb-0">Current Initiatives in Action</h2>
          </div>
          <div className="row g-4">
            {activeInitiatives.map((initiative) => {
              const initiativeId = initiative._id || initiative.title;
              const isOpen = openInitiativeId === initiativeId;
              const panelId = `initiative-panel-${String(initiativeId).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

              return (
                <div className="col-md-6 col-xl-4" key={initiativeId}>
                  <article className={`content-card h-100 p-0 overflow-hidden home-initiative-card ${isOpen ? 'is-open' : ''}`}>
                    {resolveInitiativeImage(initiative.image) && (
                      <img
                        src={resolveInitiativeImage(initiative.image)}
                        alt={initiative.title}
                        className="w-100 home-initiative-image"
                        loading="lazy"
                      />
                    )}

                    <button
                      type="button"
                      className="home-initiative-toggle"
                      onClick={() => setOpenInitiativeId(isOpen ? null : initiativeId)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <div className="home-initiative-header p-4">
                        <p className="section-kicker mb-1">Initiative</p>
                        <h3 className="h5 mb-0">{initiative.title}</h3>
                      </div>
                    </button>

                    <div id={panelId} className={`home-initiative-description ${isOpen ? 'is-open' : ''}`}>
                      <div className="home-initiative-description-inner px-4 pb-4">
                        <p className="text-muted mb-0">{initiative.description}</p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="statement-section p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="section-illustration-shell section-illustration-shell-home">
                <img
                  src={helpingHandsImage}
                  alt="Community members supporting women and families through empowerment programs"
                  className="section-illustration"
                  style={{ animation: 'float 4s ease-in-out infinite', filter: 'brightness(1.05) contrast(1.08)' }}
                />
              </div>
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

      <section className="home-feed-grid">
        <ErrorMessage message={error} />
        <div className="row g-4">
          <div className="col-xl-5">
            <div className="content-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-title h3 mb-0">Latest Updates</h2>
                <a href="/contact" className="btn btn-sm btn-outline-secondary">Stay Connected</a>
              </div>
              <div className="d-grid gap-3">
                {announcements.length === 0 && <div className="text-muted">No announcements available.</div>}
                {announcements.slice(0, 3).map((announcement) => (
                  <article className="home-feed-card" key={announcement._id}>
                    <p className="section-kicker mb-1">Announcement</p>
                    <h6 className="mb-1">{announcement.title}</h6>
                    <p className="text-muted small mb-2">{announcement.message}</p>
                    <small className="text-secondary">{new Date(announcement.date).toLocaleDateString()}</small>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="col-xl-7">
            <div className="content-card p-4 h-100">
              <h2 className="section-title h3 mb-3">Upcoming Events</h2>
              <div className="d-grid gap-3">
                {Object.entries(groupedEvents).length === 0 && <div className="text-muted">No events scheduled.</div>}
                {Object.entries(groupedEvents).slice(0, 4).map(([date, dateEvents]) => {
                  const event = dateEvents[0];
                  const eventImage = getMediaUrl(event.image);
                  const totalVolunteers = Number(event.totalVolunteersRequired || event.requirements?.volunteersNeeded || 0);
                  const registeredVolunteers = Number(event.currentApprovedVolunteers || 0);
                  const remainingVolunteers = Math.max(0, Number(event.remainingVolunteers ?? totalVolunteers - registeredVolunteers));
                  const isFull = remainingVolunteers <= 0;
                  return (
                    <article key={date} className="home-event-card">
                      <div className="event-card-content">
                        <div className="mb-2">
                          <p className="section-kicker mb-1">{date}</p>
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <h6 className="mb-0">{event.title}</h6>
                            <span className={`badge ${event.status === 'inactive' ? 'text-bg-secondary' : 'text-bg-success'}`}>
                              {event.status || 'active'}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted small mb-2">{event.description}</p>
                        {event.location && <p className="event-meta small mb-2">📍 {event.location}</p>}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge rounded-pill text-bg-primary">Volunteers Needed: {totalVolunteers}</span>
                          <span className="badge rounded-pill text-bg-info">Registered: {registeredVolunteers}</span>
                          <span className={`badge rounded-pill ${isFull ? 'text-bg-danger' : 'text-bg-success'}`}>
                            {isFull ? 'Full' : `${remainingVolunteers} spots left`}
                          </span>
                          {event.requirements?.fundsNeeded > 0 && (
                            <span className="badge rounded-pill text-bg-success">Funds: {event.requirements.fundsNeeded}</span>
                          )}
                          {event.requirements?.itemsNeeded && (
                            <span className="badge rounded-pill text-bg-secondary">Items: {event.requirements.itemsNeeded}</span>
                          )}
                        </div>
                        <div>
                          {isFull ? (
                            <button className="btn btn-sm btn-outline-secondary" disabled>
                              Full
                            </button>
                          ) : (
                            <Link
                              className="btn btn-sm btn-primary"
                              to={`/contact?eventId=${event._id}&eventTitle=${encodeURIComponent(event.title || '')}`}
                            >
                              Volunteer Now
                            </Link>
                          )}
                        </div>
                      </div>
                      {eventImage && (
                        <div className="event-card-image">
                          <img
                            src={eventImage}
                            alt={`${event.title} event`}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {stories.length > 0 && (
        <section>
          <div className="text-center mb-4">
            <p className="section-kicker mb-2">Stories of Change</p>
            <h2 className="section-title mb-0">Real People. Real Impact.</h2>
          </div>
          <div className="row g-4">
            {stories.slice(0, 6).map((story) => (
              <div className="col-md-6 col-lg-4" key={story._id}>
                <div className="story-card h-100" role="button" onClick={() => setSelectedStory(story)} style={{ cursor: 'pointer' }}>
                  {story.imageUrl && (
                    <div className="story-card-img-wrap">
                      <img
                        src={story.imageUrl}
                        alt={story.name}
                        className="story-card-img"
                      />
                    </div>
                  )}
                  <div className="story-card-body">
                    <p className="story-card-name">{story.name}</p>
                    <h5 className="story-card-title">{story.title}</h5>
                    <p className="story-card-desc">{story.description}</p>
                    <span className="story-card-read-more">Read full story →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedStory && (
        <div className="story-modal-backdrop" onClick={() => setSelectedStory(null)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <button className="story-modal-close" onClick={() => setSelectedStory(null)} aria-label="Close">✕</button>
            {selectedStory.imageUrl && (
              <img src={selectedStory.imageUrl} alt={selectedStory.name} className="story-modal-img" />
            )}
            <div className="story-modal-body">
              <p className="story-card-name">{selectedStory.name}</p>
              <h4 className="story-modal-title">{selectedStory.title}</h4>
              <p className="text-muted">{selectedStory.description}</p>
              {selectedStory.fullStory && (
                <p className="story-modal-full">{selectedStory.fullStory}</p>
              )}
            </div>
          </div>
        </div>
      )}

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
