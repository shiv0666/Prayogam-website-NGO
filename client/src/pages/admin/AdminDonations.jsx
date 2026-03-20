import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import AdminSearchBar from '../../components/admin/AdminSearchBar.jsx';
import AdminFilterSelect from '../../components/admin/AdminFilterSelect.jsx';
import AdminPagination from '../../components/admin/AdminPagination.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';

const categoryOrder = ['Education', 'Social Welfare', 'Environment', 'Healthcare'];

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const DEFAULT_LIMIT = 10;

const categoryOptions = [
  { value: '', label: 'All Categories' },
  ...categoryOrder.map((category) => ({ value: category, label: category }))
];

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' }
];

const sortOptions = [
  { value: 'date_desc', label: 'Date ↓' },
  { value: 'date_asc', label: 'Date ↑' },
  { value: 'amount_asc', label: 'Amount ↑' },
  { value: 'amount_desc', label: 'Amount ↓' }
];

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalDonors: 0, byCategory: {} });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('date_desc');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/donations', {
        params: {
          page: currentPage,
          limit: DEFAULT_LIMIT,
          search: debouncedSearch,
          category: categoryFilter,
          dateRange,
          sort,
          minAmount,
          maxAmount
        }
      });

      const donationRows = response.data.data || response.data.donations || (Array.isArray(response.data) ? response.data : []);
      setDonations(donationRows);
      setSummary(response.data.summary || { totalAmount: 0, totalDonors: 0, byCategory: {} });
      setTotalItems(typeof response.data.totalItems === 'number' ? response.data.totalItems : donationRows.length);
      setTotalPages(response.data.totalPages || 1);
    } catch (loadError) {
      setError('Unable to load donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [currentPage, debouncedSearch, categoryFilter, dateRange, sort, minAmount, maxAmount]);

  const rangeLabel = useMemo(() => {
    if (totalItems === 0) return 'Showing 0 of 0 donations';
    const start = (currentPage - 1) * DEFAULT_LIMIT + 1;
    const end = Math.min(currentPage * DEFAULT_LIMIT, totalItems);
    return `Showing ${start}-${end} of ${totalItems} donations`;
  }, [currentPage, totalItems]);

  const handleVerify = async (donation) => {
    setError('');
    setSuccess('');

    try {
      await api.put(`/donations/${donation._id}`, { paymentStatus: 'Verified' });
      setSuccess('Donation marked as verified.');
      loadDonations();
      if (selectedDonation?._id === donation._id) {
        setSelectedDonation({ ...selectedDonation, paymentStatus: 'Verified' });
      }
    } catch (updateError) {
      setError('Unable to update donation status.');
    }
  };

  const handleDelete = async (donationId) => {
    setError('');
    setSuccess('');

    try {
      await api.delete(`/donations/${donationId}`);
      setSuccess('Donation deleted.');
      if (selectedDonation?._id === donationId) {
        setSelectedDonation(null);
      }
      loadDonations();
    } catch (deleteError) {
      setError('Unable to delete donation.');
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="section-title mb-1">Manage Donations</h1>
          <p className="text-muted mb-0">Track donation records, verify payments, and review donor details.</p>
        </div>
        <span className="badge text-bg-primary">{totalItems} total</span>
      </div>

      <ErrorMessage message={error} />
      {success && <div className="success mb-4">{success}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="content-card p-4 h-100">
            <p className="section-kicker mb-2">Total Collected</p>
            <h3 className="mb-0">{formatCurrency(summary.totalAmount)}</h3>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="content-card p-4 h-100">
            <p className="section-kicker mb-2">Total Donors</p>
            <h3 className="mb-0">{summary.totalDonors || 0}</h3>
          </div>
        </div>
        {categoryOrder.map((category) => (
          <div className="col-md-6 col-xl-3" key={category}>
            <div className="content-card p-4 h-100">
              <p className="section-kicker mb-2">{category}</p>
              <h3 className="mb-0">{formatCurrency(summary.byCategory?.[category])}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="content-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-lg-4">
            <AdminSearchBar value={search} onChange={(value) => { setCurrentPage(1); setSearch(value); }} placeholder="Search donations by name, email, or phone..." />
          </div>
          <div className="col-sm-6 col-lg-2">
            <AdminFilterSelect value={categoryFilter} onChange={(value) => { setCurrentPage(1); setCategoryFilter(value); }} options={categoryOptions} ariaLabel="Filter by category" />
          </div>
          <div className="col-sm-6 col-lg-2">
            <AdminFilterSelect value={dateRange} onChange={(value) => { setCurrentPage(1); setDateRange(value); }} options={dateRangeOptions} ariaLabel="Filter by date" />
          </div>
          <div className="col-sm-6 col-lg-2">
            <input className="form-control" value={minAmount} onChange={(event) => { setCurrentPage(1); setMinAmount(event.target.value); }} placeholder="Min amount" type="number" min="0" />
          </div>
          <div className="col-sm-6 col-lg-2">
            <input className="form-control" value={maxAmount} onChange={(event) => { setCurrentPage(1); setMaxAmount(event.target.value); }} placeholder="Max amount" type="number" min="0" />
          </div>
          <div className="col-sm-6 col-lg-2">
            <AdminFilterSelect value={sort} onChange={(value) => { setCurrentPage(1); setSort(value); }} options={sortOptions} ariaLabel="Sort donations" />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="content-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Donation Records</h5>
              <span className="text-muted small">{rangeLabel}</span>
            </div>
            <div className="table-responsive">
              <table className="table align-middle donation-admin-table mb-0">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Donation Category</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">Loading donations...</td>
                    </tr>
                  )}
                  {!loading && donations.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">No results found.</td>
                    </tr>
                  )}
                  {!loading && donations.map((donation) => (
                    <tr key={donation._id}>
                      <td>{donation.name}</td>
                      <td>{donation.email}</td>
                      <td>{donation.phone}</td>
                      <td>{donation.category}</td>
                      <td>{formatCurrency(donation.amount)}</td>
                      <td>
                        <span className={`badge ${donation.paymentStatus === 'Verified' ? 'text-bg-success' : 'text-bg-warning'}`}>
                          {donation.paymentStatus}
                        </span>
                      </td>
                      <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setSelectedDonation(donation)}>
                            View
                          </button>
                          {donation.paymentStatus !== 'Verified' && (
                            <button className="btn btn-sm btn-primary" type="button" onClick={() => handleVerify(donation)}>
                              Verify
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(donation._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} disabled={loading} />
          </div>
        </div>

        <div className="col-xl-4">
          <div className="content-card p-4 h-100">
            <h5 className="mb-3">Donation Details</h5>
            {!selectedDonation && <p className="text-muted mb-0">Select a donation to view full details.</p>}
            {selectedDonation && (
              <div className="d-grid gap-3">
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Donor Name</span>
                  <strong>{selectedDonation.name}</strong>
                </div>
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Email</span>
                  <strong>{selectedDonation.email}</strong>
                </div>
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Phone</span>
                  <strong>{selectedDonation.phone}</strong>
                </div>
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Category</span>
                  <strong>{selectedDonation.category}</strong>
                </div>
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Amount</span>
                  <strong>{formatCurrency(selectedDonation.amount)}</strong>
                </div>
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Payment Status</span>
                  <strong>{selectedDonation.paymentStatus}</strong>
                </div>
                <div className="donation-detail-item">
                  <span className="small text-muted d-block">Created At</span>
                  <strong>{new Date(selectedDonation.createdAt).toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDonations;
