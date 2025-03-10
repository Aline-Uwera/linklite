# URL Shortener Service

## 📌 Overview
This is a URL shortening service that allows authenticated users to shorten URLs, track analytics, and manage their links. The system uses NestJS for the backend with PostgreSQL, and authentication is handled using JWT.

## 🚀 Features
### **1. Authentication & User Management**
- User registration and login using JWT (access & refresh tokens).
- Secure password hashing with bcrypt.

### **2. URL Management**
- Authenticated users can shorten URLs.
- Users can view and manage only their own URLs.
- Click tracking for analytics.

### **3. Database & Storage**
- PostgreSQL as the database.

---

## 🛠 Tech Stack
- **Backend:** NestJS (TypeScript, Express, TypeORM)
- **Database:** PostgreSQL
- **Authentication:** JWT (Passport.js)
- **Frontend:** Vite React 

---

## 🔧 Setup Instructions
### **1. Clone the Repository**
```sh
 git https://github.com/Aline-Uwera/linklite.git
 cd linklite
```

### **2. Install Dependencies**
```sh
yarn install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and set up the following:
```env
DATABASE_URL
JWT_SECRET
```

### **4. Start the Server**
```sh
yarn start:dev 
```

---

## 📌 API Documentation
### **Authentication Endpoints**

#### **1. Register User**
```http
POST /auth/register
```
#### **2. Login User**
```http
POST /auth/login
```

---

### **URL Shortening Endpoints**
#### **3. Shorten a URL**
```http
POST urls/shorten
```
#### **4. Get User’s URLs**
```http
GET /urls
```

#### **5. Get URL Analytics**
```http
GET /analytics/:shortUrl
```

---


