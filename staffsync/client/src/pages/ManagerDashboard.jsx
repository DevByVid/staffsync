import { useState } from "react";
import Topbar from "../components/common/Topbar";
import { getUser } from "../api";
import LeaveApplications from "../components/manager/LeaveApplications";
import TrainingManagement from "../components/manager/TrainingManagement";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";

const TABS = [
  { key: "leaves", label: "Leave Applications", cls: "btn-primary" },
  { key: "training", label: "Training & Development", cls: "btn-success" },
  { key: "announce", label: "Announcements", cls: "btn-info" },
];

const ManagerDashboard = () => {
  const [tab, setTab] = useState("leaves");
  const user = getUser();
  return (
    <>
      <Topbar title="Manager Dashboard" />
      <div className="container py-4" style={{ maxWidth: 1100 }}>
        <div className="panel">
          <h4 className="text-center fw-bold mb-4">Welcome Back, {user?.name?.split(" ")[0] || "Manager"}</h4>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {TABS.map((t) => (
              <button key={t.key} className={`btn btn-sm ${tab === t.key ? t.cls : "btn-outline-secondary"}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          {tab === "leaves" && <LeaveApplications />}
          {tab === "training" && <TrainingManagement />}
          {tab === "announce" && <AnnouncementsManager />}
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
