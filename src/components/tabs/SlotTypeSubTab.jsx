import { useEffect, useState } from "react";
import {
  getSlotTypes,
  createSlotType,
  updateSlotType,
  deleteSlotType,
} from "../../services/api";
import Loader from "../common/Loader";

export default function SlotTypeSubTab() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getSlotTypes();
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateSlotType(editingId, {
          id: editingId,
          slotType1: name,
        });
      } else {
        await createSlotType({
          slotType1: name,
        });
      }

      setName("");
      setEditingId(null);
      loadData();
    } catch {
      alert("Failed to save Slot Type");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlotType(id);
      loadData();
    } catch {
      alert("Delete failed (in use)");
    }
  };

  return (
    <>
      <h3>Slot Type</h3>
      
      {loading ? (
        <Loader message="Loading slot types..." />
      ) : (
        <>
          <div className="form-row">
        <input
          placeholder="Slot Type Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleSave}>
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Slot Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.slotType1}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingId(r.id);
                    setName(r.slotType1);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan="3">No slot types</td>
            </tr>
          )}
        </tbody>
      </table>
        </>
      )}
    </>
  );
}
