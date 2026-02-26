import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const quickNavItems = [
  { to: '/users',       icon: '👤', label: 'Users',       desc: 'View all registered members'       },
  { to: '/teams',       icon: '🏆', label: 'Teams',       desc: 'Browse and manage fitness teams'   },
  { to: '/activities',  icon: '🏃', label: 'Activities',  desc: 'Log and review workout activities' },
  { to: '/leaderboard', icon: '📊', label: 'Leaderboard', desc: "See who's leading the pack"        },
  { to: '/workouts',    icon: '💪', label: 'Workouts',    desc: 'Discover personalised workouts'    },
];

function HomePage() {
  return (
    <>
      <div className="octofit-hero text-center">
        <img
          src="/octofitapp-small.png"
          alt="OctoFit"
          height="72"
          className="mb-3"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h1 className="display-5 fw-bold">Welcome to OctoFit Tracker</h1>
        <p className="lead mb-4">
          Track your fitness activities, manage teams, and compete on the leaderboard!
        </p>
        <Link to="/activities" className="btn btn-success btn-lg me-2 px-4">
          🏃 Start Tracking
        </Link>
        <Link to="/leaderboard" className="btn btn-outline-light btn-lg px-4">
          📊 View Leaderboard
        </Link>
      </div>

      <h5 className="text-muted mb-3 fw-semibold">Quick Navigation</h5>
      <div className="row g-3 mb-4">
        {quickNavItems.map((item) => (
          <div className="col-6 col-md-4 col-lg" key={item.to}>
            <Link to={item.to} className="quick-nav-card card h-100 text-center">
              <div className="card-body">
                <span className="quick-nav-icon">{item.icon}</span>
                <h6 className="card-title fw-bold mb-1">{item.label}</h6>
                <p className="card-text text-muted small mb-0">{item.desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      {/* ── Navbar ── */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src="/octofitapp-small.png"
              alt="OctoFit Logo"
              height="34"
              width="34"
              className="d-inline-block align-top"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="brand-name">OctoFit Tracker</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {quickNavItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                    to={item.to}
                  >
                    {item.icon} {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users"       element={<Users />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"    element={<Workouts />} />
        </Routes>
      </main>

      {/* ── Footer ── */}
      <footer className="octofit-footer">
        © {new Date().getFullYear()} OctoFit Tracker &mdash; built with{' '}
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a> &amp;{' '}
        <a href="https://getbootstrap.com" target="_blank" rel="noreferrer">Bootstrap</a>
      </footer>
    </div>
  );
}

export default App;
