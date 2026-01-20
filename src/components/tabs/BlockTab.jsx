import { useEffect, useState } from "react";
import {
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
} from "../../services/api";
import Loader from "../common/Loader";

const blueButtonStyle = {
  padding: "6px 12px",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
};


export default function BlockTab({ constituencies, rows, setRows }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    constituencynumber: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD FROM BACKEND
  ====================== */
  const loadBlocks = async () => {
    setLoading(true);
    try {
      const res = await getBlocks();
      setRows(res.data || []);
    } catch (err) {
      console.error("Failed to load blocks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.number ||
      !formData.constituencynumber
    )
      return;

    try {
      const payload = {
        name: formData.name,
        number: Number(formData.number),
        constituencynumber: Number(formData.constituencynumber),
      };

      if (editingId) {
        await updateBlock(editingId, payload);
      } else {
        await createBlock(payload);
      }

      setFormData({
        name: "",
        number: "",
        constituencynumber: "",
      });
      setEditingId(null);
      loadBlocks();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this block?")) return;

    try {
      await deleteBlock(id);
      loadBlocks();
    } catch {
      alert("Delete failed");
    }
  };

  const getConstituencyName = (number) => {
    const c = constituencies.find(
      (c) => Number(c.number) === Number(number)
    );
    return c ? c.displayName || c.name : "-";
  };

  return (
    <div className="card">
      <h2>Block</h2>
      
      {loading ? (
        <Loader message="Loading blocks..." />
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
          Add Block Manually
        </h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={formData.constituencynumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                constituencynumber: e.target.value,
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

          <input
            type="text"
            placeholder="Block Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            style={{ flex: 2 }}
          />

          <input
            type="number"
            placeholder="Block Number"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
            style={{ flex: 1 }}
          />

          <button onClick={handleSubmit} style={blueButtonStyle}>
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button onClick={() => {
              setFormData({
                name: "",
                number: "",
                constituencynumber: "",
              });
              setEditingId(null);
            }} style={blueButtonStyle}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ===== Table ===== */}
      <table>
        <thead>
          <tr>
            <th>Constituency</th>
            <th>Block</th>
            <th>Block Number</th>
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
                <td>{r.name}</td>
                <td>{r.number}</td>
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
                          number: r.number,
                          constituencynumber: r.constituencynumber,
                        });
                      }}
                      style={blueButtonStyle}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      style={blueButtonStyle}
                    >
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