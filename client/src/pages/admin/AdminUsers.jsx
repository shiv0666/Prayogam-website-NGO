import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'user'
};

const AdminUsers = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (err) {
      setError('Unable to load accounts.');
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEdit = (account) => {
    setEditingId(account._id);
    setFormData({
      name: account.name || '',
      email: account.email,
      password: '',
      role: account.role
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
        await api.put(`/accounts/${editingId}`, {
          name: formData.name,
          role: formData.role
        });
        setSuccess('Account updated.');
      } else {
        await api.post('/accounts', formData);
        setSuccess('Account created.');
      }
      resetForm();
      loadAccounts();
    } catch (err) {
      setError('Unable to save account.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/accounts/${id}`);
      setSuccess('Account deleted.');
      loadAccounts();
    } catch (err) {
      setError('Unable to delete account.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Manage Accounts</h1>
        <span className="badge text-bg-primary">{accounts.length} users</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Account' : 'Create Account'}</h5>
            <form className="form" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              {success && <div className="success">{success}</div>}
              <input
                className="form-control"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!editingId}
              />
              {!editingId && (
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              )}
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="ngo_admin">NGO Admin</option>
                <option value="user">User</option>
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
            <h5 className="mb-3">Existing Accounts</h5>
            <div className="d-grid gap-3">
              {accounts.length === 0 && <p className="text-muted mb-0">No accounts created yet.</p>}
              {accounts.map((account) => (
                <div key={account._id} className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong>{account.name || account.email}</strong>
                    <span className="badge text-bg-secondary text-uppercase">{account.role}</span>
                  </div>
                  <p className="text-muted mb-2">{account.email}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      onClick={() => handleEdit(account)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(account._id)}
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

export default AdminUsers;
