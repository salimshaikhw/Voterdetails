# Reports API Documentation

## Overview
This API provides comprehensive booking reports with advanced filtering capabilities and Excel export functionality. Perfect for creating administrative dashboards, analytics, and data export features in your UI.

---

## **API Endpoints**

### **Base URL:** `http://localhost:5196/api/Reports`

---

## **1. Get All Bookings (JSON Response)**

### **Endpoint:** `GET /api/Reports/AllBookings`

Returns a JSON response with booking data and filtering metadata.

### **Query Parameters (All Optional)**

| Parameter | Type | Description | Example | Notes |
|-----------|------|-------------|---------|-------|
| `zoneId` | GUID | Filter by Zone ID | `123e4567-e89b-12d3-a456-426614174000` | Hierarchical filter |
| `districtId` | GUID | Filter by District ID | `123e4567-e89b-12d3-a456-426614174001` | Under Zone |
| `constituencyNumber` | int | Filter by Constituency Number | `25` | Under District |
| `boothNumber` | int | Filter by Booth Number | `150` | Under Constituency |
| `townId` | GUID | Filter by Town ID | `123e4567-e89b-12d3-a456-426614174002` | Geographic filter |
| `centerId` | GUID | Filter by Center/CSC ID | `123e4567-e89b-12d3-a456-426614174003` | Service center |
| `karyakartaName` | string | Filter by Karyakarta Name | `"Rajesh"` | Partial match, case-insensitive |
| `karyakartaId` | GUID | Filter by Karyakarta ID | `123e4567-e89b-12d3-a456-426614174004` | Exact match |
| `timePeriod` | string | Predefined time period | `"lastweek"`, `"last2weeks"`, `"lastmonth"` | Quick date range |
| `startDate` | string | Custom start date | `"15/01/2026"` | Format: dd/MM/yyyy |
| `endDate` | string | Custom end date | `"20/01/2026"` | Format: dd/MM/yyyy |
| `status` | string | Filter by booking status | `"Confirmed"`, `"Pending"`, `"Cancelled"` | Exact match |

---

### **Response Structure**

```json
{
  "totalBookings": 150,
  "filterApplied": {
    "zone": true,
    "district": false,
    "constituency": false,
    "booth": false,
    "town": false,
    "center": false,
    "karyakarta": false,
    "timePeriod": true,
    "status": false
  },
  "dateRange": {
    "startDate": "15/01/2026",
    "endDate": "20/01/2026"
  },
  "bookings": [
    {
      "cscName": "HITESH KUMAR, S-8/668, NEAR CARE HOSPITAL, SAILI ROAD, PATHANKOT",
      "youthClubCor_Name": "Rajesh Kumar",
      "youthClubCor_Con": "9876543210",
      "familyUID": "FAM123456",
      "memberUID": "MEM789012",
      "vcardID": "ABC1234567",
      "name": "John Doe",
      "address": "",
      "age": 35,
      "gender": "Male",
      "minor": "No",
      "contactNumber": "9876543210",
      "familyHead": "Jane Doe",
      "createdAt": "15/01/2026",
      "appointmentDate": "20/01/2026",
      "status": "Confirmed",
      "zoneName": "Zone A",
      "districtName": "Patiala",
      "constituencyName": "Patiala Urban",
      "townName": "Ward 32",
      "bookingId": "guid-here",
      "acknowledgementNumber": "ACK123456"
    }
  ]
}
```

---

### **Response Fields Description**

#### **Summary Fields**

| Field | Type | Description |
|-------|------|-------------|
| `totalBookings` | int | Total number of bookings matching filters |
| `filterApplied` | object | Boolean flags indicating which filters were applied |
| `dateRange` | object | Start and end dates used for filtering |

#### **Booking Fields**

| Field | Type | Description |
|-------|------|-------------|
| `cscName` | string | Center address (not name) |
| `youthClubCor_Name` | string | Youth Club Coordinator/Karyakarta Name |
| `youthClubCor_Con` | string | Youth Club Coordinator Contact Number |
| `familyUID` | string | Family Unique Identifier |
| `memberUID` | string | Family Member Unique Identifier |
| `vcardID` | string | Voter Card ID |
| `name` | string | Family Member Name |
| `address` | string | Address (always empty string) |
| `age` | int | Age of family member |
| `gender` | string | Gender (Male/Female) |
| `minor` | string | Is Minor? (Yes/No) |
| `contactNumber` | string | Family Contact Number |
| `familyHead` | string | Family Head Name |
| `createdAt` | string | Booking Creation Date (dd/MM/yyyy) |
| `appointmentDate` | string | Appointment Date (dd/MM/yyyy) |
| `status` | string | Booking Status |
| `zoneName` | string | Zone Name |
| `districtName` | string | District Name |
| `constituencyName` | string | Constituency Name |
| `townName` | string | Town/Village/Ward Name |
| `bookingId` | GUID | Booking ID |
| `acknowledgementNumber` | string | Acknowledgement Number |

---

## **2. Download Excel Report**

### **Endpoint:** `GET /api/Reports/DownloadExcel`

Downloads an Excel file with filtered booking data.

### **Query Parameters**

**Same as AllBookings endpoint** - All filters apply identically.

### **Response Details**

- **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **File Name Format:** `Bookings_Report_YYYYMMDD_HHmmss.xlsx`
- **Example:** `Bookings_Report_20260121_143052.xlsx`

### **Excel Structure**

**22 Columns:**

1. Zone
2. District
3. Constituency Number
4. Constituency Name
5. Village/Ward Name
6. Booth No.
7. CSC Name (Center Address)
8. YouthClubCor_Name
9. YouthClubCor_Con
10. FamilyUID
11. MemberUID
12. VcardID
13. Name
14. Address (blank)
15. Age
16. Gender
17. Minor
18. ContactNumber
19. FamilyHead
20. CreatedAt
21. AppointmentDate
22. Status

**Formatting:**
- Header row with bold text and gray background
- Auto-fitted column widths
- All data properly formatted

---

## **Filter Examples & Use Cases**

### **Example 1: Last Week Bookings**
```
GET /api/Reports/AllBookings?timePeriod=lastweek
```
**Use Case:** Quick weekly report for management review

---

### **Example 2: Custom Date Range**
```
GET /api/Reports/AllBookings?startDate=01/01/2026&endDate=20/01/2026
```
**Use Case:** Monthly or quarterly reports

---

### **Example 3: Zone + District + Date Range**
```
GET /api/Reports/AllBookings?zoneId=guid&districtId=guid&startDate=01/01/2026&endDate=20/01/2026
```
**Use Case:** Regional performance analysis

---

### **Example 4: Karyakarta Performance**
```
GET /api/Reports/AllBookings?karyakartaName=Rajesh&timePeriod=lastmonth
```
**Use Case:** Individual coordinator performance tracking

---

### **Example 5: Center-Specific Report**
```
GET /api/Reports/AllBookings?centerId=guid&status=Confirmed&timePeriod=lastweek
```
**Use Case:** Center-wise booking analytics

---

### **Example 6: Status-Based Filtering**
```
GET /api/Reports/AllBookings?status=Pending&timePeriod=lastweek
```
**Use Case:** Follow-up on pending bookings

---

### **Example 7: Download Excel with Filters**
```
GET /api/Reports/DownloadExcel?zoneId=guid&timePeriod=lastmonth&status=Confirmed
```
**Use Case:** Export filtered data for offline analysis

---

## **Date Format & Time Periods**

### **Date Format**
- **Input Format:** `dd/MM/yyyy`
- **Example:** `21/01/2026`
- **Validation:** Returns `400 Bad Request` if format is invalid

### **Predefined Time Periods**

| Value | Description | Calculation |
|-------|-------------|-------------|
| `lastweek` | Last 7 days | Today - 7 days to Today |
| `last2weeks` | Last 14 days | Today - 14 days to Today |
| `lastmonth` | Last 30 days | Today - 30 days to Today |

**Note:** Custom date ranges override predefined periods if both are provided.

---

## **Hierarchical Filtering**

The system supports hierarchical geographic filtering:

```
Zone
└── District
    └── Constituency
        └── Booth
            └── Town
                └── Center
```

**Filter Behavior:**
- Filters can be combined at any level
- Lower-level filters don't require higher-level filters
- All filters use AND logic (not OR)

---

## **Error Responses**

### **Invalid Date Format (400 Bad Request)**
```json
{
  "message": "Invalid startDate format. Use dd/MM/yyyy (e.g., 15/01/2026)"
}
```

### **Server Error (500 Internal Server Error)**
```json
{
  "message": "Error retrieving bookings",
  "error": "Detailed error message"
}
```

---

## **UI Implementation Guide**

### **Recommended Page Layout**

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Booking Reports                        [Download Excel] [🔄]  │
├──────────────────────────────────────────────────────────────────┤
│  Filters:                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ Zone       │ │ District   │ │ Const.     │ │ Booth      │   │
│  │ [Select▾]  │ │ [Select▾]  │ │ [Select▾]  │ │ [Select▾]  │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │ Town       │ │ Center     │ │ Karyakarta │                  │
│  │ [Select▾]  │ │ [Select▾]  │ │ [Search...]│                  │
│  └────────────┘ └────────────┘ └────────────┘                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │ Status     │ │ Start Date │ │ End Date   │                  │
│  │ [Select▾]  │ │ [📅]       │ │ [📅]       │  [Apply Filters]│
│  └────────────┘ └────────────┘ └────────────┘                  │
│  Quick Filters: [Last Week] [Last 2 Weeks] [Last Month]        │
├──────────────────────────────────────────────────────────────────┤
│  📈 Summary: Total Bookings: 150  |  Date Range: 15/01-20/01    │
├──────────────────────────────────────────────────────────────────┤
│  Name         │ VcardID    │ Age │ Status    │ CSC              │
├───────────────┼────────────┼─────┼───────────┼──────────────────┤
│  John Doe     │ ABC123     │ 35  │ Confirmed │ HITESH KUMAR...  │
│  Jane Smith   │ XYZ789     │ 28  │ Pending   │ CSC JK COMP...   │
├──────────────────────────────────────────────────────────────────┤
│  Showing 1-50 of 150                      [<] [1] [2] [3] ... [>]│
└──────────────────────────────────────────────────────────────────┘
```

---

## **UI Component Breakdown**

### **1. Filter Panel**

**Cascading Dropdowns:**
```javascript
// Zone selection triggers district loading
const handleZoneChange = (zoneId) => {
  setSelectedZone(zoneId);
  loadDistricts(zoneId);
  // Reset child selections
  setSelectedDistrict(null);
  setSelectedConstituency(null);
};
```

**Date Picker:**
```javascript
// Date range with dd/MM/yyyy format
<DateRangePicker
  format="dd/MM/yyyy"
  startDate={startDate}
  endDate={endDate}
  onChange={handleDateChange}
/>
```

**Quick Filter Buttons:**
```javascript
const quickFilters = [
  { label: 'Last Week', value: 'lastweek' },
  { label: 'Last 2 Weeks', value: 'last2weeks' },
  { label: 'Last Month', value: 'lastmonth' }
];
```

---

### **2. Data Table**

**Required Features:**
- ✅ Sortable columns
- ✅ Searchable within results
- ✅ Pagination (50-100 rows per page)
- ✅ Column visibility toggle
- ✅ Responsive design
- ✅ Row selection (for batch operations)
- ✅ Export visible columns

**Recommended Columns for Table View:**
1. Name
2. VcardID
3. Age
4. Gender
5. Contact Number
6. Family Head
7. CSC Name (truncated)
8. Karyakarta Name
9. Appointment Date
10. Status (with color coding)
11. Actions (View Details)

---

### **3. Summary Dashboard**

**Key Metrics:**
```javascript
// Display above data table
<SummaryCards>
  <Card>
    <Label>Total Bookings</Label>
    <Value>{data.totalBookings}</Value>
  </Card>
  <Card>
    <Label>Date Range</Label>
    <Value>{dateRange.startDate} - {dateRange.endDate}</Value>
  </Card>
  <Card>
    <Label>Active Filters</Label>
    <Value>{activeFilterCount}</Value>
  </Card>
</SummaryCards>
```

---

### **4. Export Functionality**

**Download Button:**
```javascript
const handleDownloadExcel = async () => {
  // Build query string from current filters
  const queryParams = new URLSearchParams({
    ...(zoneId && { zoneId }),
    ...(districtId && { districtId }),
    ...(startDate && { startDate: format(startDate, 'dd/MM/yyyy') }),
    ...(endDate && { endDate: format(endDate, 'dd/MM/yyyy') }),
    // ... other filters
  });

  // Trigger download
  const url = `http://localhost:5196/api/Reports/DownloadExcel?${queryParams}`;
  window.open(url, '_blank');
  
  // Or use fetch with blob
  const response = await fetch(url);
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `Bookings_Report_${Date.now()}.xlsx`;
  link.click();
};
```

---

## **Complete React Implementation Example**

```typescript
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface BookingFilters {
  zoneId?: string;
  districtId?: string;
  constituencyNumber?: number;
  boothNumber?: number;
  townId?: string;
  centerId?: string;
  karyakartaName?: string;
  karyakartaId?: string;
  timePeriod?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface Booking {
  cscName: string;
  youthClubCor_Name: string;
  youthClubCor_Con: string;
  familyUID: string;
  memberUID: string;
  vcardID: string;
  name: string;
  address: string;
  age: number;
  gender: string;
  minor: string;
  contactNumber: string;
  familyHead: string;
  createdAt: string;
  appointmentDate: string;
  status: string;
  zoneName: string;
  districtName: string;
  constituencyName: string;
  townName: string;
  bookingId: string;
  acknowledgementNumber: string;
}

interface ReportResponse {
  totalBookings: number;
  filterApplied: {
    zone: boolean;
    district: boolean;
    constituency: boolean;
    booth: boolean;
    town: boolean;
    center: boolean;
    karyakarta: boolean;
    timePeriod: boolean;
    status: boolean;
  };
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  bookings: Booking[];
}

const BookingReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilters>({});
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `http://localhost:5196/api/Reports/AllBookings?${queryParams}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `http://localhost:5196/api/Reports/DownloadExcel?${queryParams}`;
    window.open(url, '_blank');
  };

  const handleQuickFilter = (period: string) => {
    setFilters({ ...filters, timePeriod: period, startDate: undefined, endDate: undefined });
  };

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => {
    fetchReport();
  };

  const handleResetFilters = () => {
    setFilters({});
    setReportData(null);
  };

  return (
    <div className="booking-reports-page">
      <header className="page-header">
        <h1>📊 Booking Reports</h1>
        <div className="actions">
          <button onClick={fetchReport} disabled={loading}>
            🔄 Refresh
          </button>
          <button onClick={handleDownloadExcel} disabled={!reportData}>
            📥 Download Excel
          </button>
        </div>
      </header>

      {/* Filter Panel */}
      <section className="filter-panel">
        <h2>Filters</h2>
        
        {/* Geographic Filters */}
        <div className="filter-row">
          <select 
            value={filters.zoneId || ''} 
            onChange={(e) => handleFilterChange('zoneId', e.target.value)}
          >
            <option value="">Select Zone</option>
            {/* Load zones from API */}
          </select>

          <select 
            value={filters.districtId || ''} 
            onChange={(e) => handleFilterChange('districtId', e.target.value)}
          >
            <option value="">Select District</option>
            {/* Load districts from API */}
          </select>

          <input
            type="number"
            placeholder="Constituency Number"
            value={filters.constituencyNumber || ''}
            onChange={(e) => handleFilterChange('constituencyNumber', parseInt(e.target.value))}
          />

          <input
            type="number"
            placeholder="Booth Number"
            value={filters.boothNumber || ''}
            onChange={(e) => handleFilterChange('boothNumber', parseInt(e.target.value))}
          />
        </div>

        {/* Other Filters */}
        <div className="filter-row">
          <input
            type="text"
            placeholder="Karyakarta Name"
            value={filters.karyakartaName || ''}
            onChange={(e) => handleFilterChange('karyakartaName', e.target.value)}
          />

          <select 
            value={filters.status || ''} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filters */}
        <div className="filter-row">
          <input
            type="text"
            placeholder="Start Date (dd/MM/yyyy)"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />

          <input
            type="text"
            placeholder="End Date (dd/MM/yyyy)"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />

          <button onClick={handleApplyFilters}>Apply Filters</button>
          <button onClick={handleResetFilters}>Reset</button>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <span>Quick Filters:</span>
          <button onClick={() => handleQuickFilter('lastweek')}>Last Week</button>
          <button onClick={() => handleQuickFilter('last2weeks')}>Last 2 Weeks</button>
          <button onClick={() => handleQuickFilter('lastmonth')}>Last Month</button>
        </div>
      </section>

      {/* Summary */}
      {reportData && (
        <section className="summary">
          <div className="summary-card">
            <label>Total Bookings</label>
            <strong>{reportData.totalBookings}</strong>
          </div>
          <div className="summary-card">
            <label>Date Range</label>
            <strong>
              {reportData.dateRange.startDate} - {reportData.dateRange.endDate}
            </strong>
          </div>
          <div className="summary-card">
            <label>Active Filters</label>
            <strong>
              {Object.values(reportData.filterApplied).filter(Boolean).length}
            </strong>
          </div>
        </section>
      )}

      {/* Data Table */}
      {loading && <div className="loading">Loading report...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      {reportData && !loading && (
        <section className="data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>VcardID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Family Head</th>
                <th>CSC Name</th>
                <th>Karyakarta</th>
                <th>Appointment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.name}</td>
                  <td>{booking.vcardID}</td>
                  <td>{booking.age}</td>
                  <td>{booking.gender}</td>
                  <td>{booking.contactNumber}</td>
                  <td>{booking.familyHead}</td>
                  <td title={booking.cscName}>
                    {booking.cscName.substring(0, 30)}...
                  </td>
                  <td>{booking.youthClubCor_Name}</td>
                  <td>{booking.appointmentDate}</td>
                  <td>
                    <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            Showing {reportData.bookings.length} of {reportData.totalBookings} bookings
          </div>
        </section>
      )}
    </div>
  );
};

export default BookingReportsPage;
```

---

## **Recommended UI Libraries**

### **Data Table**
- **TanStack Table** (formerly React Table) - Headless, flexible
- **AG Grid** - Enterprise features, Excel-like
- **MUI DataGrid** - Material Design integration

### **Date Picker**
- **react-datepicker** - Simple, customizable
- **date-fns** - Date manipulation library
- **MUI DatePicker** - Material Design date picker

### **Charts & Visualizations**
- **Chart.js + react-chartjs-2** - Simple charts
- **Recharts** - React-native charts
- **Apache ECharts** - Advanced visualizations

### **Component Libraries**
- **Material-UI (MUI)** - Comprehensive
- **Ant Design** - Enterprise-focused
- **Chakra UI** - Accessible, modern

---

## **Advanced Features to Implement**

### **1. Data Visualization Dashboard**

```javascript
// Show booking trends over time
<LineChart>
  <Line dataKey="bookings" data={bookingsByDate} />
</LineChart>

// Status distribution
<PieChart>
  <Pie data={statusDistribution} />
</PieChart>

// Top Karyakartas
<BarChart>
  <Bar dataKey="bookings" data={karyakartaPerformance} />
</BarChart>
```

### **2. Saved Filter Presets**

```javascript
// Save commonly used filters
const saveFilterPreset = (name: string, filters: BookingFilters) => {
  const presets = JSON.parse(localStorage.getItem('filterPresets') || '[]');
  presets.push({ name, filters });
  localStorage.setItem('filterPresets', JSON.stringify(presets));
};

// Load saved preset
const loadFilterPreset = (name: string) => {
  const presets = JSON.parse(localStorage.getItem('filterPresets') || '[]');
  const preset = presets.find(p => p.name === name);
  if (preset) setFilters(preset.filters);
};
```

### **3. Scheduled Reports**

```javascript
// Setup scheduled report generation
const scheduleReport = {
  frequency: 'daily' | 'weekly' | 'monthly',
  filters: BookingFilters,
  recipients: ['email@example.com'],
  format: 'excel' | 'pdf'
};
```

### **4. Bulk Actions**

```javascript
// Multi-select bookings for bulk operations
const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

const handleBulkStatusUpdate = async (newStatus: string) => {
  // Update status for all selected bookings
  await Promise.all(
    selectedBookings.map(id => updateBookingStatus(id, newStatus))
  );
};
```

### **5. Export Options**

```javascript
// Multiple export formats
const exportOptions = [
  { label: 'Excel (.xlsx)', format: 'excel', icon: '📊' },
  { label: 'CSV (.csv)', format: 'csv', icon: '📄' },
  { label: 'PDF (.pdf)', format: 'pdf', icon: '📕' },
  { label: 'JSON (.json)', format: 'json', icon: '🔧' }
];
```

---

## **Performance Optimization Tips**

### **1. Debounced Search**
```javascript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => {
    handleFilterChange('karyakartaName', value);
  },
  300
);
```

### **2. Pagination**
```javascript
// Client-side pagination for large datasets
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 50;
const paginatedData = reportData?.bookings.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
```

### **3. Memoization**
```javascript
import { useMemo } from 'react';

const filteredBookings = useMemo(() => {
  return reportData?.bookings.filter(/* filter logic */);
}, [reportData, localFilters]);
```

### **4. Virtual Scrolling**
```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={bookings.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{renderBookingRow(bookings[index])}</div>
  )}
</FixedSizeList>
```

---

## **Testing the API**

### **Using cURL**

**Get Bookings:**
```bash
curl -X GET "http://localhost:5196/api/Reports/AllBookings?timePeriod=lastweek"
```

**Download Excel:**
```bash
curl -X GET "http://localhost:5196/api/Reports/DownloadExcel?timePeriod=lastweek" \
  -o bookings_report.xlsx
```

### **Using Postman**

1. **Method:** GET
2. **URL:** `http://localhost:5196/api/Reports/AllBookings`
3. **Params Tab:**
   - Add key-value pairs for each filter
   - Example: `timePeriod` = `lastweek`
4. **Send** button to execute

### **Using Browser DevTools**

```javascript
// Test in browser console
fetch('http://localhost:5196/api/Reports/AllBookings?timePeriod=lastweek')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## **Common Integration Patterns**

### **State Management (Redux Toolkit)**

```typescript
// reportSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReport = createAsyncThunk(
  'reports/fetch',
  async (filters: BookingFilters) => {
    const queryParams = new URLSearchParams(filters as any);
    const response = await fetch(
      `http://localhost:5196/api/Reports/AllBookings?${queryParams}`
    );
    return response.json();
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default reportSlice.reducer;
```

### **React Query / TanStack Query**

```typescript
import { useQuery } from '@tanstack/react-query';

const useBookingReport = (filters: BookingFilters) => {
  return useQuery({
    queryKey: ['bookingReport', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams(filters as any);
      const response = await fetch(
        `http://localhost:5196/api/Reports/AllBookings?${queryParams}`
      );
      if (!response.ok) throw new Error('Failed to fetch report');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Usage in component
const { data, isLoading, error, refetch } = useBookingReport(filters);
```

---

## **Security Considerations**

### **CORS Configuration**

The API allows requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5174`

**Update for production:**
```csharp
// Add your production domain to appsettings.json
"AllowedOrigins": [
  "https://your-production-domain.com"
]
```

### **Rate Limiting** (Recommended)

```javascript
// Implement client-side request throttling
const throttledFetch = throttle(fetchReport, 1000);
```

### **Input Validation**

```javascript
// Validate date format before sending
const isValidDate = (dateStr: string) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateStr);
};

if (startDate && !isValidDate(startDate)) {
  setError('Invalid date format. Use dd/MM/yyyy');
  return;
}
```

---

## **Troubleshooting**

### **Issue: Invalid Date Format Error**

**Solution:** Ensure dates are in `dd/MM/yyyy` format
```javascript
// Correct format
startDate: "21/01/2026"

// Incorrect format
startDate: "2026-01-21"  // Wrong!
startDate: "01/21/2026"  // Wrong!
```

### **Issue: No Data Returned**

**Check:**
1. Verify filters are not too restrictive
2. Check database has data for selected date range
3. Inspect browser network tab for API errors
4. Verify CORS configuration

### **Issue: Excel Download Not Working**

**Solution:**
```javascript
// Ensure proper content-type handling
const handleDownload = async () => {
  const response = await fetch(url);
  const blob = await response.blob();
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
```

---

## **Related Endpoints**

Complete your integration with these related endpoints:

- `GET /api/Zones` - Get all zones for dropdown
- `GET /api/Districts` - Get all districts for dropdown
- `GET /api/Constituencies` - Get all constituencies for dropdown
- `GET /api/Booths` - Get all booths for dropdown
- `GET /api/Towns` - Get all towns for dropdown
- `GET /api/Centers` - Get all centers for dropdown
- `GET /api/Centers/with-town-mapping` - Get center-town mappings
- `GET /api/Karyakarta` - Get all karyakartas for dropdown

---

## **API Changelog**

### **Version 1.0** (Current)
- Initial release with comprehensive filtering
- Excel export with ClosedXML (MIT license)
- LEFT JOIN for Karyakarta (handles missing data)
- CSC Name shows center address
- Date format: dd/MM/yyyy

---

**Last Updated:** January 21, 2026  
**API Version:** 1.0  
**Base URL:** `http://localhost:5196/api/Reports`

---

## **Support & Contact**

For technical support:
- Review application logs for errors
- Check database connectivity
- Verify CORS configuration matches your frontend URL
- Ensure all required filter data is properly formatted

**Happy Reporting! 📊**
