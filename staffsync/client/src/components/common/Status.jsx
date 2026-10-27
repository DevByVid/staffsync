const Status = ({ value }) => (
  <span className={`badge-status st-${(value || "").split(" ")[0]}`}>{value}</span>
);

export default Status;
