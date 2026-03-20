import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import AdminSearchBar from '../../components/admin/AdminSearchBar.jsx';
import AdminFilterSelect from '../../components/admin/AdminFilterSelect.jsx';
import AdminPagination from '../../components/admin/AdminPagination.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';

const DEFAULT_LIMIT = 10;

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const dateRangeOptions = [
  { value: 'all', label: 'All Dates' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' }
];

const sortOptions = [
  { value: 'date_desc', label: 'Date ↓' },
  { value: 'date_asc', label: 'Date ↑' },
  { value: 'created_desc', label: 'Created ↓' },
  { value: 'created_asc', label: 'Created ↑' }
];

const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append('image', file);
  const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data.url;
};

const emptyForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  status: 'active',
  image: '',
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
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const todayString = new Date().toISOString().split('T')[0];
  const debouncedSearch = useDebouncedValue(search, 300);

  const loadEvents = async () => {
    setLoadingList(true);
    try {
      const response = await api.get('/events', {
        params: {
          all: true,
          page: currentPage,
          limit: DEFAULT_LIMIT,
          search: debouncedSearch,
          status: statusFilter,
          dateRange,
          sort
        }
      });
      const payload = response.data;
      const eventRows = payload.data || payload.events || (Array.isArray(payload) ? payload : []);
      setEvents(eventRows);
      setTotalItems(typeof payload.totalItems === 'number' ? payload.totalItems : eventRows.length);
      setTotalPages(payload.totalPages || 1);
    } catch (err) {
      setError('Unable to load events.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentPage, debouncedSearch, statusFilter, dateRange, sort]);

  const start = totalItems === 0 ? 0 : (currentPage - 1) * DEFAULT_LIMIT + 1;
  const end = Math.min(currentPage * DEFAULT_LIMIT, totalItems);

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
      image: selected.image || '',
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

    const payload = {
      ...formData,
      totalVolunteersRequired: Number(formData.requirements.volunteersNeeded || 0)
    };

    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
        setSuccess('Event updated.');
      } else {
        await api.post('/events', payload);
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
        <span className="badge text-bg-primary">{totalItems} events</span>
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
                min={todayString}
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
                <strong className="d-block mb-2">Event Image</strong>
                {formData.image && (
                  <img src={formData.image.startsWith('/uploads') ? `http://localhost:5050${formData.image}` : formData.image} alt="preview" className="img-thumbnail mb-2" style={{ maxHeight: 100, display: 'block' }} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-1"
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploadingImage(true);
                    try {
                      const url = await uploadImage(file);
                      setFormData((prev) => ({ ...prev, image: url }));
                    } catch {
                      setError('Image upload failed.');
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                />
                {uploadingImage && <small className="text-muted">Uploading…</small>}
              </div>

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

            <div className="row g-2 align-items-center mb-3">
              <div className="col-lg-5">
                <AdminSearchBar value={search} onChange={(value) => { setCurrentPage(1); setSearch(value); }} placeholder="Search events..." />
              </div>
              <div className="col-sm-6 col-lg-2">
                <AdminFilterSelect value={statusFilter} onChange={(value) => { setCurrentPage(1); setStatusFilter(value); }} options={statusOptions} ariaLabel="Filter event status" />
              </div>
              <div className="col-sm-6 col-lg-2">
                <AdminFilterSelect value={dateRange} onChange={(value) => { setCurrentPage(1); setDateRange(value); }} options={dateRangeOptions} ariaLabel="Filter event date" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <AdminFilterSelect value={sort} onChange={(value) => { setCurrentPage(1); setSort(value); }} options={sortOptions} ariaLabel="Sort events" />
              </div>
            </div>

            <p className="text-muted small mb-3">Showing {start}-{end} of {totalItems} events</p>

            <div className="d-grid gap-3">
              {loadingList && <p className="text-muted mb-0">Loading events...</p>}
              {!loadingList && events.length === 0 && <p className="text-muted mb-0">No results found.</p>}
              {!loadingList && events.map((event) => (
                <div key={event._id} className="border rounded-3 p-3 bg-light-subtle">
                  {(() => {
                    const total = Number(event.totalVolunteersRequired || event.requirements?.volunteersNeeded || 0);
                    const approved = Number(event.currentApprovedVolunteers || 0);
                    const remaining = Math.max(0, Number(event.remainingVolunteers ?? total - approved));

                    return (
                      <>
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
                    <span className="badge text-bg-primary">Needed: {total}</span>
                    <span className="badge text-bg-info">Registered: {approved}</span>
                    <span className={`badge ${remaining > 0 ? 'text-bg-success' : 'text-bg-danger'}`}>
                      {remaining > 0 ? `${remaining} spots left` : 'Full'}
                    </span>
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
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>

            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} disabled={loadingList} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminEvents;
