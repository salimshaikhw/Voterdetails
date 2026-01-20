import { useState, useEffect } from "react";
import { getFamilyBookingsWithMembersAndBookings } from "../../services/api";

export default function FamilyBookingTab() {
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getFamilyBookingsWithMembersAndBookings();

        const raw = Array.isArray(res.data) ? res.data : [];

        const cleaned = raw.map((f, index) => {
          const members = Array.isArray(f.familyMembers)
            ? f.familyMembers.map(m => ({
                familyMemberId: m.id || m.familymemberuid,
                name: m.name || "-",
                vCardId: m.voterid || "-",
                age: m.age ?? "-",
                gender: m.gender || "-",
                contactNumber: m.contactnumber || "-",
                serialNumber: m.serialnumber ?? "-",
                isFamilyHead: m.isfamilyhead || false,
                isMinor: m.isminor || false,
                bookingDetails: m.bookingDetails || {}
              }))
            : [];

          const booking = members[0]?.bookingDetails || {};

          return {
            familyBookingId: booking.bookingId || f.id || `tmp-${index}`,
            familyId: f.familyuid || "-",

            constituencyName: f.constituencyName || "Unknown",
            constituencyNumber: f.constituencyNumber ?? "-",
            partNumber: f.partNumber ?? "-",

            centerName: f.centerName || "Unknown",
            centerAddress: f.centerAddress || "-",

            town: f.townName || "-",

            slotTypeName: booking.slotTypeName || "-",
            appointmentDate: booking.appointmentdate || null,
            bookingTime: booking.bookingdate || null,

            karyakartaName: f.karyakartaName || "-",
            karyakartaContactNumber: f.karyakartaContactNumber || "-",

            members,
            familyMembers: members,
          };
        });

        if (mounted) setBookings(cleaned);
      } catch (err) {
        console.error("Failed to load family bookings", err);
        if (mounted) setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const [filterConstituency, setFilterConstituency] = useState("");
  const [filterPartNumber, setFilterPartNumber] = useState("");
  const [filterCenter, setFilterCenter] = useState("");

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFamilyHead = (members) => {
    if (!Array.isArray(members) || members.length === 0) {
      return {
        name: "Unknown",
        vCardId: "-",
        contactNumber: "-",
        age: "-",
        gender: "-",
        serialNumber: "-",
        isFamilyHead: false,
      };
    }

    return members.find((m) => m.isFamilyHead) || members[0];
  };

  const constituencies = [
    ...new Set(bookings.map((b) => b.constituencyName).filter(Boolean)),
  ];

  const partNumbers = [
    ...new Set(bookings.map((b) => b.partNumber).filter((p) => p !== "-")),
  ].sort((a, b) => a - b);

  const centers = [
    ...new Set(bookings.map((b) => b.centerName).filter(Boolean)),
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchConstituency =
      !filterConstituency ||
      booking.constituencyName === filterConstituency;

    const matchPartNumber =
      !filterPartNumber ||
      Number(booking.partNumber) === Number(filterPartNumber);

    const matchCenter =
      !filterCenter || booking.centerName === filterCenter;

    return matchConstituency && matchPartNumber && matchCenter;
  });

  return (
    <div className="card">
      <h2>Family Bookings</h2>

      {/* Filter Section */}
      <div style={{
        marginTop: "20px",
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
        border: "1px solid #dee2e6"
      }}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>🔍 Filters</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
              Constituency
            </label>
            <select
              value={filterConstituency}
              onChange={(e) => setFilterConstituency(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            >
              <option value="">All Constituencies</option>
              {constituencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
              Part Number
            </label>
            <select
              value={filterPartNumber}
              onChange={(e) => setFilterPartNumber(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            >
              <option value="">All Part Numbers</option>
              {partNumbers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
              Center
            </label>
            <select
              value={filterCenter}
              onChange={(e) => setFilterCenter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            >
              <option value="">All Centers</option>
              {centers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "0", minWidth: "120px", display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setFilterConstituency("");
                setFilterPartNumber("");
                setFilterCenter("");
              }}
              style={{
                width: "100%",
                padding: "8px 15px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#6c757d",
                color: "white",
                cursor: "pointer"
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          {loading ? "Loading bookings..." : `Showing ${filteredBookings.length} of ${bookings.length} bookings`}
          {error && <span style={{ color: 'red', marginLeft: 8 }}>Error: {error}</span>}
        </div>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        {filteredBookings.map((booking) => {
          const familyHead = getFamilyHead(booking.familyMembers);
          const isExpanded = expandedAccordion === booking.familyBookingId;

          return (
            <div 
              key={booking.familyBookingId}
              style={{
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleAccordion(booking.familyBookingId)}
                style={{
                  padding: "15px 20px",
                  backgroundColor: isExpanded ? "#007bff" : "#f8f9fa",
                  color: isExpanded ? "white" : "#333",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  userSelect: "none",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, flexWrap: "wrap" }}>
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {familyHead.name}
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>
                    VCard: {familyHead.vCardId}
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>
                    Mobile: {familyHead.contactNumber}
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>
                    Constituency: {booking.constituencyName}
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>
                    Part: {booking.partNumber}
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>
                    Center: {booking.centerName}
                  </div>
                </div>
                <div style={{ 
                  fontSize: "24px", 
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}>
                  ▼
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div style={{ padding: "20px", backgroundColor: "white" }}>
                  
                  {/* Section 1: Family Head & Constituency Information */}
                  <div style={{
                    marginBottom: "25px",
                    padding: "15px",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "6px",
                    border: "1px solid #bee5eb"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "16px",
                      color: "#0056b3",
                      borderBottom: "2px solid #007bff",
                      paddingBottom: "8px"
                    }}>
                      👤 Family Head & Constituency Details
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <strong>Name:</strong> {familyHead.name}
                      </div>
                      <div>
                        <strong>VCard ID:</strong> {familyHead.vCardId}
                      </div>
                      <div>
                        <strong>Age:</strong> {familyHead.age} years
                      </div>
                      <div>
                        <strong>Gender:</strong> {familyHead.gender}
                      </div>
                      <div>
                        <strong>Contact:</strong> {familyHead.contactNumber}
                      </div>
                      <div>
                        <strong>Serial No:</strong> {familyHead.serialNumber}
                      </div>
                      <div>
                        <strong>Constituency:</strong> {booking.constituencyName}
                      </div>
                      <div>
                        <strong>Constituency No:</strong> {booking.constituencyNumber}
                      </div>
                      <div>
                        <strong>Part Number:</strong> {booking.partNumber}
                      </div>
                      <div>
                        <strong>Town:</strong> {booking.town || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: All Family Members */}
                  <div style={{
                    marginBottom: "25px",
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "16px",
                      color: "#495057",
                      borderBottom: "2px solid #6c757d",
                      paddingBottom: "8px"
                    }}>
                      👨‍👩‍👧‍👦 Family Members ({booking.members.length})
                    </h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ 
                        width: "100%", 
                        borderCollapse: "collapse",
                        fontSize: "14px"
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: "#e9ecef" }}>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>S.No</th>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>Name</th>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>VCard ID</th>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>Age</th>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>Gender</th>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>Contact</th>
                            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #dee2e6" }}>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {booking.members.map((member, index) => (
                            <tr key={member.familyMemberId} style={{ 
                              backgroundColor: member.isFamilyHead ? "#d1ecf1" : "white"
                            }}>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.serialNumber}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.name} {member.isFamilyHead && "👑"}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.vCardId}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.age} {member.isMinor && "(Minor)"}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.gender}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.contactNumber}
                              </td>
                              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                                {member.isFamilyHead ? "Family Head" : "Member"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 3: Booking Details */}
                  <div style={{
                    marginBottom: "25px",
                    padding: "15px",
                    backgroundColor: "#d4edda",
                    borderRadius: "6px",
                    border: "1px solid #28a745"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "16px",
                      color: "#155724",
                      borderBottom: "2px solid #28a745",
                      paddingBottom: "8px"
                    }}>
                      📅 Booking Details
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <strong>Booking ID:</strong> {booking.familyBookingId}
                      </div>
                      <div>
                        <strong>Family ID:</strong> {booking.familyId}
                      </div>
                      <div>
                        <strong>Center Name:</strong> {booking.centerName}
                      </div>
                      <div>
                        <strong>Center Address:</strong> {booking.centerAddress}
                      </div>
                      <div>
                        <strong>Slot Type:</strong> {booking.slotTypeName}
                      </div>
                      <div>
                        <strong>Appointment Date:</strong> {booking.appointmentDate || "-"}
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <strong>Booking Time:</strong> {formatDate(booking.bookingTime)}
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Karyakarta Details */}
                  <div style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    borderRadius: "6px",
                    border: "1px solid #ffc107"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "16px",
                      color: "#856404",
                      borderBottom: "2px solid #ffc107",
                      paddingBottom: "8px"
                    }}>
                      👷 Karyakarta Details
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <strong>Name:</strong> {booking.karyakartaName}
                      </div>
                      <div>
                        <strong>Contact Number:</strong> {booking.karyakartaContactNumber}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          color: "#666",
          fontSize: "16px"
        }}>
          No bookings found
        </div>
      )}
    </div>
  );
}