# 🌿 Farm Produce Marketplace

> Connecting Australian farmers directly with consumers — fresh, local, and fair.

**CPRO306 Capstone Project — Kent Institute Australia**

[![Live App](https://img.shields.io/badge/🌐_Live_App-Railway-success?style=for-the-badge)](https://frontend-production-05406.up.railway.app/)
[![Backend](https://img.shields.io/badge/⚙️_API-Railway-blue?style=for-the-badge)](https://farm-marketplace-production.up.railway.app/api/health)
[![Stack](https://img.shields.io/badge/Stack-React_|_Node_|_MySQL-orange?style=for-the-badge)]()

---

## 🚀 Live Deployment

| Service  | URL |
|----------|-----|
| 🌐 Frontend | https://frontend-production-05406.up.railway.app |
| ⚙️ Backend API | https://farm-marketplace-production.up.railway.app |

---

## 🎯 Demo Accounts

> Ready to use — no sign-up needed.

| Role    | Email             | Password  |
|---------|-------------------|-----------|
| 🌾 Farmer | farmer@demo.com | `test123` |
| 🛒 Buyer  | buyer@demo.com  | `test123` |
| 🔧 Admin  | admin@demo.com  | `test123` |

---

## ✨ Key Features

### 👤 Authentication & Users
- JWT-based login & registration
- Role-based access: Farmer / Buyer / Admin
- bcrypt password hashing (12 salt rounds)

### 🛍️ Marketplace
- Product listings with image upload
- Search & filter by category, price, keyword
- Shopping cart (persists in localStorage)
- Order placement with real-time stock management

### 🤖 AI & Payments
- **FarmBot** — OpenAI-powered chatbot assistant
- AI-generated product descriptions
- Stripe payment integration (test mode)

### 📊 Dashboards
- Farmer dashboard — full CRUD on listings
- Admin dashboard — user management & analytics

---

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt (12 salt rounds) |
| Authentication | JWT tokens (24h expiry) |
| Access Control | Role-based (RBAC) |
| Input Validation | express-validator |
| Abuse Prevention | Rate limiting on AI endpoints |
| CORS | Restricted to frontend URL |
| SQL Safety | Parameterised queries |

---

## 🧪 API Endpoints

```
GET  /api/health       → Health check
GET  /api/listings     → All product listings
GET  /api/categories   → All categories
```

**Base URL:** `https://farm-marketplace-production.up.railway.app`

Try it live:
- https://farm-marketplace-production.up.railway.app/api/health
- https://farm-marketplace-production.up.railway.app/api/listings
- https://farm-marketplace-production.up.railway.app/api/categories

---

## 📁 Project Structure

```
farm-marketplace/
├── client/                    ← React.js Frontend
│   └── src/
│       ├── components/        ← Navbar, ProductCard, ChatBot
│       ├── pages/             ← Home, Listings, Login, Cart, Dashboards
│       ├── context/           ← AuthContext, CartContext
│       └── services/          ← api.js (Axios)
│
└── server/                    ← Node.js + Express Backend
    ├── routes/                ← auth, listings, orders, ai, payments, admin
    ├── middleware/            ← authMiddleware (JWT)
    ├── config/                ← db.js, email.js, passport.js
    └── db/                    ← schema.sql
```

---

## 💻 Local Development

> Only needed if you want to run the project locally. The live version is already deployed.

### Prerequisites
- [Node.js LTS](https://nodejs.org)
- [MySQL](https://dev.mysql.com/downloads/installer)
- [VS Code](https://code.visualstudio.com)

### 1. Set Up the Database

```bash
mysql -u root -p < server/db/schema.sql
```

Or open `server/db/schema.sql` in MySQL Workbench and click ⚡ Execute.

### 2. Configure Environment Variables

Rename `server/.env.example` → `server/.env` and fill in:

```env
DB_PASSWORD=your_mysql_root_password
OPENAI_API_KEY=sk-...          # https://platform.openai.com/api-keys
STRIPE_SECRET_KEY=sk_test_...  # https://dashboard.stripe.com/test/apikeys
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run the Backend

```bash
cd server
npm install
npm run dev
```

Expected output:
```
✅ MySQL connected successfully
✅ Server running on http://localhost:5001
```

### 4. Run the Frontend

Open a **second terminal**:

```bash
cd client
npm install
npm start
```

App opens at → http://localhost:3000

---

## 🛠️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React.js, Axios, Context API |
| Backend   | Node.js, Express.js |
| Database  | MySQL |
| Auth      | JWT, bcrypt, Passport.js |
| AI        | OpenAI API (GPT) |
| Payments  | Stripe |
| Uploads   | Multer |
| Hosting   | Railway |

---

## 👥 Contributors

| GitHub | Role |
|--------|------|
| [@k240392-arch](https://github.com/k240392-arch) | 🧑‍💻 Full Stack Developer |
| [@k240490-del](https://github.com/k240490-del) | ⚙️ Backend Developer |
| [@Manya822](https://github.com/Manya822) | 📋 Project Manager |
| [@Alisha349](https://github.com/Alisha349) | 🎨 Frontend Developer |
| [@samii-collab](https://github.com/samii-collab) | 🧪 QA & Testing |
| [@AhmadZK231919](https://github.com/AhmadZK231919) | 🗄️ Database Administrator |

---

*CPRO306 Capstone Project — Kent Institute Australia*