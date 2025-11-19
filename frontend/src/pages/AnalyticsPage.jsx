import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { api } from '../api/api';

const AnalyticsPage = ({ analyticsRange = { from: '', to: '' }, setAnalyticsRange, showMessage }) => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    if (!analyticsRange.from || !analyticsRange.to) {
      showMessage('Please select a valid date range', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getAnalytics(analyticsRange.from, analyticsRange.to);
      setAnalytics(data || []);
    } catch (error) {
      showMessage('Failed to load analytics: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analyticsRange.from && analyticsRange.to) loadAnalytics();
  }, []);

  return (
    <div className="container mt-4">

      {/* Header */}
      <h2 className="fw-bold mb-4">📊 Analytics Dashboard</h2>

      {/* Date Range Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Select Date Range</h5>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">From</label>
              <input
                type="date"
                className="form-control"
                value={analyticsRange.from || ''}
                onChange={(e) => setAnalyticsRange({ ...analyticsRange, from: e.target.value })}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">To</label>
              <input
                type="date"
                className="form-control"
                value={analyticsRange.to || ''}
                onChange={(e) => setAnalyticsRange({ ...analyticsRange, to: e.target.value })}
              />
            </div>
          </div>

          <button className="btn btn-primary w-100" onClick={loadAnalytics}>
            Load Analytics
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-muted py-5">Loading analytics...</p>
      )}

      {/* Empty State */}
      {!loading && analytics.length === 0 && (
        <p className="text-center text-muted py-5">
          No confirmed bookings in selected date range
        </p>
      )}

      {/* Analytics Content */}
      {!loading && analytics.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-primary shadow-sm">
                <div className="card-body">
                  <small className="text-muted">Total Revenue</small>
                  <h2 className="fw-bold text-primary">
                    ₹{analytics.reduce((sum, r) => sum + r.totalRevenue, 0)}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-success shadow-sm">
                <div className="card-body">
                  <small className="text-muted">Total Hours Booked</small>
                  <h2 className="fw-bold text-success">
                    {analytics.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)}h
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-info shadow-sm">
                <div className="card-body">
                  <small className="text-muted">Rooms Used</small>
                  <h2 className="fw-bold text-info">{analytics.length}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Room Performance */}
          <div className="card shadow-sm mb-5">
            <div className="card-body">
              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <TrendingUp size={20} />
                Room Performance
              </h4>

              {analytics.map((room, idx) => {
                const maxRevenue = Math.max(...analytics.map(r => r.totalRevenue), 1);

                return (
                  <div key={room.roomId} className="mb-4">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1">
                          #{idx + 1} — {room.roomName}
                        </h6>
                        <small className="text-muted">
                          {room.totalHours}h booked • ₹{room.totalRevenue} revenue
                        </small>
                      </div>
                    </div>

                    {/* Bootstrap Progress Bar */}
                    <div className="progress mt-2" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${(room.totalRevenue / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
