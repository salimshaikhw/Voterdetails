# Centers Controller - Complete API Documentation

## Base URL
`/api/centers`

---

## Endpoints

### 1. Get All Centers
- **Method:** `GET`
- **Route:** `/api/centers`
- **Description:** Retrieves all centers in the system
- **Request Parameters:** None
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "guid",
      "centerUid": "string",
      "name": "string",
      "address": "string",
      "townid": "guid"
    }
  ]
  ```

---

### 2. Get Center by ID
- **Method:** `GET`
- **Route:** `/api/centers/{id}`
- **Description:** Retrieves a specific center by its ID
- **Path Parameters:**
  - `id` (Guid) - The unique identifier of the center
- **Response:** 
  - `200 OK`
    ```json
    {
      "id": "guid",
      "centerUid": "string",
      "name": "string",
      "address": "string",
      "townid": "guid"
    }
    ```
  - `404 Not Found` - When center with specified ID doesn't exist

---

### 3. Create Center
- **Method:** `POST`
- **Route:** `/api/centers`
- **Description:** Creates a new center
- **Request Body:**
  ```json
  {
    "name": "string",
    "address": "string",
    "townid": "guid",
    "centerUid": "string"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "guid",
    "centerUid": "string",
    "name": "string",
    "address": "string",
    "townid": "guid"
  }
  ```
- **Location Header:** `/api/centers/{newId}`

---

### 4. Update Center
- **Method:** `PUT`
- **Route:** `/api/centers/{id}`
- **Description:** Updates an existing center
- **Path Parameters:**
  - `id` (Guid) - The unique identifier of the center to update
- **Request Body:**
  ```json
  {
    "name": "string",
    "address": "string",
    "townid": "guid",
    "centerUid": "string"
  }
  ```
- **Response:**
  - `204 No Content` - Successfully updated
  - `404 Not Found` - When center with specified ID doesn't exist

---

### 5. Delete Center
- **Method:** `DELETE`
- **Route:** `/api/centers/{id}`
- **Description:** Deletes a center by ID
- **Path Parameters:**
  - `id` (Guid) - The unique identifier of the center to delete
- **Response:**
  - `204 No Content` - Successfully deleted
  - `404 Not Found` - When center with specified ID doesn't exist

---

### 6. Get Centers by Town ID
- **Method:** `GET`
- **Route:** `/api/centers/by-town/{townId}`
- **Description:** Retrieves all centers mapped to a specific town (uses town_csc_mapping table)
- **Path Parameters:**
  - `townId` (Guid) - The town ID to get centers for
- **Response:**
  - `200 OK`
    ```json
    [
      {
        "id": "guid",
        "centerUid": "string",
        "name": "string",
        "address": "string",
        "townid": "guid"
      }
    ]
    ```
  - `404 Not Found` - When no centers found for the town ID

---

### 7. Get All Centers with Town Mapping
- **Method:** `GET`
- **Route:** `/api/centers/with-town-mapping`
- **Description:** Retrieves all centers with their associated town information from the mapping table
- **Request Parameters:** None
- **Response:** `200 OK`
  ```json
  [
    {
      "centerUid": "string",
      "townName": "string",
      "centerAddress": "string",
      "centerId": "guid",
      "townId": "guid"
    }
  ]
  ```

---

## Data Models

### CenterDto (Response Model)
```typescript
{
  id: string (Guid),           // Auto-generated unique identifier
  centerUid: string | null,    // Custom center UID
  name: string | null,         // Center name (max 500 chars)
  address: string | null,      // Center address (max 500 chars)
  townid: string (Guid)        // Reference to Town
}
```

### CreateCenterDto (Create Request)
```typescript
{
  name: string | null,         // Center name
  address: string | null,      // Center address
  townid: string (Guid),       // Town ID (required)
  centerUid: string | null     // Custom center UID
}
```

### UpdateCenterDto (Update Request)
```typescript
{
  name: string | null,         // Center name
  address: string | null,      // Center address
  townid: string (Guid),       // Town ID (required)
  centerUid: string | null     // Custom center UID
}
```

---

## Important Notes for UI Team

1. **GUIDs:** All IDs are GUIDs (UUID format). The `Id` field is auto-generated on creation.

2. **Nullable Fields:** `CenterUid`, `Name`, and `Address` are nullable strings.

3. **Town Relationship:** Centers are linked to Towns through the `Townid` field and also have a many-to-many relationship via `TownCscMapping` table.

4. **Error Handling:** 
   - All 404 errors return appropriate messages
   - The API uses custom error handling middleware

5. **Validation:** 
   - Name and Address have max length of 500 characters
   - All Guid fields must be valid GUID format

6. **Special Endpoint:** The `/by-town/{townId}` endpoint uses the `town_csc_mapping` table to find centers, not the direct `townid` field in the centers table.

7. **Content Type:** All requests and responses use `application/json`

---

## Example Usage

### Example 1: Create a New Center
**Request:**
```http
POST /api/centers
Content-Type: application/json

{
  "name": "Health Center A",
  "address": "123 Main Street, City",
  "townid": "550e8400-e29b-41d4-a716-446655440000",
  "centerUid": "HC001"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Location: /api/centers/660e8400-e29b-41d4-a716-446655440001

{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "centerUid": "HC001",
  "name": "Health Center A",
  "address": "123 Main Street, City",
  "townid": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### Example 2: Get Centers by Town ID
**Request:**
```http
GET /api/centers/by-town/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```http
HTTP/1.1 200 OK

[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "centerUid": "HC001",
    "name": "Health Center A",
    "address": "123 Main Street, City",
    "townid": "550e8400-e29b-41d4-a716-446655440000"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "centerUid": "HC002",
    "name": "Health Center B",
    "address": "456 Oak Avenue, City",
    "townid": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

---

### Example 3: Update a Center
**Request:**
```http
PUT /api/centers/660e8400-e29b-41d4-a716-446655440001
Content-Type: application/json

{
  "name": "Health Center A - Updated",
  "address": "123 Main Street, City, Updated Location",
  "townid": "550e8400-e29b-41d4-a716-446655440000",
  "centerUid": "HC001"
}
```

**Response:**
```http
HTTP/1.1 204 No Content
```

---

### Example 4: Get Centers with Town Mapping
**Request:**
```http
GET /api/centers/with-town-mapping
```

**Response:**
```http
HTTP/1.1 200 OK

[
  {
    "centerUid": "HC001",
    "townName": "Downtown",
    "centerAddress": "123 Main Street, City",
    "centerId": "660e8400-e29b-41d4-a716-446655440001",
    "townId": "550e8400-e29b-41d4-a716-446655440000"
  },
  {
    "centerUid": "HC002",
    "townName": "Downtown",
    "centerAddress": "456 Oak Avenue, City",
    "centerId": "660e8400-e29b-41d4-a716-446655440002",
    "townId": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```
