# Voting System API - Postman Documentation

This directory contains Postman collection and environment files for testing the Voting System API.

## Files

- `voting-system-api.postman_collection.json` - Complete API collection with all endpoints
- `voting-system.postman_environment.json` - Environment variables for local development

## How to Use

### 1. Import into Postman

1. Open Postman
2. Click "Import" button
3. Select both JSON files:
   - `voting-system-api.postman_collection.json`
   - `voting-system.postman_environment.json`
4. Click "Import"

### 2. Select Environment

1. In Postman, click the environment dropdown (top right)
2. Select "Voting System - Local"
3. Ensure the environment is active (checkmark)

### 3. Test the API

The collection is organized into folders:

- **Authentication** - Register, login, and profile endpoints
- **Features** - CRUD operations for feature requests
- **Votes** - Vote management endpoints
- **Health Check** - API status endpoint

### Authentication Flow

1. Start with **Register User** or **Login** endpoint
2. The collection automatically:
   - Saves the JWT token to `{{authToken}}` variable
   - Saves the user ID to `{{userId}}` variable
3. Protected endpoints automatically use the saved token

### Collection Features

#### Pre-request Scripts
- Endpoints that require authentication automatically include the Bearer token

#### Test Scripts
- Authentication endpoints save tokens automatically
- Response examples included for all endpoints

#### Variables Used
- `{{baseUrl}}` - API base URL (default: http://localhost:3000)
- `{{authToken}}` - JWT token (set automatically after login/register)
- `{{userId}}` - Current user ID (set automatically after login/register)

### Testing Workflow

1. **Register a new user**
   ```
   POST /api/auth/register
   ```

2. **Create a feature** (uses saved auth token)
   ```
   POST /api/features
   ```

3. **Vote for a feature** (uses saved auth token)
   ```
   POST /api/votes
   ```

4. **Get all features** (public endpoint)
   ```
   GET /api/features
   ```

### Response Examples

Each endpoint includes example responses for:
- Success cases
- Common error cases
- Validation errors

### Environment Variables

You can modify these in the environment settings:

- `baseUrl` - Change this if API is running on different host/port
- `testEmail` - Default test email
- `testPassword` - Default test password
- `testUsername` - Default test username

### Tips

1. **Fork the collection** to create your own copy for modifications
2. **Use collection runner** to run all tests in sequence
3. **Create additional environments** for staging/production
4. **Export test results** for documentation

### Troubleshooting

1. **401 Unauthorized** - Token expired or invalid. Re-run login/register
2. **403 Forbidden** - You're trying to modify a resource you don't own
3. **Connection refused** - Ensure the API is running on the correct port

### API Documentation

For detailed API documentation, see:
- `API_AUTH_EXAMPLE.md` - Authentication examples with cURL
- `CLAUDE.md` - Project documentation

## Security Notes

- Never commit environment files with real tokens
- Use environment variables for sensitive data
- Tokens expire after 24 hours by default