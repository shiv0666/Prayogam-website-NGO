const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginatedResponse = ({ data, totalItems, currentPage, limit, extra = {} }) => {
  const safeTotal = Math.max(0, Number(totalItems || 0));
  const totalPages = Math.max(1, Math.ceil(safeTotal / limit));

  return {
    data,
    totalItems: safeTotal,
    totalPages,
    currentPage,
    ...extra
  };
};

const getStartDateByRange = (range) => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (range === 'last7') {
    start.setDate(start.getDate() - 6);
    return start;
  }

  if (range === 'last30') {
    start.setDate(start.getDate() - 29);
    return start;
  }

  return null;
};

module.exports = {
  parsePagination,
  buildPaginatedResponse,
  getStartDateByRange
};
