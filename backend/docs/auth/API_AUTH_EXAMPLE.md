# API Authentication Examples

## Authentication Flow

1. **Register a new user**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

2. **Login with existing user**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Using Protected Endpoints

All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Protected Endpoints:

1. **Get user profile (protected)**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

2. **Create a feature (protected)**
```bash
curl -X POST http://localhost:3000/api/features \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "New Feature",
    "description": "This is a great feature"
  }'
```

3. **Update a feature (protected - owner only)**
```bash
curl -X PUT http://localhost:3000/api/features/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Updated Feature Title",
    "description": "Updated description"
  }'
```
Note: You can only update features you created. Returns 403 if you're not the owner.

4. **Delete a feature (protected - owner only)**
```bash
curl -X DELETE http://localhost:3000/api/features/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
Note: You can only delete features you created. Returns 403 if you're not the owner.

5. **Vote on a feature (protected)**
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "featureId": 1
  }'
```

6. **Remove vote (protected)**
```bash
curl -X DELETE http://localhost:3000/api/votes/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Public Endpoints (no auth required):

1. **Get all features**
```bash
curl -X GET http://localhost:3000/api/features
```

2. **Get single feature**
```bash
curl -X GET http://localhost:3000/api/features/1
```

3. **Get feature votes**
```bash
curl -X GET http://localhost:3000/api/votes/feature/1
```

## Error Responses

### No Authorization Header
```json
{
  "error": "No authorization header provided"
}
```

### Invalid Token Format
```json
{
  "error": "Invalid authorization format. Use: Bearer <token>"
}
```

### Invalid Token
```json
{
  "error": "Invalid token"
}
```

### Expired Token
```json
{
  "error": "Token expired"
}
```

### Forbidden (Not Owner)
```json
{
  "error": "You can only update your own features"
}
```
or
```json
{
  "error": "You can only delete your own features"
}
```

## Security Notes

- JWT tokens expire after 24 hours (configurable in .env)
- Always use HTTPS in production
- Store tokens securely on the client side
- Never expose your JWT_SECRET