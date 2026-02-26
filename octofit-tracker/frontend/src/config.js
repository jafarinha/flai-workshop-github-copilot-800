// Central API base URL.
// Uses REACT_APP_CODESPACE_NAME env var (set in .env) when running in a GitHub Codespace,
// falling back to localhost for local development.
const codespace = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE_URL = codespace
  ? `https://${codespace}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

export default API_BASE_URL;
