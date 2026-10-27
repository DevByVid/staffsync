import { useEffect, useState } from "react";
import api, { errMsg, fmtDate } from "../../api";
import Alert from "../common/Alert";

const empty = { name: "", email: "", department: "", position: "", salary: "", joinDate: "", phone: "", address: "" };

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState(null);

  const load = () => api.get("/employees").then((r) => setEmployees(r.data)).catch((e) => setMsg({ type: "danger", text: errMsg(e) }));
  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/employees/${editId}`, form);
        setMsg({ type: "success", text: "Employee updated" });
      } else {
        await api.post("/employees", form);
        setMsg({ type: "success", text: "Employee added" });
      }
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  const edit = (emp) => {
    setEditId(emp._id);
    const picked = Object.fromEntries(Object.keys(empty).map((k) => [k, emp[k] ?? ""]));
    setForm({ ...picked, joinDate: emp.joinDate?.slice(0, 10) || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this employee record?")) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((list) => list.filter((e) => e._id !== id));
    } catch (err) {
      setMsg({ type: "danger", text: errMsg(err) });
    }
  };

  const shown = employees.filter((e) =>
    [e.name, e.email, e.department, e.position].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel">
      <h6 className="fw-bold mb-3">Employee Management</h6>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <form onSubmit={submit} className="row g-2 mb-3">
        <div className="col-md-4"><input className="form-control" placeholder="Name" required value={form.name} onChange={set("name")} /></div>
        <div className="col-md-4"><input type="email" className="form-control" placeholder="Email" required value={form.email} onChange={set("email")} /></div>
        <div className="col-md-4"><input className="form-control" placeholder="Department" required value={form.department} onChange={set("department")} /></div>
        <div className="col-md-4"><input className="form-control" placeholder="Position" required value={form.position} onChange={set("position")} /></div>
        <div className="col-md-4"><input type="number" min="0" className="form-control" placeholder="Salary" required value={form.salary} onChange={set("salary")} /></div>
        <div className="col-md-4"><input type="date" className="form-control" title="Join date" required value={form.joinDate} onChange={set("joinDate")} /></div>
        <div className="col-md-4"><input className="form-control" placeholder="Phone" value={form.phone} onChange={set("phone")} /></div>
        <div className="col-md-8"><input className="form-control" placeholder="Address" value={form.address} onChange={set("address")} /></div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-danger flex-grow-1">{editId ? "Update Employee" : "Add Employee"}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>
      <input className="form-control form-control-sm mb-2" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Salary</th><th>Join Date</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={9} className="text-center muted">No employees found</td></tr>}
            {shown.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                <td>{e.position}</td>
                <td>₹{Number(e.salary).toLocaleString("en-IN")}</td>
                <td>{fmtDate(e.joinDate)}</td>
                <td>{e.phone || "-"}</td>
                <td>{e.address || "-"}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(e)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeCRUD;
