# Voting System

A full-stack feature voting platform where users can submit feature requests and vote on community proposals. Built with modern technologies for scalability and cross-platform compatibility.

## ✨ Features

### **Core Functionality**
- 🔐 **User Authentication** - JWT-based registration and login
- 📝 **Feature Requests** - Create, edit, and delete feature proposals
- 🗳️ **Voting System** - Upvote/downvote with duplicate prevention
- 👤 **User Profiles** - Personal account management
- 📱 **Cross-Platform** - Native mobile app + web support

### **Technical Features**
- 🔒 **Security** - Password hashing, JWT tokens, CORS protection
- 🗄️ **Database** - PostgreSQL with optimized queries and views
- 🐳 **Containerized** - Docker setup for easy deployment
- 🧪 **Testing** - Comprehensive test suite with Jest
- 📖 **Documentation** - API docs with Postman collections
- 🔧 **TypeScript** - End-to-end type safety

## 🏗️ Technology Stack

### **Backend**
- **Runtime**: Node.js 22 (LTS)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15 with connection pooling
- **Authentication**: JWT + bcryptjs password hashing
- **Security**: Helmet, CORS, request validation with Zod
- **Testing**: Jest with ts-jest, 25 test suites
- **Deployment**: Docker containerization

### **Frontend**
- **Framework**: React Native with Expo SDK 49
- **Navigation**: React Navigation v6 with stack navigator
- **State Management**: React Context + AsyncStorage
- **HTTP Client**: Axios with interceptors
- **Platforms**: iOS, Android, Web
- **Development**: Hot reload, QR code testing

### **Database**
- **Engine**: PostgreSQL 15
- **Features**: Materialized views, indexes, foreign keys
- **Schema**: Users, features, votes with relational integrity
- **Connection**: Environment-based configuration

## Quick Start

### 1. Start Backend & Database
```bash
docker compose up -d
```

### 2. Start Mobile App
```bash
cd mobile
npm install
npm start
```

### 3. Test the App
- **iPhone**: Download "Expo Go" → Scan QR code
- **iOS Simulator**: Press `i` in terminal
- **Web Browser**: Press `w` in terminal

## Services

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 3000 | REST API server |
| PostgreSQL | 5433 | Database (external port) |
| Mobile (Expo) | 19000 | React Native development server |

## Prerequisites

- **Docker & Docker Compose** (for backend/database)
- **Node.js 18+** (for mobile development)
- **Expo Go app** (for iPhone testing)

## Setup Instructions

### 1. Clone & Setup
```bash
git clone <repository-url>
cd voting-system
```

### 2. Environment Configuration
The backend uses environment variables in `backend/.env`. Default configuration works with Docker setup.

### 3. Database Setup (Docker)
```bash
# Start PostgreSQL with initialization
docker compose up -d database

# Check database is ready
docker compose logs database
```

### 4. Backend Setup (Docker)
```bash
# Start backend API
docker compose up -d backend

# Check API is running
curl http://localhost:3000/api/features
```

### 5. Mobile Setup (Local)
```bash
cd mobile
npm install
npm start

# Then:
# - Press 'i' for iOS Simulator
# - Press 'w' for web browser
# - Scan QR code with Expo Go app on phone
```

### 6. Claude Code Setup (Optional)
For database querying with Claude Code:

```bash
# Copy MCP template
cp .claude-code/mcp.json.template .claude-code/mcp.json

# Or run setup script
chmod +x setup-claude.sh
./setup-claude.sh
```

## API Endpoints

### 🔓 Public Endpoints (No Authentication Required)

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Features (Read-Only):**
- `GET /api/features` - Get all features
- `GET /api/features/:id` - Get feature by ID

**Votes (Read-Only):**
- `GET /api/votes/feature/:featureId` - Get feature vote count

### 🔒 Protected Endpoints (Authentication Required)

**User Profile:**
- `GET /api/auth/me` - Get user profile

**Features (Write Operations):**
- `POST /api/features` - Create new feature
- `PUT /api/features/:id` - Update feature (owner only)
- `DELETE /api/features/:id` - Delete feature (owner only)

**Voting:**
- `POST /api/votes` - Vote for a feature
- `DELETE /api/votes/:featureId` - Remove vote

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

**Security Features:**
- Public browsing of features and vote counts
- JWT-based authentication for write operations
- Ownership validation (users can only modify their own features)
- One vote per user per feature

## Development

### Database Schema

**Core Tables:**
- **`users`** - User accounts with hashed passwords and metadata
- **`features`** - Feature requests with title, description, and ownership
- **`votes`** - User votes with foreign key constraints
- **`features_with_votes`** - Optimized view with vote aggregation

**Key Features:**
- Foreign key constraints for data integrity
- Unique constraints preventing duplicate votes
- Indexed columns for query performance
- Automatic timestamp management

### Project Structure
```
voting-system/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── controllers/     # Business logic (Auth, Feature, Vote)
│   │   ├── models/          # Database models with TypeScript
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # Auth, error handling, CORS
│   │   └── database/        # PostgreSQL connection pooling
│   ├── tests/               # Jest test suites (25 tests)
│   ├── docs/                # API documentation & Postman
│   └── .env                 # Environment configuration
├── mobile/                  # React Native Mobile App
│   ├── src/
│   │   ├── screens/         # HomeScreen, FeatureDetail, Create, Auth
│   │   ├── context/         # Authentication state management
│   │   ├── services/        # API client with Axios
│   │   └── components/      # Reusable UI components
│   └── assets/              # App icons and images
├── database/                # PostgreSQL Setup
│   └── init.sql            # Schema creation and seed data
├── shared/                  # Cross-Platform Types
│   └── types/index.ts      # TypeScript interfaces
└── .claude-code/           # Development Tools
    └── mcp.json.template   # Database MCP configuration
```

### Testing & Quality Assurance

#### Backend Testing
```bash
cd backend
npm test                 # Run all 25 Jest tests
npm run type-check       # TypeScript compilation check
npm run build           # Production build verification
```

**Test Coverage:**
- ✅ **Controllers** - Auth, Feature, Vote business logic
- ✅ **Models** - Database operations with mocked queries  
- ✅ **Middleware** - Error handling integration
- ✅ **Database** - Connection and query validation

#### API Testing Options
```bash
# 1. Manual cURL testing
curl http://localhost:3000/api/features

# 2. Postman Collections (Professional)
# Import: backend/docs/postman/voting-system-api.postman_collection.json
# Environment: backend/docs/postman/voting-system.postman_environment.json

# 3. Authentication example
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### Mobile Testing
```bash
cd mobile
npm start               # Start Expo dev server

# Testing options:
# - Press 'i' for iOS Simulator  
# - Press 'w' for web browser
# - Scan QR code with Expo Go app (iPhone/Android)
```

### Production Deployment

#### Docker Production Setup
```bash
# Production deployment
docker compose up -d --build

# Health checks
curl http://localhost:3000/health        # Backend health
docker compose ps                        # Container status
docker compose logs -f backend          # Real-time logs

# Database management
docker compose exec database psql -U postgres -d voting_system
```

#### Environment Configuration
```bash
# Backend environment variables (.env)
DATABASE_URL=postgresql://postgres:password@localhost:5433/voting_system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=3000

# Security settings
BCRYPT_SALT_ROUNDS=12                    # Higher for production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://yourdomain.com       # Restrict CORS in production
```

### Common Development Commands

```bash
# Development workflow
docker compose up -d                     # Start backend + database
cd mobile && npm start                   # Start mobile development

# Maintenance
docker compose down                      # Stop all services
docker compose down -v                  # Reset database (removes data)
docker compose pull                     # Update base images

# Monitoring
docker compose logs -f backend          # Backend logs
docker compose logs -f database         # Database logs
docker stats                           # Resource usage
```

### Troubleshooting

#### Common Issues & Solutions

**Database Connection Issues:**
```bash
# Check database status
docker compose logs database | grep "ready to accept connections"

# Reset database connection
docker compose restart database
docker compose logs -f database

# Manual database connection test
docker compose exec database psql -U postgres -d voting_system -c "SELECT 1;"
```

**Mobile App Issues:**
```bash
# Clear Expo cache and restart
cd mobile
npx expo start --clear

# Check mobile dependencies
npm install
npm audit fix

# Network issues - use tunnel mode
npx expo start --tunnel
```

**Backend API Issues:**
```bash
# Check API health endpoint
curl http://localhost:3000/health

# View detailed error logs
docker compose logs -f backend

# Restart backend service
docker compose restart backend
```

**Port Conflicts:**
```bash
# Check port usage
lsof -i :3000   # Backend API
lsof -i :5433   # PostgreSQL Database  
lsof -i :19000  # Expo Development Server

# Kill conflicting processes
sudo lsof -ti:3000 | xargs kill -9
```

**Authentication Issues:**
```bash
# Test authentication flow
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Verify JWT token format
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 Additional Resources

- **API Documentation**: `backend/docs/postman/`
- **Database Schema**: `database/init.sql`
- **Environment Setup**: `backend/.env.example`
- **Claude Code MCP**: `.claude-code/mcp.json.template`
- **Project Instructions**: `CLAUDE.md`

## 🚀 What's Next?

**Potential Enhancements:**
- Email verification for user registration
- Password reset functionality  
- Feature request categories and tags
- Search and filtering capabilities
- Real-time notifications
- Admin dashboard
- Feature request comments
- Voting analytics and insights