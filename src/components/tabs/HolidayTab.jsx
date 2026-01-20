import { useEffect, useState } from "react";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../../services/api";
import Loader from "../common/Loader";

export default function HolidayTab({
  booths = [],
  centers = [],
  slotTimes = [],
  rows,
  setRows,
}) {
  const [loading, setLoading] = useState(true);
  const [boothId, setBoothId] = useState("");
  const [centerId, setCenterId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [description, setDescription] = useState("");
  const [fullDay, setFullDay] = useState(false);
  const [globalHoliday, setGlobalHoliday] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const res = await getHolidays();
      // Normalize incoming records to support different backends
      const normalize = (h) => ({
        ...h,
        centerId: h.cscid || h.centerId,
        townId: h.townid || h.townId,
        constituencyNumber: h.constituencynumber || h.constituencyNumber,
        slotId: h.slotid || h.slotId,
        holidayDate: h.holidaydate || h.holidayDate,
        description: h.description || "",
        isGlobal: h.isglobal ?? h.isGlobal ?? false,
        holidayType: h.holidayType || h.holidaytype || "string",
      });

      setRows(Array.isArray(res.data) ? res.data.map(normalize) : []);
    } catch (err) {
      console.error("Failed to load holidays", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTERS ---------------- */

  const filteredCenters = centers.filter(
    (c) => c.boothId === Number(boothId)
  );

  const filteredSlots = slotTimes.filter(
    (s) => s.centerId === Number(centerId)
  );

  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setBoothId("");
    setCenterId("");
    setSlotId("");
    setHolidayDate("");
    setDescription("");
    setFullDay(false);
    setGlobalHoliday(false);
    setEditingId(null);
  };

  /* ---------------- HELPERS ---------------- */

  const getBoothLabel = (b) => {
    if (!b) return "-";
    const number = b.partNumber ?? b.partNo ?? b.boothNumber ?? b.number ?? "";
    const name = b.name ?? b.booth ?? "";
    return number ? `${number} - ${name}` : name || "-";
  };

  const getCenterLabel = (c) => {
    if (!c) return "-";
    const number = c.centerNumber ?? c.centerNo ?? c.number ?? c.id ?? "";
    const name = c.name ?? c.center ?? "";
    return number ? `${number} - ${name}` : name || "-";
  };

  /* ---------------- SAVE / UPDATE ---------------- */

  const handleSave = async () => {
    if (!holidayDate) return alert("Date is required");

    if (!fullDay && !slotId)
      return alert("Select slot or enable Full Day");

    const payload = {
      // include id for update endpoints that expect it in body
      ...(editingId ? { id: editingId } : {}),
      cscid: centerId ? centerId : null,
      townid: boothId ? boothId : null,
      constituencynumber: 0,
      slotid: fullDay ? 0 : slotId ? Number(slotId) : 0,
      holidaydate: holidayDate, // yyyy-mm-dd format: "2026-01-18"
      description: description || "string",
      isglobal: !!globalHoliday,
      holidayType: "string"
    };

    console.log("Saving holiday payload", payload);

    try {
      if (editingId) {
        await updateHoliday(editingId, payload);
      } else {
        await createHoliday(payload);
      }

      await loadHolidays();
      resetForm();
    } catch (err) {
      console.error("Save failed", err, err.response?.data);
      const serverMsg = err.response?.data?.message ?? err.response?.data ?? null;
      alert("Failed to save Holiday" + (serverMsg ? `: ${JSON.stringify(serverMsg)}` : ""));
    }
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (h) => {
    setEditingId(h.id);
    setBoothId(h.townId ?? "");
    setCenterId(h.centerId ?? "");
    setSlotId(h.slotId ?? "");
    setHolidayDate(h.holidayDate);
    setDescription(h.description ?? "");
    setFullDay(h.slotId === 0 || h.slotId === null);
    setGlobalHoliday(!!h.isGlobal);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!confirm("Delete this holiday?")) return;

    try {
      await deleteHoliday(id);
      await loadHolidays();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  /* ---------------- UI ---------------- */

  return (
  <div className="card">
    <h2>Holiday</h2>
    
    {loading ? (
      <Loader message="Loading holidays..." />
    ) : (
      <>
        {/* ===== Holiday Form ===== */}
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
      {/* Row 1: Booth + Center */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select
          value={boothId}
          onChange={(e) => {
            setBoothId(e.target.value);
            setCenterId("");
            setSlotId("");
          }}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Booth</option>
          {booths.map((b) => (
            <option key={b.id} value={b.id}>
              {getBoothLabel(b)}
            </option>
          ))}
        </select>

        <select
          value={centerId}
          disabled={!boothId}
          onChange={(e) => {
            setCenterId(e.target.value);
            setSlotId("");
          }}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Center</option>
          {filteredCenters.map((c) => (
            <option key={c.id} value={c.id}>
              {getCenterLabel(c)}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Full Day + Slot */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={fullDay}
            onChange={(e) => {
              setFullDay(e.target.checked);
              setSlotId("");
            }}
          />
          Full Day Holiday
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={globalHoliday}
            onChange={(e) => setGlobalHoliday(e.target.checked)}
          />
          Global Holiday
        </label>

        {!fullDay && (
          <select
            value={slotId}
            disabled={!centerId}
            onChange={(e) => setSlotId(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          >
            <option value="">Select Slot</option>
            {filteredSlots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.startTime} - {s.endTime}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Row 3: Date */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="date"
          value={holidayDate}
          onChange={(e) => setHolidayDate(e.target.value)}
          style={{ padding: "8px", width: "220px" }}
        />
      </div>

      {/* Row 4: Description */}
      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            minHeight: "70px",
          }}
        />
      </div>

      {/* Row 5: Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
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
          {editingId ? "Update Holiday" : "Add Holiday"}
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

    {/* ===== Holiday Table ===== */}
    <table>
      <thead>
        <tr>
          <th>Booth</th>
          <th>Center</th>
          <th>Slot</th>
          <th>Date</th>
          <th>Global</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan="6">No holidays</td>
          </tr>
        )}

        {rows.map((h) => (
          <tr key={h.id}>
            <td>{getBoothLabel(booths.find((b) => b.id === h.townId))}</td>
            <td>{getCenterLabel(centers.find((c) => c.id === h.centerId))}</td>
            <td>
              {h.slotId && h.slotId !== 0
                ? `${slotTimes.find((s) => s.id === h.slotId)?.startTime} - 
                   ${slotTimes.find((s) => s.id === h.slotId)?.endTime}`
                : "Full Day"}
            </td>
            <td>{h.holidayDate}</td>
            <td>{h.isGlobal ? "Yes" : "No"}</td>
            <td>
              <button
                onClick={() => handleEdit(h)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(h.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      </>
    )}
  </div>
);

}