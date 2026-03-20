import { useEffect, useRef, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = { name: '', title: '', description: '', fullStory: '' };

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const loadStories = async () => {
    try {
      const response = await api.get('/stories');
      setStories(response.data);
    } catch (err) {
      setError('Unable to load stories.');
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (story) => {
    setEditingId(story._id);
    setFormData({
      name: story.name,
      title: story.title,
      description: story.description,
      fullStory: story.fullStory || ''
    });
    setImageFile(null);
    setImagePreview(story.imageUrl || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('fullStory', formData.fullStory);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editingId) {
        await api.put(`/stories/${editingId}`, payload);
        setSuccess('Story updated.');
      } else {
        await api.post('/stories', payload);
        setSuccess('Story created.');
      }
      resetForm();
      loadStories();
    } catch (err) {
      setError('Unable to save story.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/stories/${id}`);
      setSuccess('Story deleted.');
      loadStories();
    } catch (err) {
      setError('Unable to delete story.');
    }
  };

  const resolveImageSrc = (imageUrl) => {
    return imageUrl || '';
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Stories of Change</h1>
        <span className="badge text-bg-primary">{stories.length} total</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Story' : 'Create Story'}</h5>
            <form className="form" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              {success && <div className="success">{success}</div>}

              <input
                className="form-control"
                name="name"
                placeholder="Name (e.g. Riya Sharma)"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="form-control"
                name="title"
                placeholder="Title (e.g. From dropout to graduate)"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                className="form-control"
                name="description"
                placeholder="Short description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <textarea
                className="form-control"
                name="fullStory"
                placeholder="Full story (optional)"
                rows="4"
                value={formData.fullStory}
                onChange={handleChange}
              />

              <div>
                <label className="form-label fw-semibold mb-1">Image Upload</label>
                <input
                  ref={fileInputRef}
                  className="form-control"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                />
                <small className="text-muted">Supported: jpg, jpeg, png · Max 5 MB</small>
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
            <h5 className="mb-3">Existing Stories</h5>
            <div className="d-grid gap-3">
              {stories.length === 0 && <p className="text-muted mb-0">No stories created yet.</p>}
              {stories.map((story) => (
                <div key={story._id} className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex gap-3 align-items-start mb-2">
                    {story.imageUrl && (
                      <img
                        src={resolveImageSrc(story.imageUrl)}
                        alt={story.name}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      />
                    )}
                    <div className="flex-grow-1 min-w-0">
                      <strong className="d-block">{story.title}</strong>
                      <span className="text-muted small">{story.name}</span>
                    </div>
                  </div>
                  <p className="text-muted mb-2 small">{story.description}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" type="button" onClick={() => handleEdit(story)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(story._id)}
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

export default AdminStories;
