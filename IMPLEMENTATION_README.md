# 🍽️ AI-Powered Restaurant Management System

> A comprehensive full-stack restaurant management platform with owner and worker dashboards, built with React, Node.js, MongoDB, and Microsoft Azure AI

[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Documentation](#documentation)
- [Quick Start](#quick-start)
- [Employee Roles](#employee-roles)
- [AI Features](#ai-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This is a modern, AI-powered restaurant management system designed to streamline operations for restaurants of all sizes. The platform features two distinct dashboards:

### **Owner Dashboard**
- 📊 Real-time sales analytics and reporting
- 👥 Comprehensive employee management (10 role types)
- 📦 Inventory tracking with low-stock alerts
- 🍽️ Menu management with AI-powered suggestions
- 🤖 AI demand prediction for busy hours
- 📄 Automated receipt scanning with Azure Document Intelligence
- 💡 Business insights and recommendations

### **Worker Dashboard**
- 🪑 Table management and status tracking
- 📝 Order creation and management
- 🔔 Real-time kitchen order updates
- ✅ Order status updates (Preparing → Ready → Served)
- 📱 Simple, intuitive interface for fast service

---

## ✨ Features

### Core Features
- ✅ **Role-Based Access Control** - 10 employee roles with specific permissions
- ✅ **JWT Authentication** - Secure login and session management
- ✅ **Real-Time Order Tracking** - Live updates from creation to completion
- ✅ **Comprehensive Analytics** - Revenue, top items, staff performance
- ✅ **Inventory Management** - Track stock levels, suppliers, expiry dates
- ✅ **Table Management** - Assign waiters, track occupancy, reservations
- ✅ **Multi-Device Support** - Responsive design for tablets and phones

### AI-Powered Features 🤖
- **Demand Prediction** - Forecast busy hours using historical data
- **Menu Generator** - AI-suggested menu items based on trends
- **Receipt Scanning** - Extract data from supplier receipts automatically
- **Business Insights** - AI-driven recommendations for optimization

### Security Features 🔒
- JWT token authentication
- Role-based access control (RBAC)
- Azure Key Vault for secrets management
- HTTPS-only communication
- Input validation and sanitization

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                      │
├──────────────────────┬──────────────────────────────────────┤
│  Owner Dashboard     │     Worker Dashboard                 │
│  - Analytics         │     - Table Management               │
│  - Employee Mgmt     │     - Order Creation                 │
│  - Menu & Inventory  │     - Kitchen Updates                │
└──────────────────────┴──────────────────────┬───────────────┘
                                              │
                                    REST API  │
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                     │
├─────────────────────────────────────────────────────────────┤
│  Routes │ Controllers │ Middleware │ Services                │
│  /auth  │ /orders     │ JWT Auth   │ AI Services            │
│  /menu  │ /employees  │ RBAC       │ Analytics              │
└────────────────────┬────────────────────────┬───────────────┘
                     │                        │
                     ▼                        ▼
        ┌────────────────────┐    ┌──────────────────────┐
        │   MongoDB Atlas    │    │  Azure AI Services   │
        │  - Users           │    │  - OpenAI (GPT-4)    │
        │  - Orders          │    │  - Doc Intelligence  │
        │  - Employees       │    │  - Key Vault         │
        │  - Menu Items      │    └──────────────────────┘
        │  - Inventory       │
        └────────────────────┘
```

**Full Architecture**: See [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Cloud & AI (Microsoft Azure)
- **Azure Static Web Apps** - Frontend hosting
- **Azure App Service** - Backend hosting
- **Azure OpenAI Service** - GPT-4 for insights
- **Azure Document Intelligence** - Receipt scanning
- **Azure Key Vault** - Secrets management
- **Azure Application Insights** - Monitoring

### Database
- **MongoDB Atlas** - Cloud database (Free tier available)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Complete system architecture and design |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | MongoDB collections and schemas |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Full API reference with examples |
| [AI_FEATURES_GUIDE.md](AI_FEATURES_GUIDE.md) | Azure AI integration guide |
| [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md) | Step-by-step Azure deployment |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Azure subscription (for AI features)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yonelajongola/codespaces-react.git
cd codespaces-react
```

### 2. Setup Backend
```bash
cd restaurant-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant_management
JWT_SECRET=your-super-secret-jwt-key-change-this
AZURE_OPENAI_ENDPOINT=your-endpoint
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=your-endpoint
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-key
EOF

# Start MongoDB (if running locally)
# Or use MongoDB Atlas connection string

# Seed database with sample data
node seeds/seedEmployees.js
node seeds/seedUsers.js

# Start backend server
npm start
# Backend running at http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../restaurant-dashboard

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start development server
npm run dev
# Frontend running at http://localhost:3000
```

### 4. Login
**Default Owner Account:**
- Email: `owner@restaurant.com`
- Password: `password123`

**Default Waiter Account:**
- Email: `john.smith@restaurant.com`
- Password: `password123`

---

## 👥 Employee Roles

The system supports 10 different employee roles:

| # | Role | Department | Permissions |
|---|------|------------|-------------|
| 1 | **Restaurant Manager** | Management | View sales, manage employees, approve inventory |
| 2 | **Head Chef** | Kitchen | Update menu, manage kitchen orders, view ingredient stock |
| 3 | **Line Cook** | Kitchen | View kitchen orders, update order status |
| 4 | **Waiter / Server** | Front of House | Create orders, view tables, send orders to kitchen |
| 5 | **Host / Hostess** | Front of House | Table management, reservation system |
| 6 | **Cashier** | Front of House | Process payments, print receipts, handle refunds |
| 7 | **Inventory Manager** | Management | Track stock, order supplies, monitor ingredient usage |
| 8 | **Kitchen Assistant** | Kitchen | View prep tasks, update ingredient usage |
| 9 | **Delivery Driver** | Delivery | Delivery dashboard, order tracking |
| 10 | **Cleaner / Maintenance** | Maintenance | Cleaning tasks, maintenance reports |

**See**: [DATABASE_SCHEMA.md#employees-collection](DATABASE_SCHEMA.md) for detailed employee data structure

---

## 🤖 AI Features

### 1. **Demand Prediction**
Analyzes historical order data to predict:
- Busy hours for the next day/week
- Estimated number of orders per hour
- Recommended staffing levels
- Popular items likely to be ordered

**API**: `POST /api/ai/predict-demand`

```json
{
  "date": "2026-03-07",
  "analysisType": "hourly"
}
```

### 2. **AI Menu Generator**
Generates creative menu items based on:
- Cuisine type (Italian, Chinese, etc.)
- Dietary restrictions (vegetarian, vegan, gluten-free)
- Category (appetizer, main course, dessert)

**API**: `POST /api/ai/generate-menu`

```json
{
  "category": "Main Course",
  "cuisine": "Italian",
  "dietaryRestrictions": ["vegetarian"],
  "count": 3
}
```

### 3. **Receipt Scanner**
Uses Azure Document Intelligence to extract:
- Vendor name
- Invoice number and date
- Line items with quantities and prices
- Totals and taxes

**API**: `POST /api/ai/scan-receipt`

Upload image file and get structured JSON data.

**See**: [AI_FEATURES_GUIDE.md](AI_FEATURES_GUIDE.md) for implementation details

---

## 🗄️ Database Schema

### Main Collections

#### 1. **users**
- Authentication credentials
- Role and permissions
- Last login tracking

#### 2. **employees**
- Personal information
- Job title and department
- Schedule and shift
- Performance metrics
- Salary/hourly rate

#### 3. **orders**
- Order items and status
- Table assignment
- Waiter information
- Payment details
- Timestamps

#### 4. **menuItems**
- Name, description, price
- Ingredients and allergens
- Preparation time
- Availability and ratings

#### 5. **inventory**
- Current stock levels
- Supplier information
- Reorder points
- Expiry dates
- Usage history

**See**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete schemas with examples

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login
GET  /api/auth/me         - Get current user
POST /api/auth/refresh    - Refresh token
```

### Orders
```
POST   /api/orders              - Create order
GET    /api/orders              - Get all orders
GET    /api/orders/:id          - Get order by ID
PUT    /api/orders/:id/status   - Update order status
DELETE /api/orders/:id          - Cancel order
```

### Menu
```
GET    /api/menu        - Get all menu items
POST   /api/menu        - Create menu item (Owner)
PUT    /api/menu/:id    - Update menu item
DELETE /api/menu/:id    - Delete menu item
```

### Employees
```
GET    /api/employees                  - Get all employees
POST   /api/employees                  - Add employee (Owner)
GET    /api/employees/:id              - Get employee by ID
PUT    /api/employees/:id              - Update employee
DELETE /api/employees/:id              - Remove employee
GET    /api/employees/:id/performance  - Get performance metrics
```

### Inventory
```
GET  /api/inventory            - Get all inventory
POST /api/inventory            - Add inventory item
PUT  /api/inventory/:id        - Update stock
GET  /api/inventory/low-stock  - Get low stock alerts
```

### Analytics
```
GET /api/analytics/revenue          - Revenue by date range
GET /api/analytics/top-items        - Top selling items
GET /api/analytics/staff-performance - Staff metrics
GET /api/analytics/daily-summary    - Daily report
```

### AI Features
```
POST /api/ai/predict-demand  - Predict demand
POST /api/ai/generate-menu   - Generate menu items
POST /api/ai/scan-receipt    - Scan receipt image
GET  /api/ai/insights        - Get AI insights
```

**See**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference with examples

---

## ☁️ Deployment

### Azure Deployment (Recommended)

**Step-by-step guide**: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)

#### Quick Deployment Commands

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name restaurant-rg --location eastus

# 3. Deploy backend
cd restaurant-backend
az webapp up --name restaurant-api --runtime "NODE:18-lts"

# 4. Deploy frontend
cd ../restaurant-dashboard
npm run build
az staticwebapp create --name restaurant-frontend --source ./dist

# 5. Configure services (OpenAI, Document Intelligence, Key Vault)
# See deployment guide for detailed steps
```

### Cost Estimate
- **Free Tier**: ~$0/month (MongoDB Atlas Free, Static Web Apps Free)
- **Basic Tier**: ~$43/month (includes AI features)
- **Production Tier**: ~$100-200/month (auto-scaling, CDN)

---

## 🧪 Testing

### Backend Tests
```bash
cd restaurant-backend
npm test
```

### Frontend Tests
```bash
cd restaurant-dashboard
npm test
```

### API Testing with curl
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@restaurant.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:5000/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📦 Project Structure

```
restaurant-management-system/
├── restaurant-backend/           # Node.js Backend
│   ├── controllers/             # Request handlers
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, RBAC, validation
│   ├── services/                # AI services, business logic
│   ├── seeds/                   # Database seed scripts
│   └── server.js                # Entry point
│
├── restaurant-dashboard/         # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Dashboard pages
│   │   ├── services/            # API calls
│   │   ├── hooks/               # Custom React hooks
│   │   └── App.jsx              # Main app component
│   └── vite.config.js
│
├── docs/                         # Documentation
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── AI_FEATURES_GUIDE.md
│   └── AZURE_DEPLOYMENT_GUIDE.md
│
└── README.md                     # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Microsoft Azure** - Cloud platform and AI services
- **MongoDB Atlas** - Cloud database
- **React Team** - Frontend framework
- **Node.js Community** - Backend runtime

---

## 📧 Support

For questions or support:
- 📧 Email: support@restaurant-system.com
- 🐛 Issues: [GitHub Issues](https://github.com/yonelajongola/codespaces-react/issues)
- 📖 Docs: See documentation folder

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅ (Completed)
- [x] System architecture
- [x] Database schema
- [x] API endpoints
- [x] Employee management
- [x] AI features integration
- [x] Deployment guide

### Phase 2: Frontend Implementation (In Progress)
- [ ] Owner dashboard UI
- [ ] Worker dashboard UI
- [ ] Analytics charts
- [ ] Real-time updates
- [ ] Mobile responsive design

### Phase 3: Advanced Features (Planned)
- [ ] Multi-restaurant support
- [ ] Customer-facing order system
- [ ] QR code table ordering
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile apps (React Native)

### Phase 4: Enterprise Features (Future)
- [ ] Multi-tenant architecture
- [ ] Advanced reporting
- [ ] Custom branding
- [ ] Third-party integrations
- [ ] Franchise management

---

## 💻 System Requirements

### Development
- **OS**: Windows, macOS, or Linux
- **Node.js**: 18+ LTS
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

### Production
- **Azure Subscription**: Free or paid tier
- **MongoDB Atlas**: Free M0 tier or higher
- **Domain**: Optional for custom branding

---

## 🔥 Quick Links

- [📊 System Architecture](SYSTEM_ARCHITECTURE.md)
- [🗄️ Database Schema](DATABASE_SCHEMA.md)
- [🌐 API Documentation](API_DOCUMENTATION.md)
- [🤖 AI Features](AI_FEATURES_GUIDE.md)
- [☁️ Azure Deployment](AZURE_DEPLOYMENT_GUIDE.md)

---

<div align="center">

**Built with ❤️ for the restaurant industry**

⭐ Star this repo if you find it helpful!

</div>
