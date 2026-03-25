import { useEffect, useRef, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import readingImg from '../../extra/reading.png';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  order: ''
};

const fallbackInitiative = {
  _id: 'fallback-reading-room',
  title: 'Reading Room Initiative',
  description:
    'Prayogam Foundation has launched a reading room for students at minimal cost to support education and self-learning.',
  image: readingImg,
  date: null,
  order: 0,
  isFallback: true
};

const normalizeTitle = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const READING_ROOM_KEY = normalizeTitle('Reading Room Initiative');
const isReadingRoomInitiative = (item) => normalizeTitle(item?.title).startsWith(READING_ROOM_KEY);

const formatInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const AdminInitiatives = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const loadInitiatives = async () => {
    try {
      const response = await api.get('/initiatives');
      const apiItems = Array.isArray(response.data) ? response.data : [];
      const hasReadingRoom = apiItems.some(isReadingRoomInitiative);
      setItems(hasReadingRoom ? apiItems : [fallbackInitiative, ...apiItems]);
      setError('');
    } catch {
      setItems([fallbackInitiative]);
      setError('');
    }
  };

  useEffect(() => {
    loadInitiatives();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (item) => {
    const target =
      item.isFallback
        ? items.find((entry) => !entry.isFallback && isReadingRoomInitiative(entry)) || item
        : item;

    if (target.isFallback) {
      setError('No editable Reading Room record found yet. Create one first, then edit it.');
      setSuccess('');
      return;
    }

    setEditingId(target._id);
    setFormData({
      title: target.title || '',
      description: target.description || '',
      date: formatInputDate(target.date),
      order: target.order ?? ''
    });
    setImageFile(null);
    setImagePreview(target.image || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('date', formData.date || '');
    payload.append('order', formData.order);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingId) {
        await api.put(`/initiatives/${editingId}`, payload);
        setSuccess('Initiative updated.');
      } else {
        await api.post('/initiatives', payload);
        setSuccess('Initiative created.');
      }

      resetForm();
      loadInitiatives();
    } catch (err) {
      const validationMsg = err?.response?.data?.errors?.[0]?.msg;
      setError(validationMsg || err?.response?.data?.message || 'Unable to save initiative.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');

    if (id === fallbackInitiative._id) {
      setSuccess('Reading Room is a default pinned initiative and cannot be deleted.');
      return;
    }

    try {
      await api.delete(`/initiatives/${id}`);
      setSuccess('Initiative deleted.');
      loadInitiatives();
    } catch {
      setError('Unable to delete initiative.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Initiatives Timeline</h1>
        <span className="badge text-bg-primary">{items.length} total</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Initiative' : 'Create Initiative'}</h5>
            <form className="form" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              {success && <div className="success">{success}</div>}

              <input
                className="form-control"
                name="title"
                placeholder="Initiative title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <textarea
                className="form-control"
                name="description"
                placeholder="Short description"
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
              />

              <input
                className="form-control"
                type="number"
                name="order"
                placeholder="Display order (leave blank for auto)"
                value={formData.order}
                onChange={handleChange}
              />

              <div>
                <label className="form-label fw-semibold mb-1">Image Upload</label>
                <input
                  ref={fileInputRef}
                  className="form-control"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  onChange={handleImageChange}
                />
                <small className="text-muted">Supported: jpg, jpeg, png, webp, gif · Max 5 MB</small>
              </div>

              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}

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
            <h5 className="mb-3">Existing Initiatives</h5>
            <div className="d-grid gap-3">
              {items.length === 0 && <p className="text-muted mb-0">No initiatives created yet.</p>}
              {items.map((item) => (
                <div key={item._id} className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex gap-3 align-items-start mb-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      />
                    )}
                    <div className="flex-grow-1 min-w-0">
                      <strong className="d-block">{item.title}</strong>
                      <span className="text-muted small">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Date not set'} | Order: {item.order ?? 0}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted mb-2 small">{item.description}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(item._id)}
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

export default AdminInitiatives;
