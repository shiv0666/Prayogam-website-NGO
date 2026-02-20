import { useEffect, useState } from 'react';
import api from '../services/api.js';
import ErrorMessage from '../components/ErrorMessage.jsx';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (err) {
        setSettings(null);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/contact', formData);
      setSuccess('Message sent successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Unable to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="page-hero mb-4">
        <p className="section-kicker text-white-50 mb-2">Contact</p>
        <h1 className="section-title text-white mb-2">Get in Touch</h1>
        <p className="mb-0 text-white-50">Partner with Prayogam Foundation, ask questions, or share how you’d like to contribute.</p>
      </div>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">Get in touch</h5>
            <p className="text-muted mb-2">{settings?.address || 'Address will be updated by admin.'}</p>
            <p className="mb-2"><strong>Contact:</strong> {settings?.contact || 'Not available'}</p>
            <p className="mb-2"><strong>Founder:</strong> {settings?.founder || 'Not available'}</p>
            <p className="mb-0"><strong>Location:</strong> {settings?.location || 'Not available'}</p>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="form-card bg-white p-4 p-lg-5 h-100">
            <h5 className="mb-3">Send a message</h5>
            <form className="form" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />
            {success && <div className="success">{success}</div>}
            <input
              className="form-control"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="form-control"
              name="message"
              placeholder="Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
