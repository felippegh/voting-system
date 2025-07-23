# Voting System

A full-stack voting system where users can post feature requests and upvote others. Built with TypeScript, PostgreSQL, Express.js, and React Native.

## Architecture

- **Backend**: Node.js + TypeScript + Express.js
- **Database**: PostgreSQL
- **Mobile**: React Native (Expo)
- **Containerization**: Docker & Docker Compose

## Quick Start

### Run Everything (Full Stack)
```bash
docker-compose up
```

### Run Backend + Database Only
```bash
docker-compose -f docker-compose.backend.yml up
```

### Run Mobile Development Only
```bash
docker-compose -f docker-compose.mobile.yml up
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 3000 | REST API server |
| PostgreSQL | 5432 | Database |
| Mobile (Expo) | 19000-19002, 8081 | React Native development |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile

### Features
- `GET /api/features` - Get all features
- `POST /api/features` - Create new feature
- `GET /api/features/:id` - Get feature by ID
- `PUT /api/features/:id` - Update feature
- `DELETE /api/features/:id` - Delete feature

### Votes
- `POST /api/votes` - Vote for a feature
- `DELETE /api/votes/:featureId` - Remove vote
- `GET /api/votes/feature/:featureId` - Get feature vote count

## Development

### Prerequisites
- Docker & Docker Compose
- (Optional) Node.js 18+ for local development

### Database Schema
The database includes:
- `users` - User accounts
- `features` - Feature requests
- `votes` - User votes (one per user per feature)
- `features_with_votes` - View with vote counts

### Mobile Development
The mobile app uses Expo for cross-platform development. Connect via:
- Scan QR code with Expo Go app
- Run on iOS/Android simulator
- Web preview available

## Commands

```bash
# Full stack
docker-compose up

# Backend only
docker-compose -f docker-compose.backend.yml up

# Mobile only  
docker-compose -f docker-compose.mobile.yml up

# Individual services
docker-compose up backend
docker-compose up database
docker-compose up mobile

# Clean up
docker-compose down
docker-compose down -v  # Remove volumes
```