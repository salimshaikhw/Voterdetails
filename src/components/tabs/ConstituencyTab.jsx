import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  getConstituencies,
  createConstituency,
  updateConstituency,
  deleteConstituency,
  uploadConstituencyData,
  getZones,
  getDistricts,
} from "../../services/api";
import Loader from "../common/Loader";

export default function ConstituencyTab() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [constituencyNumber, setConstituencyNumber] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [canUpload, setCanUpload] = useState(false);

  /* ======================
     LOAD FROM BACKEND
  ====================== */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getConstituencies();

      const normalized = res.data.map((c) => ({
        ...c,
        constituencyNumber: c.number,
        name: c.displayName ?? c.name,
      }));

      setRows(normalized);
    } catch (err) {
      console.error("Failed to load constituencies", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMasters = async () => {
    try {
      const [zoneRes, districtRes] = await Promise.all([
        getZones(),
        getDistricts(),
      ]);
      setZones(zoneRes.data);
      setDistricts(districtRes.data);
    } catch (err) {
      console.error("Failed to load zones/districts", err);
    }
  };

  useEffect(() => {
    loadData();
    loadMasters();
  }, []);

  const filteredDistricts = selectedZoneId
    ? districts.filter((d) => d.zoneid === selectedZoneId)
    : districts;

  /* ======================
     ADD / UPDATE (SQL)
  ====================== */
  const handleSave = async () => {
    if (
      !name.trim() ||
      !constituencyNumber ||
      !selectedZoneId ||
      !selectedDistrictId
    )
      return;

    try {
      const payload = {
        name,
        number: Number(constituencyNumber),
        zoneid: selectedZoneId,
        districtid: selectedDistrictId,
      };

      if (editingId) {
        await updateConstituency(editingId, payload);
      } else {
        await createConstituency(payload);
      }

      setName("");
      setConstituencyNumber("");
      setSelectedZoneId("");
      setSelectedDistrictId("");
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     DELETE (SQL)
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this constituency?")) return;

    try {
      await deleteConstituency(id);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  /* ======================
     FILE UPLOAD (EXCEL)
     (UNCHANGED)
  ====================== */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setCanUpload(false);
    setSelectedFile(null);
    setUploadStatus("");
    if (!file) return;

    const validExt = [".xlsx", ".xls"].some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!validExt) {
      setUploadStatus("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus("File size exceeds 50 MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        const rowsPreview = XLSX.utils.sheet_to_json(firstSheet, {
          defval: null,
        });
        const rowCount = Array.isArray(rowsPreview) ? rowsPreview.length : 0;
        setUploadStatus(`Preview: ${rowCount} data rows found.`);
        setSelectedFile(file);
        setCanUpload(rowCount > 0);
        if (rowCount === 0) {
          setUploadStatus("Preview: No data rows found in the selected file.");
        }
      } catch (err) {
        console.error("Local parse failed", err);
        setUploadStatus("Could not parse file locally; server may accept it.");
        setSelectedFile(file);
        setCanUpload(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("Uploading...");

    try {
      await uploadConstituencyData(selectedFile);
      setUploadStatus("File uploaded successfully!");
      setSelectedFile(null);
      await loadData();
    } catch (err) {
      console.error("Upload failed", err);
      const serverMsg = err?.response?.data || err?.response?.statusText;
      const msg = serverMsg ? JSON.stringify(serverMsg) : err.message;
      setUploadStatus(`Upload failed: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ["Name,ConstituencyNumber"];
    const sampleData = [
      "Sample Constituency 1,1",
      "Sample Constituency 2,2",
    ];

    const csvContent = [...headers, ...sampleData].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "constituency_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <h2>Constituency</h2>
      
      {loading ? (
        <Loader message="Loading constituencies..." />
      ) : (
        <>
          {/* ===== Manual Entry ===== */}
          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>
          Add Constituency Manually
        </h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={selectedZoneId}
            onChange={(e) => {
              setSelectedZoneId(e.target.value);
              setSelectedDistrictId("");
            }}
            style={{ flex: 1 }}
          >
            <option value="">Select Zone</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrictId}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            style={{ flex: 1 }}
            disabled={!selectedZoneId}
          >
            <option value="">Select District</option>
            {filteredDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Constituency Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 2 }}
          />
          <input
            type="number"
            placeholder="Constituency Number"
            value={constituencyNumber}
            onChange={(e) => setConstituencyNumber(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleSave}>
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ===== Upload Excel (UNCHANGED) ===== */}
      {/* YOUR EXACT EXCEL BLOCK REMAINS HERE */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px" }}>
          Upload Constituency Data (Excel)
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={downloadTemplate}
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "18px" }}>📥</span>
            Download Template
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            id="constituency-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            style={{ flex: 1 }}
          />

          <button
            onClick={handleFileUpload}
            disabled={!selectedFile || isUploading || !canUpload}
            style={{
              padding: "8px 20px",
              cursor:
                !selectedFile || isUploading || !canUpload
                  ? "not-allowed"
                  : "pointer",
              opacity: !selectedFile || isUploading ? 0.6 : 1,
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "18px" }}>📤</span>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {uploadStatus && (
          <div style={{ marginTop: "10px", fontSize: "14px" }}>
            {uploadStatus}
          </div>
        )}

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          <strong>Note:</strong> Maximum file size: 50 MB. Only Excel files
          (.xlsx, .xls) are supported.
        </div>
      </div>



      {/* ===== Table ===== */}
      <table>
        <thead>
          <tr>
            <th>Zone</th>
            <th>District</th>
            <th>Constituency</th>
            <th>Constituency Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="5">No data</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>{zones.find((z) => z.id === r.zoneid)?.name || "-"}</td>
                <td>{districts.find((d) => d.id === r.districtid)?.name || "-"}</td>
                <td>{r.name}</td>
                <td>{r.constituencyNumber}</td>
                <td>
  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
    <button
      onClick={() => {
        setEditingId(r.id);
        setName(r.name);
        setConstituencyNumber(r.constituencyNumber ?? r.number);
        setSelectedZoneId(r.zoneid);
        setSelectedDistrictId(r.districtid);
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