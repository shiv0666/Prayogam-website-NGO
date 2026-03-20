import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import AdminSearchBar from '../../components/admin/AdminSearchBar.jsx';
import AdminFilterSelect from '../../components/admin/AdminFilterSelect.jsx';
import AdminPagination from '../../components/admin/AdminPagination.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';

const DEFAULT_LIMIT = 10;

const volunteerTypeOptions = [
  { value: '', label: 'All Volunteers' },
  { value: 'general', label: 'General Volunteer' },
  { value: 'event', label: 'Event-Based' }
];

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' }
];

const sortOptions = [
  { value: 'date_desc', label: 'Date ↓' },
  { value: 'date_asc', label: 'Date ↑' }
];

const AdminVolunteers = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [volunteerType, setVolunteerType] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/volunteers', {
        params: {
          page: currentPage,
          limit: DEFAULT_LIMIT,
          search: debouncedSearch,
          volunteerType,
          dateRange,
          sort
        }
      });
      const volunteerRows = response.data.data || response.data.volunteers || (Array.isArray(response.data) ? response.data : []);
      setRequests(volunteerRows);
      setTotalItems(typeof response.data.totalItems === 'number' ? response.data.totalItems : volunteerRows.length);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError('Unable to load volunteers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [currentPage, debouncedSearch, volunteerType, dateRange, sort]);

  const registeredCount = useMemo(
    () => totalItems,
    [totalItems]
  );

  const start = totalItems === 0 ? 0 : (currentPage - 1) * DEFAULT_LIMIT + 1;
  const end = Math.min(currentPage * DEFAULT_LIMIT, totalItems);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Volunteers</h1>
        <span className="badge text-bg-primary">Total: {registeredCount}</span>
      </div>

      <div className="content-card p-4">
        <div className="row g-2 align-items-center mb-3">
          <div className="col-lg-4">
            <AdminSearchBar value={search} onChange={(value) => { setCurrentPage(1); setSearch(value); }} placeholder="Search by name, email, phone, or city..." />
          </div>
          <div className="col-sm-6 col-lg-2">
            <AdminFilterSelect value={volunteerType} onChange={(value) => { setCurrentPage(1); setVolunteerType(value); }} options={volunteerTypeOptions} ariaLabel="Filter by volunteer type" />
          </div>
          <div className="col-sm-6 col-lg-2">
            <AdminFilterSelect value={dateRange} onChange={(value) => { setCurrentPage(1); setDateRange(value); }} options={dateRangeOptions} ariaLabel="Filter volunteer date" />
          </div>
          <div className="col-sm-6 col-lg-2" style={{ marginLeft: 'auto' }}>
            <AdminFilterSelect value={sort} onChange={(value) => { setCurrentPage(1); setSort(value); }} options={sortOptions} ariaLabel="Sort volunteer registrations" />
          </div>
        </div>

        <p className="text-muted small mb-3">Showing {start}-{end} of {totalItems} registrations</p>

        <ErrorMessage message={error} />

        {loading ? (
          <p className="text-muted mb-0">Loading volunteers...</p>
        ) : requests.length === 0 ? (
          <p className="text-muted mb-0">No results found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Event</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  const createdDate = request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-';

                  return (
                    <tr key={request._id}>
                      <td>{request.name}</td>
                      <td>{request.email}</td>
                      <td>{request.phone}</td>
                      <td>{request.city}</td>
                      <td>{request.eventName || 'General Volunteer'}</td>
                      <td>{createdDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} disabled={loading} />
      </div>
    </section>
  );
};

export default AdminVolunteers;
