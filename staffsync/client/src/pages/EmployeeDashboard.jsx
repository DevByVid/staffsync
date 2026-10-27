import { useEffect, useState } from "react";
import api from "../api";
import Topbar from "../components/common/Topbar";
import Tabs from "../components/common/Tabs";
import Announcements from "../components/employee/Announcements";
import LeaveApply from "../components/employee/LeaveApply";
import LeaveList from "../components/employee/LeaveList";
import Attendance from "../components/employee/Attendance";
import Profile from "../components/employee/Profile";

const TABS = ["Announcements", "Leaves", "Attendance", "Profile"];

const EmployeeDashboard = () => {
  const [tab, setTab] = useState("Announcements");
  const [leaves, setLeaves] = useState([]);
  const loadLeaves = () => api.get("/leaves/my").then((r) => setLeaves(r.data)).catch(() => {});
  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <>
      <Topbar title="Employee Portal" />
      <div className="container py-4" style={{ maxWidth: 1000 }}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        {tab === "Announcements" && <Announcements />}
        {tab === "Leaves" && (
          <>
            <LeaveApply onApplied={loadLeaves} />
            <LeaveList leaves={leaves} onChange={loadLeaves} />
          </>
        )}
        {tab === "Attendance" && <Attendance />}
        {tab === "Profile" && <Profile />}
      </div>
    </>
  );
};

export default EmployeeDashboard;
