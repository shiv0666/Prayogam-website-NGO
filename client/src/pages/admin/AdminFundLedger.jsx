import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const CATEGORIES = ['Education', 'Social', 'Environment', 'Healthcare', 'Administration', 'Other'];

const emptyForm = {
  year: new Date().getFullYear(),
  category: 'Education',
  amountRaised: '',
  amountSpent: '',
  beneficiariesServed: '',
  description: ''
};

const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const AdminFundLedger = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadEntries = async () => {
    try {
      const res = await api.get('/fund-ledger');
      setEntries(res.data);
    } catch {
      setError('Unable to load fund ledger.');
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setFormData({
      year: entry.year,
      category: entry.category,
      amountRaised: entry.amountRaised,
      amountSpent: entry.amountSpent,
      beneficiariesServed: entry.beneficiariesServed || '',
      description: entry.description || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        year: Number(formData.year),
        category: formData.category,
        amountRaised: Number(formData.amountRaised),
        amountSpent: Number(formData.amountSpent),
        beneficiariesServed: formData.beneficiariesServed ? Number(formData.beneficiariesServed) : 0,
        description: formData.description
      };
      if (editingId) {
        await api.put(`/fund-ledger/${editingId}`, payload);
        setSuccess('Entry updated.');
      } else {
        await api.post('/fund-ledger', payload);
        setSuccess('Entry created.');
      }
      resetForm();
      loadEntries();
    } catch {
      setError('Unable to save entry.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/fund-ledger/${id}`);
      setSuccess('Entry deleted.');
      loadEntries();
    } catch {
      setError('Unable to delete entry.');
    }
  };

  // Group entries by year for display
  const byYear = entries.reduce((acc, e) => {
    acc[e.year] = acc[e.year] || [];
    acc[e.year].push(e);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b - a);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Fund Usage Ledger</h1>
        <span className="badge text-bg-primary">{entries.length} entries</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">{editingId ? 'Edit Entry' : 'Add Entry'}</h5>
            <form className="form" onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              {success && <div className="success">{success}</div>}

              <label className="form-label fw-semibold">Year</label>
              <input
                className="form-control"
                type="number"
                name="year"
                min="2000"
                max="2100"
                value={formData.year}
                onChange={handleChange}
                required
              />

              <label className="form-label fw-semibold">Category</label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="form-label fw-semibold">Amount Raised (₹)</label>
              <input
                className="form-control"
                type="number"
                name="amountRaised"
                min="0"
                step="1"
                placeholder="e.g. 50000"
                value={formData.amountRaised}
                onChange={handleChange}
                required
              />

              <label className="form-label fw-semibold">Amount Spent (₹)</label>
              <input
                className="form-control"
                type="number"
                name="amountSpent"
                min="0"
                step="1"
                placeholder="e.g. 45000"
                value={formData.amountSpent}
                onChange={handleChange}
                required
              />

              <label className="form-label fw-semibold">Beneficiaries Served</label>
              <input
                className="form-control"
                type="number"
                name="beneficiariesServed"
                min="0"
                placeholder="e.g. 120"
                value={formData.beneficiariesServed}
                onChange={handleChange}
              />

              <label className="form-label fw-semibold">Notes / Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                placeholder="Brief note on how funds were used"
                value={formData.description}
                onChange={handleChange}
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

        <div className="col-lg-8">
          <div className="content-card p-4">
            <h5 className="mb-3">All Entries</h5>
            {entries.length === 0 && <p className="text-muted">No entries yet. Add your first fund usage record.</p>}
            {years.map((year) => (
              <div key={year} className="mb-4">
                <h6 className="text-muted text-uppercase fw-bold mb-2 border-bottom pb-1">{year}</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Category</th>
                        <th>Raised</th>
                        <th>Spent</th>
                        <th>Beneficiaries</th>
                        <th>Notes</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {byYear[year].map((entry) => (
                        <tr key={entry._id}>
                          <td><span className="badge text-bg-primary">{entry.category}</span></td>
                          <td className="text-success fw-semibold">{fmt(entry.amountRaised)}</td>
                          <td className="text-warning fw-semibold">{fmt(entry.amountSpent)}</td>
                          <td>{entry.beneficiariesServed || '—'}</td>
                          <td className="text-muted small" style={{ maxWidth: 180 }}>{entry.description || '—'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-xs btn-sm btn-primary py-0 px-2" onClick={() => handleEdit(entry)}>Edit</button>
                              <button className="btn btn-xs btn-sm btn-outline-danger py-0 px-2" onClick={() => handleDelete(entry._id)}>Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminFundLedger;
