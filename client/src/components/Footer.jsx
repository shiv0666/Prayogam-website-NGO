import { useEffect, useState } from 'react';
import api from '../services/api.js';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (error) {
        setSettings(null);
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="footer-wrap mt-5 py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <h5 className="mb-3">{settings?.name || 'Prayogam Foundation'}</h5>
            <p className="text-muted mb-2">
              {settings?.domain || 'Community-led NGO initiatives focused on dignity, resilience, and opportunity.'}
            </p>
            <small className="text-muted">Every contribution supports meaningful, measurable social change.</small>
          </div>
          <div className="col-lg-4">
            <h6 className="text-uppercase text-muted mb-3">Contact</h6>
            <p className="mb-1">{settings?.address || 'Address will be updated by admin.'}</p>
            <p className="mb-1">{settings?.location || 'Location unavailable'}</p>
            <p className="mb-0">{settings?.contact || 'Contact unavailable'}</p>
          </div>
          <div className="col-lg-3">
            <h6 className="text-uppercase text-muted mb-3">Organization</h6>
            <p className="mb-1">Founder: {settings?.founder || 'Not available'}</p>
            <p className="mb-1">Prayogam Foundation</p>
            <p className="mb-0">Support and partnership requests via contact form.</p>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <small className="text-muted">© {new Date().getFullYear()} Prayogam Foundation. All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;
