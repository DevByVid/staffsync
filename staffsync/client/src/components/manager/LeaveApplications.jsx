import { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";
import Status from "../common/Status";
import Alert from "../common/Alert";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const LeaveApplications = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get("/leaves").then((r) => setLeaves(r.data)).catch((e) => setMsg({ type: "danger", text: errMsg(e) }));
  }, []);

  const decide = async (id, status) => {
    try {
      const { data } = await api.put(`/leaves/${id}/status`, { status });
      setLeaves((ls) => ls.map((l) => (l._id === id ? data : l)));
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  const shown = filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="fw-bold mb-0">Leave Applications</h5>
        <div className="btn-group btn-group-sm">
          {FILTERS.map((f) => (
            <button key={f} className={`btn ${filter === f ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      {shown.length === 0 && <p className="small-muted">No leave applications.</p>}
      <div className="card-grid">
        {shown.map((l) => (
          <div className="panel-sub small" key={l._id}>
            <p className="mb-1"><b>Employee:</b> {l.user?.name} ({l.user?.email})</p>
            <p className="mb-1"><b>From:</b> {fmtDate(l.startDate)}</p>
            <p className="mb-1"><b>To:</b> {fmtDate(l.endDate)}</p>
            <p className="mb-1"><b>Reason:</b> {l.reason}</p>
            <p className="mb-1"><b>Status:</b> <Status value={l.status} /></p>
            <p className="mb-2"><b>Approved/Rejected By:</b> <span className="text-info">{l.approverRole || "-"}</span></p>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" disabled={l.status === "Approved"} onClick={() => decide(l._id, "Approved")}>Approve</button>
              <button className="btn btn-sm btn-danger" disabled={l.status === "Rejected"} onClick={() => decide(l._id, "Rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApplications;
