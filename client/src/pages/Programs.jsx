import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import img4 from '../img4.jpeg';
import img5 from '../img5.jpeg';
import img6 from '../img6.jpeg';

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

  if (loading) return <Loader />;

  return (
    <section>
      <ErrorMessage message={error} />
      <div className="page-hero mb-4">
        <p className="section-kicker text-white-50 mb-2">Programs</p>
        <h1 className="section-title text-white mb-2">Our Programs</h1>
        <p className="mb-0 text-white-50">Designed for direct impact, local relevance, and long-term sustainability.</p>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">Active Initiatives</h2>
        <span className="text-muted small">{programs.length} initiatives</span>
      </div>
      <div className="row g-4">
        {programs.length === 0 && (
          <div className="col-12">
            <div className="content-card p-4 text-muted text-center">No programs listed.</div>
          </div>
        )}
        {programs.map((program) => (
          <div className="col-md-6" key={program._id}>
            <div className="content-card h-100 p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="mb-0">{program.title}</h4>
                <span className={`badge ${program.status === 'inactive' ? 'text-bg-secondary' : 'text-bg-success'}`}>
                  {program.status || 'active'}
                </span>
              </div>
              <p className="text-muted mb-0">{program.description}</p>
            </div>
          </div>
        ))}
      </div>

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
