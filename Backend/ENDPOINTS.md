# API Endpoints Documentation

## Base URL
`http://localhost:5000/api`

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** 201 Created
```json
{
  "id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

### POST /api/auth/login
Login and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

---

## Sweets Endpoints (Protected - Requires JWT Token)

All sweets endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

### POST /api/sweets
Add a new sweet.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Gulab Jamun",
  "category": "Indian",
  "price": 25,
  "quantity": 50
}
```

**Response:** 201 Created
```json
{
  "_id": "...",
  "name": "Gulab Jamun",
  "category": "Indian",
  "price": 25,
  "quantity": 50,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### GET /api/sweets
Get all available sweets.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** 200 OK
```json
[
  {
    "_id": "...",
    "name": "Gulab Jamun",
    "category": "Indian",
    "price": 25,
    "quantity": 50
  },
  ...
]
```

### GET /api/sweets/search
Search sweets by name, category, or price range.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `name` (optional): Search by name (case-insensitive)
- `category` (optional): Search by category (case-insensitive)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

**Example:**
```
GET /api/sweets/search?category=Indian&minPrice=20&maxPrice=50
```

**Response:** 200 OK
```json
[
  {
    "_id": "...",
    "name": "Gulab Jamun",
    "category": "Indian",
    "price": 25,
    "quantity": 50
  },
  ...
]
```

### PUT /api/sweets/:id
Update a sweet's details.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "category": "Updated Category",
  "price": 30,
  "quantity": 60
}
```

**Response:** 200 OK
```json
{
  "_id": "...",
  "name": "Updated Name",
  "category": "Updated Category",
  "price": 30,
  "quantity": 60
}
```

### DELETE /api/sweets/:id
Delete a sweet. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** 200 OK
```json
{
  "message": "Sweet deleted"
}
```

---

## Inventory Endpoints (Protected - Requires JWT Token)

### POST /api/sweets/:id/purchase
Purchase a sweet, decreasing its quantity.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 1
}
```

**Response:** 200 OK
```json
{
  "_id": "...",
  "name": "Gulab Jamun",
  "category": "Indian",
  "price": 25,
  "quantity": 49
}
```

### POST /api/sweets/:id/restock
Restock a sweet, increasing its quantity. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 10
}
```

**Response:** 200 OK
```json
{
  "_id": "...",
  "name": "Gulab Jamun",
  "category": "Indian",
  "price": 25,
  "quantity": 59
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "status": 400,
    "code": "VALIDATION_ERROR",
    "message": "Error message here"
  }
}
```

### Common Error Codes:
- `AUTH_REQUIRED` (401): Missing or invalid Authorization header
- `INVALID_TOKEN` (401): Invalid JWT token
- `ADMIN_REQUIRED` (403): Admin access required
- `VALIDATION_ERROR` (400): Invalid request data
- `SWEET_NOT_FOUND` (404): Sweet not found
- `INSUFFICIENT_STOCK` (400): Not enough stock for purchase
- `NOT_FOUND` (404): Route not found

