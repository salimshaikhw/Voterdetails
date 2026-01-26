# Holiday API Documentation

## Overview
The Holiday API manages holidays in the booking system. Holidays can be defined at different levels:
- **Global**: Affects all centers, towns, and slots
- **Center-specific**: Affects a specific center (CSC)
- **Town-specific**: Affects a specific town
- **Slot-specific**: Affects a specific time slot
- **Constituency-specific**: Affects a specific constituency

**Base URL:** `/api/Holidays`

---

## Data Models

### HolidayDto (Response)
```json
{
  "id": 1,
  "cscid": "123e4567-e89b-12d3-a456-426614174000",
  "townid": null,
  "constituencynumber": null,
  "slotid": null,
  "holidaydate": "2026-01-26",
  "description": "Republic Day",
  "isglobal": true,
  "holidayType": "Global"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier for the holiday |
| `cscid` | GUID (nullable) | Center ID (for center-specific holidays) |
| `townid` | GUID (nullable) | Town ID (for town-specific holidays) |
| `constituencynumber` | integer (nullable) | Constituency number |
| `slotid` | integer (nullable) | Slot ID (for slot-specific holidays) |
| `holidaydate` | DateOnly | Date of the holiday (format: "YYYY-MM-DD") |
| `description` | string | Description of the holiday |
| `isglobal` | boolean | True if this is a global holiday |
| `holidayType` | string | Type: "Global", "Center", "Town", "Slot", or "Constituency" |

### CreateHolidayDto (Request)
```json
{
  "cscid": null,
  "townid": null,
  "constituencynumber": null,
  "slotid": null,
  "holidaydate": "2026-01-26",
  "description": "Republic Day",
  "isglobal": true
}
```

### UpdateHolidayDto (Request)
Same structure as CreateHolidayDto.

---

## Endpoints

### 1. Get All Holidays

Retrieves all holidays in the system regardless of type.

**Endpoint:** `GET /api/Holidays`

**Request:**
```http
GET /api/Holidays HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-01-26",
    "description": "Republic Day",
    "isglobal": true,
    "holidayType": "Global"
  },
  {
    "id": 2,
    "cscid": "123e4567-e89b-12d3-a456-426614174000",
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-02-15",
    "description": "Center Maintenance",
    "isglobal": false,
    "holidayType": "Center"
  },
  {
    "id": 3,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": 1,
    "holidaydate": "2026-03-10",
    "description": "Morning Slot Closed",
    "isglobal": false,
    "holidayType": "Slot"
  }
]
```

**UI Implementation Notes:**
- Display in a calendar view or table format
- Color-code by holiday type:
  - Global: Red
  - Center: Orange
  - Town: Blue
  - Slot: Purple
  - Constituency: Green
- Show filters to view by type
- Sort by date (ascending)

---

### 2. Get Global Holidays

Retrieves all holidays that apply globally to all centers, towns, and slots.

**Endpoint:** `GET /api/Holidays/global`

**Request:**
```http
GET /api/Holidays/global HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-01-26",
    "description": "Republic Day",
    "isglobal": true,
    "holidayType": "Global"
  },
  {
    "id": 4,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-08-15",
    "description": "Independence Day",
    "isglobal": true,
    "holidayType": "Global"
  }
]
```

**UI Implementation Notes:**
- Use for displaying national/state holidays
- Show prominently in booking calendar
- Consider auto-blocking these dates in booking forms

---

### 3. Get Center-Specific Holidays

Retrieves holidays for a specific center, including global holidays.

**Endpoint:** `GET /api/Holidays/center/{cscId}`

**Request:**
```http
GET /api/Holidays/center/123e4567-e89b-12d3-a456-426614174000 HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-01-26",
    "description": "Republic Day",
    "isglobal": true,
    "holidayType": "Global"
  },
  {
    "id": 2,
    "cscid": "123e4567-e89b-12d3-a456-426614174000",
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-02-15",
    "description": "Center Maintenance",
    "isglobal": false,
    "holidayType": "Center"
  },
  {
    "id": 5,
    "cscid": "123e4567-e89b-12d3-a456-426614174000",
    "townid": null,
    "constituencynumber": null,
    "slotid": 1,
    "holidaydate": "2026-03-20",
    "description": "Morning Slot Maintenance",
    "isglobal": false,
    "holidayType": "Slot"
  }
]
```

**UI Implementation Notes:**
- Use when showing center-specific booking calendar
- Automatically includes global holidays
- Show which holidays are global vs center-specific
- Use when validating if a center is open on a specific date

---

### 4. Get Town-Specific Holidays

Retrieves holidays for a specific town, including global holidays.

**Endpoint:** `GET /api/Holidays/town/{townId}`

**Request:**
```http
GET /api/Holidays/town/456e7890-e89b-12d3-a456-426614174111 HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-01-26",
    "description": "Republic Day",
    "isglobal": true,
    "holidayType": "Global"
  },
  {
    "id": 6,
    "cscid": null,
    "townid": "456e7890-e89b-12d3-a456-426614174111",
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-04-10",
    "description": "Local Festival",
    "isglobal": false,
    "holidayType": "Town"
  }
]
```

**UI Implementation Notes:**
- Use when showing town-specific availability
- Filter booking dates based on town holidays

---

### 5. Get Slot-Specific Holidays

Retrieves holidays for a specific time slot, including global holidays.

**Endpoint:** `GET /api/Holidays/slot/{slotId}`

**Request:**
```http
GET /api/Holidays/slot/1 HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-01-26",
    "description": "Republic Day",
    "isglobal": true,
    "holidayType": "Global"
  },
  {
    "id": 3,
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": 1,
    "holidaydate": "2026-03-10",
    "description": "Morning Slot Closed",
    "isglobal": false,
    "holidayType": "Slot"
  }
]
```

**UI Implementation Notes:**
- Use when showing which slots are available on a specific date
- If a date is a slot holiday, don't show that slot as available
- Show why a slot is unavailable (e.g., "Morning slot closed for maintenance")

---

### 6. Check If Date Is Holiday

Checks if a specific date is a holiday for a given context (center, town, or slot).

**Endpoint:** `GET /api/Holidays/check`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | DateOnly | Yes | Date to check (format: "YYYY-MM-DD") |
| `cscId` | GUID | No | Center ID to check |
| `townId` | GUID | No | Town ID to check |
| `slotId` | integer | No | Slot ID to check |

**Request Examples:**

Check if date is a global holiday:
```http
GET /api/Holidays/check?date=2026-01-26 HTTP/1.1
Host: your-api-domain.com
```

Check if date is a holiday for specific center:
```http
GET /api/Holidays/check?date=2026-02-15&cscId=123e4567-e89b-12d3-a456-426614174000 HTTP/1.1
Host: your-api-domain.com
```

Check if date is a holiday for specific slot:
```http
GET /api/Holidays/check?date=2026-03-10&slotId=1 HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK) - Is Holiday:**
```json
{
  "isHoliday": true,
  "type": "Global"
}
```

**Response (200 OK) - Not Holiday:**
```json
{
  "isHoliday": false,
  "type": null
}
```

**Holiday Type Values:**
- `"Global"` - Global holiday
- `"Center"` - Center-specific holiday
- `"Town"` - Town-specific holiday
- `"Slot"` - Slot-specific holiday

**UI Implementation Notes:**
- Use this for quick validation before allowing booking
- Call this when user selects a date in booking form
- Show appropriate message: "This date is a {type} holiday: {description}"
- Disable booking button if it's a holiday
- Consider pre-loading holidays for current month to reduce API calls

**Example Implementation:**
```javascript
async function checkHolidayBeforeBooking(date, centerId, slotId) {
  const params = new URLSearchParams({
    date: date,
    cscId: centerId,
    slotId: slotId
  });
  
  const response = await fetch(`/api/Holidays/check?${params}`);
  const result = await response.json();
  
  if (result.isHoliday) {
    alert(`Cannot book on this date. It is a ${result.type} holiday.`);
    return false;
  }
  
  return true;
}
```

---

### 7. Get Holiday by ID

Retrieves a specific holiday by its ID.

**Endpoint:** `GET /api/Holidays/{id}`

**Request:**
```http
GET /api/Holidays/1 HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
{
  "id": 1,
  "cscid": null,
  "townid": null,
  "constituencynumber": null,
  "slotid": null,
  "holidaydate": "2026-01-26",
  "description": "Republic Day",
  "isglobal": true,
  "holidayType": "Global"
}
```

**Response (404 Not Found):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Holiday with ID 1 not found",
  "traceId": "00-xxxxx"
}
```

**UI Implementation Notes:**
- Use for loading holiday details in edit form
- Display full holiday information in a details view

---

### 8. Create Holiday

Creates a new holiday.

**Endpoint:** `POST /api/Holidays`

**Request:**
```http
POST /api/Holidays HTTP/1.1
Host: your-api-domain.com
Content-Type: application/json

{
  "cscid": null,
  "townid": null,
  "constituencynumber": null,
  "slotid": null,
  "holidaydate": "2026-12-25",
  "description": "Christmas",
  "isglobal": true
}
```

**Response (201 Created):**
```json
{
  "id": 10,
  "cscid": null,
  "townid": null,
  "constituencynumber": null,
  "slotid": null,
  "holidaydate": "2026-12-25",
  "description": "Christmas",
  "isglobal": true,
  "holidayType": "Global"
}
```

**Response Headers:**
```
Location: /api/Holidays/10
```

**Validation Errors (400 Bad Request):**

When trying to create a global holiday with specific IDs:
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Global holidays cannot have center, town, or slot specific IDs"
}
```

**UI Implementation Notes:**

Create form should have:
1. **Holiday Type Selector:**
   - Radio buttons or dropdown: Global, Center, Town, Slot, Constituency
   
2. **Conditional Fields (based on type):**
   - If Global: No additional fields needed
   - If Center: Show center dropdown
   - If Town: Show town dropdown
   - If Slot: Show slot dropdown
   - If Constituency: Show constituency number input

3. **Common Fields:**
   - Date picker (required)
   - Description text input (required)

4. **Validation Rules:**
   - If `isglobal` is true, `cscid`, `townid`, `slotid` must all be null
   - If `isglobal` is false, at least one of the specific IDs should be provided

**Example Form:**
```
┌─────────────────────────────────────────┐
│ Add Holiday                        [×]  │
├─────────────────────────────────────────┤
│                                         │
│ Holiday Type *                          │
│ ○ Global                                │
│ ● Center                                │
│ ○ Town                                  │
│ ○ Slot                                  │
│ ○ Constituency                          │
│                                         │
│ Select Center *                         │
│ ┌─────────────────────────────────────┐ │
│ │ Downtown Center          ▼          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Date *                                  │
│ ┌─────────────────────────────────────┐ │
│ │ 2026-02-15             📅           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Description *                           │
│ ┌─────────────────────────────────────┐ │
│ │ Center Maintenance                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Cancel]      [Add Holiday]    │
│                                         │
└─────────────────────────────────────────┘
```

---

### 9. Update Holiday

Updates an existing holiday.

**Endpoint:** `PUT /api/Holidays/{id}`

**Request:**
```http
PUT /api/Holidays/1 HTTP/1.1
Host: your-api-domain.com
Content-Type: application/json

{
  "cscid": null,
  "townid": null,
  "constituencynumber": null,
  "slotid": null,
  "holidaydate": "2026-01-26",
  "description": "Republic Day (Updated)",
  "isglobal": true
}
```

**Response (204 No Content):**
- Empty response body on success

**Response (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Global holidays cannot have center, town, or slot specific IDs"
}
```

**Response (404 Not Found):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Holiday with ID 1 not found",
  "traceId": "00-xxxxx"
}
```

**UI Implementation Notes:**
- Use same form as create, but pre-populate with existing data
- Allow changing holiday type (with warnings if it affects existing bookings)
- Show save button instead of create button
- Refresh holiday list after successful update

---

### 10. Delete Holiday

Deletes a holiday.

**Endpoint:** `DELETE /api/Holidays/{id}`

**Request:**
```http
DELETE /api/Holidays/1 HTTP/1.1
Host: your-api-domain.com
```

**Response (204 No Content):**
- Empty response body on success

**Response (404 Not Found):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Holiday with ID 1 not found",
  "traceId": "00-xxxxx"
}
```

**UI Implementation Notes:**
- Show confirmation dialog before deletion
- Warning: "Are you sure you want to delete this holiday? This may affect booking availability."
- Remove from list after successful deletion
- Consider warning if deleting might affect existing bookings

---

## Complete UI Example Flow

### Holiday Calendar View

```
┌─────────────────────────────────────────────────────────────┐
│ Holiday Management                      [+ Add Holiday]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Filter: [All ▼]  [2026 ▼]                                  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │                   January 2026                         │ │
│ │  Sun  Mon  Tue  Wed  Thu  Fri  Sat                     │ │
│ │                        1    2    3                      │ │
│ │   4    5    6    7    8    9   10                      │ │
│ │  11   12   13   14   15   16   17                      │ │
│ │  18   19   20   21   22   23   24                      │ │
│ │  25  [26]  27   28   29   30   31                      │ │
│ │       🔴                                                │ │
│ │   Republic Day (Global)                                │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ Upcoming Holidays                                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 🔴 Jan 26 - Republic Day                        Global │ │
│ │                                    [Edit]     [Delete] │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 🟠 Feb 15 - Center Maintenance          Downtown Center│ │
│ │                                    [Edit]     [Delete] │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 🟣 Mar 10 - Morning Slot Closed         Morning Slot   │ │
│ │                                    [Edit]     [Delete] │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Holiday Types Legend
- 🔴 Global Holiday
- 🟠 Center Holiday
- 🔵 Town Holiday
- 🟣 Slot Holiday
- 🟢 Constituency Holiday

---

## Date Format Handling

### Frontend to Backend

The API expects dates in `YYYY-MM-DD` format.

```javascript
// Convert date picker value to API format
function formatDateForApi(dateInput) {
  // If dateInput is a Date object
  if (dateInput instanceof Date) {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0');
    const day = String(dateInput.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // If already in correct format
  return dateInput;
}
```

### Backend to Frontend

The API returns dates in `YYYY-MM-DD` format.

```javascript
// Convert API date to display format
function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Example: "2026-01-26" → "January 26, 2026"
```

---

## Business Rules & Validations

### Holiday Hierarchy

The system follows this priority order:
1. **Global holidays** - Apply to everything
2. **Slot holidays** - Override normal slot availability
3. **Center holidays** - Apply to specific center
4. **Town holidays** - Apply to specific town
5. **Constituency holidays** - Apply to constituency

### Validation Rules

1. **Global Holiday Constraints:**
   - If `isglobal` is `true`, then `cscid`, `townid`, `slotid`, and `constituencynumber` must all be `null`
   - Global holidays block all bookings system-wide

2. **Specific Holiday Constraints:**
   - If `isglobal` is `false`, at least one specific identifier should be provided
   - Center holiday: `cscid` is required
   - Town holiday: `townid` is required
   - Slot holiday: `slotid` is required
   - Constituency holiday: `constituencynumber` is required

3. **Date Constraints:**
   - Cannot create holidays for past dates (optional business rule)
   - Consider warning for holidays within next 7 days

4. **Duplicate Prevention:**
   - Consider checking for duplicate holidays on same date for same entity
   - UI should warn: "A holiday already exists for this date"

---

## Integration with Booking System

### Booking Validation Flow

```javascript
async function validateBookingDate(bookingData) {
  const { date, centerId, slotId } = bookingData;
  
  // Check if date is a holiday
  const holidayCheck = await fetch(
    `/api/Holidays/check?date=${date}&cscId=${centerId}&slotId=${slotId}`
  );
  const result = await holidayCheck.json();
  
  if (result.isHoliday) {
    return {
      valid: false,
      message: `Cannot book on this date. It is a ${result.type} holiday.`
    };
  }
  
  return { valid: true };
}
```

### Availability Calendar

When showing booking availability:
1. Fetch all relevant holidays (global + center/town/slot specific)
2. Mark holiday dates as unavailable in the calendar
3. Show tooltip on hover explaining why date is unavailable
4. Use different colors for different holiday types

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
- Invalid holiday data
- Global holiday with specific IDs
- Missing required fields

**404 Not Found:**
- Holiday with specified ID doesn't exist

**500 Internal Server Error:**
- Database connection issues
- Unexpected server errors

### UI Error Handling

```javascript
function handleHolidayApiError(error, context) {
  if (error.status === 400) {
    if (error.detail?.includes("Global holidays")) {
      return "Global holidays cannot be assigned to specific centers, towns, or slots.";
    }
    return "Invalid holiday data. Please check your input.";
  } else if (error.status === 404) {
    return "Holiday not found. It may have been deleted.";
  } else {
    return "An error occurred. Please try again later.";
  }
}
```

---

## Testing Checklist

### UI Testing

- [ ] Load all holidays successfully
- [ ] Filter holidays by type (Global, Center, Town, Slot)
- [ ] Create global holiday
- [ ] Create center-specific holiday
- [ ] Create town-specific holiday
- [ ] Create slot-specific holiday
- [ ] Validate global holiday cannot have specific IDs
- [ ] Edit existing holiday
- [ ] Delete holiday with confirmation
- [ ] Check if date is holiday (various contexts)
- [ ] View holidays in calendar format
- [ ] View holidays in list format
- [ ] Handle date format correctly
- [ ] Show appropriate error messages
- [ ] Loading states during API calls

### API Testing

```bash
# Get all holidays
curl -X GET "http://localhost:5000/api/Holidays"

# Get global holidays
curl -X GET "http://localhost:5000/api/Holidays/global"

# Get center holidays
curl -X GET "http://localhost:5000/api/Holidays/center/123e4567-e89b-12d3-a456-426614174000"

# Check if date is holiday
curl -X GET "http://localhost:5000/api/Holidays/check?date=2026-01-26"

# Create global holiday
curl -X POST "http://localhost:5000/api/Holidays" \
  -H "Content-Type: application/json" \
  -d '{
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-12-25",
    "description": "Christmas",
    "isglobal": true
  }'

# Create center-specific holiday
curl -X POST "http://localhost:5000/api/Holidays" \
  -H "Content-Type: application/json" \
  -d '{
    "cscid": "123e4567-e89b-12d3-a456-426614174000",
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-03-15",
    "description": "Center Maintenance",
    "isglobal": false
  }'

# Update holiday
curl -X PUT "http://localhost:5000/api/Holidays/1" \
  -H "Content-Type: application/json" \
  -d '{
    "cscid": null,
    "townid": null,
    "constituencynumber": null,
    "slotid": null,
    "holidaydate": "2026-01-26",
    "description": "Republic Day (Updated)",
    "isglobal": true
  }'

# Delete holiday
curl -X DELETE "http://localhost:5000/api/Holidays/1"
```

---

## Sample UI Components

### React Example - Holiday Form

```jsx
import React, { useState } from 'react';

function HolidayForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    holidayType: initialData.holidayType || 'global',
    cscid: initialData.cscid || null,
    townid: initialData.townid || null,
    slotid: initialData.slotid || null,
    constituencynumber: initialData.constituencynumber || null,
    holidaydate: initialData.holidaydate || '',
    description: initialData.description || '',
    isglobal: initialData.isglobal ?? true
  });

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      holidayType: type,
      isglobal: type === 'global',
      cscid: null,
      townid: null,
      slotid: null,
      constituencynumber: null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      cscid: formData.holidayType === 'center' ? formData.cscid : null,
      townid: formData.holidayType === 'town' ? formData.townid : null,
      slotid: formData.holidayType === 'slot' ? formData.slotid : null,
      constituencynumber: formData.holidayType === 'constituency' ? formData.constituencynumber : null,
      holidaydate: formData.holidaydate,
      description: formData.description,
      isglobal: formData.isglobal
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Holiday Type</label>
        <select value={formData.holidayType} onChange={(e) => handleTypeChange(e.target.value)}>
          <option value="global">Global</option>
          <option value="center">Center</option>
          <option value="town">Town</option>
          <option value="slot">Slot</option>
          <option value="constituency">Constituency</option>
        </select>
      </div>

      {formData.holidayType === 'center' && (
        <div>
          <label>Center</label>
          <select value={formData.cscid || ''} onChange={(e) => setFormData({...formData, cscid: e.target.value})}>
            <option value="">Select Center</option>
            {/* Load centers from API */}
          </select>
        </div>
      )}

      {/* Similar conditional fields for town, slot, constituency */}

      <div>
        <label>Date</label>
        <input
          type="date"
          value={formData.holidaydate}
          onChange={(e) => setFormData({...formData, holidaydate: e.target.value})}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <button type="submit">Save Holiday</button>
    </form>
  );
}
```

---

## Support

For issues or questions about the Holiday API, please contact the development team.
