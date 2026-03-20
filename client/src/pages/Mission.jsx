import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import prayogamLogo from '../LOGOs/final.png';
import handsImage from '../random/hands.jpg';

const Mission = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await api.get('/content/mission');
        setContent(response.data);
      } catch (err) {
        setError('Mission content is not available yet.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) return <Loader />;

  return (
    <section>
      <ErrorMessage message={error} />
      <div className="page-hero mission-hero mb-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(12, 34, 69, 0.76), rgba(19, 104, 132, 0.68)), url(${handsImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <p className="section-kicker text-white-50 mb-2">Mission & Vision</p>
        <h1 className="section-title text-white">{content?.title || 'Mission & Vision'}</h1>
        <p className="mb-0 text-white-50">Focused, inclusive, and people-centered action across urgent social priorities.</p>
      </div>
      <div className="content-card p-4 p-lg-5">
        <div className="row g-4 align-items-center mb-4">
          <div className="col-lg-7">
            <p className="lead text-muted mb-0">{content?.body || 'Please check back later.'}</p>
          </div>
          <div className="col-lg-5">
            <div className="section-illustration-shell">
              <img
                src={prayogamLogo}
                alt="Prayogam Foundation Logo"
                className="section-illustration"
              />
            </div>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-4 border rounded-3 h-100 bg-light-subtle">
              <h6 className="mb-2">Mission</h6>
              <p className="text-muted mb-0">Deliver inclusive programs that improve quality of life for underserved communities.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 border rounded-3 h-100 bg-light-subtle">
              <h6 className="mb-2">Vision</h6>
              <p className="text-muted mb-0">Build a resilient and equitable society through collaboration, dignity, and opportunity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
