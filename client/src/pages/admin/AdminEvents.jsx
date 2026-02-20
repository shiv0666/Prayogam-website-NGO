import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  status: 'active',
  requirements: {
    volunteersNeeded: 0,
    fundsNeeded: 0,
    itemsNeeded: ''
  }
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadEvents = async () => {
    try {
      const response = await api.get('/events?all=true');
      setEvents(response.data);
    } catch (err) {
      setError('Unable to load events.');
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [name]: name.includes('Needed') ? Number(value) : value
      }
    }));
  };

  const handleEdit = (selected) => {
    setEditingId(selected._id);
    setFormData({
      title: selected.title,
      description: selected.description,
      date: selected.date?.slice(0, 10) || '',
      location: selected.location || '',
      status: selected.status || 'active',
      requirements: {
        volunteersNeeded: selected.requirements?.volunteersNeeded || 0,
        fundsNeeded: selected.requirements?.fundsNeeded || 0,
        itemsNeeded: selected.requirements?.itemsNeeded || ''
      }
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
        await api.put(`/events/${editingId}`, formData);
        setSuccess('Event updated.');
      } else {
        await api.post('/events', formData);
        setSuccess('Event created.');
      }
      resetForm();
      loadEvents();
    } catch (err) {
      setError('Unable to save event.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/events/${id}`);
      setSuccess('Event deleted.');
      loadEvents();
    } catch (err) {
      setError('Unable to delete event.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Events</h1>
        <span className="badge text-bg-primary">{events.length} events</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Event' : 'Create Event'}</h5>
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
              <input
                className="form-control"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <input
                className="form-control"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="border rounded-3 p-3 bg-light-subtle">
                <strong>Requirements</strong>
                <div className="form mt-2">
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    name="volunteersNeeded"
                    placeholder="Volunteers needed"
                    value={formData.requirements.volunteersNeeded}
                    onChange={handleRequirementChange}
                  />
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    name="fundsNeeded"
                    placeholder="Funds needed"
                    value={formData.requirements.fundsNeeded}
                    onChange={handleRequirementChange}
                  />
                  <input
                    className="form-control"
                    name="itemsNeeded"
                    placeholder="Items needed"
                    value={formData.requirements.itemsNeeded}
                    onChange={handleRequirementChange}
                  />
                </div>
              </div>

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
            <h5 className="mb-3">Upcoming Events</h5>
            <div className="d-grid gap-3">
              {events.length === 0 && <p className="text-muted mb-0">No events created yet.</p>}
              {events.map((event) => (
                <div key={event._id} className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong>{event.title}</strong>
                    <span className={`badge ${event.status === 'inactive' ? 'text-bg-secondary' : 'text-bg-success'}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-muted mb-2">{event.description}</p>
                  <small className="text-secondary d-block">{new Date(event.date).toLocaleDateString()}</small>
                  {event.location && <p className="mb-2">Location: {event.location}</p>}
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {event.requirements?.volunteersNeeded > 0 && (
                      <span className="badge text-bg-primary">Volunteers: {event.requirements.volunteersNeeded}</span>
                    )}
                    {event.requirements?.fundsNeeded > 0 && (
                      <span className="badge text-bg-success">Funds: {event.requirements.fundsNeeded}</span>
                    )}
                    {event.requirements?.itemsNeeded && (
                      <span className="badge text-bg-secondary">Items: {event.requirements.itemsNeeded}</span>
                    )}
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-sm btn-primary" type="button" onClick={() => handleEdit(event)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(event._id)}
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

export default AdminEvents;
