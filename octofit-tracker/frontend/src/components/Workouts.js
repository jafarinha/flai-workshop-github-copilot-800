import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
// API endpoint: https://expert-guide-445jvv4569v3764v-8000.app.github.dev/api/workouts

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `${API_BASE_URL}/workouts/`;

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mb-4">
      <h2 className="display-6 fw-bold mb-4">💪 Workouts</h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div className="card octofit-card">
        <div className="card-header">
          <h2>Workout Plans</h2>
          {!loading && (
            <span className="count-badge">{workouts.length} plan{workouts.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="card-body">
          {loading ? (
            <div className="octofit-spinner-wrap">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0 text-muted">Loading workouts…</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        <div className="alert alert-info mb-0 text-center">
                          No workout plans found. Add some workouts to get started!
                        </div>
                      </td>
                    </tr>
                  ) : (
                    workouts.map((workout, index) => (
                      <tr key={workout._id || workout.id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><strong>{workout.name}</strong></td>
                        <td className="text-muted">{workout.description}</td>
                        <td>
                          <span className="badge bg-info text-dark">{workout.duration} min</span>
                        </td>
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

export default Workouts;
