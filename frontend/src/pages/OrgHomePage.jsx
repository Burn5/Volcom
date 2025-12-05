// src/pages/OrgHomePage.jsx
import { useEffect, useState } from 'react';

export default function OrgHomePage() {
  const [org, setOrg] = useState(null);
  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    description: ''
  });
  const [myOps, setMyOps] = useState([]);

  useEffect(() => {
    // load org user
    const stored = localStorage.getItem('volcom_user');
    if (stored) {
      try {
        setOrg(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    // load created opportunities
    const storedOps = localStorage.getItem('volcom_created_opportunities');
    if (storedOps) {
      try {
        setMyOps(JSON.parse(storedOps));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!org || org.role !== 'Organization') {
      alert('Please log in as an organization to create opportunities.');
      return;
    }

    const newOp = {
      id: Date.now(), // numeric, works with registrations
      title: form.title.trim(),
      organization: org.name || 'Your organization',
      location: form.location.trim() || 'TBA',
      date: form.date.trim() || 'TBA',
      description: form.description.trim() || 'No description provided yet.',
      createdByOrgId: org.id || null
    };

    const updated = [newOp, ...myOps];
    setMyOps(updated);
    localStorage.setItem(
      'volcom_created_opportunities',
      JSON.stringify(updated)
    );

    setForm({ title: '', location: '', date: '', description: '' });
    alert('Opportunity created! Volunteers will now see it on the Opportunities page.');
  };

  const name = org?.name || 'Organization';

  return (
    <section>
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {name}</h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          This is your VolCom dashboard as an organization. Create volunteer
          opportunities and they will appear on the public Opportunities page
          for volunteers to browse and register.
        </p>

        <h3 style={{ marginBottom: '0.5rem' }}>Create a new opportunity</h3>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title*</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Community Food Drive Helper"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Toronto, ON"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="date">Date / schedule</label>
            <input
              id="date"
              name="date"
              type="text"
              placeholder="e.g. Saturdays, 10am–1pm"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Briefly describe what volunteers will do and any requirements."
              value={form.description}
              onChange={handleChange}
              style={{
                borderRadius: '0.8rem',
                border: '1px solid #1f2937',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                resize: 'vertical'
              }}
            />
          </div>

          <button type="submit" className="btn btn--primary">
            Post opportunity
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Your posted opportunities</h3>
        {myOps.length === 0 ? (
          <p className="text-muted">
            You haven&apos;t posted any opportunities yet. Use the form above to create
            your first one.
          </p>
        ) : (
          <div className="opportunity-grid">
            {myOps.map(op => (
              <article key={op.id} className="opportunity-card">
                <h4 className="opportunity-title">{op.title}</h4>
                <p className="opportunity-org">{op.organization}</p>
                <p className="opportunity-meta">
                  {op.location} • {op.date}
                </p>
                <p
                  style={{
                    fontSize: '0.85rem',
                    marginTop: '0.4rem',
                    color: '#9ca3af'
                  }}
                >
                  Volunteers will see this on the Opportunities page and can register
                  for it.
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
