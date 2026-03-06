# Restaurant Management System - Full Architecture

## 🏗️ System Overview

A comprehensive AI-powered restaurant management platform with role-based dashboards for owners and staff, featuring real-time order management, inventory tracking, sales analytics, and Azure AI integration.

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  Owner Dashboard          │       Worker Dashboard          │
│  - Sales Analytics        │       - Table Management        │
│  - Menu Management        │       - Order Creation          │
│  - Inventory Tracking     │       - Kitchen Updates         │
│  - Staff Management       │       - Order Status            │
│  - Reports & Insights     │                                 │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  │   HTTPS/REST API      │
                  │                       │
┌─────────────────▼───────────────────────▼───────────────────┐
│              AZURE STATIC WEB APPS                          │
│              (React Frontend Hosting)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  - JWT Authentication                                       │
│  - Role-Based Access Control (RBAC)                        │
│  - Rate Limiting                                           │
│  - Request Validation                                      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                AZURE APP SERVICE                            │
│              (Node.js + Express Backend)                    │
├─────────────────────────────────────────────────────────────┤
│  Routes:                                                    │
│  ├── /api/auth          (Authentication)                   │
│  ├── /api/orders        (Order Management)                 │
│  ├── /api/menu          (Menu CRUD)                        │
│  ├── /api/inventory     (Inventory Tracking)               │
│  ├── /api/tables        (Table Management)                 │
│  ├── /api/employees     (Staff Management)                 │
│  ├── /api/analytics     (Sales Reports)                    │
│  ├── /api/ai            (AI Features)                      │
│  └── /api/receipts      (Receipt Scanning)                 │
└───────┬──────────────────────┬──────────────────────────────┘
        │                      │
        │                      │
┌───────▼──────────┐    ┌──────▼───────────────────────────┐
│  MONGODB ATLAS   │    │    MICROSOFT AZURE SERVICES      │
│                  │    ├──────────────────────────────────┤
│  Collections:    │    │  1. Azure OpenAI Service         │
│  - users         │    │     - Demand Prediction          │
│  - orders        │    │     - Menu Generator             │
│  - menuItems     │    │     - AI Insights                │
│  - inventory     │    │                                  │
│  - tables        │    │  2. Azure Document Intelligence  │
│  - employees     │    │     - Receipt Scanning           │
│  - analytics     │    │     - Invoice Processing         │
│                  │    │                                  │
│                  │    │  3. Azure Key Vault              │
│                  │    │     - API Keys                   │
│                  │    │     - Connection Strings         │
│                  │    │     - JWT Secrets                │
└──────────────────┘    └──────────────────────────────────┘
```

---

## 👥 User Roles & Permissions

### 1. **Owner** (Full Access)
- ✅ All analytics and reports
- ✅ Employee management
- ✅ Menu management
- ✅ Inventory control
- ✅ Financial reports
- ✅ System settings

### 2. **Restaurant Manager**
- ✅ View sales reports
- ✅ Manage employees
- ✅ Approve inventory orders
- ❌ Financial settings

### 3. **Head Chef**
- ✅ Update menu
- ✅ Manage kitchen orders
- ✅ View ingredient stock
- ❌ View sales

### 4. **Line Cook**
- ✅ View kitchen orders
- ✅ Update order status
- ❌ Menu updates

### 5. **Waiter / Server**
- ✅ Create orders
- ✅ View tables
- ✅ Send orders to kitchen
- ❌ View inventory

### 6. **Host / Hostess**
- ✅ Table management
- ✅ Reservation system
- ❌ Order creation

### 7. **Cashier**
- ✅ Process payments
- ✅ Print receipts
- ✅ Handle refunds
- ❌ View analytics

### 8. **Inventory Manager**
- ✅ Track stock
- ✅ Order supplies
- ✅ Monitor ingredient usage
- ❌ Employee management

### 9. **Kitchen Assistant**
- ✅ View prep tasks
- ✅ Update ingredient usage
- ❌ Menu management

### 10. **Delivery Driver**
- ✅ Delivery dashboard
- ✅ Order tracking
- ❌ Table management

---

## 📁 Complete Folder Structure

```
restaurant-management-system/
│
├── frontend/                          # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── styles.css
│   │   │
│   │   ├── components/               # Reusable Components
│   │   │   ├── shared/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Chart.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── RevenueCard.jsx
│   │   │   │   ├── RevenueChart.jsx
│   │   │   │   ├── OrdersList.jsx
│   │   │   │   ├── TopItems.jsx
│   │   │   │   ├── StaffPerformance.jsx
│   │   │   │   └── InsightCard.jsx
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   └── OrderStatus.jsx
│   │   │   │
│   │   │   └── employees/
│   │   │       ├── EmployeeCard.jsx
│   │   │       ├── EmployeeForm.jsx
│   │   │       └── EmployeeTable.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── WorkerDashboard.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Staff.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Tables.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── auth.js              # Auth API calls
│   │   │   ├── orders.js            # Order API calls
│   │   │   ├── menu.js              # Menu API calls
│   │   │   ├── inventory.js         # Inventory API calls
│   │   │   ├── employees.js         # Employee API calls
│   │   │   └── ai.js                # AI Features API
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useOrders.js
│   │   │   ├── useRestaurant.js
│   │   │   └── useEmployees.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── RestaurantContext.jsx
│   │   │
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── helpers.js
│   │       └── validators.js
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/                          # Node.js + Express Backend
│   ├── server.js                    # Main entry point
│   ├── db.js                        # MongoDB connection
│   ├── .env                         # Environment variables
│   │
│   ├── config/
│   │   ├── azure.js                 # Azure services config
│   │   └── database.js              # DB configuration
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Order.js
│   │   ├── MenuItem.js
│   │   ├── Inventory.js
│   │   ├── Table.js
│   │   └── Analytics.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ordersController.js
│   │   ├── menuController.js
│   │   ├── inventoryController.js
│   │   ├── tableController.js
│   │   ├── employeeController.js
│   │   ├── analyticsController.js
│   │   └── aiController.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── menu.js
│   │   ├── inventory.js
│   │   ├── tables.js
│   │   ├── employees.js
│   │   ├── analytics.js
│   │   └── ai.js
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── roles.js                 # RBAC middleware
│   │   ├── errorHandler.js
│   │   └── validator.js
│   │
│   ├── services/
│   │   ├── aiWaiter.js              # Azure OpenAI integration
│   │   ├── aiInsights.js            # AI analytics
│   │   ├── demandPredictor.js       # ML predictions
│   │   ├── receiptScanner.js        # Azure Document Intelligence
│   │   └── menuGenerator.js         # AI menu suggestions
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── encryption.js
│   │   └── helpers.js
│   │
│   └── package.json
│
├── database/
│   ├── schemas/                     # MongoDB schemas
│   │   ├── users.schema.json
│   │   ├── orders.schema.json
│   │   ├── employees.schema.json
│   │   └── inventory.schema.json
│   │
│   └── seeds/                       # Seed data
│       ├── seedUsers.js
│       ├── seedMenu.js
│       └── seedEmployees.js
│
├── deployment/
│   ├── azure/
│   │   ├── static-web-app.yaml
│   │   ├── app-service.yaml
│   │   └── deployment-guide.md
│   │
│   └── scripts/
│       ├── deploy-frontend.sh
│       └── deploy-backend.sh
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── AI_FEATURES.md
│   └── DEPLOYMENT_GUIDE.md
│
└── README.md
```

---

## 🔐 Security Architecture

### Authentication Flow
```
1. User Login → POST /api/auth/login
2. Server validates credentials
3. Generate JWT token with role
4. Return token + user info
5. Client stores token in localStorage
6. Include token in Authorization header
7. Middleware verifies token on each request
```

### JWT Token Structure
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "owner@restaurant.com",
  "role": "Owner",
  "permissions": ["all"],
  "iat": 1678125600,
  "exp": 1678212000
}
```

### Role-Based Access Control
- Middleware checks user role before processing request
- Each route has required permissions
- Unauthorized access returns 403 Forbidden

---

## 🗄️ Database Design

### Collections Overview

1. **users** - Authentication and user profiles
2. **employees** - Staff information and roles
3. **orders** - Customer orders and status
4. **menuItems** - Restaurant menu
5. **inventory** - Stock and ingredients
6. **tables** - Table management
7. **analytics** - Sales and performance data

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (Owner only)
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Inventory
- `GET /api/inventory` - Get all inventory
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update stock
- `GET /api/inventory/low-stock` - Get low stock alerts

### Tables
- `GET /api/tables` - Get all tables
- `PUT /api/tables/:id/status` - Update table status
- `POST /api/tables` - Create table

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Remove employee
- `GET /api/employees/:id/performance` - Get performance metrics

### Analytics
- `GET /api/analytics/revenue` - Revenue by date range
- `GET /api/analytics/top-items` - Best selling items
- `GET /api/analytics/staff-performance` - Staff metrics
- `GET /api/analytics/daily-summary` - Daily report

### AI Features
- `POST /api/ai/predict-demand` - Predict busy hours
- `POST /api/ai/generate-menu` - Generate menu ideas
- `POST /api/ai/scan-receipt` - Scan supplier receipt
- `GET /api/ai/insights` - Get AI insights

---

## 🤖 AI Integration

### Azure OpenAI Service
- **Demand Prediction**: Analyze historical data to predict busy times
- **Menu Generator**: Generate creative menu items
- **Customer Insights**: Analyze ordering patterns

### Azure Document Intelligence
- **Receipt Scanning**: Extract data from supplier receipts
- **Invoice Processing**: Automate bookkeeping

---

## ☁️ Azure Services Used

| Service | Purpose |
|---------|---------|
| Azure Static Web Apps | Frontend hosting |
| Azure App Service | Backend API hosting |
| Azure Key Vault | Secure secrets storage |
| Azure OpenAI Service | AI features |
| Azure Document Intelligence | Receipt scanning |
| Azure Monitor | Logging and monitoring |
| MongoDB Atlas | Database hosting |

---

## 📊 Data Flow

### Order Creation Flow
```
1. Waiter logs in → JWT with "Waiter" role
2. Waiter creates order → POST /api/orders
3. Middleware validates JWT and role
4. Order saved to MongoDB
5. Real-time update sent to kitchen dashboard
6. Chef receives order → Updates status to "Preparing"
7. Status update triggers notification
8. Order completed → Status: "Ready"
9. Waiter serves → Status: "Served"
10. Analytics updated automatically
```

---

## 🚀 Deployment Strategy

### Frontend Deployment (Azure Static Web Apps)
```bash
# Build React app
npm run build

# Deploy to Azure
az staticwebapp create \
  --name restaurant-frontend \
  --resource-group restaurant-rg \
  --source . \
  --location "East US"
```

### Backend Deployment (Azure App Service)
```bash
# Create App Service
az webapp create \
  --name restaurant-api \
  --resource-group restaurant-rg \
  --plan restaurant-plan \
  --runtime "NODE|18-lts"

# Deploy code
az webapp deployment source config-zip \
  --resource-group restaurant-rg \
  --name restaurant-api \
  --src backend.zip
```

---

## 📈 Scalability Considerations

- **Horizontal Scaling**: Azure App Service can auto-scale based on CPU/memory
- **Database Indexing**: MongoDB indexes on frequently queried fields
- **Caching**: Redis cache for frequently accessed data
- **CDN**: Azure CDN for static assets

---

## 🔍 Monitoring & Logging

- **Azure Monitor**: Track API performance
- **Application Insights**: Error tracking
- **Custom Metrics**: Order processing time, kitchen efficiency

---

## 🛠️ Development Workflow

1. Local development with environment variables
2. Git feature branches
3. Pull request reviews
4. Automated testing
5. Staging deployment
6. Production deployment

---

## 💡 Future Enhancements

- **Mobile App**: React Native version
- **QR Code Ordering**: Customer self-service
- **Payment Integration**: Stripe/PayPal
- **Multi-Restaurant**: Support multiple locations
- **Advanced Analytics**: Predictive analytics dashboard

---

**Last Updated**: March 6, 2026
**Version**: 1.0
