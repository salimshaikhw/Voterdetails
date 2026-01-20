import { useEffect, useState } from "react";
import {
  getTowns,
  createTown,
  updateTown,
  deleteTown,
  getConstituencies,
  getBlocks,
} from "../../services/api";
import Loader from "../common/Loader";

export default function TownTab() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const [formData, setFormData] = useState({
    constituencynumber: "",
    blocknumber: "",
    name: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    setLoading(true);
    try {
      const [townRes, constituencyRes, blockRes] = await Promise.all([
        getTowns(),
        getConstituencies(),
        getBlocks(),
      ]);

      setRows(townRes.data || []);
      setConstituencies(constituencyRes.data || []);
      setBlocks(blockRes.data || []);
    } catch (err) {
      console.error("Failed to load town data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBlocks = formData.constituencynumber
    ? blocks.filter(
        (b) =>
          Number(b.constituencynumber) ===
          Number(formData.constituencynumber)
      )
    : blocks;

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (
      !formData.constituencynumber ||
      !formData.blocknumber ||
      !formData.name.trim()
    ) {
      alert("Please select Constituency, Block and enter Town name");
      return;
    }

    const payload = {
      name: formData.name,
      constituencynumber: parseInt(formData.constituencynumber, 10),
      blocknumber: parseInt(formData.blocknumber, 10),
    };

    if (isNaN(payload.blocknumber)) {
      alert("Please select a block");
      return;
    }

    try {
      if (editingId) {
        await updateTown(editingId, payload);
      } else {
        await createTown(payload);
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
    if (!window.confirm("Delete this town?")) return;

    try {
      await deleteTown(id);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      constituencynumber: "",
      blocknumber: "",
      name: "",
    });
    setEditingId(null);
  };

  const getConstituencyName = (number) => {
    const c = constituencies.find(
      (c) => Number(c.number) === Number(number)
    );
    return c ? c.displayName || c.name : "-";
  };

  const getBlockName = (number) => {
    const b = blocks.find(
      (b) => Number(b.number) === Number(number)
    );
    return b ? b.name : "-";
  };

  return (
    <div className="card">
      <h2>Town</h2>
      
      {loading ? (
        <Loader message="Loading towns..." />
      ) : (
        <>
          {/* ===== Manual Entry ===== */}
          <div
            style={{
              marginBottom: "30px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
        <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>
          Add Town Manually
        </h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={formData.constituencynumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                constituencynumber: e.target.value,
                blocknumber: "",
              })
            }
            style={{ flex: 2 }}
          >
            <option value="">Select Constituency</option>
            {constituencies.map((c) => (
              <option key={c.id} value={c.number}>
                {c.displayName || c.name}
              </option>
            ))}
          </select>

          <select
            value={formData.blocknumber}
            onChange={(e) =>
              setFormData({ ...formData, blocknumber: e.target.value })
            }
            style={{ flex: 2 }}
            disabled={!formData.constituencynumber}
          >
            <option value="">Select Block</option>
            {filteredBlocks.map((b) => (
              <option key={b.id} value={b.number}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Town Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            style={{ flex: 2 }}
          />

          <button onClick={handleSave}>
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button onClick={resetForm}>Cancel</button>
          )}
        </div>
      </div>

      {/* ===== Table ===== */}
      <table>
        <thead>
          <tr>
            <th>Constituency</th>
            <th>Block</th>
            <th>Town</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="4">No data</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>{getConstituencyName(r.constituencynumber)}</td>
                <td>{getBlockName(r.blocknumber)}</td>
                <td>{r.name}</td>
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
                        setEditingId(r.id);
                        setFormData({
                          name: r.name,
                          constituencynumber: r.constituencynumber,
                          blocknumber: r.blocknumber,
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
                  </div>
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