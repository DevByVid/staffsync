import { useState } from "react";
import Topbar from "../components/common/Topbar";
import Tabs from "../components/common/Tabs";
import LeaveApplications from "../components/hr/LeaveApplications";
import EmployeeCRUD from "../components/hr/EmployeeCRUD";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";
import AttendanceSummary from "../components/hr/AttendanceSummary";

const TABS = ["Leave Applications", "Employee Management", "Announcements", "Attendance"];

const HrDashboard = () => {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <>
      <Topbar title="HR Portal" />
      <div className="container py-4">
        <h4 className="fw-bold mb-3">HR Dashboard</h4>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        {tab === "Leave Applications" && <LeaveApplications />}
        {tab === "Employee Management" && <EmployeeCRUD />}
        {tab === "Announcements" && <AnnouncementsManager />}
        {tab === "Attendance" && <AttendanceSummary />}
      </div>
    </>
  );
};

export default HrDashboard;
