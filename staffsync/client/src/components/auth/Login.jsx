import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { saveSession, dashboardPath, errMsg } from "../../api";

// Demo accounts created by `npm run seed` on the server
const DEMO = [
  { role: "HR", email: "hr@staffsync.com", password: "hr123456" },
  { role: "Manager", email: "manager@staffsync.com", password: "manager123" },
  { role: "Employee", email: "employee@staffsync.com", password: "employee123" },
];

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
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
          <h4 className="text-center fw-bold mb-4">StaffSync Login</h4>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={submit}>
            <label className="form-label small">Email</label>
            <input type="email" className="form-control mb-3" placeholder="Enter your email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label className="form-label small">Password</label>
            <input type="password" className="form-control mb-4" placeholder="Enter your password" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center small-muted mt-3 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <div className="panel-sub demo-box mt-4">
            <div className="muted mb-2">Demo accounts (click to fill):</div>
            <div className="d-flex gap-2 flex-wrap">
              {DEMO.map((d) => (
                <button key={d.role} type="button" className="btn btn-outline-light btn-sm"
                  onClick={() => setForm({ email: d.email, password: d.password })}>
                  {d.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
