import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = { title: '', value: '', description: '', icon: '', status: 'active', order: '' };

const AdminImpactStats = () => {
  const [stats, setStats] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadStats = async () => {
    try {
      const response = await api.get('/impact-stats?all=true');
      setStats(response.data);
    } catch (err) {
      setError('Unable to load impact statistics.');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEdit = (stat) => {
    setEditingId(stat._id);
    setFormData({
      title: stat.title,
      value: stat.value,
      description: stat.description,
      icon: stat.icon || '',
      status: stat.status,
      order: stat.order ?? ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      ...formData,
      order:
        formData.order === undefined ||
        formData.order === null ||
        String(formData.order).trim() === ''
          ? undefined
          : Number(formData.order)
    };

    try {
      if (editingId) {
        await api.put(`/impact-stats/${editingId}`, payload);
        setSuccess('Impact stat updated.');
      } else {
        await api.post('/impact-stats', payload);
        setSuccess('Impact stat created.');
      }
      resetForm();
      loadStats();
    } catch (err) {
      const firstValidationError = err?.response?.data?.errors?.[0]?.msg;
      setError(firstValidationError || err?.response?.data?.message || 'Unable to save impact stat.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/impact-stats/${id}`);
      setSuccess('Impact stat deleted.');
      loadStats();
    } catch (err) {
      setError('Unable to delete impact stat.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Impact Statistics</h1>
        <span className="badge text-bg-primary">{stats.length} total</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Impact Stat' : 'Create Impact Stat'}</h5>
            <form className="form" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              {success && <div className="alert alert-success">{success}</div>}
              
              <input
                className="form-control"
                name="title"
                placeholder="Title (e.g., Children Reached)"
                value={formData.title}
                onChange={handleChange}
                required
              />
              
              <input
                className="form-control"
                name="value"
                placeholder="Value (e.g., 1.5M+)"
                value={formData.value}
                onChange={handleChange}
                required
              />
              
              <textarea
                className="form-control"
                name="description"
                placeholder="Description (e.g., children and their families reached every year)"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
              
              <input
                className="form-control"
                name="icon"
                placeholder="Icon (optional, e.g., 👨‍👩‍👧‍👦 or emoji)"
                value={formData.icon}
                onChange={handleChange}
              />
              
              <input
                className="form-control"
                name="order"
                type="number"
                placeholder="Display order (leave blank for auto)"
                value={formData.order}
                onChange={handleChange}
              />
              
              <select 
                className="form-select" 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">Existing Impact Statistics</h5>
            <div className="d-grid gap-3">
              {stats.length === 0 && <p className="text-muted mb-0">No impact statistics created yet.</p>}
              {stats.map((stat) => (
                <div key={stat._id} className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex gap-2 align-items-center">
                      {stat.icon && <span className="fs-4">{stat.icon}</span>}
                      <strong>{stat.title}</strong>
                    </div>
                    <span className={`badge ${stat.status === 'inactive' ? 'text-bg-secondary' : 'text-bg-success'}`}>
                      {stat.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="fs-3 fw-bold text-primary">{stat.value}</span>
                  </div>
                  <p className="text-muted mb-2">{stat.description}</p>
                  <div className="d-flex gap-2 align-items-center">
                    <small className="text-muted">Order: {stat.order}</small>
                    <div className="ms-auto d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-primary" 
                        type="button" 
                        onClick={() => handleEdit(stat)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => handleDelete(stat._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminImpactStats;
