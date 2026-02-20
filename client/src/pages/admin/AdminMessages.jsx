import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await api.get('/contact');
        setMessages(response.data);
      } catch (err) {
        setError('Unable to load messages.');
      }
    };

    loadMessages();
  }, []);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Contact Messages</h1>
        <span className="badge text-bg-primary">{messages.length} messages</span>
      </div>
      <ErrorMessage message={error} />
      <div className="row g-4">
        {messages.length === 0 && (
          <div className="col-12">
            <div className="content-card p-4 text-muted">No messages yet.</div>
          </div>
        )}
        {messages.map((message) => (
          <div className="col-md-6" key={message._id}>
            <div className="content-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <strong>{message.name}</strong>
                <small className="text-secondary">{new Date(message.createdAt).toLocaleDateString()}</small>
              </div>
              <p className="text-muted mb-2">{message.email}</p>
              <p className="mb-0">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminMessages;
