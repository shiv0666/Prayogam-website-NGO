const buildPageWindow = (currentPage, totalPages) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

const AdminPagination = ({ currentPage, totalPages, onPageChange, disabled = false }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = buildPageWindow(currentPage, totalPages);

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
      <button
        className="btn btn-sm btn-outline-secondary"
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        Previous
      </button>

      <div className="d-flex align-items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            type="button"
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="btn btn-sm btn-outline-secondary"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Next
      </button>
    </div>
  );
};

export default AdminPagination;
