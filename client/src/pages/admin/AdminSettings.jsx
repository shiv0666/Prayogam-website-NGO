import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = {
  name: '',
  founder: '',
  address: '',
  contact: '',
  location: '',
  domain: '',
  facebook: '',
  twitter: '',
  youtube: '',
  instagram: '',
  whatsapp: '',
  phone: ''
};

const AdminSettings = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        setFormData(response.data);
      } catch (err) {
        setError('Settings not available yet.');
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
    try {
      await api.put('/settings', formData);
      setSuccess('Settings updated successfully.');
    } catch (err) {
      setError('Unable to update settings.');
    }
  };

  return (
    <section>
      <h1 className="section-title mb-4">NGO Details</h1>
      <div className="content-card p-4">
        <form className="form" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          {success && <div className="success">{success}</div>}
          <input
            className="form-control"
            name="name"
            placeholder="Organization name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="founder"
            placeholder="Founder / Director"
            value={formData.founder}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="contact"
            placeholder="Contact number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="domain"
            placeholder="Domain"
            value={formData.domain}
            onChange={handleChange}
            required
          />
          <hr className="my-2" />
          <h6 className="fw-semibold text-muted mb-1">Social Media Links</h6>
          <input
            className="form-control"
            name="facebook"
            placeholder="Facebook URL"
            value={formData.facebook || ''}
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="twitter"
            placeholder="X (Twitter) URL"
            value={formData.twitter || ''}
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="youtube"
            placeholder="YouTube URL"
            value={formData.youtube || ''}
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="instagram"
            placeholder="Instagram URL"
            value={formData.instagram || ''}
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="whatsapp"
            placeholder="WhatsApp link (e.g. https://wa.me/91XXXXXXXXXX)"
            value={formData.whatsapp || ''}
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="phone"
            placeholder="Phone number (e.g. +91XXXXXXXXXX)"
            value={formData.phone || ''}
            onChange={handleChange}
          />
          <button className="btn btn-primary" type="submit">Save Details</button>
        </form>
      </div>
    </section>
  );
};

export default AdminSettings;
