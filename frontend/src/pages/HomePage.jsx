import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="hero">
      <h1 className="hero-title">
        Welcome to <span className="hero-highlight">VolCom</span>
      </h1>
      <p className="hero-tagline">
        Voluntary Community – connecting volunteers with local opportunities,
        events, and organizations that need your help.
      </p>

      <div className="hero-actions">
        <Link to="/opportunities" className="btn btn--primary">
          View Opportunities
        </Link>
        <Link to="/login" className="btn btn--ghost">
          Login / Register
        </Link>
      </div>
    </section>
  );
}
