import { useEffect, useState } from "react";
import { 
  getAllBookings, 
  downloadExcelReport,
  getZones,
  getDistricts,
  getConstituencies,
  getBooths,
  getTowns,
  getCenters
} from "../../services/api";

export default function ReportTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [showFilters, setShowFilters] = useState(false); // Accordion state
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(1);

  // Master data
  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [booths, setBooths] = useState([]);
  const [towns, setTowns] = useState([]);
  const [centers, setCenters] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    zoneId: "",
    districtId: "",
    constituencyNumber: "",
    boothNumber: "",
    townId: "",
    centerId: "",
    karyakartaName: "",
    timePeriod: "",
    startDate: "",
    endDate: "",
    status: ""
  });

  /* ======================
     LOAD MASTER DATA
  ====================== */
  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const [zoneRes, districtRes, constituencyRes, boothRes, townRes, centerRes] = 
        await Promise.all([
          getZones(),
          getDistricts(),
          getConstituencies(),
          getBooths(),
          getTowns(),
          getCenters()
        ]);

      setZones(zoneRes.data || []);
      setDistricts(districtRes.data || []);
      setConstituencies(constituencyRes.data || []);
      setBooths(boothRes.data || []);
      setTowns(townRes.data || []);
      setCenters(centerRes.data || []);
    } catch (err) {
      console.error("Failed to load master data", err);
    }
  };

  /* ======================
     LOAD BOOKINGS DATA
  ====================== */
  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBookings({
        ...filters,
        page: currentPage,
        pageSize: pageSize
      });
      const data = response.data;
      
      setTotalBookings(data.totalBookings || 0);
      setDateRange(data.dateRange || { startDate: "", endDate: "" });
      setTotalPages(Math.ceil((data.totalBookings || 0) / pageSize));
      
      if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [currentPage, pageSize]);

  /* ======================
     FILTER HANDLERS
  ====================== */
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    loadBookings();
  };

  const handleClearFilters = () => {
    setFilters({
      zoneId: "",
      districtId: "",
      constituencyNumber: "",
      boothNumber: "",
      townId: "",
      centerId: "",
      karyakartaName: "",
      timePeriod: "",
      startDate: "",
      endDate: "",
      status: ""
    });
    setCurrentPage(1);
  };

  const handleQuickFilter = (period) => {
    setFilters(prev => ({ 
      ...prev, 
      timePeriod: period,
      startDate: "",
      endDate: ""
    }));
    setCurrentPage(1);
  };

  /* ======================
     PAGINATION HANDLERS
  ====================== */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  /* ======================
     EXCEL DOWNLOAD
  ====================== */
  const handleDownloadExcel = async () => {
    try {
      const response = await downloadExcelReport(filters);
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `Bookings_Report_${timestamp}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download Excel", err);
      alert("Failed to download Excel report");
    }
  };

  // Filter helper functions
  const filteredDistricts = filters.zoneId 
    ? districts.filter(d => d.zoneid === filters.zoneId)
    : districts;

  const filteredConstituencies = filters.districtId
    ? constituencies.filter(c => c.districtid === filters.districtId)
    : constituencies;

  /* ======================
     UI
  ====================== */
  return (
    <div className="card" style={{ width: "100%", maxWidth: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>📊 Booking Reports</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{ 
              background: showFilters ? "#6c757d" : "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>{showFilters ? "▲" : "▼"}</span> Filters
          </button>
          <button onClick={handleDownloadExcel} style={{ background: "#28a745" }}>
            📥 Download Excel
          </button>
          <button onClick={loadBookings} disabled={loading}>
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* ACCORDION FILTERS SECTION */}
      {showFilters && (
        <div style={{ 
          border: "2px solid #e5e7eb", 
          padding: "20px", 
          borderRadius: "12px",
          marginBottom: "20px",
          background: "#f8fafc",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          animation: "slideDown 0.3s ease-out"
        }}>
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px", color: "#1e40af" }}>Filter Options</h3>
          
          {/* Row 1: Zone, District, Constituency, Booth, Town, Center */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Zone</label>
              <select 
                value={filters.zoneId} 
                onChange={(e) => handleFilterChange("zoneId", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              >
                <option value="">All Zones</option>
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>District</label>
              <select 
                value={filters.districtId} 
                onChange={(e) => handleFilterChange("districtId", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              >
                <option value="">All Districts</option>
                {filteredDistricts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Constituency</label>
              <select 
                value={filters.constituencyNumber} 
                onChange={(e) => handleFilterChange("constituencyNumber", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              >
                <option value="">All Constituencies</option>
                {filteredConstituencies.map(c => (
                  <option key={c.number} value={c.number}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Booth #</label>
              <input 
                type="number"
                placeholder="Booth #"
                value={filters.boothNumber} 
                onChange={(e) => handleFilterChange("boothNumber", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Town</label>
              <select 
                value={filters.townId} 
                onChange={(e) => handleFilterChange("townId", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              >
                <option value="">All Towns</option>
                {towns.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Center</label>
              <select 
                value={filters.centerId} 
                onChange={(e) => handleFilterChange("centerId", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              >
                <option value="">All Centers</option>
                {centers.map(c => (
                  <option key={c.id} value={c.id}>{c.centerAddress || c.address || c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Karyakarta, Status, Start Date, End Date, Apply Button */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Karyakarta Name</label>
              <input 
                type="text"
                placeholder="Search karyakarta..."
                value={filters.karyakartaName} 
                onChange={(e) => handleFilterChange("karyakartaName", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange("status", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              >
                <option value="">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>Start Date</label>
              <input 
                type="text"
                placeholder="15/01/2026"
                value={filters.startDate} 
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", fontWeight: "600", color: "#64748b" }}>End Date</label>
              <input 
                type="text"
                placeholder="20/01/2026"
                value={filters.endDate} 
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "13px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button 
                onClick={handleApplyFilters} 
                style={{ 
                  width: "100%",
                  padding: "8px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            alignItems: "center",
            padding: "12px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b" }}>Quick:</span>
            <button 
              onClick={() => handleQuickFilter("lastweek")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              Last Week
            </button>
            <button 
              onClick={() => handleQuickFilter("last2weeks")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              Last 2 Weeks
            </button>
            <button 
              onClick={() => handleQuickFilter("lastmonth")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              Last Month
            </button>
            <button 
              onClick={handleClearFilters}
              style={{ padding: "6px 12px", fontSize: "12px", background: "#6c757d" }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY */}
      <div style={{ 
        padding: "12px 16px", 
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", 
        borderRadius: "8px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e5e7eb"
      }}>
        <div>
          <strong style={{ fontSize: "15px", color: "#1e40af" }}>📈 Total Bookings: {totalBookings.toLocaleString()}</strong>
          <span style={{ marginLeft: "20px", fontSize: "13px", color: "#64748b" }}>
            Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalBookings)} of {totalBookings.toLocaleString()}
          </span>
        </div>
        {dateRange.startDate && dateRange.endDate && (
          <div style={{ fontSize: "13px" }}>
            <strong>Date Range:</strong> {dateRange.startDate} - {dateRange.endDate}
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px", padding: "10px", background: "#fee" }}>
          {error}
        </div>
      )}

      {/* BOOKINGS TABLE */}
      {loading ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          padding: "60px 20px",
          background: "#f9f9f9",
          borderRadius: "8px"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ 
            marginTop: "20px", 
            fontSize: "16px", 
            color: "#666",
            fontWeight: "500"
          }}>
            Loading bookings data...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Vcard ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Family Head</th>
                <th>CSC</th>
                <th>YouthClubCor_Name</th>
                <th>YouthClubCor_ContactNumber</th>
                <th>Zone</th>
                <th>District</th>
                <th>Constituency</th>
                <th>Town</th>
                <th>Created At</th>
                <th>Appointment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(bookings) || bookings.length === 0 ? (
                <tr>
                  <td colSpan="16" style={{ textAlign: "center" }}>No bookings found</td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr key={booking.bookingId || index}>
                    <td>{booking.name}</td>
                    <td>{booking.vcardID}</td>
                    <td>{booking.age}</td>
                    <td>{booking.gender}</td>
                    <td>{booking.contactNumber}</td>
                    <td>{booking.familyHead}</td>
                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {booking.cscName}
                    </td>
                    <td>{booking.youthClubCor_Name}</td>
                    <td>{booking.youthClubCor_Con}</td>
                    <td>{booking.zoneName}</td>
                    <td>{booking.districtName}</td>
                    <td>{booking.constituencyName}</td>
                    <td>{booking.townName}</td>
                    <td>{booking.createdAt}</td>
                    <td>{booking.appointmentDate}</td>
                    <td>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        background: booking.status === "Confirmed" ? "#d4edda" : 
                                   booking.status === "Pending" ? "#fff3cd" : "#f8d7da",
                        color: booking.status === "Confirmed" ? "#155724" : 
                               booking.status === "Pending" ? "#856404" : "#721c24"
                      }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!loading && Array.isArray(bookings) && bookings.length > 0 && (
        <div style={{ 
          marginTop: "20px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "15px",
          background: "#f9f9f9",
          borderRadius: "5px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>Rows per page:</label>
            <select 
              value={pageSize} 
              onChange={(e) => handlePageSizeChange(e.target.value)}
              style={{ padding: "5px" }}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={{ padding: "5px 10px" }}
            >
              ⏮️ First
            </button>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: "5px 10px" }}
            >
              ◀️ Prev
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{
                  padding: "5px 12px",
                  background: currentPage === pageNum ? "#007bff" : "#fff",
                  color: currentPage === pageNum ? "#fff" : "#000",
                  border: "1px solid #ddd",
                  fontWeight: currentPage === pageNum ? "bold" : "normal"
                }}
              >
                {pageNum}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: "5px 10px" }}
            >
              Next ▶️
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{ padding: "5px 10px" }}
            >
              Last ⏭️
            </button>

            <span style={{ marginLeft: "15px", fontSize: "14px" }}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
