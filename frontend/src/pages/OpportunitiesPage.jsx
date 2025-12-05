import { useEffect, useState } from 'react';
import { api } from '../api';

const baseOpportunities = [
  {
    id: 1,
    title: 'Food Bank Helper',
    organization: 'Community Food Bank',
    location: 'Toronto, ON',
    date: 'Saturdays',
    description:
      'Help pack and distribute food boxes for local families in need.'
  },
  {
    id: 2,
    title: 'Park Cleanup Volunteer',
    organization: 'Green City Org',
    location: 'Scarborough, ON',
    date: 'Last Sunday of each month',
    description:
      'Join a friendly team to keep neighbourhood parks clean and safe.'
  },
  {
    id: 3,
    title: 'Homework Club Tutor',
    organization: 'Youth Learning Centre',
    location: 'Online / Hybrid',
    date: 'Weekday evenings',
    description:
      'Support elementary students with reading and math in a small group.'
  },
  {
    id: 4,
    title: 'Senior Companion Visits',
    organization: 'Golden Years Residence',
    location: 'North York, ON',
    date: 'Flexible',
    description:
      'Visit seniors for conversation, games, and light activities to reduce isolation.'
  }
];

export default function OpportunitiesPage() {
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState([]);
  const [registeredKeys, setRegisteredKeys] = useState([]);
  const [createdOps, setCreatedOps] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('volcom_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }

    const storedCreated = localStorage.getItem('volcom_created_opportunities');
    if (storedCreated) {
      try {
        setCreatedOps(JSON.parse(storedCreated));
      } catch {
        // ignore
      }
    }
  }, []);

  const isVolunteer = currentUser?.role === 'Volunteer';
  const isOrg = currentUser?.role === 'Organization';

  // load saved from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('volcom_saved_opportunities');
    if (stored) {
      try {
        setSaved(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  // keep localStorage updated
  useEffect(() => {
    localStorage.setItem('volcom_saved_opportunities', JSON.stringify(saved));
  }, [saved]);

  // load registrations from backend
  useEffect(() => {
    async function loadRegistrations() {
      try {
        const res = await api.get('/registrations/my');
        const keys = res.data.map(r => r.opportunityKey);
        setRegisteredKeys(keys);
      } catch (err) {
        // not logged in or error
        console.log('Could not load registrations (maybe not logged in yet)');
      }
    }

    loadRegistrations();
  }, []);

  const allOpportunities = [...baseOpportunities, ...createdOps];

  const isSaved = id => saved.some(op => op.id === id);
  const isRegistered = id => registeredKeys.includes(id);

  const handleToggleSave = opportunity => {
    if (!isVolunteer) {
      alert('Please log in as a volunteer to save opportunities.');
      return;
    }

    setSaved(prev => {
      if (prev.some(op => op.id === opportunity.id)) {
        return prev.filter(op => op.id !== opportunity.id);
      }
      return [...prev, opportunity];
    });
  };

  const handleRegister = async opportunity => {
    if (!isVolunteer) {
      alert(
        isOrg
          ? 'Organizations can create opportunities but cannot register as volunteers.'
          : 'Please log in as a volunteer to register.'
      );
      return;
    }

    if (isRegistered(opportunity.id)) {
      alert('You are already registered for this opportunity.');
      return;
    }

    try {
      const payload = {
        opportunityKey: opportunity.id,
        title: opportunity.title,
        organization: opportunity.organization,
        date: opportunity.date,
        location: opportunity.location
      };

      const res = await api.post('/registrations', payload);
      setRegisteredKeys(prev => [...prev, res.data.opportunityKey]);
      alert('You have registered for this opportunity!');
    } catch (err) {
      alert(
        err.response?.data?.message || 'Could not register. Please try again.'
      );
    }
  };

  const filtered = allOpportunities.filter(op => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      op.title.toLowerCase().includes(q) ||
      op.organization.toLowerCase().includes(q) ||
      op.location.toLowerCase().includes(q)
    );
  });

  return (
    <section>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.4rem', textAlign: 'center' }}>
          Volunteer Opportunities
        </h2>
        <p className="text-muted" style={{ textAlign: 'center' }}>
          Search for ways to help in your community, save the ones you like, and
          register when you&apos;re ready.
        </p>
      </div>

      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ flex: '1 1 200px', marginRight: '0.75rem' }}>
          <label
            htmlFor="search"
            style={{ fontSize: '0.8rem', color: '#9ca3af' }}
          >
            Search by title, organization, or location
          </label>
          <input
            id="search"
            type="text"
            placeholder="e.g. food bank, Toronto"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              marginTop: '0.35rem',
              width: '100%',
              borderRadius: '0.75rem',
              border: '1px solid #1f2937',
              padding: '0.5rem 0.75rem',
              backgroundColor: '#020617',
              color: '#e5e7eb'
            }}
          />
        </div>
        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
          Saved: <strong>{saved.length}</strong> • Registered:{' '}
          <strong>{registeredKeys.length}</strong>
        </div>
      </div>

      <div className="opportunity-grid">
        {filtered.map(op => (
          <article key={op.id} className="opportunity-card">
            <h3 className="opportunity-title">{op.title}</h3>
            <p className="opportunity-org">{op.organization}</p>
            <p
              style={{
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}
            >
              {op.description}
            </p>
            <p className="opportunity-meta">
              {op.location} • {op.date}
            </p>

            {isVolunteer ? (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.6rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleSave(op)}
                  className="btn btn--ghost"
                  style={{
                    width: 'auto',
                    padding: '0.35rem 0.9rem',
                    fontSize: '0.8rem'
                  }}
                >
                  {isSaved(op.id) ? 'Saved ✓' : 'Save for later'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRegister(op)}
                  className="btn btn--primary"
                  style={{
                    width: 'auto',
                    padding: '0.35rem 0.9rem',
                    fontSize: '0.8rem'
                  }}
                >
                  {isRegistered(op.id) ? 'Registered ✓' : 'Register'}
                </button>
              </div>
            ) : (
              <p
                className="text-muted"
                style={{ fontSize: '0.8rem', marginTop: '0.6rem' }}
              >
                {isOrg
                  ? 'You posted opportunities from your Org Dashboard. Volunteers must log in to register.'
                  : 'Log in as a volunteer to save or register for this opportunity.'}
              </p>
            )}
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p
          className="text-muted"
          style={{ textAlign: 'center', marginTop: '1.5rem' }}
        >
          No opportunities match your search yet.
        </p>
      )}
    </section>
  );
}
