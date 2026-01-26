import { useEffect, useState, useMemo } from "react";
import {
  getCentersWithTownMapping,
  getCentersByTownId,
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
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter
  const [filterTownId, setFilterTownId] = useState("");

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
      alert("Failed to load data. Please refresh the page.");
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
    setForm((prev) => ({
      townid: prev.townid, // Persist town selection
      centerUid: "",
      name: "",
      address: "",
    }));
  };

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (!form.townid || !form.centerUid || !form.address) {
      alert("Please fill in Town, Center UID, and Address fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateCenter(editingId, {
          id: editingId,
          ...form,
        });
        alert("Center updated successfully!");
      } else {
        await createCenter(form);
        alert("Center created successfully!");
      }

      resetForm();
      loadData();
      setCurrentPage(1); // Reset to first page after adding/updating
    } catch (err) {
      console.error("Save failed", err);
      alert("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this center?")) return;

    try {
      await deleteCenter(id);
      alert("Center deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. Please try again.");
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
     FILTERING & PAGINATION
  ====================== */
  const filteredAndPaginatedCenters = useMemo(() => {
    let filtered = [...centers];

    // Filter by town
    if (filterTownId) {
      filtered = filtered.filter((c) => {
        const townIdValue = c.townid || c.townId || c.TownId;
        return townIdValue === filterTownId;
      });
    }

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage,
      startIndex,
      endIndex: Math.min(endIndex, totalItems),
    };
  }, [
    centers,
    filterTownId,
    currentPage,
    itemsPerPage,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTownId, centers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= filteredAndPaginatedCenters.totalPages) {
      setCurrentPage(newPage);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="card">
      <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>
        🏢 Centers Management
      </h2>

      {/* ===== EDIT MODE BANNER ===== */}
      {editingId && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px 20px",
            background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(23, 162, 184, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            animation: "slideDown 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>✏️</span>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                EDIT MODE - Editing Center
              </div>
              <div style={{ fontSize: "13px", opacity: 0.9 }}>
                Editing center: {form.centerUid} - {form.name || "Unnamed"}
              </div>
            </div>
          </div>
          <button
            onClick={resetForm}
            disabled={submitting}
            style={{
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "2px solid white",
              borderRadius: "6px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            ❌ Cancel Edit
          </button>
        </div>
      )}

      {/* ===== Add / Update Center Form ===== */}
      <div
        style={{
          marginBottom: "25px",
          padding: "20px",
          border: editingId ? "3px solid #17a2b8" : "2px solid #28a745",
          borderRadius: "10px",
          backgroundColor: editingId ? "#d1ecf1" : "#d4edda",
          boxShadow: editingId
            ? "0 4px 16px rgba(23, 162, 184, 0.25)"
            : "0 2px 8px rgba(40, 167, 69, 0.15)",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        {/* Form Mode Indicator */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "20px",
            padding: "4px 16px",
            background: editingId ? "#17a2b8" : "#28a745",
            color: "white",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {editingId ? "✏️ EDIT CENTER" : "➕ ADD NEW CENTER"}
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap", marginTop: "10px" }}>
          <select
            name="townid"
            value={form.townid}
            onChange={handleChange}
            style={{
              flex: "1 1 200px",
              padding: "10px",
              borderRadius: "6px",
              border: editingId ? "2px solid #17a2b8" : "2px solid #28a745",
              fontSize: "14px",
            }}
          >
            <option value="">Select Town *</option>
            {towns.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            name="centerUid"
            placeholder="Center UID *"
            value={form.centerUid}
            onChange={handleChange}
            disabled={editingId} // Disable UID editing in edit mode
            style={{
              flex: "1 1 150px",
              padding: "10px",
              borderRadius: "6px",
              border: editingId ? "2px solid #17a2b8" : "2px solid #28a745",
              fontSize: "14px",
              backgroundColor: editingId ? "#ffffff" : "#ffffff",
              opacity: editingId ? 0.7 : 1,
              cursor: editingId ? "not-allowed" : "text",
            }}
          />

          <input
            name="name"
            placeholder="Center Name"
            value={form.name}
            onChange={handleChange}
            style={{
              flex: "1 1 250px",
              padding: "10px",
              borderRadius: "6px",
              border: editingId ? "2px solid #17a2b8" : "2px solid #28a745",
              fontSize: "14px",
            }}
          />
        </div>

        <input
          name="address"
          placeholder="Address *"
          value={form.address}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: editingId ? "2px solid #17a2b8" : "2px solid #28a745",
            fontSize: "14px",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSave}
            disabled={submitting}
            style={{
              padding: "12px 32px",
              background: submitting
                ? "#95a5a6"
                : editingId
                ? "linear-gradient(135deg, #17a2b8 0%, #138496 100%)"
                : "linear-gradient(135deg, #28a745 0%, #218838 100%)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "700",
              transition: "all 0.3s ease",
              boxShadow: submitting
                ? "none"
                : "0 4px 12px rgba(0,0,0,0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {submitting
              ? "⏳ Saving..."
              : editingId
              ? "✏️ EDIT CENTER"
              : "➕ ADD CENTER"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              disabled={submitting}
              style={{
                padding: "12px 32px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontSize: "15px",
                fontWeight: "700",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "#5a6268";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#6c757d";
              }}
            >
              ❌ CANCEL
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Loader message="Loading centers..." />
      ) : (
        <>
          {/* ===== Pagination Info & Controls ===== */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#f1f3f5",
              borderRadius: "6px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#495057" }}>
              Showing {filteredAndPaginatedCenters.startIndex + 1} to{" "}
              {filteredAndPaginatedCenters.endIndex} of{" "}
              {filteredAndPaginatedCenters.totalItems} centers
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <label style={{ fontSize: "14px", color: "#495057" }}>
                  Filter by Town:
                </label>
                <select
                  value={filterTownId}
                  onChange={(e) => setFilterTownId(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ced4da",
                    fontSize: "14px",
                    minWidth: "150px",
                  }}
                >
                  <option value="">All Towns</option>
                  {towns.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <label style={{ fontSize: "14px", color: "#495057" }}>
                  Items per page:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ced4da",
                    fontSize: "14px",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== Center Table ===== */}
          <div style={{ overflowX: "auto", marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>
                    Center UID
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>
                    Center Name
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>
                    Town
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>
                    Address
                  </th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAndPaginatedCenters.data.map((c, index) => {
                  const townIdValue = c.townid || c.townId || c.TownId;
                  const town = getTown(townIdValue);

                  return (
                    <tr
                      key={c.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e9ecef")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#ffffff" : "#f8f9fa")
                      }
                    >
                      <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>
                        <strong>{c.centerUid || "-"}</strong>
                      </td>

                      <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>
                        {c.name || "-"}
                      </td>

                      <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>
                        {c.townname || town?.name || "-"}
                      </td>

                      <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>
                        {c.centerAddress || c.address || "-"}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #dee2e6",
                          textAlign: "center",
                        }}
                      >
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
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            style={{
                              padding: "6px 14px",
                              background: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#138496")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "#17a2b8")
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => handleDelete(c.id)}
                            style={{
                              padding: "6px 14px",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#c82333")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "#dc3545")
                            }
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredAndPaginatedCenters.data.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#6c757d",
                        fontSize: "16px",
                      }}
                    >
                      {centers.length === 0
                        ? "No centers found. Add your first center above."
                        : "No centers match your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ===== Pagination Controls ===== */}
          {filteredAndPaginatedCenters.totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                padding: "15px",
              }}
            >
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  background: currentPage === 1 ? "#e9ecef" : "#007bff",
                  color: currentPage === 1 ? "#6c757d" : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
              >
                « First
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  background: currentPage === 1 ? "#e9ecef" : "#007bff",
                  color: currentPage === 1 ? "#6c757d" : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
              >
                ‹ Prev
              </button>

              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from(
                  { length: filteredAndPaginatedCenters.totalPages },
                  (_, i) => i + 1
                )
                  .filter((page) => {
                    // Show first page, last page, current page, and 2 pages around current
                    return (
                      page === 1 ||
                      page === filteredAndPaginatedCenters.totalPages ||
                      Math.abs(page - currentPage) <= 2
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} style={{ display: "flex", gap: "4px" }}>
                        {showEllipsis && (
                          <span
                            style={{
                              padding: "8px 12px",
                              color: "#6c757d",
                              fontSize: "14px",
                            }}
                          >
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          style={{
                            padding: "8px 12px",
                            background: page === currentPage ? "#007bff" : "#e9ecef",
                            color: page === currentPage ? "white" : "#495057",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: page === currentPage ? "700" : "500",
                            minWidth: "40px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === filteredAndPaginatedCenters.totalPages}
                style={{
                  padding: "8px 12px",
                  background:
                    currentPage === filteredAndPaginatedCenters.totalPages
                      ? "#e9ecef"
                      : "#007bff",
                  color:
                    currentPage === filteredAndPaginatedCenters.totalPages
                      ? "#6c757d"
                      : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    currentPage === filteredAndPaginatedCenters.totalPages
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
              >
                Next ›
              </button>

              <button
                onClick={() =>
                  handlePageChange(filteredAndPaginatedCenters.totalPages)
                }
                disabled={currentPage === filteredAndPaginatedCenters.totalPages}
                style={{
                  padding: "8px 12px",
                  background:
                    currentPage === filteredAndPaginatedCenters.totalPages
                      ? "#e9ecef"
                      : "#007bff",
                  color:
                    currentPage === filteredAndPaginatedCenters.totalPages
                      ? "#6c757d"
                      : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    currentPage === filteredAndPaginatedCenters.totalPages
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
              >
                Last »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}