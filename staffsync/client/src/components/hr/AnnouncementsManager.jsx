import { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";
import Alert from "../common/Alert";

const empty = { title: "", message: "", targetAudience: "All" };

// Used by both HR and Managers to post announcements
const AnnouncementsManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = () => api.get("/announcements").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/announcements/${editId}`, form);
      else await api.post("/announcements", form);
      setMsg({ type: "success", text: editId ? "Announcement updated" : "Announcement posted" });
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await api.delete(`/announcements/${id}`);
    setItems((list) => list.filter((a) => a._id !== id));
  };

  return (
    <div className="panel">
      <h6 className="fw-bold mb-3">Announcements</h6>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Title" required value={form.title} onChange={set("title")} />
        <textarea className="form-control mb-2" rows={3} placeholder="Message" required value={form.message} onChange={set("message")} />
        <div className="d-flex gap-2">
          <select className="form-select" style={{ maxWidth: 180 }} value={form.targetAudience} onChange={set("targetAudience")}>
            <option>All</option>
            <option>Employees</option>
            <option>Managers</option>
          </select>
          <button className="btn btn-danger">{editId ? "Update" : "Create"}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>
      <div className="mt-4">
        {items.length === 0 && <p className="small-muted">No announcements yet.</p>}
        {items.map((a) => (
          <div className="panel-sub mb-2" key={a._id}>
            <div className="d-flex justify-content-between gap-2">
              <div>
                <div className="fw-semibold">{a.title} <span className="badge bg-secondary ms-1">{a.targetAudience}</span></div>
                <div className="small mt-1">{a.message}</div>
                <div className="small-muted mt-1">By {a.createdBy?.name} ({a.createdBy?.role}) · {fmtDate(a.createdAt)}</div>
              </div>
              <div className="text-nowrap">
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditId(a._id); setForm({ title: a.title, message: a.message, targetAudience: a.targetAudience }); }}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(a._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsManager;
