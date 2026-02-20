const Loader = () => {
  return (
    <div className="d-flex justify-content-center py-5">
      <div className="card p-4 text-center" style={{ maxWidth: '320px', width: '100%' }}>
        <div className="spinner-border text-primary mx-auto mb-3" role="status" aria-label="Loading" />
        <span className="text-muted">Loading content...</span>
      </div>
    </div>
  );
};

export default Loader;
