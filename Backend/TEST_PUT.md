# Testing PUT /api/sweets/:id Endpoint

## Quick Test Guide

### Method 1: Using PowerShell

```powershell
# Step 1: Login and get token
$loginBody = @{
    email = "anushree.patel@icloud.com"
    password = "YOUR_PASSWORD"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

# Step 2: Update a sweet
$headers = @{
    Authorization = "Bearer $token"
    ContentType = "application/json"
}

$updateData = @{
    price = 35
    quantity = 30
} | ConvertTo-Json

$sweetId = "693eef6146a3a0e4b564b768"  # Kulfi ID
$result = Invoke-RestMethod -Uri "http://localhost:5000/api/sweets/$sweetId" -Method Put -Body $updateData -Headers $headers

# Display result
Write-Host "Updated Sweet:"
Write-Host "Name: $($result.name)"
Write-Host "Price: ₹$($result.price)"
Write-Host "Quantity: $($result.quantity)"
Write-Host "ID: $($result._id)"
```

### Method 2: Using curl (if available)

```bash
# Step 1: Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anushree.patel@icloud.com","password":"YOUR_PASSWORD"}' \
  | jq -r '.token')

# Step 2: Update sweet
curl -X PUT http://localhost:5000/api/sweets/693eef6146a3a0e4b564b768 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":35,"quantity":30}'
```

### Method 3: Using Postman/Insomnia

1. **Login Request:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "anushree.patel@icloud.com",
       "password": "YOUR_PASSWORD"
     }
     ```
   - Copy the `token` from response

2. **Update Sweet Request:**
   - Method: `PUT`
   - URL: `http://localhost:5000/api/sweets/693eef6146a3a0e4b564b768`
   - Headers:
     - `Authorization: Bearer <your-token>`
     - `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "name": "Kulfi",
       "category": "Indian",
       "price": 35,
       "quantity": 30
     }
     ```
   - Or partial update (only fields you want to change):
     ```json
     {
       "price": 35
     }
     ```

## Test Sweet IDs

From the database:
- `693eef6146a3a0e4b564b768` - Kulfi
- `693eef6146a3a0e4b564b75a` - Gulab Jamun
- `693eef6146a3a0e4b564b75b` - Rasgulla
- `693eef6146a3a0e4b564b75c` - Ladoo
- `693eef6146a3a0e4b564b75d` - Jalebi

## Expected Response

**Success (200 OK):**
```json
{
  "_id": "693eef6146a3a0e4b564b768",
  "name": "Kulfi",
  "category": "Indian",
  "price": 35,
  "quantity": 30,
  "createdAt": "2025-12-14T17:09:53.000Z",
  "updatedAt": "2025-12-14T17:15:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Not an admin user
- `404 Not Found` - Sweet ID doesn't exist
- `400 Bad Request` - Invalid data (e.g., negative price)

## Notes

- **Admin Only**: This endpoint requires admin role
- **Partial Updates**: You can send only the fields you want to update
- **Validation**: Price must be non-negative, quantity must be non-negative integer
- **Unique Name**: If updating name, it must be unique

