import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import AdminSearchBar from '../../components/admin/AdminSearchBar.jsx';
import AdminFilterSelect from '../../components/admin/AdminFilterSelect.jsx';
import AdminPagination from '../../components/admin/AdminPagination.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';

const DEFAULT_LIMIT = 10;

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' }
];

const sortOptions = [
  { value: 'date_desc', label: 'Date ↓' },
  { value: 'date_asc', label: 'Date ↑' }
];

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await api.get('/contact', {
          params: {
            page: currentPage,
            limit: DEFAULT_LIMIT,
            search: debouncedSearch,
            dateRange,
            sort
          }
        });

        const messageRows = response.data.data || response.data.messages || (Array.isArray(response.data) ? response.data : []);
        setMessages(messageRows);
        setTotalItems(typeof response.data.totalItems === 'number' ? response.data.totalItems : messageRows.length);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError('Unable to load messages.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [currentPage, debouncedSearch, dateRange, sort]);

  const start = totalItems === 0 ? 0 : (currentPage - 1) * DEFAULT_LIMIT + 1;
  const end = Math.min(currentPage * DEFAULT_LIMIT, totalItems);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Contact Messages</h1>
        <span className="badge text-bg-primary">{totalItems} messages</span>
      </div>
      <ErrorMessage message={error} />

      <div className="content-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-lg-6">
            <AdminSearchBar value={search} onChange={(value) => { setCurrentPage(1); setSearch(value); }} placeholder="Search messages by name, email, or text..." />
          </div>
          <div className="col-sm-6 col-lg-3">
            <AdminFilterSelect value={dateRange} onChange={(value) => { setCurrentPage(1); setDateRange(value); }} options={dateRangeOptions} ariaLabel="Filter messages by date" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <AdminFilterSelect value={sort} onChange={(value) => { setCurrentPage(1); setSort(value); }} options={sortOptions} ariaLabel="Sort messages" />
          </div>
        </div>
      </div>

      <p className="text-muted small mb-3">Showing {start}-{end} of {totalItems} messages</p>

      <div className="row g-4">
        {loading && (
          <div className="col-12">
            <div className="content-card p-4 text-muted">Loading messages...</div>
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="col-12">
            <div className="content-card p-4 text-muted">No results found.</div>
          </div>
        )}
        {!loading && messages.map((message) => (
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

      <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} disabled={loading} />
    </section>
  );
};

export default AdminMessages;
