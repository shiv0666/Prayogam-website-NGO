import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';

const CATEGORY_META = {
  Education:      { color: '#2563eb', bg: '#eff6ff', icon: '📚' },
  Social:         { color: '#10b981', bg: '#f0fdf4', icon: '🤝' },
  Environment:    { color: '#16a34a', bg: '#f0fdf7', icon: '🌱' },
  Healthcare:     { color: '#f97316', bg: '#fff7ed', icon: '🏥' },
  Administration: { color: '#64748b', bg: '#f1f5f9', icon: '🏢' },
  Other:          { color: '#8b5cf6', bg: '#f5f3ff', icon: '✦' }
};

const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const pct = (spent, raised) =>
  raised > 0 ? Math.min(100, Math.round((spent / raised) * 100)) : 0;

const Transparency = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    api.get('/fund-ledger').then((res) => {
      setEntries(res.data);
      if (res.data.length > 0) {
        setSelectedYear(Math.max(...res.data.map((e) => e.year)));
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const years = [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a);
  const yearEntries = entries.filter((e) => e.year === selectedYear);

  const totals = yearEntries.reduce(
    (acc, e) => ({
      raised: acc.raised + e.amountRaised,
      spent: acc.spent + e.amountSpent,
      beneficiaries: acc.beneficiaries + (e.beneficiariesServed || 0)
    }),
    { raised: 0, spent: 0, beneficiaries: 0 }
  );

  return (
    <section>
      <div className="page-hero mb-4">
        <p className="section-kicker text-white-50 mb-2">Transparency</p>
        <h1 className="section-title text-white mb-2">Fund Usage Ledger</h1>
        <p className="mb-0 text-white-50">
          We believe in radical transparency. Here is exactly where every rupee raised goes.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="content-card p-5 text-center text-muted">
          <p className="mb-0 fs-5">Fund usage data will be published here as programs receive and deploy funds.</p>
        </div>
      ) : (
        <>
          {/* Year selector */}
          <div className="d-flex gap-2 flex-wrap mb-4">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                className={`btn ${selectedYear === y ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Summary cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="content-card p-4 text-center">
                <div className="stat-card-icon mb-1" style={{ color: '#10b981' }}>💰</div>
                <div className="stat-card-value" style={{ color: '#10b981' }}>{fmt(totals.raised)}</div>
                <div className="text-muted small">Total Raised in {selectedYear}</div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="content-card p-4 text-center">
                <div className="stat-card-icon mb-1" style={{ color: '#f97316' }}>📤</div>
                <div className="stat-card-value" style={{ color: '#f97316' }}>{fmt(totals.spent)}</div>
                <div className="text-muted small">Deployed to Programs</div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="content-card p-4 text-center">
                <div className="stat-card-icon mb-1" style={{ color: '#2563eb' }}>🤲</div>
                <div className="stat-card-value" style={{ color: '#2563eb' }}>{totals.beneficiaries.toLocaleString('en-IN')}</div>
                <div className="text-muted small">Beneficiaries Served</div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="content-card p-4 mb-4">
            <h3 className="section-title h5 mb-4">Breakdown by Category — {selectedYear}</h3>
            <div className="d-grid gap-3">
              {yearEntries.map((entry) => {
                const meta = CATEGORY_META[entry.category] || CATEGORY_META.Other;
                const utilization = pct(entry.amountSpent, entry.amountRaised);
                return (
                  <div
                    key={entry._id}
                    className="ledger-row"
                    style={{ background: meta.bg, borderLeft: `4px solid ${meta.color}` }}
                  >
                    <div className="ledger-row-header">
                      <span className="ledger-category-icon">{meta.icon}</span>
                      <strong style={{ color: meta.color }}>{entry.category}</strong>
                      {entry.beneficiariesServed > 0 && (
                        <span className="badge ms-auto" style={{ background: meta.color }}>
                          {entry.beneficiariesServed.toLocaleString('en-IN')} beneficiaries
                        </span>
                      )}
                    </div>
                    <div className="row g-3 align-items-center mt-1">
                      <div className="col-sm-8">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted">Utilization ({utilization}%)</small>
                          <small>
                            <span style={{ color: meta.color }}>{fmt(entry.amountSpent)}</span>
                            <span className="text-muted"> / {fmt(entry.amountRaised)} raised</span>
                          </small>
                        </div>
                        <div className="ledger-progress-bar">
                          <div
                            className="ledger-progress-fill"
                            style={{ width: `${utilization}%`, background: meta.color }}
                          />
                        </div>
                        {entry.description && (
                          <p className="text-muted small mb-0 mt-2">{entry.description}</p>
                        )}
                      </div>
                      <div className="col-sm-4 text-sm-end">
                        <div className="ledger-balance">
                          <span className="text-muted small">Surplus</span>
                          <div className="fw-bold" style={{ color: entry.amountRaised >= entry.amountSpent ? '#10b981' : '#ef4444' }}>
                            {fmt(entry.amountRaised - entry.amountSpent)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aggregate table */}
          <div className="content-card p-4">
            <h3 className="section-title h5 mb-3">Full History</h3>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Year</th>
                    <th>Category</th>
                    <th>Raised</th>
                    <th>Spent</th>
                    <th>Beneficiaries</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const meta = CATEGORY_META[entry.category] || CATEGORY_META.Other;
                    const util = pct(entry.amountSpent, entry.amountRaised);
                    return (
                      <tr key={entry._id}>
                        <td className="fw-semibold">{entry.year}</td>
                        <td>
                          <span className="badge" style={{ background: meta.color }}>
                            {meta.icon} {entry.category}
                          </span>
                        </td>
                        <td className="text-success">{fmt(entry.amountRaised)}</td>
                        <td className="text-warning">{fmt(entry.amountSpent)}</td>
                        <td>{entry.beneficiariesServed ? entry.beneficiariesServed.toLocaleString('en-IN') : '—'}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${util}%`, height: '100%', background: meta.color, borderRadius: 3 }} />
                            </div>
                            <small className="text-muted">{util}%</small>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Transparency;
