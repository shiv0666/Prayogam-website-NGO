const AdminSearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <input
      className="form-control"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="search"
    />
  );
};

export default AdminSearchBar;
