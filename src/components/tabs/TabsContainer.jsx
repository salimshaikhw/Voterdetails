export default function TabsContainer({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "report", label: "Report" },
    { key: "zone", label: "Zone" },
    { key: "district", label: "District" },
    { key: "constituency", label: "Constituency" },
    { key: "block", label: "Block" },
    { key: "town", label: "Town" },
    { key: "booth", label: "Booth" },
    { key: "center", label: "Center" },
    { key: "slot", label: "Slot" },
    { key: "holiday", label: "Holiday" },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={activeTab === tab.key ? "active" : ""}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
