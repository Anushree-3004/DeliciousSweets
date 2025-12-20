# 🍬 DeliciousSweets — Sweet Shop Management System

DeliciousSweets is a full-stack **Sweet Shop Management System** designed and developed as a **Test-Driven Development (TDD) Kata**.  
The application provides secure user authentication, complete sweets and inventory management, and a modern frontend interface for both customers and administrators.

This project demonstrates real-world backend design, API security, database integration, frontend development, testing, and responsible AI usage.

---

## 📌 Project Objectives

- Build a secure, scalable backend API
- Implement inventory and role-based access control
- Develop a modern single-page frontend application
- Follow clean coding practices and test-driven development
- Maintain a clear and descriptive Git commit history
- Transparently use AI tools as development aids

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (User / Admin)
- Protected API endpoints

### 🍩 Sweets Management
- View all available sweets
- Search sweets by:
  - Name
  - Category
  - Price range
- Each sweet includes:
  - Unique ID
  - Name
  - Category
  - Price
  - Quantity in stock

### 📦 Inventory Operations
- Purchase sweets (quantity decreases)
- Purchase disabled when stock is zero
- Restock sweets (Admin only)
- Delete sweets (Admin only)

### 🖥 Frontend Application
- Single-page application (SPA)
- User login and registration
- Dashboard displaying all sweets
- Dedicated search and filter page
- Purchase button disabled when quantity is zero
- Admin dashboard to:
  - Add sweets
  - Edit sweets
  - Delete sweets

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- Jest & Supertest

### Frontend
- React
- Vite
- Context API
- CSS

---

## 📁 Project Structure

**DeliciousSweets/
│
├── Backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controller/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── tests/
│ │ ├── utils/
│ │ └── server.js
│ └── jest.config.js
│
├── Frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ └── styles.css
│ └── vite.config.js**

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or cloud)
- Git



### 🔧 Backend Setup

bash
cd Backend
npm install

### 🤖 My AI Usage

AI tools were used responsibly to enhance productivity and code quality.

Tools Used

ChatGPT (OpenAI)
Wrap AI

How AI Was Used

Brainstorming API design and architecture
Generating initial boilerplate for controllers and tests
Debugging failing tests and edge cases
Improving documentation and readability

Reflection

AI accelerated development and improved problem-solving efficiency.
All AI-generated suggestions were reviewed, modified, and integrated manually to ensure correctness and originality.
For commits where AI assistance was used, AI is credited as a co-author in the commit messages.

### 📸 Screenshots
<img width="960" height="540" alt="pic3" src="https://github.com/user-attachments/assets/1d699fd0-b293-4603-9a85-d1326813e866" />
<img width="960" height="540" alt="pic2" src="https://github.com/user-attachments/assets/32f9a7cc-bf12-43d8-adf6-c884e4f39457" />
<img width="960" height="540" alt="pic" src="https://github.com/user-attachments/assets/df3d1c89-16e6-40e0-bda2-44378bb37c3d" />
<img width="960" height="540" alt="98b244e4-2fab-4ee1-b78d-b36aa99067ac" src="https://github.com/user-attachments/assets/a09d2fcc-0654-452d-a1e6-5f6e84ac951b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b6815074-3333-4c61-b39b-dc4968d57dff" />

### Tests
## 🧪 Test Report

The backend application is thoroughly tested using **Jest** and **Supertest** to ensure correctness, security, and reliability of all core features.

### ✅ Test Coverage

The test suite validates the following functionality:

#### 🔐 Authentication
- User registration with valid data
- Prevention of duplicate user registration
- User login with valid credentials
- Rejection of invalid login attempts
- JWT token generation on successful login

#### 🍩 Sweets API
- Create a new sweet (Admin only)
- Fetch all available sweets
- Search sweets by name, category, and price range
- Update sweet details (Admin only)
- Delete a sweet (Admin only)
- Validation of price and quantity inputs

#### 📦 Inventory Management
- Purchase a sweet and decrease stock
- Prevent purchase when quantity is zero
- Restock a sweet and increase stock (Admin only)
- Reject inventory operations by unauthorized users

#### 🛡 Authorization & Security
- Access denial for unauthenticated users
- Enforcement of admin-only routes
- Proper HTTP status codes and error responses

---

### ▶️ Running the Tests

To run the full backend test suite:

bash
cd Backend
npm test

## 📊 Test Results

All tests pass successfully
Tests run against a dedicated test database
Each test suite cleans up data to ensure isolation
Edge cases and failure scenarios are explicitly tested
The test suite ensures that the backend behaves correctly under real-world conditions and that critical business logic remains stable as the application evolves.

## 🌐 deployed application

the application is fully deployed with separate frontend and backend services.

frontend (react app):
https://delicioussweets.onrender.com

backend (node.js / express api):
https://delicioussweets-backend.onrender.com

