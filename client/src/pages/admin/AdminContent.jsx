import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const defaultState = {
  home: { title: '', body: '' },
  about: { title: '', body: '' },
  mission: { title: '', body: '' }
};

const AdminContent = () => {
  const [content, setContent] = useState(defaultState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [home, about, mission] = await Promise.all([
          api.get('/content/home'),
          api.get('/content/about'),
          api.get('/content/mission')
        ]);
        setContent({
          home: { title: home.data?.title || '', body: home.data?.body || '' },
          about: { title: about.data?.title || '', body: about.data?.body || '' },
          mission: { title: mission.data?.title || '', body: mission.data?.body || '' }
        });
      } catch (err) {
        setError('Unable to load content.');
      }
    };

    loadContent();
  }, []);

  const handleChange = (key, field, value) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSave = async (key) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/content/${key}`, content[key]);
      setSuccess('Content updated successfully.');
    } catch (err) {
      setError('Unable to save content.');
    }
  };

  return (
    <section>
      <h1 className="section-title mb-4">Manage Content</h1>
      <ErrorMessage message={error} />
      {success && <div className="success">{success}</div>}
      {['home', 'about', 'mission'].map((key) => (
        <div className="content-card p-4" key={key} style={{ marginBottom: '20px' }}>
          <p className="section-kicker mb-2">{key} page</p>
          <h5 className="mb-3 text-capitalize">{key} Content</h5>
          <div className="form">
            <input
              className="form-control"
              placeholder="Title"
              value={content[key].title}
              onChange={(event) => handleChange(key, 'title', event.target.value)}
            />
            <textarea
              className="form-control"
              rows="5"
              placeholder="Body"
              value={content[key].body}
              onChange={(event) => handleChange(key, 'body', event.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={() => handleSave(key)}>
              Save {key}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AdminContent;
