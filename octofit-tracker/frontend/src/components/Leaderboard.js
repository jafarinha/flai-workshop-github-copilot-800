import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

// Safely render a user field that may be a nested object or a plain value
const displayUser = (user) => {
  if (!user) return '—';
  if (typeof user === 'object') return user.username || user.email || String(user._id) || JSON.stringify(user);
  return user;
};

const medalClass = (rank) => {
  if (rank === 1) return 'rank-1';
  if (rank === 2) return 'rank-2';
  if (rank === 3) return 'rank-3';
  return '';
};

const medalLabel = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `${API_BASE_URL}/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mb-4">
      <h2 className="display-6 fw-bold mb-4">📊 Leaderboard</h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div className="card octofit-card">
        <div className="card-header">
          <h2>Rankings</h2>
          {!loading && (
            <span className="count-badge">{entries.length} player{entries.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="card-body">
          {loading ? (
            <div className="octofit-spinner-wrap">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0 text-muted">Loading leaderboard…</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">User</th>
                    <th scope="col">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        <div className="alert alert-info mb-0 text-center">
                          No leaderboard entries yet. Complete activities to earn points!
                        </div>
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, index) => {
                      const rank = index + 1;
                      return (
                        <tr key={entry._id || entry.id || index}>
                          <td className={`fw-bold fs-5 ${medalClass(rank)}`}>
                            {medalLabel(rank)}
                          </td>
                          <td><strong>{displayUser(entry.user)}</strong></td>
                          <td>
                            <span className="badge bg-success fs-6">{entry.score} pts</span>
                          </td>
                        </tr>
                      );
                    })
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

export default Leaderboard;
