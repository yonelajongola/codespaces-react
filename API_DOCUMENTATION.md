# Restaurant Management API Documentation

## 📡 API Overview

**Base URL**: `https://restaurant-api.azurewebsites.net/api`

**Authentication**: JWT Bearer Token

**API Version**: v1

**Content-Type**: `application/json`

---

## 🔐 Authentication

### Register New User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@restaurant.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "Waiter"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@restaurant.com",
    "role": "Waiter",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@restaurant.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@restaurant.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Waiter",
    "permissions": ["orders:read", "orders:write", "tables:read"],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@restaurant.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Waiter",
    "lastLogin": "2026-03-06T10:30:00Z"
  }
}
```

---

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

## 📋 Orders API

### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "tableId": "507f1f77bcf86cd799439020",
  "tableNumber": 5,
  "customerName": "Walk-in Customer",
  "items": [
    {
      "menuItemId": "507f1f77bcf86cd799439030",
      "name": "Grilled Salmon",
      "quantity": 2,
      "price": 24.99,
      "specialInstructions": "No onions"
    },
    {
      "menuItemId": "507f1f77bcf86cd799439031",
      "name": "Caesar Salad",
      "quantity": 1,
      "price": 12.99,
      "specialInstructions": ""
    }
  ],
  "orderType": "dine-in",
  "notes": ""
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20260306-0001",
    "tableNumber": 5,
    "items": [...],
    "subtotal": 62.97,
    "tax": 6.30,
    "total": 69.27,
    "status": "pending",
    "estimatedTime": 25,
    "createdAt": "2026-03-06T12:00:00Z"
  }
}
```

---

### Get All Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, preparing, ready, served, completed, cancelled)
- `date` (optional): Filter by date (YYYY-MM-DD)
- `tableId` (optional): Filter by table
- `limit` (optional): Number of results (default: 50)
- `page` (optional): Page number (default: 1)

**Example:**
```http
GET /api/orders?status=preparing&date=2026-03-06&limit=20&page=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "507f1f77bcf86cd799439013",
        "orderNumber": "ORD-20260306-0001",
        "tableNumber": 5,
        "customerName": "Walk-in Customer",
        "waiterName": "John Smith",
        "items": [
          {
            "name": "Grilled Salmon",
            "quantity": 2,
            "price": 24.99,
            "status": "preparing"
          }
        ],
        "total": 69.27,
        "status": "preparing",
        "createdAt": "2026-03-06T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 87,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

---

### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20260306-0001",
    "tableId": "507f1f77bcf86cd799439020",
    "tableNumber": 5,
    "customerName": "Walk-in Customer",
    "waiterName": "John Smith",
    "items": [...],
    "subtotal": 62.97,
    "tax": 6.30,
    "tip": 12.00,
    "total": 81.27,
    "status": "preparing",
    "paymentStatus": "pending",
    "orderType": "dine-in",
    "estimatedTime": 25,
    "createdAt": "2026-03-06T12:00:00Z",
    "updatedAt": "2026-03-06T12:05:00Z"
  }
}
```

---

### Update Order Status
```http
PUT /api/orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Status Values:**
- `pending` - Order placed but not started
- `preparing` - Kitchen is preparing the order
- `ready` - Order ready to be served
- `served` - Order delivered to customer
- `completed` - Order finished and paid
- `cancelled` - Order cancelled

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439013",
    "status": "preparing",
    "updatedAt": "2026-03-06T12:05:00Z"
  }
}
```

---

### Cancel Order
```http
DELETE /api/orders/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Customer request"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439013",
    "status": "cancelled"
  }
}
```

---

## 🍽️ Menu API

### Get All Menu Items
```http
GET /api/menu
```

**Query Parameters:**
- `category` (optional): Filter by category
- `available` (optional): true/false
- `featured` (optional): true/false

**Example:**
```http
GET /api/menu?category=Main Course&available=true
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "menuItems": [
      {
        "menuItemId": "507f1f77bcf86cd799439030",
        "name": "Grilled Salmon",
        "description": "Fresh Atlantic salmon grilled to perfection",
        "category": "Main Course",
        "price": 24.99,
        "image": "https://storage.azure.com/menu/salmon.jpg",
        "allergens": ["Fish"],
        "isVegetarian": false,
        "isVegan": false,
        "isGlutenFree": true,
        "preparationTime": 20,
        "availability": true,
        "rating": 4.7,
        "soldCount": 235
      }
    ],
    "total": 45
  }
}
```

---

### Get Menu Item by ID
```http
GET /api/menu/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "menuItemId": "507f1f77bcf86cd799439030",
    "name": "Grilled Salmon",
    "description": "Fresh Atlantic salmon grilled to perfection with herbs",
    "category": "Main Course",
    "subcategory": "Seafood",
    "price": 24.99,
    "cost": 12.00,
    "image": "https://storage.azure.com/menu/salmon.jpg",
    "ingredients": [
      {
        "name": "Salmon Fillet",
        "quantity": 200,
        "unit": "g"
      }
    ],
    "allergens": ["Fish"],
    "nutritionalInfo": {
      "calories": 450,
      "protein": 45,
      "carbs": 5,
      "fat": 28
    },
    "availability": true,
    "preparationTime": 20,
    "rating": 4.7,
    "reviews": 87
  }
}
```

---

### Create Menu Item (Owner Only)
```http
POST /api/menu
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Grilled Salmon",
  "description": "Fresh Atlantic salmon grilled to perfection",
  "category": "Main Course",
  "subcategory": "Seafood",
  "price": 24.99,
  "cost": 12.00,
  "image": "https://storage.azure.com/menu/salmon.jpg",
  "ingredients": [
    {
      "inventoryItemId": "507f1f77bcf86cd799439040",
      "name": "Salmon Fillet",
      "quantity": 200,
      "unit": "g"
    }
  ],
  "allergens": ["Fish"],
  "isVegetarian": false,
  "isVegan": false,
  "isGlutenFree": true,
  "preparationTime": 20,
  "calories": 450
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "menuItemId": "507f1f77bcf86cd799439030",
    "name": "Grilled Salmon",
    "price": 24.99,
    "availability": true,
    "createdAt": "2026-03-06T10:00:00Z"
  }
}
```

---

### Update Menu Item (Owner Only)
```http
PUT /api/menu/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 26.99,
  "availability": true,
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "menuItemId": "507f1f77bcf86cd799439030",
    "name": "Grilled Salmon",
    "price": 26.99,
    "updatedAt": "2026-03-06T10:30:00Z"
  }
}
```

---

### Delete Menu Item (Owner Only)
```http
DELETE /api/menu/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## 📦 Inventory API

### Get All Inventory
```http
GET /api/inventory
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): in-stock, low-stock, out-of-stock, expiring-soon
- `category` (optional): Seafood, Vegetables, Meat, etc.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "inventoryItemId": "507f1f77bcf86cd799439040",
        "itemCode": "INV-001",
        "name": "Salmon Fillet",
        "category": "Seafood",
        "currentStock": 25.5,
        "unit": "kg",
        "minimumStock": 10,
        "reorderPoint": 15,
        "unitPrice": 18.50,
        "status": "in-stock",
        "expiryDate": "2026-03-12T00:00:00Z",
        "supplier": {
          "name": "Fresh Seafood Co.",
          "phone": "+1234567893"
        }
      }
    ],
    "summary": {
      "totalItems": 127,
      "lowStockItems": 8,
      "outOfStockItems": 2,
      "expiringItems": 5,
      "totalValue": 45230.50
    }
  }
}
```

---

### Get Low Stock Items
```http
GET /api/inventory/low-stock
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lowStockItems": [
      {
        "inventoryItemId": "507f1f77bcf86cd799439040",
        "name": "Salmon Fillet",
        "currentStock": 8.5,
        "minimumStock": 10,
        "reorderPoint": 15,
        "supplier": "Fresh Seafood Co.",
        "status": "low-stock"
      }
    ],
    "total": 8
  }
}
```

---

### Add Inventory Item
```http
POST /api/inventory
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "itemCode": "INV-001",
  "name": "Salmon Fillet",
  "category": "Seafood",
  "unit": "kg",
  "currentStock": 25.5,
  "minimumStock": 10,
  "maximumStock": 50,
  "reorderPoint": 15,
  "unitPrice": 18.50,
  "supplier": {
    "name": "Fresh Seafood Co.",
    "contactPerson": "Mike Johnson",
    "phone": "+1234567893",
    "email": "orders@freshseafood.com"
  },
  "expiryDate": "2026-03-12T00:00:00Z",
  "storageLocation": "Walk-in Freezer A"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Inventory item added successfully",
  "data": {
    "inventoryItemId": "507f1f77bcf86cd799439040",
    "itemCode": "INV-001",
    "name": "Salmon Fillet",
    "currentStock": 25.5,
    "status": "in-stock"
  }
}
```

---

### Update Inventory Stock
```http
PUT /api/inventory/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "restock",
  "quantity": 20,
  "reason": "Regular supplier delivery"
}
```

**Type Values:**
- `restock` - Add stock
- `usage` - Reduce stock (used in orders)
- `waste` - Reduce stock (spoilage)
- `adjustment` - Manual adjustment

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Inventory updated successfully",
  "data": {
    "inventoryItemId": "507f1f77bcf86cd799439040",
    "previousStock": 5.5,
    "newStock": 25.5,
    "status": "in-stock"
  }
}
```

---

## 🪑 Tables API

### Get All Tables
```http
GET /api/tables
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): available, occupied, reserved, cleaning

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tables": [
      {
        "tableId": "507f1f77bcf86cd799439020",
        "tableNumber": 5,
        "capacity": 4,
        "location": "Main Dining Area",
        "status": "occupied",
        "currentOrderId": "507f1f77bcf86cd799439013",
        "assignedWaiter": {
          "userId": "507f1f77bcf86cd799439011",
          "name": "John Smith"
        },
        "occupiedAt": "2026-03-06T12:00:00Z",
        "estimatedFreeAt": "2026-03-06T13:30:00Z"
      }
    ],
    "summary": {
      "total": 25,
      "available": 18,
      "occupied": 5,
      "reserved": 2,
      "cleaning": 0
    }
  }
}
```

---

### Update Table Status
```http
PUT /api/tables/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "occupied",
  "orderId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Table status updated successfully",
  "data": {
    "tableId": "507f1f77bcf86cd799439020",
    "tableNumber": 5,
    "status": "occupied",
    "updatedAt": "2026-03-06T12:00:00Z"
  }
}
```

---

### Create Table Reservation
```http
POST /api/tables/:id/reserve
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "customerName": "Alice Johnson",
  "customerPhone": "+1234567894",
  "reservationTime": "2026-03-06T18:00:00Z",
  "partySize": 4,
  "specialRequests": "Window seat preferred"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Table reserved successfully",
  "data": {
    "tableId": "507f1f77bcf86cd799439020",
    "tableNumber": 5,
    "reservation": {
      "customerName": "Alice Johnson",
      "reservationTime": "2026-03-06T18:00:00Z",
      "partySize": 4
    }
  }
}
```

---

## 👥 Employees API

### Get All Employees
```http
GET /api/employees
Authorization: Bearer <token>
```

**Query Parameters:**
- `jobTitle` (optional): Filter by job title
- `department` (optional): Kitchen, Front of House, Management
- `status` (optional): active, on_leave, terminated
- `shift` (optional): Morning, Afternoon, Night, Full Day

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "employeeId": "507f1f77bcf86cd799439012",
        "employeeCode": "EMP001",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@restaurant.com",
        "phone": "+1234567891",
        "jobTitle": "Waiter",
        "department": "Front of House",
        "shift": "Morning",
        "hourlyRate": 15.00,
        "status": "active",
        "performance": {
          "rating": 4.5,
          "ordersCompleted": 1250
        }
      }
    ],
    "summary": {
      "total": 25,
      "active": 23,
      "onLeave": 2,
      "byDepartment": {
        "Kitchen": 8,
        "Front of House": 12,
        "Management": 3,
        "Delivery": 2
      }
    }
  }
}
```

---

### Get Employee by ID
```http
GET /api/employees/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employeeId": "507f1f77bcf86cd799439012",
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@restaurant.com",
    "phone": "+1234567891",
    "jobTitle": "Waiter",
    "department": "Front of House",
    "shift": "Morning",
    "hourlyRate": 15.00,
    "salary": 3000,
    "hireDate": "2026-01-15T00:00:00Z",
    "performance": {
      "rating": 4.5,
      "ordersCompleted": 1250,
      "customerRatings": 4.7,
      "punctuality": 95
    },
    "schedule": [
      {
        "day": "Monday",
        "startTime": "08:00",
        "endTime": "16:00"
      }
    ],
    "status": "active"
  }
}
```

---

### Add Employee (Owner Only)
```http
POST /api/employees
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@restaurant.com",
  "phone": "+1234567891",
  "jobTitle": "Waiter",
  "department": "Front of House",
  "shift": "Morning",
  "hourlyRate": 15.00,
  "paymentType": "hourly",
  "hireDate": "2026-01-15",
  "dateOfBirth": "1995-05-20",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee added successfully",
  "data": {
    "employeeId": "507f1f77bcf86cd799439012",
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "jobTitle": "Waiter",
    "status": "active"
  }
}
```

---

### Update Employee
```http
PUT /api/employees/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "hourlyRate": 16.00,
  "shift": "Afternoon",
  "performance": {
    "rating": 4.7
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "employeeId": "507f1f77bcf86cd799439012",
    "hourlyRate": 16.00,
    "shift": "Afternoon",
    "updatedAt": "2026-03-06T10:30:00Z"
  }
}
```

---

### Delete Employee (Owner Only)
```http
DELETE /api/employees/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee removed successfully"
}
```

---

### Get Employee Performance
```http
GET /api/employees/:id/performance
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employeeId": "507f1f77bcf86cd799439012",
    "name": "John Smith",
    "jobTitle": "Waiter",
    "period": {
      "startDate": "2026-03-01",
      "endDate": "2026-03-06"
    },
    "performance": {
      "ordersServed": 87,
      "totalRevenue": 4523.50,
      "averageOrderValue": 52.00,
      "customerRating": 4.7,
      "punctuality": 95,
      "hoursWorked": 40,
      "efficiency": "Excellent"
    }
  }
}
```

---

## 📊 Analytics API

### Get Revenue Analytics
```http
GET /api/analytics/revenue
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `period` (optional): daily, weekly, monthly

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2026-03-01",
      "end": "2026-03-06"
    },
    "revenue": {
      "total": 27141.00,
      "cash": 7200.00,
      "card": 16800.00,
      "online": 3141.00,
      "tips": 4073.40
    },
    "growth": {
      "percentage": 12.5,
      "previousPeriod": 24125.78
    },
    "dailyBreakdown": [
      {
        "date": "2026-03-01",
        "revenue": 4523.50,
        "orders": 87
      }
    ],
    "averageOrderValue": 52.53
  }
}
```

---

### Get Top Selling Items
```http
GET /api/analytics/top-items
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (required)
- `endDate` (required)
- `limit` (optional, default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topItems": [
      {
        "menuItemId": "507f1f77bcf86cd799439030",
        "name": "Grilled Salmon",
        "category": "Main Course",
        "soldCount": 138,
        "revenue": 3448.62,
        "percentage": 15.2
      },
      {
        "menuItemId": "507f1f77bcf86cd799439031",
        "name": "Caesar Salad",
        "soldCount": 186,
        "revenue": 2416.14,
        "percentage": 10.7
      }
    ],
    "totalItems": 452,
    "totalRevenue": 22673.00
  }
}
```

---

### Get Staff Performance
```http
GET /api/analytics/staff-performance
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (required)
- `endDate` (required)
- `jobTitle` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "staffPerformance": [
      {
        "employeeId": "507f1f77bcf86cd799439012",
        "name": "John Smith",
        "jobTitle": "Waiter",
        "ordersServed": 87,
        "revenue": 4523.50,
        "rating": 4.7,
        "efficiency": 92,
        "rank": 1
      }
    ],
    "summary": {
      "totalStaff": 25,
      "averageRating": 4.5,
      "topPerformer": "John Smith",
      "improvementNeeded": 3
    }
  }
}
```

---

### Get Daily Summary
```http
GET /api/analytics/daily-summary
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (optional, default: today) (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-06",
    "revenue": {
      "total": 4523.50,
      "cash": 1200.00,
      "card": 2800.50,
      "online": 523.00
    },
    "orders": {
      "total": 87,
      "completed": 85,
      "cancelled": 2,
      "averageValue": 52.00
    },
    "customers": {
      "totalServed": 187,
      "newCustomers": 12,
      "returningCustomers": 175
    },
    "topSellingItems": [
      {
        "name": "Grilled Salmon",
        "soldCount": 23
      }
    ],
    "busyHours": [12, 13, 18, 19],
    "staffOnDuty": 18
  }
}
```

---

## 🤖 AI Features API

### Predict Demand
```http
POST /api/ai/predict-demand
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "date": "2026-03-07",
  "analysisType": "hourly"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-07",
    "predictions": {
      "busyHours": [12, 13, 18, 19, 20],
      "estimatedOrders": 95,
      "peakTime": "19:00",
      "recommendedStaffing": {
        "waiters": 6,
        "cooks": 4,
        "total": 12
      },
      "hourlyForecast": [
        {
          "hour": 12,
          "estimatedOrders": 18,
          "confidence": 85
        }
      ]
    },
    "insights": [
      "Friday evenings are typically 35% busier",
      "Recommend preparing extra seafood items"
    ]
  }
}
```

---

### Generate Menu Items
```http
POST /api/ai/generate-menu
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "category": "Main Course",
  "cuisine": "Italian",
  "dietaryRestrictions": ["vegetarian"],
  "count": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "generatedItems": [
      {
        "name": "Truffle Mushroom Risotto",
        "description": "Creamy Arborio rice with wild mushrooms and black truffle oil",
        "suggestedPrice": 22.99,
        "ingredients": [
          "Arborio rice",
          "Mixed mushrooms",
          "Parmesan cheese",
          "White wine",
          "Truffle oil"
        ],
        "preparationTime": 25,
        "category": "Main Course"
      },
      {
        "name": "Eggplant Parmigiana",
        "description": "Layers of breaded eggplant with marinara and mozzarella",
        "suggestedPrice": 18.99,
        "ingredients": [
          "Eggplant",
          "Marinara sauce",
          "Mozzarella cheese",
          "Basil",
          "Breadcrumbs"
        ],
        "preparationTime": 30,
        "category": "Main Course"
      }
    ]
  }
}
```

---

### Scan Receipt
```http
POST /api/ai/scan-receipt
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
receipt: [image file]
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "vendor": "Fresh Seafood Co.",
    "date": "2026-03-05",
    "invoiceNumber": "INV-2026-0305",
    "items": [
      {
        "name": "Salmon Fillet",
        "quantity": 20,
        "unit": "kg",
        "unitPrice": 18.50,
        "total": 370.00
      },
      {
        "name": "Tuna Steak",
        "quantity": 15,
        "unit": "kg",
        "unitPrice": 22.00,
        "total": 330.00
      }
    ],
    "subtotal": 700.00,
    "tax": 70.00,
    "total": 770.00,
    "confidence": 96.5
  }
}
```

---

### Get AI Insights
```http
GET /api/ai/insights
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "demand",
        "title": "Weekend Rush Expected",
        "message": "Historical data shows 40% increase in orders on weekends",
        "action": "Consider scheduling extra staff",
        "priority": "high"
      },
      {
        "type": "inventory",
        "title": "Salmon Stock Low",
        "message": "Current stock will last only 2 days at current usage rate",
        "action": "Reorder from Fresh Seafood Co.",
        "priority": "medium"
      },
      {
        "type": "menu",
        "title": "Seasonal Menu Update",
        "message": "Spring ingredients now available",
        "action": "Consider adding seasonal specials",
        "priority": "low"
      }
    ],
    "generatedAt": "2026-03-06T10:00:00Z"
  }
}
```

---

## 🚨 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 🔑 Authentication Headers

All authenticated endpoints require JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Rate Limiting

- **Rate Limit**: 100 requests per minute per user
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 95
  - `X-RateLimit-Reset`: 1678125600

---

## 🔒 Role-Based Access

### Permission Matrix

| Endpoint | Owner | Manager | Chef | Waiter | Cashier |
|----------|-------|---------|------|--------|---------|
| POST /orders | ✅ | ✅ | ❌ | ✅ | ❌ |
| GET /orders | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /menu | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /menu | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /employees | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /analytics | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /inventory | ✅ | ✅ | ❌ | ❌ | ❌ |

---

**Last Updated**: March 6, 2026
**API Version**: 1.0
