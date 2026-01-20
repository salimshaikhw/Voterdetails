import { useEffect, useState } from "react";
import {
  getSlots,
  createSlot,
  updateSlot,
  deleteSlot,
  getCenters,
  getSlotTypes,
} from "../../services/api";
import Loader from "../common/Loader";

export default function SlotTimeSubTab() {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [centers, setCenters] = useState([]);
  const [slotTypes, setSlotTypes] = useState([]);

  const [centerId, setCenterId] = useState("");
  const [slotTypeId, setSlotTypeId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxAppointment, setMaxAppointment] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD ALL DATA
  ====================== */
  const loadAll = async () => {
    setLoading(true);
    try {
      const [slotRes, centerRes, slotTypeRes] = await Promise.all([
        getSlots(),
        getCenters(),
        getSlotTypes(),
      ]);

      setSlots(slotRes.data);
      setCenters(centerRes.data);
      setSlotTypes(slotTypeRes.data);
    } catch (err) {
      console.error("Failed to load Slot Time data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ======================
     ADD / UPDATE SLOT
  ====================== */
  const handleSave = async () => {
    if (!centerId || !slotTypeId || !startTime || !endTime) return;

    const payload = {
      centerId: Number(centerId),
      slotTypeId: Number(slotTypeId),
      startTime,
      endTime,
      maxAppointment: Number(maxAppointment),
      isActive,
    };

    try {
      if (editingId) {
        await updateSlot(editingId, payload);
      } else {
        await createSlot(payload);
      }

      resetForm();
      loadAll();
    } catch {
      alert("Failed to save slot");
    }
  };

  /* ======================
     DELETE SLOT
  ====================== */
  const handleDelete = async (id) => {
    if (!confirm("Delete this slot?")) return;

    try {
      await deleteSlot(id);
      loadAll();
    } catch {
      alert("Delete failed (slot may be in use)");
    }
  };

  /* ======================
     EDIT SLOT
  ====================== */
  const handleEdit = (s) => {
    setEditingId(s.id);
    setCenterId(String(s.centerId));
    setSlotTypeId(String(s.slotTypeId));
    setStartTime(s.startTime);
    setEndTime(s.endTime);
    setMaxAppointment(s.maxAppointment);
    setIsActive(s.isActive ?? true);
  };

  const resetForm = () => {
    setEditingId(null);
    setCenterId("");
    setSlotTypeId("");
    setStartTime("");
    setEndTime("");
    setMaxAppointment("");
    setIsActive(true);
  };

  /* ======================
     RENDER
  ====================== */
  return (
  <div className="card">
    <h3>Slot Time</h3>
    
    {loading ? (
      <Loader message="Loading slot times..." />
    ) : (
      <>
        {/* ===== Add / Update Slot Time ===== */}
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
      {/* Row 1: Center + Slot Type */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select
          value={centerId}
          onChange={(e) => setCenterId(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Center</option>
          {centers.map((c) => {
            const number = c.centerNumber ?? c.centerNo ?? c.number ?? c.id ?? "";
            const name = c.name ?? c.centerName ?? "";
            const label = number ? `${number} - ${name}` : name;
            return (
              <option key={c.id} value={c.id}>
                {label}
              </option>
            );
          })}
        </select>

        <select
          value={slotTypeId}
          disabled={!centerId}
          onChange={(e) => setSlotTypeId(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Slot Type</option>
          {slotTypes.map((t) => {
            const number = t.slotTypeNumber ?? t.number ?? t.id ?? "";
            const name = t.slotType1 ?? t.name ?? t.slotType ?? "";
            const label = number ? `${number} - ${name}` : name;
            return (
              <option key={t.id} value={t.id}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {/* Row 2: Start Time + End Time */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
      </div>

      {/* Row 3: Capacity + Active + Buttons */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Max Appointments"
          value={maxAppointment}
          onChange={(e) => setMaxAppointment(e.target.value)}
          style={{ width: "180px", padding: "8px" }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button
          onClick={handleSave}
          style={{
            padding: "8px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>

    {/* ===== Slot Time Table ===== */}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Center</th>
          <th>Slot Type</th>
          <th>Time</th>
          <th>Capacity</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {slots.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{(() => {
              const c = centers.find(c => c.id === s.centerId);
              if (!c) return "-";
              const number = c.centerNumber ?? c.centerNo ?? c.number ?? c.id ?? "";
              const name = c.name ?? c.centerName ?? "";
              return number ? `${number} - ${name}` : name || "-";
            })()}</td>
            <td>{(() => {
              const t = slotTypes.find(t => t.id === s.slotTypeId);
              if (!t) return "-";
              const number = t.slotTypeNumber ?? t.number ?? t.id ?? "";
              const name = t.slotType1 ?? t.name ?? t.slotType ?? "";
              return number ? `${number} - ${name}` : name || "-";
            })()}</td>
            <td>
              {s.startTime} - {s.endTime}
            </td>
            <td>{s.maxAppointment}</td>
            <td>{s.isActive ? "Active" : "Inactive"}</td>
            <td>
              <button
                onClick={() => handleEdit(s)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>

              <button onClick={() => handleDelete(s.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}

        {slots.length === 0 && (
          <tr>
            <td colSpan="7">No slots</td>
          </tr>
        )}
      </tbody>
    </table>
      </>
    )}
  </div>
);

}
