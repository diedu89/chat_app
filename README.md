# Real-time Chat Application

A chat application built with Rails 8 API, React, TypeScript, and Action Cable for real-time communication.

## Features

- Real-time messaging using Action Cable
- JWT Authentication
- Channel-based chat rooms
- Dynamic channel creation
- Mobile-responsive design
- Multiple chat room support

## Technology Stack

### Backend (API)

- Ruby on Rails 7
- PostgreSQL
- Action Cable for WebSocket
- JWT for authentication
- RSpec for testing

### Frontend (Client)

- React 18
- TypeScript
- TailwindCSS
- Action Cable consumer
- Vite

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd chat_app
```

2. Set up the database

```bash
# If containers are not running:
docker compose run --rm api bundle exec rails db:migrate

# Or if containers are already running:
docker compose exec api bundle exec rails db:migrate
```

3. Start the application

```bash
docker compose up
```

The application will be available at:

- Frontend: http://localhost:8080
- API: http://localhost:3000
