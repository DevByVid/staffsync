import { Link, useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../../api";

const Topbar = ({ title }) => {
  const navigate = useNavigate();
  const user = getUser();
  const logout = () => {
    clearSession();
    navigate("/login");
  };
  return (
    <div className="topbar">
      <Link to="/" className="brand">
        Staff<span>Sync</span> <span className="muted fw-normal fs-6 ms-1">{title}</span>
      </Link>
      <div className="d-flex align-items-center gap-3">
        {user && <span className="small-muted d-none d-sm-inline">{user.name} · {user.role}</span>}
        <button className="btn btn-sm btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Topbar;
