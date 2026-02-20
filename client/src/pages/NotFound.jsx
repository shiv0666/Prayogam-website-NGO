import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="content-card text-center p-5" style={{ maxWidth: '600px', background: 'linear-gradient(145deg, #fff, #f2f4fb)' }}>
        <p className="section-kicker mb-2">404 Error</p>
        <h1 className="h2 mb-3">Page not found</h1>
        <p className="text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
