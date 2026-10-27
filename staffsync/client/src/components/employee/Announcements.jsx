import { useEffect, useState } from "react";
import api, { fmtDate } from "../../api";

const Announcements = () => {
  const [items, setItems] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    api.get("/announcements").then((r) => setItems(r.data)).catch(() => {});
    api.get("/trainings").then((r) => setTrainings(r.data)).catch(() => {});
  }, []);

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="panel h-100">
          <h6 className="fw-bold mb-3">Announcements</h6>
          {items.length === 0 && <p className="small-muted">No announcements available.</p>}
          {items.map((a) => (
            <div className="panel-sub mb-2" key={a._id}>
              <div className="fw-semibold">{a.title}</div>
              <div className="small mt-1">{a.message}</div>
              <div className="small-muted mt-1">
                By {a.createdBy?.name || "HR"} · {fmtDate(a.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-md-6">
        <div className="panel h-100">
          <h6 className="fw-bold mb-3">Trainings</h6>
          {trainings.length === 0 && <p className="small-muted">No trainings assigned.</p>}
          {trainings.map((t) => (
            <div className="panel-sub mb-2" key={t._id}>
              <div className="fw-semibold">{t.title}</div>
              <div className="small mt-1">{t.description}</div>
              <div className="small-muted mt-1">Trainer: {t.trainer} · Date: {fmtDate(t.date)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
