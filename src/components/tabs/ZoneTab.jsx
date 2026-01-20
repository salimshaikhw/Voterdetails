import { useEffect, useState } from "react";
import {
  getZones,
  createZone,
  updateZone,
  deleteZone,
} from "../../services/api";
import Loader from "../common/Loader";

export default function ZoneTab() {
  const [zones, setZones] = useState([]);
  const [zonename, setZonename] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getZones();
      setZones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load zones", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (!zonename.trim()) return;

    const exists = zones.some(
      z =>
        (z.name || "").toLowerCase() === zonename.toLowerCase() &&
        z.id !== editingId
    );

    if (exists) {
      alert("Zone already exists");
      return;
    }

    try {
      if (editingId) {
        await updateZone(editingId, { zonename });
        setZones(prev =>
          prev.map(z =>
            z.id === editingId ? { ...z, name: zonename } : z
          )
        );
      } else {
        const res = await createZone({ zonename });
        setZones(prev => [...prev, res.data]);
      }

      setZonename("");
      setEditingId(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     EDIT
  ====================== */
  const handleEdit = (zone) => {
    setEditingId(zone.id);
    setZonename(zone.name || "");
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this zone?")) return;

    try {
      await deleteZone(id);
      setZones(prev => prev.filter(z => z.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: "15px" }}>Zone</h2>

      {loading ? (
        <Loader message="Loading zones..." />
      ) : (
        <>
          {/* FORM ROW */}
          <div
        style={{
          maxWidth: "1100px",
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          backgroundColor: "white",
          display: "flex",
          gap: "15px",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          placeholder="Zone Name"
          value={zonename}
          onChange={(e) => setZonename(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleSave}
          disabled={!zonename.trim()}
          style={{
            padding: "8px 22px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setZonename("");
            }}
            style={{
              padding: "8px 22px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* TABLE */}
      <div
        style={{
          maxWidth: "1100px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          backgroundColor: "white"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>
          Zones ({zones.length})
        </h3>

        <table
          width="100%"
          cellPadding="10"
          style={{ borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f5f6f8" }}>
            <tr>
              <th align="left">Zone Name</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(zone => (
              <tr key={zone.id}>
                <td>{zone.name}</td>
                <td>
                  <button
                    onClick={() => handleEdit(zone)}
                    style={{
                      marginRight: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(zone.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#dc3545",
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
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}