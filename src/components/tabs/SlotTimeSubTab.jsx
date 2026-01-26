import { useEffect, useState } from "react";
import {
  getBookingSlots,
  createBookingSlot,
  updateBookingSlot,
  deleteBookingSlot,
} from "../../services/api";
import Loader from "../common/Loader";

export default function SlotTimeSubTab() {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxCount, setMaxCount] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD BOOKING SLOTS
  ====================== */
  const loadSlots = async () => {
    setLoading(true);
    try {
      const res = await getBookingSlots();
      setSlots(res.data || []);
    } catch (err) {
      console.error("Failed to load booking slots", err);
      alert("Failed to load booking slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  /* ======================
     VALIDATE FORM
  ====================== */
  const validateForm = () => {
    if (!startTime) {
      alert("Start time is required");
      return false;
    }
    if (!endTime) {
      alert("End time is required");
      return false;
    }
    if (!maxCount || maxCount < 1) {
      alert("Max count must be at least 1");
      return false;
    }

    // Validate end time is after start time
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) {
      alert("End time must be after start time");
      return false;
    }

    return true;
  };

  /* ======================
     FORMAT TIME FOR API
  ====================== */
  const formatTimeForApi = (timeInput) => {
    // Convert "09:00" to "09:00:00"
    if (timeInput && timeInput.length === 5) {
      return `${timeInput}:00`;
    }
    return timeInput;
  };

  /* ======================
     FORMAT TIME FOR DISPLAY
  ====================== */
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  /* ======================
     ADD / UPDATE SLOT
  ====================== */
  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      name: name || undefined,
      startTime: formatTimeForApi(startTime),
      endTime: formatTimeForApi(endTime),
      maxCount: Number(maxCount),
      isActive,
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      if (editingId) {
        await updateBookingSlot(editingId, payload);
      } else {
        await createBookingSlot(payload);
      }

      resetForm();
      loadSlots();
    } catch (err) {
      console.error("Failed to save slot", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.title || "Failed to save slot";
      alert(errorMsg);
    }
  };

  /* ======================
     DELETE SLOT
  ====================== */
  const handleDelete = async (id, slotName) => {
    const confirmMsg = `Are you sure you want to delete "${slotName || 'this slot'}"?\n\nThis action cannot be undone and may affect existing bookings.`;
    if (!confirm(confirmMsg)) return;

    try {
      await deleteBookingSlot(id);
      loadSlots();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. This slot may have existing bookings.");
    }
  };

  /* ======================
     EDIT SLOT
  ====================== */
  const handleEdit = (s) => {
    setEditingId(s.id);
    setName(s.name || "");
    // Remove seconds from time for input field
    setStartTime(s.startTime ? s.startTime.substring(0, 5) : "");
    setEndTime(s.endTime ? s.endTime.substring(0, 5) : "");
    setMaxCount(s.maxCount || "");
    setIsActive(s.isActive ?? true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setStartTime("");
    setEndTime("");
    setMaxCount("");
    setIsActive(true);
  };

  /* ======================
     RENDER
  ====================== */
  return (
  <div className="card">
    <h3>📅 Booking Slots Management</h3>
    
    {loading ? (
      <Loader message="Loading booking slots..." />
    ) : (
      <>
        {/* ===== Add / Update Booking Slot ===== */}
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
            {editingId ? "Edit Booking Slot" : "Create New Slot"}
          </h4>

          {/* Row 1: Slot Name */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
              Slot Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Morning Slot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>

          {/* Row 2: Start Time + End Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                Start Time <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                End Time <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                required
              />
            </div>
          </div>

          {/* Row 3: Max Count + Active */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                Maximum Bookings <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                min="1"
                value={maxCount}
                onChange={(e) => setMaxCount(e.target.value)}
                style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ddd" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "5px", fontWeight: "600", color: "#64748b" }}>
                Status
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>Active</span>
              </label>
            </div>
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
              {editingId ? "✓ Update Slot" : "+ Create Slot"}
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

        {/* ===== Booking Slots Table ===== */}
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Slot Name</th>
                <th>Time Period</th>
                <th>Max Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: "600" }}>{s.name || `Slot ${s.id}`}</td>
                  <td>
                    <span style={{ whiteSpace: "nowrap" }}>
                      {formatTimeForDisplay(s.startTime)} - {formatTimeForDisplay(s.endTime)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: "4px 12px", 
                      background: "#e3f2fd", 
                      borderRadius: "12px",
                      fontWeight: "600",
                      color: "#1976d2"
                    }}>
                      {s.maxCount} bookings
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: s.isActive ? "#d4edda" : "#f8d7da",
                      color: s.isActive ? "#155724" : "#721c24"
                    }}>
                      {s.isActive ? "✓ Active" : "✗ Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(s)}
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
                      onClick={() => handleDelete(s.id, s.name)}
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
              ))}

              {slots.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
                    No booking slots found. Create your first slot above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
);

}

