import { useEffect, useState } from "react";
import {
  getDistricts,
  getZones,
//   getDistrictsByZoneId,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "../../services/api";
import Loader from "../common/Loader";

export default function DistrictTab() {
  const [rows, setRows] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD INITIAL DATA
  ====================== */
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadZones(), loadDistricts()]);
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async () => {
    const res = await getZones();
    setZones(res.data);
  };

  const loadDistricts = async () => {
    const res = await getDistricts();
    setRows(res.data);
  };

  /* ======================
     FILTER BY ZONE
  ====================== */
  const handleZoneFilter = async (zid) => {
    setZoneId(zid);

    if (!zid) {
      loadDistricts();
      return;
    }

    const res = await getDistrictsByZoneId(zid);
    setRows(res.data);
  };

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (!name.trim() || !zoneId) return;

    const payload = {
      name,
      zoneid: zoneId,
    };

    if (editingId) {
      await updateDistrict(editingId, payload);
    } else {
      await createDistrict(payload);
    }

    resetForm();
    loadDistricts();
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this district?")) return;
    await deleteDistrict(id);
    loadDistricts();
  };

  const resetForm = () => {
    setName("");
    setZoneId("");
    setEditingId(null);
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="card">
      <h2>District</h2>
      
      {loading ? (
        <Loader message="Loading districts..." />
      ) : (
        <>
          {/* ===== Add / Edit ===== */}
          <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">Select Zone</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="District Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 2 }}
          />

          <button onClick={handleSave}>
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ===== Filter ===== */}
      <div style={{ marginBottom: "10px" }}>
        <select
          value={zoneId}
          onChange={(e) => handleZoneFilter(e.target.value)}
        >
          <option value="">All Zones</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>

      {/* ===== Table ===== */}
      <table>
        <thead>
          <tr>
            <th>District</th>
            <th>Zone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="3">No data</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  {zones.find((z) => z.id === r.zoneid)?.name || "-"}
                </td>
                <td>
                  <button
                    onClick={() => {
                      setEditingId(r.id);
                      setName(r.name);
                      setZoneId(r.zoneid);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
        </>
      )}
    </div>
  );
}