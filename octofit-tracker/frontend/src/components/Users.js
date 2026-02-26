import React, { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config';

const EMPTY_FORM = { name: '', username: '', email: '', password: '', team_id: '' };

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);   // user being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const usersUrl = `${API_BASE_URL}/users/`;
  const teamsUrl = `${API_BASE_URL}/teams/`;

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(usersUrl).then((r) => { if (!r.ok) throw new Error(`Users HTTP ${r.status}`); return r.json(); }),
      fetch(teamsUrl).then((r) => { if (!r.ok) throw new Error(`Teams HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([uData, tData]) => {
        setUsers(Array.isArray(uData) ? uData : uData.results || []);
        setTeams(Array.isArray(tData) ? tData : tData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [usersUrl, teamsUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openEdit = (user) => {
    setEditUser(user);
    setSaveError(null);
    setSaveSuccess(false);
    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      team_id: user.team ? String(user.team._id) : '',
    });
  };

  const closeEdit = () => {
    setEditUser(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const payload = {
      name: form.name,
      username: form.username,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
      team_id: form.team_id !== '' ? parseInt(form.team_id, 10) : null,
    };

    fetch(`${usersUrl}${editUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(JSON.stringify(d)); });
        return r.json();
      })
      .then(() => {
        setSaving(false);
        setSaveSuccess(true);
        fetchData();
        setTimeout(closeEdit, 900);
      })
      .catch((err) => {
        setSaving(false);
        setSaveError(err.message);
      });
  };

  return (
    <div className="mb-4">
      <h2 className="display-6 fw-bold mb-4">👤 Users</h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div className="card octofit-card">
        <div className="card-header">
          <h2>Member Directory</h2>
          {!loading && (
            <span className="count-badge">{users.length} user{users.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="card-body">
          {loading ? (
            <div className="octofit-spinner-wrap">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0 text-muted">Loading users…</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Team</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="alert alert-info mb-0 text-center">
                          No users found. Register to get started!
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id || user.id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><strong>{user.name || '—'}</strong></td>
                        <td>
                          <span className="badge bg-secondary">@{user.username}</span>
                        </td>
                        <td>
                          <a href={`mailto:${user.email}`} className="link-primary">
                            {user.email}
                          </a>
                        </td>
                        <td>
                          {user.team
                            ? <span className="badge bg-info text-dark">{user.team.name}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(user)}
                          >
                            ✏️ Edit
                          </button>
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

      {/* Edit Modal */}
      {editUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User — @{editUser.username}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {saveError && (
                    <div className="alert alert-danger py-2">{saveError}</div>
                  )}
                  {saveSuccess && (
                    <div className="alert alert-success py-2">Saved successfully!</div>
                  )}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">New Password <span className="text-muted fw-normal">(leave blank to keep current)</span></label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Team</label>
                    <select
                      className="form-select"
                      name="team_id"
                      value={form.team_id}
                      onChange={handleChange}
                    >
                      <option value="">— No team —</option>
                      {teams.map((t) => (
                        <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
