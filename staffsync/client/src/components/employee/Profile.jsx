import { useEffect, useState } from "react";
import api, { errMsg, getUser, saveSession } from "../../api";
import Alert from "../common/Alert";

const Profile = () => {
  const [user, setUser] = useState(getUser() || {});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => {});
  }, []);

  const startEdit = () => {
    setForm({ name: user.name || "", department: user.department || "", phone: user.phone || "", address: user.address || "", password: "" });
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await api.put("/auth/me", payload);
      setUser(data);
      saveSession(localStorage.getItem("token"), data);
      setEditing(false);
      setMsg({ type: "success", text: "Profile updated" });
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="panel">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">My Profile</h6>
        {!editing && <button className="btn btn-sm btn-outline-primary" onClick={startEdit}>Edit</button>}
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      {!editing ? (
        <div className="small">
          <p className="mb-1"><span className="muted">Name:</span> {user.name}</p>
          <p className="mb-1"><span className="muted">Email:</span> {user.email}</p>
          <p className="mb-1"><span className="muted">Role:</span> {user.role}</p>
          <p className="mb-1"><span className="muted">Department:</span> {user.department || "-"}</p>
          <p className="mb-1"><span className="muted">Phone:</span> {user.phone || "-"}</p>
          <p className="mb-0"><span className="muted">Address:</span> {user.address || "-"}</p>
        </div>
      ) : (
        <form onSubmit={save} className="row g-2">
          <div className="col-md-6"><input className="form-control" placeholder="Name" required value={form.name} onChange={set("name")} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Department" value={form.department} onChange={set("department")} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Phone" value={form.phone} onChange={set("phone")} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Address" value={form.address} onChange={set("address")} /></div>
          <div className="col-12"><input type="password" className="form-control" placeholder="New password (leave blank to keep)" minLength={6} value={form.password} onChange={set("password")} /></div>
          <div className="col-12 d-flex gap-2 mt-2">
            <button className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
