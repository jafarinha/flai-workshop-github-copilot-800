import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

// Safely render a user field that may be a nested object or a plain value
const displayUser = (user) => {
  if (!user) return '—';
  if (typeof user === 'object') return user.username || user.email || String(user._id) || JSON.stringify(user);
  return user;
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `${API_BASE_URL}/activities/`;

  useEffect(() => {
    console.log('Activities: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Activities: fetched data', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mb-4">
      {/* Page heading */}
      <h2 className="display-6 fw-bold mb-4">🏃 Activities</h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div className="card octofit-card">
        <div className="card-header">
          <h2>Activity Log</h2>
          {!loading && (
            <span className="count-badge">{activities.length} record{activities.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="card-body">
          {loading ? (
            <div className="octofit-spinner-wrap">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0 text-muted">Loading activities…</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Activity Type</th>
                    <th scope="col">Duration (min)</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="alert alert-info mb-0 text-center">
                          No activities found. Start logging your workouts!
                        </div>
                      </td>
                    </tr>
                  ) : (
                    activities.map((activity, index) => (
                      <tr key={activity._id || activity.id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><strong>{displayUser(activity.user)}</strong></td>
                        <td><span className="badge bg-primary">{activity.activity_type}</span></td>
                        <td>{activity.duration}</td>
                        <td>{activity.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
