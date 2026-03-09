# WorkSphere - Employee Management System

## Project Configuration & Setup Guide

---

## **Project Overview**

**WorkSphere** is a professional Employee Management System built with:

- **Backend:** Node.js + Express.js + MongoDB
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB with Mongoose ODM

---

## **User Roles & Access Control**

### **1. ADMIN ROLE**

- **Purpose:** Manage the entire organization
- **Access:** Admin Dashboard (`/admin-dashboard`)
- **Credentials:**
  - Email: `admin@worksphere.com`
  - Password: `Admin@123`
- **Permissions:**
  - ✅ View all employees
  - ✅ Delete employees
  - ✅ Manage leave requests (Approve/Reject)
  - ✅ Set employee salaries
  - ✅ Assign daily schedules
  - ❌ Cannot apply for leaves
  - ❌ Cannot view employee dashboard
- **Login:** Direct login on login page (no signup for admin)

### **2. EMPLOYEE ROLE**

- **Purpose:** Employee operations & self-service
- **Access:** Employee Dashboard (`/employee-dashboard`)
- **Registration:** Via signup page (role defaults to "employee")
- **Permissions:**
  - ✅ Apply for leaves
  - ✅ View own leave status
  - ✅ View own salary
  - ✅ Download payslip (PDF)
  - ✅ View assigned schedules
  - ❌ Cannot manage other employees
  - ❌ Cannot access admin dashboard
- **Signup:** Self-registration enabled on signup page

---

## **Project Structure**

```
office MANAGEMENT project/
├── config/
│   └── database.js              # MongoDB connection
├── models/
│   ├── User.js                  # User schema (admin/employee)
│   ├── Leave.js                 # Leave requests schema
│   ├── Salary.js                # Salary schema
│   └── Schedule.js              # Schedule schema
├── middleware/
│   └── auth.js                  # JWT verification & role checking
├── routes/
│   ├── auth.js                  # Register, Login, Auth check
│   ├── users.js                 # Employee management
│   ├── leaves.js                # Leave management
│   ├── salaries.js              # Salary management
│   └── schedules.js             # Schedule management
├── public/
│   ├── index.html               # Landing page
│   ├── login.html               # Universal login page
│   ├── signup.html              # Employee signup only
│   ├── employee-dashboard.html  # Employee interface
│   ├── admin-dashboard.html     # Admin interface
│   └── reset.html               # Password reset
├── scripts/
│   └── init-db.js               # Initialize admin user
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── DATABASE_SETUP.md            # Database setup guide
```

---

## **Authentication Flow**

### **Admin Login:**

1. Go to `http://localhost:3000/login`
2. Enter: `admin@worksphere.com` / `Admin@123`
3. Redirected to `/admin-dashboard`
4. JWT token stored in localStorage

### **Employee Registration & Login:**

1. Go to `http://localhost:3000/signup`
2. Enter: Name, Email, Password (min 8 chars)
3. Role automatically set to "employee"
4. Redirected to login page
5. Login with registered credentials
6. Redirected to `/employee-dashboard`
7. JWT token stored in localStorage

---

## **API Endpoints**

### **Authentication Routes** (`/api/auth`)

- `POST /register` - Register new employee
  - Body: `{ name, email, password, role: "employee" }`
- `POST /login` - Login (admin or employee)
  - Body: `{ email, password }`
  - Returns: JWT token + user object
- `GET /me` - Get current user info
  - Headers: `Authorization: Bearer <token>`

### **User Routes** (`/api/users`)

- `GET /employees` - Get all employees (admin only)
  - Headers: `Authorization: Bearer <token>`
- `DELETE /:id` - Delete employee (admin only)
  - Headers: `Authorization: Bearer <token>`

### **Leave Routes** (`/api/leaves`)

- `POST /apply` - Apply for leave (employee)
  - Body: `{ date, reason }`
- `GET /my-leaves` - Get current user's leaves
- `GET /` - Get all leaves (admin only)
- `PATCH /:id` - Update leave status (admin only)
  - Body: `{ status: "Approved" | "Rejected" }`

### **Salary Routes** (`/api/salaries`)

- `POST /set` - Set employee salary (admin only)
  - Body: `{ email, amount }`
- `GET /my-salary` - Get current user's salary
- `GET /` - Get all salaries (admin only)

### **Schedule Routes** (`/api/schedules`)

- `POST /create` - Create schedule (admin only)
  - Body: `{ email, date, task }`
- `GET /my-schedules` - Get current user's schedules
- `GET /` - Get all schedules (admin only)

---

## **Database Models**

### **User Model**

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: "admin", "employee"),
  createdAt: Date,
  updatedAt: Date
}
```

### **Leave Model**

```javascript
{
  _id: ObjectId,
  email: String,
  userId: ObjectId (ref: User),
  date: Date,
  reason: String,
  status: String (enum: "Pending", "Approved", "Rejected"),
  createdAt: Date,
  updatedAt: Date
}
```

### **Salary Model**

```javascript
{
  _id: ObjectId,
  email: String,
  userId: ObjectId (ref: User),
  amount: Number,
  currency: String,
  updatedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### **Schedule Model**

```javascript
{
  _id: ObjectId,
  email: String,
  userId: ObjectId (ref: User),
  date: Date,
  task: String,
  assignedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## **Environment Variables** (`.env`)

```
MONGODB_URI=mongodb://localhost:27017/worksphere
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

---

## **Security Features**

✅ **Password Hashing:** bcryptjs (10-round salt)
✅ **JWT Authentication:** 7-day token expiration
✅ **Role-Based Access Control:** Admin vs Employee
✅ **Server-Side Validation:** All API endpoints validated
✅ **Middleware Protection:** authMiddleware + adminMiddleware
✅ **Cascading Deletion:** When employee deleted, all related data removed

---

## **Running the Project**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Start MongoDB**

```bash
mongod --dbpath ~/mongodb_data
```

### **3. Initialize Database**

```bash
node scripts/init-db.js
```

### **4. Start Server**

```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## **Testing Credentials**

### **Admin Login:**

- Email: `admin@worksphere.com`
- Password: `Admin@123`
- Access: Admin Dashboard

### **Create Test Employee:**

1. Go to signup page
2. Create account with any email/password
3. Login with those credentials
4. Access Employee Dashboard

---

## **Features Summary**

| Feature               | Admin | Employee |
| --------------------- | ----- | -------- |
| View All Employees    | ✅    | ❌       |
| Delete Employees      | ✅    | ❌       |
| Apply for Leaves      | ❌    | ✅       |
| View Own Leaves       | ✅    | ✅       |
| Manage Leave Requests | ✅    | ❌       |
| Set Salaries          | ✅    | ❌       |
| View Own Salary       | ✅    | ✅       |
| Download Payslip      | ❌    | ✅       |
| Create Schedules      | ✅    | ❌       |
| View Own Schedule     | ✅    | ✅       |

---

## **Troubleshooting**

### **MongoDB Connection Error**

- Ensure MongoDB is running: `mongod --dbpath ~/mongodb_data`
- Check MONGODB_URI in .env file
- Verify port 27017 is available

### **Port Already in Use**

```bash
lsof -i :3000
kill -9 <PID>
```

### **JWT Token Error**

- Clear localStorage: `localStorage.clear()`
- Login again to generate new token
- Check .env JWT_SECRET is set

### **Admin Cannot Login**

- Initialize database: `node scripts/init-db.js`
- Use credentials: `admin@worksphere.com` / `Admin@123`

---

## **Next Steps**

1. ✅ Setup complete and running
2. Test admin login with provided credentials
3. Create test employee accounts via signup
4. Test all admin dashboard features
5. Test employee dashboard features
6. Deploy to production server

---

**Version:** 1.0.0  
**Last Updated:** 7 February 2026  
**Status:** Production Ready
