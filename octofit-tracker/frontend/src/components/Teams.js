import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
// API endpoint: https://expert-guide-445jvv4569v3764v-8000.app.github.dev/api/teams

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `${API_BASE_URL}/teams/`;

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mb-4">
      <h2 className="display-6 fw-bold mb-4">🏆 Teams</h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div className="card octofit-card">
        <div className="card-header">
          <h2>Team Directory</h2>
          {!loading && (
            <span className="count-badge">
              {teams.reduce((sum, t) => sum + (Array.isArray(t.members) ? t.members.length : 0), 0)} member{teams.reduce((sum, t) => sum + (Array.isArray(t.members) ? t.members.length : 0), 0) !== 1 ? 's' : ''} across {teams.length} team{teams.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="card-body">
          {loading ? (
            <div className="octofit-spinner-wrap">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0 text-muted">Loading teams…</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Team Name</th>
                    <th scope="col"># Members</th>
                    <th scope="col">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        <div className="alert alert-info mb-0 text-center">
                          No teams found. Create a team to get started!
                        </div>
                      </td>
                    </tr>
                  ) : (
                    teams.map((team, index) => (
                      <tr key={team._id || team.id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><strong>{team.name}</strong></td>
                        <td>
                          <span className="badge bg-primary">
                            {Array.isArray(team.members) ? team.members.length : 0}
                          </span>
                        </td>
                        <td>
                          {Array.isArray(team.members) && team.members.length > 0
                            ? team.members.map((m, i) => (
                                <span key={i} className="badge bg-secondary me-1">
                                  {typeof m === 'object' ? (m.username || m.email || String(m._id)) : m}
                                </span>
                              ))
                            : <span className="text-muted fst-italic">No members yet</span>}
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

export default Teams;
