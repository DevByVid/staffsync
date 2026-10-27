import api, { fmtDate } from "../../api";
import Status from "../common/Status";

const LeaveList = ({ leaves, onChange }) => {
  const cancel = async (id) => {
    if (!window.confirm("Cancel this leave request?")) return;
    await api.delete(`/leaves/${id}`);
    onChange?.();
  };

  return (
    <div className="panel">
      <h6 className="fw-bold mb-3">My Leaves</h6>
      {leaves.length === 0 && <p className="small-muted mb-0">You haven't applied for any leave yet.</p>}
      {leaves.map((l) => (
        <div className="panel-sub mb-2 d-flex justify-content-between align-items-center gap-2" key={l._id}>
          <div>
            <div className="fw-semibold">{fmtDate(l.startDate)} → {fmtDate(l.endDate)}</div>
            <div className="small-muted">{l.reason}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Status value={l.status} />
            {l.status === "Pending" && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(l._id)}>Cancel</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveList;
