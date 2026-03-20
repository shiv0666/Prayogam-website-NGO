import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      const response = await api.post('/auth/login', payload);
      login(response.data.token, response.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err?.response?.status === 401) {
        setError('Invalid login credentials.');
      } else {
        setError('Server unavailable. Please start backend and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '520px' }}>
        <div className="form-card p-4 p-lg-5" style={{ background: 'linear-gradient(145deg, #ffffff, #f3f4fa)' }}>
          <p className="section-kicker mb-2">Prayogam Foundation</p>
          <h1 className="h3 mb-3">Admin Sign In</h1>
          <form className="form" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="small text-muted mt-3 mb-0">Authorized personnel only.</p>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
