import { useEffect, useRef, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import plantImage from '../random/plant.jpg';

const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.DEV ? `http://${window.location.hostname}:5050` : '';
  return `${base}${path}`;
};
import img4 from '../img4.jpeg';
import img5 from '../img5.jpeg';
import img6 from '../img6.jpeg';
import educationSupportImage from '../extra/education-support.svg';
import socialSupportImage from '../extra/social-support.svg';
import environmentCareImage from '../extra/environment-care.svg';
import healthcareSupportImage from '../extra/healthcare-support.svg';
import donationBannerImage from '../random/donation banner.jpg';
import InitiativeTimeline from '../components/InitiativeTimeline.jsx';

const programIllustrations = [educationSupportImage, socialSupportImage, environmentCareImage, healthcareSupportImage];

const programGallery = [
  {
    title: 'Community Education Drive',
    caption: 'Outreach and educational workshops in diverse communities.',
    image: img5
  },
  {
    title: 'Youth Learning Workshop',
    caption: 'Interactive learning sessions for school-age students and young adults.',
    image: img4
  },
  {
    title: 'Rural Livelihood Support',
    caption: 'Skill-building and market-linkage programs for sustainable livelihoods.',
    image: img6
  }
];

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const modalPanelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await api.get('/programs');
        setPrograms(response.data);
      } catch (err) {
        setError('Programs are not available yet.');
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const cards = document.querySelectorAll('.programs-grid .reveal-on-scroll');
    if (cards.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [programs]);

  const openProgramModal = (program) => {
    setSelectedProgram(program);
  };

  const closeProgramModal = () => {
    setSelectedProgram(null);
  };

  useEffect(() => {
    if (!selectedProgram) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const focusFirstElement = () => {
      if (!modalPanelRef.current) return;
      const focusableElements = modalPanelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        modalPanelRef.current.focus();
      }
    };

    focusFirstElement();

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeProgramModal();
        return;
      }

      if (event.key === 'Tab' && modalPanelRef.current) {
        const focusableElements = modalPanelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        } else if (!event.shiftKey && activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [selectedProgram]);

  if (loading) return <Loader />;

  return (
    <section>
      <ErrorMessage message={error} />
      <div className="page-hero programs-hero mb-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(8, 22, 46, 0.8), rgba(14, 72, 92, 0.72)), url(${donationBannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <p className="section-kicker text-white-50 mb-2">Programs</p>
        <h1 className="section-title text-white mb-2">Our Programs</h1>
        <p className="mb-0 text-white-50">Designed for direct impact, local relevance, and long-term sustainability.</p>
      </div>

      <InitiativeTimeline />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">Active Initiatives</h2>
        <span className="text-muted small">{programs.length} initiatives</span>
      </div>
      <div className="row g-4 programs-grid">
        {programs.length === 0 && (
          <div className="col-12">
            <div className="content-card p-4 text-muted text-center">No programs listed.</div>
          </div>
        )}
        {programs.map((program, index) => {
          const isEnvironmentProgram = program.title?.toLowerCase().includes('environment') || program.title?.toLowerCase().includes('green') || program.title?.toLowerCase().includes('plant');
          const programImage = program.image ? getMediaUrl(program.image) : programIllustrations[index % programIllustrations.length];
          const revealDelay = (index % 3) * 85 + Math.floor(index / 3) * 55;
          
          return (
          <div className="col-sm-6 col-lg-4" key={program._id}>
            <article
              className="content-card h-100 overflow-hidden program-rich-card reveal-on-scroll"
              style={{ '--reveal-delay': `${revealDelay}ms` }}
            >
              <div className="program-card-media" style={isEnvironmentProgram ? { backgroundImage: `url(${plantImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <img
                  src={programImage}
                  alt={program.title}
                  className="program-card-image"
                />
                <div className="program-card-overlay" />
                <div className="program-card-media-content">
                  <h4 className="program-card-title mb-0">{program.title}</h4>
                  <span className={`program-status-pill ${program.status === 'inactive' ? 'is-inactive' : ''}`}>
                    {program.status || 'active'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-light btn-sm program-card-view-btn"
                  onClick={() => openProgramModal(program)}
                >
                  View Details
                </button>
              </div>
              <div className="p-4 d-flex flex-column program-card-body">
                <p className="text-muted mb-3 program-card-description">{program.description}</p>
                <div className="d-flex align-items-center gap-2 mt-auto flex-wrap">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm program-learn-btn"
                    onClick={() => openProgramModal(program)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </article>
          </div>
        );
        })}
      </div>

      {selectedProgram && (
        <div
          className="program-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="program-modal-title"
          aria-describedby="program-modal-description"
          onClick={closeProgramModal}
        >
          <div
            className="program-modal-panel content-card"
            onClick={(event) => event.stopPropagation()}
            ref={modalPanelRef}
            tabIndex={-1}
          >
            <button type="button" className="program-modal-close" onClick={closeProgramModal} aria-label="Close details">
              ×
            </button>
            <div className="program-modal-media">
              <img
                src={selectedProgram.image ? getMediaUrl(selectedProgram.image) : programIllustrations[0]}
                alt={selectedProgram.title}
                className="program-modal-image"
              />
            </div>
            <div className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
                <h3 className="section-title h4 mb-0" id="program-modal-title">{selectedProgram.title}</h3>
                <span className={`program-status-pill ${selectedProgram.status === 'inactive' ? 'is-inactive' : ''}`}>
                  {selectedProgram.status || 'active'}
                </span>
              </div>
              <p className="mb-0 text-muted" id="program-modal-description">{selectedProgram.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="content-card p-3 p-lg-4 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="section-title h4 mb-0">Past Programs & Promotional Gallery</h3>
          <span className="section-kicker mb-0">Moments of impact</span>
        </div>
        <div id="programGalleryCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {programGallery.map((item, index) => (
              <button
                key={item.title}
                type="button"
                data-bs-target="#programGalleryCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="carousel-inner rounded-4 overflow-hidden">
            {programGallery.map((item, index) => (
              <div key={item.title} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="w-100 d-flex align-items-center justify-content-center" style={{ height: '420px', background: '#eef3f8' }}>
                  <img
                    src={item.image}
                    className="d-block w-100 h-100"
                    alt={item.title}
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
                  <h5>{item.title}</h5>
                  <p className="mb-0">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#programGalleryCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#programGalleryCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
