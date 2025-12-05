import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OpportunitiesPage from './pages/OpportunitiesPage.jsx';
import VolunteerHomePage from './pages/VolunteerHomePage.jsx';
import OrgHomePage from './pages/OrgHomePage.jsx';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || null;
  const isVolunteer = user?.role === 'Volunteer';
  const isOrg = user?.role === 'Organization';

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          VolCom
        </Link>
        <div className="nav-links">
          <Link to="/opportunities" className="nav-link nav-link--outline">
            Opportunities
          </Link>

          {isVolunteer && (
            <Link to="/volunteer" className="nav-link nav-link--outline">
              Volunteer Home
            </Link>
          )}

          {isOrg && (
            <Link to="/org" className="nav-link nav-link--outline">
              Org Dashboard
            </Link>
          )}

          {user ? (
            <>
              <span className="nav-user">Hi, {firstName}</span>
              <button
                type="button"
                className="nav-link-button"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('volcom_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogin = (userFromApi, token) => {
    setUser(userFromApi);
    localStorage.setItem('volcom_user', JSON.stringify(userFromApi));
    localStorage.setItem('volcom_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('volcom_user');
    localStorage.removeItem('volcom_token');
    localStorage.removeItem('volcom_saved_opportunities');
  };

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/volunteer" element={<VolunteerHomePage />} />
          <Route path="/org" element={<OrgHomePage />} />
        </Routes>
      </main>
    </div>
  );
}
