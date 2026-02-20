const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <div className="alert alert-danger mb-3">{message}</div>;
};

export default ErrorMessage;
