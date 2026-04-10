# Architecture: Restaurant Management System

## Overview

A full-stack restaurant management system built with React (Vite), Node.js/Express, and MongoDB. The system supports two roles—**Owner** and **Worker**—with JWT-based authentication and role-based access control.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Bootstrap 5, Recharts |
| Backend | Node.js, Express 4 |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Deployment | Azure Static Web Apps (frontend) + Azure App Service (backend) |

---

## Folder Structure

```
/
├── src/                        # React frontend
│   ├── App.jsx                 # Routes + providers
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state (token, role, name, email)
│   ├── components/
│   │   ├── Login.jsx           # Login with role-based redirect
│   │   ├── SignUp.jsx          # Registration with role selection
│   │   ├── ProtectedRoute.jsx  # Route guard with role check
│   │   ├── Navbar.jsx
│   │   ├── Cart.jsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── WorkerDashboard.jsx # Tables, create order, order status
│   │   ├── OwnerDashboard.jsx  # Analytics, revenue, menu, inventory
│   │   └── AIFeatures.jsx      # Demand prediction, menu gen, receipt scan
│   └── home/                   # Public-facing pages (Main, CartPage, etc.)
│
├── backend/
│   ├── app.js                  # Express app + route registration
│   ├── index.js                # Server entrypoint
│   ├── db.js                   # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication + requireRole
│   ├── models/
│   │   ├── Users.js            # User schema (name, email, password, role)
│   │   ├── Orders.js           # Customer online orders
│   │   ├── Table.js            # Restaurant tables
│   │   ├── KitchenOrder.js     # In-restaurant kitchen orders
│   │   ├── MenuItem.js         # Menu items
│   │   └── Inventory.js        # Inventory tracking
│   └── Routes/
│       ├── CreateUser.js       # POST /createuser, POST /loginuser
│       ├── DisplayData.js      # GET /foodData
│       ├── OrderData.js        # POST /orderData, POST /myOrderData
│       ├── TableRoutes.js      # GET/PUT /tables, POST /tables/seed
│       ├── KitchenRoutes.js    # Kitchen order CRUD
│       ├── OwnerRoutes.js      # Analytics endpoints
│       ├── MenuRoutes.js       # Menu CRUD
│       ├── InventoryRoutes.js  # Inventory CRUD
│       └── AIRoutes.js         # AI feature endpoints
│
├── .github/workflows/
│   ├── azure-static-web-apps.yml
│   └── azure-backend-deploy.yml
└── ARCHITECTURE.md
```

---

## Database Schema

### Users
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | required |
| password | String | bcrypt hashed |
| location | String | required |
| role | String | enum: owner, worker (default: worker) |
| date | Date | default: now |

### Table
| Field | Type | Notes |
|-------|------|-------|
| tableNumber | Number | required, unique |
| status | String | available / occupied / reserved |
| capacity | Number | default: 4 |
| currentOrder | ObjectId | ref: kitchenorder |

### KitchenOrder
| Field | Type | Notes |
|-------|------|-------|
| tableNumber | Number | required |
| items | Array | [{name, quantity, price, notes}] |
| status | String | pending / preparing / ready / served |
| workerEmail | String | |
| workerName | String | |
| timestamps | — | createdAt, updatedAt |

### MenuItem
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| description | String | |
| price | Number | required |
| category | String | required |
| img | String | |
| available | Boolean | default: true |

### Inventory
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| category | String | ingredient / beverage / supply |
| quantity | Number | required |
| unit | String | required (kg, liters, pieces…) |
| minStock | Number | default: 10 |
| cost | Number | default: 0 |

---

## API Endpoints

### Auth (no token required)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/createuser | Register new user (role optional) |
| POST | /api/loginuser | Login, returns JWT + role + name |

### Tables (auth required)
| Method | Path | Role |
|--------|------|------|
| GET | /api/tables | any |
| PUT | /api/tables/:id/status | worker, owner |
| POST | /api/tables/seed | owner |

### Kitchen Orders (auth required)
| Method | Path | Role |
|--------|------|------|
| POST | /api/kitchen/order | worker, owner |
| GET | /api/kitchen/orders | any |
| PUT | /api/kitchen/orders/:id/status | worker, owner |
| GET | /api/kitchen/orders/history | any |

### Owner Analytics (owner only)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/owner/analytics | Summary cards |
| GET | /api/owner/revenue/daily | Daily revenue (30 days) |
| GET | /api/owner/top-dishes | Top selling dishes |
| GET | /api/owner/staff-performance | Orders per worker |

### Menu (GET public, mutations owner only)
| Method | Path | Role |
|--------|------|------|
| GET | /api/menu | public |
| POST | /api/menu | owner |
| PUT | /api/menu/:id | owner |
| DELETE | /api/menu/:id | owner |

### Inventory (owner only)
| Method | Path |
|--------|------|
| GET | /api/inventory |
| POST | /api/inventory |
| PUT | /api/inventory/:id |
| DELETE | /api/inventory/:id |

### AI Features (owner only)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/ai/demand-prediction | Busy hour prediction from order history |
| POST | /api/ai/menu-generator | Suggested menu items by category/cuisine |
| POST | /api/ai/receipt-scan | Receipt OCR stub (Azure Document Intelligence) |

---

## Authentication Flow

1. User logs in via `POST /api/loginuser`
2. Server returns `{ authToken, role, name, email }`
3. Frontend stores these in `localStorage` and React `AuthContext`
4. Protected routes check `AuthContext.user` and redirect if unauthenticated or wrong role
5. API requests include `Authorization: Bearer <token>` header
6. `backend/middleware/auth.js` verifies the JWT and attaches `req.user`

---

## Azure Deployment

### Frontend — Azure Static Web Apps
- Triggered on push to `main` (path: any)
- Builds with `vite build`, outputs to `dist/`
- Token stored in `AZURE_STATIC_WEB_APPS_API_TOKEN` secret

### Backend — Azure App Service
- Triggered on push to `main` affecting `backend/**`
- Deploys Node.js app via publish profile
- Secrets: `AZURE_APP_SERVICE_NAME`, `AZURE_APP_SERVICE_PUBLISH_PROFILE`
- Required env vars on App Service: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`
