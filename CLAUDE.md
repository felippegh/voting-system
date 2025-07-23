# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack voting system where users can post feature requests and upvote others. Built with TypeScript across all layers for type safety.

## Architecture

- **Backend**: Express.js + TypeScript + PostgreSQL (port 3000)
- **Mobile**: React Native with Expo (ports 19000-19002, 8081)  
- **Database**: PostgreSQL (port 5433 externally, 5432 internally)
- **Shared**: Common TypeScript types used by both backend and mobile

## Development Commands

### Docker Compose (Recommended)
```bash
# Full stack
docker-compose up

# Backend + Database only
docker-compose -f docker-compose.backend.yml up

# Mobile development only
docker-compose -f docker-compose.mobile.yml up

# Individual services
docker-compose up backend
docker-compose up database
docker-compose up mobile

# Clean up
docker-compose down
docker-compose down -v  # Remove volumes including database data
```

### Backend Development
```bash
cd backend
npm run dev          # Development with hot reload using tsx
npm run build        # Compile TypeScript to dist/
npm run start        # Run production build from dist/
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests for CI/CD (no watch, with coverage)
npm run lint         # ESLint with TypeScript rules
npm run lint:fix     # ESLint with auto-fix
npm run type-check   # TypeScript type checking without emit
npm run clean        # Clean dist and coverage directories

# Environment setup
cp .env.example .env  # Copy example environment file
# Edit .env with your configuration
```

### Mobile Development
```bash
cd mobile
npm start            # Start Expo development server
npm run android      # Run on Android device/emulator
npm run ios          # Run on iOS device/simulator
npm run web          # Run on web browser
npm test             # Run Jest tests
npm run lint         # ESLint for .ts/.tsx files
npm run type-check   # TypeScript type checking without emit
```

### Database Access
```bash
# Connect to PostgreSQL (when running via Docker)
docker exec -it voting-system-database-1 psql -U postgres -d voting_system

# Reset database (removes all data)
docker-compose down -v && docker-compose up database
```

## Code Architecture

### Backend Structure
- `src/index.ts` - Express app setup with middleware (helmet, cors, morgan)
- `src/routes/` - Route handlers for auth, features, votes
- `src/controllers/` - Business logic for AuthController, FeatureController, VoteController
- `src/models/` - Database models (User, Feature, Vote)
- `src/database/connection.ts` - PostgreSQL connection
- `src/middleware/errorHandler.ts` - Global error handling
- `src/middleware/auth.ts` - JWT authentication middleware

### Mobile Structure
- `App.tsx` - Navigation setup with React Navigation stack
- `src/screens/` - HomeScreen, FeatureDetailScreen, CreateFeatureScreen
- Uses React Navigation for routing between screens
- Navigation type definitions in App.tsx for type safety

### Shared Types
- `shared/types/index.ts` - Common interfaces used by both backend and mobile
- Includes User, Feature, Vote, API request/response types

## Database

PostgreSQL with initialization script at `database/init.sql`. Key tables:
- `users` - User accounts with auth (unique username/email constraints)
- `features` - Feature requests with foreign key to users
- `votes` - User votes with composite unique constraint (one per user per feature)
- `features_with_votes` - Materialized view with vote counts, ordered by popularity

Database includes performance indexes on frequently queried columns and sample data for development. Foreign key constraints ensure referential integrity with CASCADE deletes.

## Environment Variables

Backend configuration is handled through environment variables in `backend/.env`:

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing

### Optional Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 24h)
- `BCRYPT_SALT_ROUNDS` - Password hashing rounds (default: 10)
- `DB_POOL_MIN/MAX` - Connection pool size (default: 2/10)

## Claude Code Setup

This project includes PostgreSQL MCP configuration for database querying.

**Quick Setup:**
```bash
# Copy the MCP template (already configured for this project)
cp .claude-code/mcp.json.template .claude-code/mcp.json
```

**Manual Setup:** If the template doesn't exist, create `.claude-code/mcp.json`:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:password@localhost:5433/voting_system"
      }
    }
  }
}
```

**Usage:** Use `/mcp` commands to query the database directly during development.

**Note:** The connection string matches the Docker Compose database configuration.
- `LOG_LEVEL` - Morgan logging format (default: combined)
- `CORS_ORIGIN` - CORS allowed origins (default: *)
- `DB_QUERY_LOGGING` - Enable query logging (default: true)

## API Endpoints

Authentication: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
Features: `/api/features` (CRUD operations)
Votes: `/api/votes` (create/delete), `/api/votes/feature/:id` (get count)

## Development Notes

- Both backend and mobile use TypeScript with strict typing
- Backend uses JWT for authentication with bcryptjs for password hashing
- Mobile uses Expo (~49.0.0) for cross-platform development
- Shared types ensure consistency between backend and mobile APIs
- Docker Compose handles service orchestration and networking
- Backend uses Zod for request validation and sanitization
- Database connection uses environment variables for configuration
- Environment variables are configured in `backend/.env` (see `.env.example` for reference)
- Backend uses tsx for development hot reload, compiles to dist/ for production
- Mobile navigation uses React Navigation v6 with typed navigation props
- Error handling centralized through backend middleware
- Health check endpoint available at `/health` for monitoring
- Comprehensive unit tests with Jest, mocking, and coverage reporting
- Tests are located in `backend/tests/` directory with helpers for mocking