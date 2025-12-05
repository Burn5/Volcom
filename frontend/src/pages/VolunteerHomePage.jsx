import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const sampleNextSteps = [
  'Complete your volunteer profile',
  'Browse new community events',
  'Save opportunities you are interested in'
];

export default function VolunteerHomePage() {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('volcom_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }

    const storedSaved = localStorage.getItem('volcom_saved_opportunities');
    if (storedSaved) {
      try {
        setSaved(JSON.parse(storedSaved));
      } catch {
        // ignore
      }
    }

    async function loadRegistrations() {
      try {
        const res = await api.get('/registrations/my');
        setRegistrations(res.data);
      } catch (err) {
        console.log('Could not load registrations on volunteer home');
      }
    }

    loadRegistrations();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Volunteer';

  return (
    <section>
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome back, {firstName} 👋</h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          This is your VolCom home as a volunteer. From here you can explore new
          opportunities, see what you saved, and review events you&apos;re registered for.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/opportunities" className="btn btn--primary" style={{ width: 'auto' }}>
            View Opportunities
          </Link>
          <Link to="/" className="btn btn--ghost" style={{ width: 'auto' }}>
            Back to Landing Page
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Next steps</h3>
        <ul className="text-muted" style={{ paddingLeft: '1.1rem', marginTop: 0 }}>
          {sampleNextSteps.map(step => (
            <li key={step} style={{ marginBottom: '0.25rem' }}>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Saved opportunities</h3>
        {saved.length === 0 ? (
          <p className="text-muted">
            You haven&apos;t saved any opportunities yet. Browse the{' '}
            <Link to="/opportunities" style={{ color: '#38bdf8' }}>
              Opportunities
            </Link>{' '}
            page and click <em>&quot;Save for later&quot;</em> on roles that interest you.
          </p>
        ) : (
          <div className="opportunity-grid">
            {saved.map(op => (
              <article key={op.id} className="opportunity-card">
                <h4 className="opportunity-title">{op.title}</h4>
                <p className="opportunity-org">{op.organization}</p>
                <p className="opportunity-meta">
                  {op.location} • {op.date}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>My registrations</h3>
        {registrations.length === 0 ? (
          <p className="text-muted">
            You haven&apos;t registered for any opportunities yet. When you click{' '}
            <em>&quot;Register&quot;</em> on an opportunity, it will appear here.
          </p>
        ) : (
          <div className="opportunity-grid">
            {registrations.map(reg => (
              <article key={reg._id} className="opportunity-card">
                <h4 className="opportunity-title">{reg.title}</h4>
                <p className="opportunity-org">{reg.organization}</p>
                <p className="opportunity-meta">
                  {reg.location} • {reg.date} • Status: {reg.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
