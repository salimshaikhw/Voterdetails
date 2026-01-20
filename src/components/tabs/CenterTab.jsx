import { useEffect, useState } from "react";
import {
  getCentersWithTownMapping,
  createCenter,
  updateCenter,
  deleteCenter,
  getTowns,
  getBlocks,
  getConstituencies,
} from "../../services/api";
import Loader from "../common/Loader";

export default function CenterTab() {
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState([]);
  const [towns, setTowns] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    townid: "",
    centerUid: "",
    name: "",
    address: "",
  });

  /* ======================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    setLoading(true);
    try {
      const [centerRes, townRes, blockRes, constituencyRes] =
        await Promise.all([
          getCentersWithTownMapping(),
          getTowns(),
          getBlocks(),
          getConstituencies(),
        ]);

      setCenters(centerRes.data || []);
      setTowns(townRes.data || []);
      setBlocks(blockRes.data || []);
      setConstituencies(constituencyRes.data || []);
    } catch (err) {
      console.error("Failed to load center data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     FORM HANDLERS
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      townid: "",
      centerUid: "",
      name: "",
      address: "",
    });
  };

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (!form.townid || !form.centerUid || !form.name) return;

    try {
      if (editingId) {
        await updateCenter(editingId, {
          id: editingId,
          ...form,
        });
      } else {
        await createCenter(form);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this center?")) return;

    try {
      await deleteCenter(id);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  /* ======================
     HELPERS (REAL RELATIONS)
  ====================== */
  const getTown = (townId) => {
    // Try both lowercase and camelCase
    return towns.find((t) => t.id === townId || t.Id === townId);
  };

  const getBlock = (townId) => {
    const town = getTown(townId);
    return blocks.find((b) => b.number === town?.blocknumber);
  };

  const getConstituency = (townId) => {
    const block = getBlock(townId);
    return constituencies.find(
      (c) => c.number === block?.constituencynumber
    );
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="card">
      <h2>Center</h2>
      
      {loading ? (
        <Loader message="Loading centers..." />
      ) : (
        <>
          {/* ===== Add / Update Center ===== */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <select
            name="townid"
            value={form.townid}
            onChange={handleChange}
            style={{ flex: 2 }}
          >
            <option value="">Select Town</option>
            {towns.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            name="centerUid"
            placeholder="Center UID"
            value={form.centerUid}
            onChange={handleChange}
            style={{ flex: 1 }}
          />

          <input
            name="name"
            placeholder="Center Name"
            value={form.name}
            onChange={handleChange}
            style={{ flex: 2 }}
          />
        </div>

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button onClick={handleSave}>
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            style={{ marginLeft: "10px", background: "#6c757d" }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* ===== Center Table ===== */}
      <table>
        <thead>
          <tr>
            <th>Center</th>
            <th>Town</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {centers.map((c) => {
            const townIdValue = c.townid || c.townId || c.TownId;
            const town = getTown(townIdValue);

            return (
              <tr key={c.id}>
                <td>
                  {c.centerUid} - {c.name}
                </td>

                <td>
                  {c.townname || town?.name || "-"}
                </td>

                <td>{c.centerAddress || c.address || "-"}</td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setForm({
                          townid: c.townid || c.townId || c.TownId || "",
                          centerUid: c.centerUid,
                          name: c.name,
                          address: c.centerAddress || c.address,
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {centers.length === 0 && (
            <tr>
              <td colSpan="4">No data</td>
            </tr>
          )}
        </tbody>
      </table>
        </>
      )}
    </div>
  );
}