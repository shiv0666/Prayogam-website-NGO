import { useEffect, useState } from 'react';
import api from '../services/api.js';

const defaultFooterSettings = {
  name: 'Prayogam Foundation',
  domain: 'Empowering communities through education, health, and innovation',
  address: 'Prayogam Foundation, Narsala Ward, Nagpur',
  location: 'Nagpur, Maharashtra',
  contact: '+91 00000 00000',
  founder: 'Prayogam Foundation Team'
};

const Footer = () => {
  const [settings, setSettings] = useState(defaultFooterSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data) {
          setSettings({ ...defaultFooterSettings, ...response.data });
        } else {
          setSettings(defaultFooterSettings);
        }
      } catch (_error) {
        setSettings(defaultFooterSettings);
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="footer-wrap mt-5 py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <h5 className="mb-3">{settings?.name || defaultFooterSettings.name}</h5>
            <p className="text-muted mb-2">
              {settings?.domain || defaultFooterSettings.domain}
            </p>
            <small className="text-muted">Every contribution supports meaningful, measurable social change.</small>
          </div>
          <div className="col-lg-4">
            <h6 className="text-uppercase text-muted mb-3">Contact</h6>
            <p className="mb-1">{settings?.address || defaultFooterSettings.address}</p>
            <p className="mb-1">{settings?.location || defaultFooterSettings.location}</p>
            <p className="mb-0">{settings?.contact || defaultFooterSettings.contact}</p>
          </div>
          <div className="col-lg-3">
            <h6 className="text-uppercase text-muted mb-3">Organization</h6>
            <p className="mb-1">Founder: {settings?.founder || defaultFooterSettings.founder}</p>
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
