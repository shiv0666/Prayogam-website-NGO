import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = { title: '', description: '', status: 'active' };

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPrograms = async () => {
    try {
      const response = await api.get('/programs?all=true');
      setPrograms(response.data);
    } catch (err) {
      setError('Unable to load programs.');
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setFormData({
      title: program.title,
      description: program.description,
      status: program.status
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
    try {
      if (editingId) {
        await api.put(`/programs/${editingId}`, formData);
        setSuccess('Program updated.');
      } else {
        await api.post('/programs', formData);
        setSuccess('Program created.');
      }
      resetForm();
      loadPrograms();
    } catch (err) {
      setError('Unable to save program.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/programs/${id}`);
      setSuccess('Program deleted.');
      loadPrograms();
    } catch (err) {
      setError('Unable to delete program.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Programs</h1>
        <span className="badge text-bg-primary">{programs.length} total</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Program' : 'Create Program'}</h5>
            <form className="form" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              {success && <div className="success">{success}</div>}
              <input
                className="form-control"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
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
            <h5 className="mb-3">Existing Programs</h5>
            <div className="d-grid gap-3">
              {programs.length === 0 && <p className="text-muted mb-0">No programs created yet.</p>}
              {programs.map((program) => (
                <div key={program._id} className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong>{program.title}</strong>
                    <span className={`badge ${program.status === 'inactive' ? 'text-bg-secondary' : 'text-bg-success'}`}>
                      {program.status}
                    </span>
                  </div>
                  <p className="text-muted mb-2">{program.description}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" type="button" onClick={() => handleEdit(program)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(program._id)}
                    >
                      Delete
                    </button>
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

export default AdminPrograms;
