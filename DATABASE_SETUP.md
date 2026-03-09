# Database Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:

- **express**: Web server framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### 2. MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: `mongod`
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Update `.env` file with your connection string

### 3. Configure Environment Variables

The `.env` file is already created with default settings. Update if needed:

```
MONGODB_URI=mongodb://localhost:27017/worksphere
PORT=3000
NODE_ENV=development
```

For MongoDB Atlas, update MONGODB_URI to:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/worksphere?retryWrites=true&w=majority
```

### 4. Start the Server

```bash
npm start      # Production mode
npm run dev    # Development mode (with hot reload)
```

Server will start at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires token)

### Users

- `GET /api/users/employees` - Get all employees (admin only)
- `DELETE /api/users/:id` - Delete employee (admin only)

### Leaves

- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/my-leaves` - Get current user's leaves
- `GET /api/leaves` - Get all leaves (admin only)
- `PATCH /api/leaves/:id` - Update leave status (admin only)

### Salaries

- `POST /api/salaries/set` - Set employee salary (admin only)
- `GET /api/salaries/my-salary` - Get current user's salary
- `GET /api/salaries` - Get all salaries (admin only)

### Schedules

- `POST /api/schedules/create` - Create schedule (admin only)
- `GET /api/schedules/my-schedules` - Get current user's schedules
- `GET /api/schedules` - Get all schedules (admin only)

## Database Models

### User

- name: String (required)
- email: String (unique, required)
- password: String (hashed, required)
- role: String (employee/admin)
- createdAt: Date
- updatedAt: Date

### Leave

- email: String
- userId: ObjectId (reference to User)
- date: Date
- reason: String
- status: String (Pending/Approved/Rejected)
- createdAt: Date
- updatedAt: Date

### Salary

- email: String
- userId: ObjectId (reference to User)
- amount: Number
- currency: String
- updatedBy: ObjectId (reference to User)
- createdAt: Date
- updatedAt: Date

### Schedule

- email: String
- userId: ObjectId (reference to User)
- date: Date
- task: String
- assignedBy: ObjectId (reference to User)
- createdAt: Date
- updatedAt: Date

## Authentication Flow

1. User registers/logs in via `/api/auth/login`
2. Server returns JWT token
3. Client stores token in localStorage
4. Client includes token in Authorization header: `Authorization: Bearer <token>`
5. Server validates token via `authMiddleware`

## Testing with Postman/cURL

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "employee"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB credentials (if using Atlas)
- Check firewall/network settings

### Port Already in Use

Change PORT in .env or run: `lsof -i :3000` to find and kill process

### Dependencies Not Installing

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
