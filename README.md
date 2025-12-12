# TaskFlow - Full-Stack Task Management Application

A modern, scalable web application with authentication, protected dashboard, and CRUD operations.

## Tech Stack

### Frontend
- **Framework**: Next.js 
- **Styling**: TailwindCSS 
- **UI Components**: shadcn/ui

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: PostgreSQL 
- **Authentication**: JWT 

## Features

### Authentication
- User signup with email validation
- User login with JWT token
- Logout functionality

### Dashboard
- Overview statistics
- Recent tasks display
- User profile management

### Task Management (CRUD)
- Create tasks with title, description, status, priority, and due date
- Read/list tasks with search and filtering
- Update task details and status
- Delete tasks

## API Endpoints

### Auth Module
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Module
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/update` - Update user profile

### Tasks Module
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - List all tasks 
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
```

## Getting Started

1. **Install dependencies**
   ```
   npm install
   ```

2. **Start development server**
 ```
   npm run dev
 ```

3. **Open browser**
   Navigate to `http://localhost:3000`

## Security Features

- Password hashing before storage
- JWT tokens with expiration
- HTTP-only cookies for token storage
- Input validation on all API endpoints
- SQL injection prevention with parameterized queries
- Protected routes requiring authentication


