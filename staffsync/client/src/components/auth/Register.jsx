import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { saveSession, dashboardPath, errMsg } from "../../api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      saveSession(data.token, data.user);
      navigate(dashboardPath(data.user.role));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="topbar"><Link to="/" className="brand">Staff<span>Sync</span></Link></div>
      <div className="auth-wrap">
        <div className="panel auth-card">
          <h4 className="text-center fw-bold mb-4">StaffSync Register</h4>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={submit}>
            <label className="form-label small">Name</label>
            <input className="form-control mb-3" placeholder="Enter your name" required value={form.name} onChange={set("name")} />
            <label className="form-label small">Email</label>
            <input type="email" className="form-control mb-3" placeholder="Enter your email" required value={form.email} onChange={set("email")} />
            <label className="form-label small">Password</label>
            <input type="password" className="form-control mb-3" placeholder="At least 6 characters" minLength={6} required
              value={form.password} onChange={set("password")} />
            <label className="form-label small">Role</label>
            <select className="form-select mb-4" value={form.role} onChange={set("role")}>
              <option>Employee</option>
              <option>Manager</option>
              <option>HR</option>
            </select>
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="text-center small-muted mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
