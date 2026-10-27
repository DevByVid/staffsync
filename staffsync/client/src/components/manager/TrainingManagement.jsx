import { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";
import Alert from "../common/Alert";

const empty = { title: "", date: "", description: "", trainer: "", assignedTo: [] };

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = () => api.get("/trainings").then((r) => setTrainings(r.data)).catch(() => {});
  useEffect(() => {
    load();
    api.get("/auth/users", { params: { role: "Employee" } }).then((r) => setEmployees(r.data)).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (id) =>
    setForm((f) => ({ ...f, assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter((x) => x !== id) : [...f.assignedTo, id] }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/trainings/${editId}`, form);
      else await api.post("/trainings", form);
      setMsg({ type: "success", text: editId ? "Training updated" : "Training created" });
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  const edit = (t) => {
    setEditId(t._id);
    setForm({
      title: t.title,
      date: t.date?.slice(0, 10),
      description: t.description,
      trainer: t.trainer,
      assignedTo: t.assignedTo.map((u) => u._id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this training?")) return;
    await api.delete(`/trainings/${id}`);
    setTrainings((list) => list.filter((t) => t._id !== id));
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">Training & Development</h5>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <form onSubmit={submit} className="panel-sub mb-4">
        <div className="row g-2">
          <div className="col-md-6"><input className="form-control" placeholder="Training Title" required value={form.title} onChange={set("title")} /></div>
          <div className="col-md-6"><input type="date" className="form-control" required value={form.date} onChange={set("date")} /></div>
          <div className="col-12"><textarea className="form-control" rows={2} placeholder="Description" required value={form.description} onChange={set("description")} /></div>
          <div className="col-12"><input className="form-control" placeholder="Trainer Name" value={form.trainer} onChange={set("trainer")} /></div>
          <div className="col-12">
            <div className="small-muted mb-1">Assign to employees (none selected = open to all):</div>
            <div className="d-flex flex-wrap gap-2">
              {employees.length === 0 && <span className="small-muted">No employees registered yet.</span>}
              {employees.map((u) => (
                <button type="button" key={u._id}
                  className={`btn btn-sm ${form.assignedTo.includes(u._id) ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => toggle(u._id)}>
                  {u.name}
                </button>
              ))}
            </div>
          </div>
          <div className="col-12 d-flex gap-2 mt-2">
            <button className="btn btn-primary flex-grow-1">{editId ? "Update Training" : "Create Training"}</button>
            {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </div>
      </form>
      {trainings.length === 0 && <p className="small-muted">No trainings created yet.</p>}
      <div className="card-grid">
        {trainings.map((t) => (
          <div className="panel-sub small" key={t._id}>
            <div className="fw-bold mb-1">{t.title}</div>
            <p className="muted mb-1">{t.description}</p>
            <p className="mb-1"><b>Date:</b> {fmtDate(t.date)}</p>
            <p className="mb-1"><b>Trainer:</b> {t.trainer}</p>
            <p className="mb-2"><b>Assigned To:</b> {t.assignedTo.length ? t.assignedTo.map((u) => u.name).join(", ") : "All employees"}</p>
            <button className="btn btn-sm btn-warning me-2" onClick={() => edit(t)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => remove(t._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingManagement;
