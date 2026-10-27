const Tabs = ({ tabs, active, onChange }) => (
  <div className="ss-tabs">
    {tabs.map((t) => (
      <button key={t} className={`ss-tab ${active === t ? "active" : ""}`} onClick={() => onChange(t)}>
        {t}
      </button>
    ))}
  </div>
);

export default Tabs;
