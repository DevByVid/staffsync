import { Link } from "react-router-dom";
import { getUser, dashboardPath } from "../api";

const features = [
  { icon: "👥", title: "Employee Management", text: "Manage employee records, roles, and information efficiently." },
  { icon: "📅", title: "Attendance & Leave", text: "Track attendance and handle leave approvals easily." },
  { icon: "💼", title: "HR & Manager Tools", text: "Handle team announcements, performance, and training modules." },
  { icon: "🎓", title: "Employee Growth", text: "Monitor performance and assign development trainings." },
];

const Home = () => {
  const user = getUser();
  const target = user ? dashboardPath(user.role) : "/login";
  return (
    <>
      <div className="topbar">
        <Link to="/" className="brand">Staff<span>Sync</span></Link>
        <Link to={target} className="btn btn-sm btn-primary">
          {user ? "Go to Dashboard" : "Login / Register"}
        </Link>
      </div>
      <div className="container">
        <div className="hero">
          <h1>Empower Your Workforce with <span>StaffSync</span></h1>
          <p className="muted mx-auto mt-3" style={{ maxWidth: 620 }}>
            A modern Human Resource Management platform designed to simplify attendance tracking, leave
            management, employee records, and communication across teams.
          </p>
          <Link to={target} className="btn btn-primary mt-2 px-4">Get Started</Link>
        </div>
        <div className="row g-3 pb-5">
          {features.map((f) => (
            <div className="col-12 col-sm-6 col-lg-3" key={f.title}>
              <div className="panel feature">
                <div className="icon">{f.icon}</div>
                <h6 className="fw-bold">{f.title}</h6>
                <p className="small-muted mb-0">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="text-center small-muted py-4 border-top" style={{ borderColor: "var(--line)" }}>
        © {new Date().getFullYear()} StaffSync — Empowering Teams, Simplifying Workflow.
      </footer>
    </>
  );
};

export default Home;
