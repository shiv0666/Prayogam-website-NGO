import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = { title: '', message: '', date: '' };

const getTodayDateString = () => {
  const today = new Date();
  const timezoneAdjusted = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return timezoneAdjusted.toISOString().slice(0, 10);
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const minDate = getTodayDateString();

  const loadAnnouncements = async () => {
    try {
      const response = await api.get('/announcements?all=true');
      setAnnouncements(response.data);
    } catch (err) {
      setError('Unable to load announcements.');
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      date: announcement.date?.slice(0, 10) || ''
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

    if (formData.date < minDate) {
      setError('Past dates are not allowed for announcements.');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/announcements/${editingId}`, formData);
        setSuccess('Announcement updated.');
      } else {
        await api.post('/announcements', formData);
        setSuccess('Announcement created.');
      }
      resetForm();
      loadAnnouncements();
    } catch (err) {
      setError('Unable to save announcement.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/announcements/${id}`);
      setSuccess('Announcement deleted.');
      loadAnnouncements();
    } catch (err) {
      setError('Unable to delete announcement.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Announcements</h1>
        <span className="badge text-bg-primary">{announcements.length} records</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Announcement' : 'Create Announcement'}</h5>
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
                name="message"
                placeholder="Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <input
                className="form-control"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={minDate}
                required
              />
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
            <h5 className="mb-3">Existing Announcements</h5>
            <div className="d-grid gap-3">
              {announcements.length === 0 && (
                <p className="text-muted mb-0">No announcements created yet.</p>
              )}
              {announcements.map((announcement) => (
                <div key={announcement._id} className="border rounded-3 p-3 bg-light-subtle">
                  <strong>{announcement.title}</strong>
                  <p className="text-muted mb-2">{announcement.message}</p>
                  <small className="text-secondary">{new Date(announcement.date).toLocaleDateString()}</small>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      onClick={() => handleEdit(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(announcement._id)}
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

export default AdminAnnouncements;
