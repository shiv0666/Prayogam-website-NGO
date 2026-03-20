const AdminFilterSelect = ({ value, onChange, options, ariaLabel }) => {
  return (
    <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default AdminFilterSelect;
