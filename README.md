# 🔐 AUTH_BACKEND — JWT Authentication & RBAC (Express.js)

A production-ready authentication backend built with **Node.js, Express, MongoDB** implementing secure authentication using password hashing, JWT, cookies, validation, and Role-Based Access Control (RBAC).

---

## 🚀 Features

* ✅ User Registration & Login
* ✅ Password Hashing (bcrypt)
* ✅ JWT Authentication (access token)
* ✅ JWT stored in **HttpOnly Cookies**
* ✅ Protected Routes Middleware
* ✅ Role-Based Access Control (RBAC)
* ✅ Permission-based Authorization Middleware
* ✅ Input Validation (express-validator)
* ✅ Environment Variables (.env)
* ✅ Clean Folder Structure (MVC pattern)

---

## 🧠 Authentication Flow

```
Register → password hashed → saved in DB

Login → JWT generated → stored in HttpOnly cookie

Client request → cookie sent automatically

Protect middleware → verify JWT → req.user created

Authorization middleware → check role/permission → allow or deny
```

---

## 📁 Project Structure

```
AUTH_BACKEND
│
├── config
│   ├── db.js
│   └── roles.js
│
├── controller
│   └── authController.js
│
├── middleware
│   ├── protect.js
│   └── authorizationPermission.js
│
├── model
│   └── user.js
│
├── routes
│   └── authRoutes.js
│
├── .env
├── server.js
├── package.json
└── .gitignore
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* bcrypt
* jsonwebtoken
* cookie-parser
* express-validator

---

## 🔐 Security Implementations

### Password Hashing

Passwords are hashed using bcrypt before storing in database.

### JWT Authentication (Stateless)

JWT contains user id and role and is verified on every request.

### HttpOnly Cookies

JWT is stored in HttpOnly cookies to prevent XSS attacks.

### Validation Layer

Request validation prevents invalid or malicious input.

### RBAC

Access to routes depends on user role.

---

## 👤 User Roles

Defined in:

```
config/roles.js
```

Example:

```
USER
ADMIN
```

Roles are included inside JWT payload and used by authorization middleware.

---

## 🛡️ Middleware

### protect.js

* Reads JWT from cookies
* Verifies token
* Attaches decoded user to `req.user`

### authorizationPermission.js

* Checks user role/permission
* Blocks unauthorized access

---

## 🔑 API Endpoints

### Auth

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |
| POST   | /api/auth/logout   | Logout user   |

---

## 🔒 Example Protected Route

```
router.get("/admin", protect, authorize("ADMIN"), controller)
```

---

## 🌍 Environment Variables

Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=development
```

---

## ▶️ Getting Started

### 1️⃣ Clone Repo

```
git clone https://github.com/yourusername/AUTH_BACKEND.git
cd AUTH_BACKEND
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Setup Environment

Create `.env` file.

### 4️⃣ Run Server

```
npm run dev
```

or

```
npm start
```

---

## 🧪 Testing

You can test using:

* Postman
* Thunder Client
* Frontend app

Cookies will be set automatically after login.

---

## 📌 Future Improvements (Production Level)

* Refresh token system
* Email verification
* Password reset
* Rate limiting
* Account lock on brute force
* Permission-based RBAC (advanced)
* OAuth login (Google/Github)

---

## 🎯 Learning Outcomes

This project demonstrates:

* Stateless authentication architecture
* Middleware design patterns
* Secure cookie strategy
* RBAC implementation
* Production backend structure

---

## 👨‍💻 Author

Himanshu Singh Sengar
MERN Stack Developer

---

## ⭐ If you like this project

Give it a ⭐ on GitHub.
