import { useState } from "react";
import api, { errMsg } from "../../api";
import Alert from "../common/Alert";

const LeaveApply = ({ onApplied }) => {
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leaves", form);
      setForm({ startDate: "", endDate: "", reason: "" });
      setMsg({ type: "success", text: "Leave request submitted" });
      onApplied?.();
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  return (
    <div className="panel mb-3">
      <h6 className="fw-bold mb-3">Apply for Leave</h6>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <form onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small">Start Date</label>
            <input type="date" className="form-control" required value={form.startDate} onChange={set("startDate")} />
          </div>
          <div className="col-md-6">
            <label className="form-label small">End Date</label>
            <input type="date" className="form-control" required min={form.startDate} value={form.endDate} onChange={set("endDate")} />
          </div>
          <div className="col-12">
            <label className="form-label small">Reason</label>
            <textarea className="form-control" rows={2} placeholder="Reason for leave" required value={form.reason} onChange={set("reason")} />
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-3">Apply Leave</button>
      </form>
    </div>
  );
};

export default LeaveApply;
