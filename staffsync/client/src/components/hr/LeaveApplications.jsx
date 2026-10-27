import { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";
import Status from "../common/Status";
import Alert from "../common/Alert";

const LeaveApplications = () => {
  const [leaves, setLeaves] = useState([]);
  const [msg, setMsg] = useState(null);

  const load = () => api.get("/leaves").then((r) => setLeaves(r.data)).catch((e) => setMsg({ type: "danger", text: errMsg(e) }));
  useEffect(() => {
    load();
  }, []);

  const decide = async (id, status) => {
    try {
      const { data } = await api.put(`/leaves/${id}/status`, { status });
      setLeaves((ls) => ls.map((l) => (l._id === id ? data : l)));
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  return (
    <div className="panel">
      <h6 className="fw-bold mb-3">Leave Applications</h6>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr><th>Employee</th><th>Email</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {leaves.length === 0 && <tr><td colSpan={7} className="text-center muted">No leave applications</td></tr>}
            {leaves.map((l) => (
              <tr key={l._id}>
                <td>{l.user?.name || "Deleted user"}</td>
                <td>{l.user?.email}</td>
                <td>{fmtDate(l.startDate)}</td>
                <td>{fmtDate(l.endDate)}</td>
                <td>{l.reason}</td>
                <td>
                  <Status value={l.status} />
                  {l.approverRole && <div className="small-muted mt-1">by {l.approverRole}</div>}
                </td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-success me-1" disabled={l.status === "Approved"} onClick={() => decide(l._id, "Approved")}>Approve</button>
                  <button className="btn btn-sm btn-outline-danger" disabled={l.status === "Rejected"} onClick={() => decide(l._id, "Rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveApplications;
