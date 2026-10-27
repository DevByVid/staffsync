import { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";
import Status from "../common/Status";
import Alert from "../common/Alert";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [today, setToday] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const [all, t] = await Promise.all([api.get("/attendance/my"), api.get("/attendance/today")]);
    setRecords(all.data);
    setToday(t.data);
  };
  useEffect(() => {
    load().catch(() => {});
  }, []);

  const act = async (type) => {
    try {
      await api.post(`/attendance/${type}`, { time: new Date().toLocaleTimeString("en-US") });
      setMsg({ type: "success", text: type === "checkin" ? "Checked in" : "Checked out" });
      load();
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  let action;
  if (!today) action = <button className="btn btn-success btn-sm" onClick={() => act("checkin")}>Check In</button>;
  else if (!today.checkOutTime) action = <button className="btn btn-warning btn-sm" onClick={() => act("checkout")}>Check Out</button>;
  else action = <span className="badge-status st-Approved">Checked Out</span>;

  return (
    <div className="panel">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Attendance</h6>
        {action}
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      {records.length === 0 && <p className="small-muted mb-0">No attendance records yet.</p>}
      {records.map((r) => (
        <div className="panel-sub mb-2 d-flex justify-content-between align-items-center" key={r._id}>
          <div>
            <div className="fw-semibold">{fmtDate(r.date)}</div>
            <div className="small-muted">In: {r.checkInTime || "-"} | Out: {r.checkOutTime || "-"}</div>
          </div>
          <Status value={r.status} />
        </div>
      ))}
    </div>
  );
};

export default Attendance;
