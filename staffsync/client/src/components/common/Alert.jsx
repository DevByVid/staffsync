// Small inline message: { type: "success" | "danger", text }
const Alert = ({ msg, onClose }) =>
  msg ? (
    <div className={`alert alert-${msg.type} py-2 d-flex justify-content-between align-items-center`}>
      <span>{msg.text}</span>
      {onClose && <button className="btn-close btn-sm" onClick={onClose} />}
    </div>
  ) : null;

export default Alert;
