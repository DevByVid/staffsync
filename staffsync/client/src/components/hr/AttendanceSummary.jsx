import { useEffect, useState } from "react";
import api, { fmtDate } from "../../api";
import Status from "../common/Status";

const AttendanceSummary = () => {
  const [records, setRecords] = useState([]);
  const [report, setReport] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = () => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    api.get("/attendance", { params }).then((r) => setRecords(r.data)).catch(() => {});
  };
  useEffect(() => {
    load();
    api.get("/attendance/report").then((r) => setReport(r.data)).catch(() => {});
  }, []);

  const exportCSV = () => {
    const rows = [["Employee", "Email", "Date", "Check In", "Check Out", "Status"]];
    records.forEach((r) => rows.push([r.user?.name, r.user?.email, fmtDate(r.date), r.checkInTime || "", r.checkOutTime || "", r.status]));
    const csv = rows.map((row) => row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "attendance-report.csv";
    a.click();
  };

  return (
    <>
      <div className="panel mb-3">
        <h6 className="fw-bold mb-3">Attendance Report (per employee)</h6>
        <div className="card-grid">
          {report.length === 0 && <p className="small-muted mb-0">No data yet.</p>}
          {report.map((r) => (
            <div className="panel-sub" key={r.userId}>
              <div className="fw-semibold">{r.name}</div>
              <div className="small-muted">{r.email}</div>
              <div className="small mt-2">
                Total days: <b>{r.total}</b> · Present: <b>{r.stats.Present || 0}</b> · Half Day: <b>{r.stats["Half Day"] || 0}</b> · Absent: <b>{r.stats.Absent || 0}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
          <h6 className="fw-bold mb-0">Attendance Records</h6>
          <div className="d-flex flex-wrap gap-2 align-items-end">
            <div><label className="small-muted d-block">From</label><input type="date" className="form-control form-control-sm" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
            <div><label className="small-muted d-block">To</label><input type="date" className="form-control form-control-sm" value={to} onChange={(e) => setTo(e.target.value)} /></div>
            <button className="btn btn-sm btn-primary" onClick={load}>Filter</button>
            <button className="btn btn-sm btn-outline-light" onClick={exportCSV}>Export CSV</button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead><tr><th>Employee</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
            <tbody>
              {records.length === 0 && <tr><td colSpan={5} className="text-center muted">No attendance records</td></tr>}
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name || "Deleted user"}</td>
                  <td>{fmtDate(r.date)}</td>
                  <td>{r.checkInTime || "-"}</td>
                  <td>{r.checkOutTime || "-"}</td>
                  <td><Status value={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendanceSummary;
