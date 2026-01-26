import { useEffect, useState } from "react";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getCenters,
  getTowns,
  getConstituencies,
  getBookingSlots,
} from "../../services/api";
import Loader from "../common/Loader";

export default function HolidayTab() {
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState([]);
  
  // Master data
  const [centers, setCenters] = useState([]);
  const [towns, setTowns] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [slots, setSlots] = useState([]);

  // Form state
  const [holidayType, setHolidayType] = useState("global"); // global, center, town, slot, constituency
  const [cscId, setCscId] = useState("");
  const [townId, setTownId] = useState("");
  const [constituencyNumber, setConstituencyNumber] = useState("");
  const [slotId, setSlotId] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [description, setDescription] = useState("");
  
  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD DATA
  ====================== */
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [holidayRes, centerRes, townRes, constituencyRes, slotRes] = await Promise.all([
        getHolidays(),
        getCenters(),
        getTowns(),
        getConstituencies(),
        getBookingSlots(),
      ]);

      setHolidays(holidayRes.data || []);
      setCenters(centerRes.data || []);
      setTowns(townRes.data || []);
      setConstituencies(constituencyRes.data || []);
      setSlots(slotRes.data || []);
    } catch (err) {
      console.error("Failed to load data", err);
      alert("Failed to load holidays data");
    } finally {
      setLoading(false);
    }
  };



  /* ======================
     RESET FORM
  ====================== */
  const resetForm = () => {
    setEditingId(null);
    setHolidayType("global");
    setCscId("");
    setTownId("");
    setConstituencyNumber("");
    setSlotId("");
    setHolidayDate("");
    setDescription("");
  };



  /* ======================
     VALIDATE & SAVE
  ====================== */
  const handleSave = async () => {
    if (!holidayDate) {
      alert("Holiday date is required");
      return;
    }

    if (!description) {
      alert("Description is required");
      return;
    }

    const payload = {
      cscid: null,
      townid: null,
      constituencynumber: null,
      slotid: null,
      holidaydate: holidayDate,
      description: description,
      isglobal: holidayType === "global",
    };

    // Set specific IDs based on holiday type
    if (holidayType === "center") {
      if (!cscId) {
        alert("Please select a center");
        return;
      }
      payload.cscid = cscId;
    } else if (holidayType === "town") {
      if (!townId) {
        alert("Please select a town");
        return;
      }
      payload.townid = townId;
    } else if (holidayType === "slot") {
      if (!slotId) {
        alert("Please select a slot");
        return;
      }
      payload.slotid = Number(slotId);
    } else if (holidayType === "constituency") {
      if (!constituencyNumber) {
        alert("Please enter constituency number");
        return;
      }
      payload.constituencynumber = Number(constituencyNumber);
    }

    try {
      if (editingId) {
        await updateHoliday(editingId, payload);
      } else {
        await createHoliday(payload);
      }

      resetForm();
      loadAllData();
    } catch (err) {
      console.error("Save failed", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.title || "Failed to save holiday";
      alert(errorMsg);
    }
  };

  /* ======================
     EDIT HOLIDAY
  ====================== */
  const handleEdit = (h) => {
    setEditingId(h.id);
    setHolidayDate(h.holidaydate || h.holidayDate);
    setDescription(h.description || "");

    // Determine holiday type
    if (h.isglobal || h.isGlobal) {
      setHolidayType("global");
    } else if (h.cscid || h.centerId) {
      setHolidayType("center");
      setCscId(h.cscid || h.centerId);
    } else if (h.townid || h.townId) {
      setHolidayType("town");
      setTownId(h.townid || h.townId);
    } else if (h.slotid || h.slotId) {
      setHolidayType("slot");
      setSlotId(String(h.slotid || h.slotId));
    } else if (h.constituencynumber || h.constituencyNumber) {
      setHolidayType("constituency");
      setConstituencyNumber(String(h.constituencynumber || h.constituencyNumber));
    }
  };

  /* ======================
     DELETE HOLIDAY
  ====================== */
  const handleDelete = async (id, desc) => {
    if (!confirm(`Are you sure you want to delete "${desc}"?`)) return;

    try {
      await deleteHoliday(id);
      loadAllData();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete holiday");
    }
  };

  /* ======================
     HELPER FUNCTIONS
  ====================== */
  const getHolidayTypeDisplay = (h) => {
    if (h.isglobal || h.isGlobal) return "Global";
    if (h.cscid || h.centerId) return "Center";
    if (h.townid || h.townId) return "Town";
    if (h.slotid || h.slotId) return "Slot";
    if (h.constituencynumber || h.constituencyNumber) return "Constituency";
    return "-";
  };

  const getHolidayTypeColor = (type) => {
    const colors = {
      "Global": "#dc3545",
      "Center": "#fd7e14",
      "Town": "#007bff",
      "Slot": "#6f42c1",
      "Constituency": "#28a745"
    };
    return colors[type] || "#6c757d";
  };

  const getCenterName = (id) => {
    const center = centers.find(c => c.id === id);
    return center?.name || center?.centerAddress || "-";
  };

  const getTownName = (id) => {
    const town = towns.find(t => t.id === id);
    return town?.name || "-";
  };

  const getSlotName = (id) => {
    const slot = slots.find(s => s.id === Number(id));
    return slot ? `${slot.name || 'Slot'} (${slot.startTime?.substring(0, 5)} - ${slot.endTime?.substring(0, 5)})` : "-";
  };

  const getConstituencyName = (num) => {
    const constituency = constituencies.find(c => c.number === Number(num));
    return constituency?.name || `Constituency ${num}`;
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="card">
      <h2>🎊 Holiday Management</h2>
      
      {loading ? (
        <Loader message="Loading holidays..." />
      ) : (
        <>
          {/* ===== Holiday Form ===== */}
          <div
            style={{
              marginBottom: "20px",
              padding: "20px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              background: "#f8fafc",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: "15px", color: "#1e40af" }}>
              {editingId ? "Edit Holiday" : "Add New Holiday"}
            </h4>

            {/* Holiday Type Selection */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "8px", fontWeight: "600", color: "#64748b" }}>
                Holiday Type <span style={{ color: "red" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="holidayType"
                    value="global"
                    checked={holidayType === "global"}
                    onChange={(e) => setHolidayType(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>🌍 Global</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="holidayType"
                    value="center"
                    checked={holidayType === "center"}
                    onChange={(e) => setHolidayType(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>🏢 Center</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="holidayType"
                    value="town"
                    checked={holidayType === "town"}
                    onChange={(e) => setHolidayType(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>🏘️ Town</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="holidayType"
                    value="slot"
                    checked={holidayType === "slot"}
                    onChange={(e) => setHolidayType(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>⏰ Slot</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="holidayType"
                    value="constituency"
                    checked={holidayType === "constituency"}
                    onChange={(e) => setHolidayType(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>📍 Constituency</span>
                </label>
              </div>
            </div>

            {/* Conditional Fields based on Holiday Type */}
            {holidayType === "center" && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                  Select Center <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={cscId}
                  onChange={(e) => setCscId(e.target.value)}
                  style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="">-- Select Center --</option>
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.centerAddress || `Center ${c.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {holidayType === "town" && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                  Select Town <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={townId}
                  onChange={(e) => setTownId(e.target.value)}
                  style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="">-- Select Town --</option>
                  {towns.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || `Town ${t.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {holidayType === "slot" && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                  Select Slot <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={slotId}
                  onChange={(e) => setSlotId(e.target.value)}
                  style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="">-- Select Slot --</option>
                  {slots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || `Slot ${s.id}`} ({s.startTime?.substring(0, 5)} - {s.endTime?.substring(0, 5)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {holidayType === "constituency" && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                  Select Constituency <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={constituencyNumber}
                  onChange={(e) => setConstituencyNumber(e.target.value)}
                  style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="">-- Select Constituency --</option>
                  {constituencies.map((c) => (
                    <option key={c.number} value={c.number}>
                      {c.number} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                Holiday Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                Description <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                placeholder="e.g., Republic Day, Center Maintenance, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  minHeight: "80px",
                  resize: "vertical"
                }}
                required
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "10px 24px",
                  backgroundColor: editingId ? "#28a745" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {editingId ? "✓ Update Holiday" : "+ Add Holiday"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* ===== Holiday Table ===== */}
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Applies To</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
                      No holidays found. Create your first holiday above.
                    </td>
                  </tr>
                )}

                {holidays.map((h) => {
                  const type = getHolidayTypeDisplay(h);
                  let appliesTo = "All";
                  
                  if (type === "Center") appliesTo = getCenterName(h.cscid || h.centerId);
                  else if (type === "Town") appliesTo = getTownName(h.townid || h.townId);
                  else if (type === "Slot") appliesTo = getSlotName(h.slotid || h.slotId);
                  else if (type === "Constituency") appliesTo = getConstituencyName(h.constituencynumber || h.constituencyNumber);

                  return (
                    <tr key={h.id}>
                      <td>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: getHolidayTypeColor(type),
                          color: "white"
                        }}>
                          {type}
                        </span>
                      </td>
                      <td style={{ fontWeight: "500" }}>{appliesTo}</td>
                      <td>{h.holidaydate || h.holidayDate}</td>
                      <td>{h.description}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(h)}
                          style={{
                            marginRight: "8px",
                            padding: "6px 12px",
                            fontSize: "13px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(h.id, h.description)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}