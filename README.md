# Role-Based Authentication & User Management API

A secure Role-Based Authentication System built using Node.js, Express.js, MongoDB, JWT, and bcrypt. The system supports three roles: Admin, Teacher, and Student.

---

## Features

- User Registration & Login
- JWT Authentication
- Role-Based Authorization (RBAC)
- Protected Routes
- Admin-controlled User Creation
- Teacher Management
- Student Management
- Current Logged-in User Endpoint
- Secure Password Hashing using bcrypt

---

## User Roles

| Role | Description |
|--------|-------------|
| Admin | Full system access and user management |
| Teacher | Teaching-related operations |
| Student | Student-related operations |

---

## User Schema

```javascript
{
  name: String,
  email: String,
  password: String,
  role: "admin" | "teacher" | "student"
}
```

---

## Demo Accounts

### Admin

```json
{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "admin"
}
```

### Teacher

```json
{
  "name": "Teacher",
  "email": "teacher@gmail.com",
  "password": "teacher123",
  "role": "teacher"
}
```

### Student

```json
{
  "name": "Student",
  "email": "student@gmail.com",
  "password": "student123",
  "role": "student"
}
```

---

## Authentication Flow

```text
Admin
  │
  ▼
POST /api/auth/register
  │
  ├── role = admin
  ├── role = teacher
  └── role = student
```

After successful registration:

```text
User Login
    │
    ▼
POST /api/auth/login
    │
    ▼
JWT Token Generated
    │
    ▼
Authorization: Bearer <token>
    │
    ▼
Access Protected Routes
```

---

## API Endpoints

### Authentication Routes

#### Register User

```http
POST /api/auth/register
```

Request Body

```json
{
  "name": "Teacher",
  "email": "teacher@gmail.com",
  "password": "teacher123",
  "role": "teacher"
}
```

#### Login User

```http
POST /api/auth/login
```

Request Body

```json
{
  "email": "teacher@gmail.com",
  "password": "teacher123"
}
```

Response

```json
{
  "token": "JWT_TOKEN"
}
```

#### Get Current User

```http
GET /api/auth/me
```

Headers

```http
Authorization: Bearer JWT_TOKEN
```

Response

```json
{
  "_id": "user_id",
  "name": "Teacher",
  "email": "teacher@gmail.com",
  "role": "teacher"
}
```

---

## Teacher Routes

### Create Teacher

```http
POST /api/teachers
```

Headers

```http
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "name": "Teacher",
  "email": "teacher@gmail.com",
  "password": "teacher123"
}
```

---

## Student Routes

### Create Student

```http
POST /api/students
```

Headers

```http
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "name": "Student",
  "email": "student@gmail.com",
  "password": "student123"
}
```

---

## Authorization Rules

| Endpoint | Admin | Teacher | Student |
|-----------|---------|----------|----------|
| Register User | Yes | No | No |
| Create Teacher | Yes | No | No |
| Create Student | Yes | No | No |
| Login | Yes | Yes | Yes |
| View Own Profile | Yes | Yes | Yes |

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Security

- JWT Authentication
- bcrypt Password Hashing

---

## Project Structure

```text
backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
│
├── server.js
├── package.json
└── README.md
```

---

## Authentication Middleware

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

Example:

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

## Installation

```bash
git clone https://github.com/your-username/project-name.git

cd project-name

npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the server:

```bash
npm run dev
```
