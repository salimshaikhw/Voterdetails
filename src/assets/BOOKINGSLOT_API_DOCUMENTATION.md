# Booking Slot API Documentation

## Overview
The Booking Slot API manages time slots for booking appointments. Each slot has a name, start time, end time, maximum capacity, and active status.

**Base URL:** `/api/Bookingslots`

---

## Data Model

### BookingslotDto
```json
{
  "id": 1,
  "name": "Morning Slot",
  "startTime": "09:00:00",
  "endTime": "12:00:00",
  "maxCount": 50,
  "isActive": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | No (auto-generated) | Unique identifier for the slot |
| `name` | string | No | Display name for the slot |
| `startTime` | string | Yes | Slot start time in format "HH:mm:ss" (24-hour) |
| `endTime` | string | Yes | Slot end time in format "HH:mm:ss" (24-hour) |
| `maxCount` | integer | Yes | Maximum number of bookings allowed in this slot |
| `isActive` | boolean | No | Whether the slot is active (default: true) |

---

## Endpoints

### 1. Get All Booking Slots

Retrieves a list of all booking slots in the system.

**Endpoint:** `GET /api/Bookingslots`

**Request:**
```http
GET /api/Bookingslots HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Morning Slot",
    "startTime": "09:00:00",
    "endTime": "12:00:00",
    "maxCount": 50,
    "isActive": true
  },
  {
    "id": 2,
    "name": "Afternoon Slot",
    "startTime": "12:00:00",
    "endTime": "15:00:00",
    "maxCount": 40,
    "isActive": true
  },
  {
    "id": 3,
    "name": "Evening Slot",
    "startTime": "15:00:00",
    "endTime": "18:00:00",
    "maxCount": 30,
    "isActive": false
  }
]
```

**UI Implementation Notes:**
- Display slots in a table or card layout
- Use color coding for active/inactive status (e.g., green for active, gray for inactive)
- Show time in user-friendly format (e.g., "9:00 AM - 12:00 PM")
- Sort by start time by default

---

### 2. Get Booking Slot by ID

Retrieves a specific booking slot by its ID.

**Endpoint:** `GET /api/Bookingslots/{id}`

**Request:**
```http
GET /api/Bookingslots/1 HTTP/1.1
Host: your-api-domain.com
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Morning Slot",
  "startTime": "09:00:00",
  "endTime": "12:00:00",
  "maxCount": 50,
  "isActive": true
}
```

**Response (404 Not Found):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "traceId": "00-xxxxx"
}
```

**UI Implementation Notes:**
- Use for editing forms - load slot details before showing edit dialog
- Display error message if slot not found

---

### 3. Create Booking Slot

Creates a new booking slot.

**Endpoint:** `POST /api/Bookingslots`

**Request:**
```http
POST /api/Bookingslots HTTP/1.1
Host: your-api-domain.com
Content-Type: application/json

{
  "name": "Late Evening Slot",
  "startTime": "18:00:00",
  "endTime": "21:00:00",
  "maxCount": 25,
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "id": 4,
  "name": "Late Evening Slot",
  "startTime": "18:00:00",
  "endTime": "21:00:00",
  "maxCount": 25,
  "isActive": true
}
```

**Response Headers:**
```
Location: /api/Bookingslots/4
```

**Validation Errors (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "startTime": [
      "Start time is required"
    ],
    "endTime": [
      "End time is required"
    ],
    "maxCount": [
      "Max count is required"
    ]
  }
}
```

**UI Implementation Notes:**
- Create form with fields:
  - Text input for name (optional)
  - Time picker for start time (required)
  - Time picker for end time (required)
  - Number input for max count (required, min: 1)
  - Toggle/checkbox for is active (default: true)
- Validate that end time is after start time
- Show validation errors clearly
- Refresh the slot list after successful creation
- Consider showing a success notification

**Example Form Validation:**
```javascript
function validateSlotForm(formData) {
  const errors = {};
  
  if (!formData.startTime) {
    errors.startTime = "Start time is required";
  }
  
  if (!formData.endTime) {
    errors.endTime = "End time is required";
  }
  
  if (!formData.maxCount || formData.maxCount < 1) {
    errors.maxCount = "Max count must be at least 1";
  }
  
  if (formData.startTime && formData.endTime) {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    if (end <= start) {
      errors.endTime = "End time must be after start time";
    }
  }
  
  return errors;
}
```

---

### 4. Update Booking Slot

Updates an existing booking slot.

**Endpoint:** `PUT /api/Bookingslots/{id}`

**Request:**
```http
PUT /api/Bookingslots/1 HTTP/1.1
Host: your-api-domain.com
Content-Type: application/json

{
  "id": 1,
  "name": "Morning Slot (Updated)",
  "startTime": "09:30:00",
  "endTime": "12:30:00",
  "maxCount": 60,
  "isActive": true
}
```

**Response (204 No Content):**
- Empty response body on success

**Response (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400
}
```
- Occurs when the ID in the URL doesn't match the ID in the request body

**Response (404 Not Found):**
- Occurs when the slot with specified ID doesn't exist

**UI Implementation Notes:**
- Use the same form as create, but pre-populate with existing data
- Must include the `id` field in the request body
- Show "Save" or "Update" button instead of "Create"
- Refresh the slot list after successful update
- Handle concurrency issues gracefully

---

### 5. Delete Booking Slot

Deletes a booking slot.

**Endpoint:** `DELETE /api/Bookingslots/{id}`

**Request:**
```http
DELETE /api/Bookingslots/1 HTTP/1.1
Host: your-api-domain.com
```

**Response (204 No Content):**
- Empty response body on success

**Response (404 Not Found):**
- Occurs when the slot with specified ID doesn't exist

**UI Implementation Notes:**
- Show confirmation dialog before deletion
  - "Are you sure you want to delete this slot? This action cannot be undone."
- Warn if there are active bookings using this slot
- Remove the slot from the list after successful deletion
- Show error message if deletion fails (e.g., "Cannot delete slot that has existing bookings")

**Example Confirmation Dialog:**
```javascript
function confirmDeleteSlot(slotName) {
  return confirm(
    `Are you sure you want to delete "${slotName}"?\n\n` +
    `This action cannot be undone and may affect existing bookings.`
  );
}
```

---

## Complete UI Example Flow

### Slot Management Page

```
┌─────────────────────────────────────────────────────────────┐
│ Booking Slot Management                    [+ New Slot]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Morning Slot                                     Active │ │
│ │ 9:00 AM - 12:00 PM                                      │ │
│ │ Capacity: 50 bookings                                   │ │
│ │                                    [Edit]     [Delete]  │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Afternoon Slot                                   Active │ │
│ │ 12:00 PM - 3:00 PM                                      │ │
│ │ Capacity: 40 bookings                                   │ │
│ │                                    [Edit]     [Delete]  │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Evening Slot                                   Inactive │ │
│ │ 3:00 PM - 6:00 PM                                       │ │
│ │ Capacity: 30 bookings                                   │ │
│ │                                    [Edit]     [Delete]  │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Create/Edit Slot Form

```
┌─────────────────────────────────────────┐
│ Create New Slot                    [×]  │
├─────────────────────────────────────────┤
│                                         │
│ Slot Name (optional)                    │
│ ┌─────────────────────────────────────┐ │
│ │ Morning Slot                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Start Time *                            │
│ ┌─────────────────────────────────────┐ │
│ │ 09:00:00               🕐           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ End Time *                              │
│ ┌─────────────────────────────────────┐ │
│ │ 12:00:00               🕐           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Maximum Bookings *                      │
│ ┌─────────────────────────────────────┐ │
│ │ 50                                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ☑ Active                                │
│                                         │
│         [Cancel]        [Create Slot]  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
- Missing required fields
- Invalid time format
- ID mismatch (in PUT request)

**404 Not Found:**
- Slot with specified ID doesn't exist

**500 Internal Server Error:**
- Database connection issues
- Unexpected server errors

### UI Error Handling Best Practices

1. **Show user-friendly error messages**
   ```javascript
   function handleApiError(error) {
     if (error.status === 404) {
       return "Slot not found. It may have been deleted.";
     } else if (error.status === 400) {
       return "Invalid input. Please check your data.";
     } else {
       return "An error occurred. Please try again later.";
     }
   }
   ```

2. **Retry mechanism for network failures**
3. **Validation before API calls** (prevent unnecessary requests)
4. **Loading states during API calls**
5. **Optimistic updates** (update UI immediately, rollback on error)

---

## Time Format Handling

### Frontend to Backend

The API expects time in `HH:mm:ss` format (24-hour).

```javascript
// Convert time picker value to API format
function formatTimeForApi(timeInput) {
  // If timeInput is "09:00", convert to "09:00:00"
  if (timeInput.length === 5) {
    return `${timeInput}:00`;
  }
  return timeInput;
}
```

### Backend to Frontend

The API returns time in `HH:mm:ss` format.

```javascript
// Convert API time to 12-hour format for display
function formatTimeForDisplay(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Example: "09:00:00" → "9:00 AM"
// Example: "15:30:00" → "3:30 PM"
```

---

## Testing Checklist

### UI Testing

- [ ] Load all slots successfully
- [ ] Create new slot with valid data
- [ ] Create slot with missing required fields (show validation)
- [ ] Edit existing slot
- [ ] Edit slot with ID mismatch (should show error)
- [ ] Delete slot with confirmation
- [ ] Cancel delete operation
- [ ] Toggle slot active/inactive status
- [ ] Time picker shows correct values
- [ ] Time validation (end time after start time)
- [ ] Display times in user-friendly format
- [ ] Handle network errors gracefully
- [ ] Loading states during API calls

### API Testing

```bash
# Get all slots
curl -X GET "http://localhost:5000/api/Bookingslots"

# Get specific slot
curl -X GET "http://localhost:5000/api/Bookingslots/1"

# Create slot
curl -X POST "http://localhost:5000/api/Bookingslots" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Slot",
    "startTime": "10:00:00",
    "endTime": "11:00:00",
    "maxCount": 10,
    "isActive": true
  }'

# Update slot
curl -X PUT "http://localhost:5000/api/Bookingslots/1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "Updated Slot",
    "startTime": "10:30:00",
    "endTime": "11:30:00",
    "maxCount": 15,
    "isActive": true
  }'

# Delete slot
curl -X DELETE "http://localhost:5000/api/Bookingslots/1"
```

---

## Integration Notes

### Related APIs

This API works in conjunction with:
- **Bookings API** - Uses slot IDs for creating bookings
- **Slot Availability API** - Checks available capacity for each slot
- **Holidays API** - Slots may be unavailable on holidays

### Business Rules

1. **Slot Capacity:** The `maxCount` defines the maximum number of bookings allowed per day per slot
2. **Active Status:** Only active slots should be available for new bookings
3. **Time Overlap:** Consider validating that slots don't overlap (business logic decision)
4. **Deletion:** May need to prevent deletion if there are existing bookings using the slot
5. **Time Zone:** All times are stored and returned without time zone information (local time)

---

## Support

For issues or questions about the Booking Slot API, please contact the development team.
