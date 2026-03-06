# MongoDB Database Schema

## 📊 Database Overview

**Database Name**: `restaurant_management`

**Collections**: 7 main collections
- users
- employees
- orders
- menuItems
- inventory
- tables
- analytics

---

## 1. Users Collection

**Purpose**: Store authentication credentials and user profiles

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "owner@restaurant.com",
  passwordHash: "$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  role: "Owner", // Owner, Manager, Chef, Waiter, etc.
  employeeId: ObjectId("507f1f77bcf86cd799439012"), // Reference to employees collection
  permissions: [
    "orders:read",
    "orders:write",
    "menu:write",
    "analytics:read",
    "employees:write"
  ],
  status: "active", // active, inactive, suspended
  lastLogin: ISODate("2026-03-06T10:30:00Z"),
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-03-06T10:30:00Z")
}
```

### Indexes
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "employeeId": 1 })
```

### Example Documents

**Owner Account**
```javascript
{
  _id: ObjectId("660000000000000000000001"),
  email: "owner@restaurant.com",
  passwordHash: "$2b$10$xxxxxxxxxxxxx",
  firstName: "Michael",
  lastName: "Johnson",
  phone: "+1234567890",
  role: "Owner",
  permissions: ["all"],
  status: "active",
  lastLogin: ISODate("2026-03-06T09:00:00Z"),
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-03-06T09:00:00Z")
}
```

**Waiter Account**
```javascript
{
  _id: ObjectId("660000000000000000000002"),
  email: "john.waiter@restaurant.com",
  passwordHash: "$2b$10$xxxxxxxxxxxxx",
  firstName: "John",
  lastName: "Smith",
  phone: "+1234567891",
  role: "Waiter",
  employeeId: ObjectId("660000000000000000000010"),
  permissions: ["orders:read", "orders:write", "tables:read", "tables:write"],
  status: "active",
  lastLogin: ISODate("2026-03-06T08:30:00Z"),
  createdAt: ISODate("2026-02-01T00:00:00Z"),
  updatedAt: ISODate("2026-03-06T08:30:00Z")
}
```

---

## 2. Employees Collection

**Purpose**: Store detailed employee information and performance metrics

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Reference to users collection
  employeeCode: "EMP001",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@restaurant.com",
  phone: "+1234567891",
  jobTitle: "Waiter", // Manager, Head Chef, Line Cook, Waiter, Host, Cashier, etc.
  department: "Front of House", // Kitchen, Front of House, Management
  shift: "Morning", // Morning (6am-2pm), Afternoon (2pm-10pm), Night (10pm-6am), Full Day
  hourlyRate: 15.00,
  salary: 3000,
  paymentType: "hourly", // hourly, monthly, weekly
  hireDate: ISODate("2026-01-15T00:00:00Z"),
  dateOfBirth: ISODate("1995-05-20T00:00:00Z"),
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  emergencyContact: {
    name: "Jane Smith",
    relationship: "Spouse",
    phone: "+1234567892"
  },
  performance: {
    rating: 4.5, // Out of 5
    ordersCompleted: 1250,
    customerRatings: 4.7,
    punctuality: 95, // Percentage
    lastReviewDate: ISODate("2026-03-01T00:00:00Z")
  },
  schedule: [
    {
      day: "Monday",
      startTime: "08:00",
      endTime: "16:00"
    },
    {
      day: "Tuesday",
      startTime: "08:00",
      endTime: "16:00"
    }
  ],
  status: "active", // active, on_leave, terminated
  notes: "Excellent customer service skills",
  createdAt: ISODate("2026-01-15T00:00:00Z"),
  updatedAt: ISODate("2026-03-06T10:30:00Z")
}
```

### Indexes
```javascript
db.employees.createIndex({ "employeeCode": 1 }, { unique: true })
db.employees.createIndex({ "jobTitle": 1 })
db.employees.createIndex({ "department": 1 })
db.employees.createIndex({ "status": 1 })
db.employees.createIndex({ "userId": 1 })
```

### Example: 10 Restaurant Employees

```javascript
// 1. Restaurant Manager
{
  _id: ObjectId("660000000000000000000010"),
  employeeCode: "EMP001",
  firstName: "Sarah",
  lastName: "Williams",
  jobTitle: "Restaurant Manager",
  department: "Management",
  shift: "Full Day",
  salary: 5000,
  paymentType: "monthly",
  performance: { rating: 4.8, ordersCompleted: 0 },
  status: "active"
}

// 2. Head Chef
{
  _id: ObjectId("660000000000000000000011"),
  employeeCode: "EMP002",
  firstName: "Maria",
  lastName: "Garcia",
  jobTitle: "Head Chef",
  department: "Kitchen",
  shift: "Full Day",
  salary: 4500,
  paymentType: "monthly",
  performance: { rating: 5.0, ordersCompleted: 3500 },
  status: "active"
}

// 3. Line Cook
{
  _id: ObjectId("660000000000000000000012"),
  employeeCode: "EMP003",
  firstName: "David",
  lastName: "Chen",
  jobTitle: "Line Cook",
  department: "Kitchen",
  shift: "Morning",
  hourlyRate: 18.00,
  paymentType: "hourly",
  performance: { rating: 4.5, ordersCompleted: 2800 },
  status: "active"
}

// 4. Waiter
{
  _id: ObjectId("660000000000000000000013"),
  employeeCode: "EMP004",
  firstName: "John",
  lastName: "Smith",
  jobTitle: "Waiter",
  department: "Front of House",
  shift: "Morning",
  hourlyRate: 15.00,
  paymentType: "hourly",
  performance: { rating: 4.7, ordersCompleted: 1250 },
  status: "active"
}

// 5. Host
{
  _id: ObjectId("660000000000000000000014"),
  employeeCode: "EMP005",
  firstName: "Emily",
  lastName: "Rodriguez",
  jobTitle: "Host",
  department: "Front of House",
  shift: "Afternoon",
  hourlyRate: 14.00,
  paymentType: "hourly",
  performance: { rating: 4.6 },
  status: "active"
}

// 6. Cashier
{
  _id: ObjectId("660000000000000000000015"),
  employeeCode: "EMP006",
  firstName: "Robert",
  lastName: "Taylor",
  jobTitle: "Cashier",
  department: "Front of House",
  shift: "Afternoon",
  hourlyRate: 16.00,
  paymentType: "hourly",
  performance: { rating: 4.5 },
  status: "active"
}

// 7. Inventory Manager
{
  _id: ObjectId("660000000000000000000016"),
  employeeCode: "EMP007",
  firstName: "Lisa",
  lastName: "Anderson",
  jobTitle: "Inventory Manager",
  department: "Management",
  shift: "Morning",
  salary: 3500,
  paymentType: "monthly",
  performance: { rating: 4.8 },
  status: "active"
}

// 8. Kitchen Assistant
{
  _id: ObjectId("660000000000000000000017"),
  employeeCode: "EMP008",
  firstName: "Carlos",
  lastName: "Martinez",
  jobTitle: "Kitchen Assistant",
  department: "Kitchen",
  shift: "Morning",
  hourlyRate: 13.00,
  paymentType: "hourly",
  performance: { rating: 4.2 },
  status: "active"
}

// 9. Delivery Driver
{
  _id: ObjectId("660000000000000000000018"),
  employeeCode: "EMP009",
  firstName: "James",
  lastName: "Wilson",
  jobTitle: "Delivery Driver",
  department: "Delivery",
  shift: "Afternoon",
  hourlyRate: 15.00,
  paymentType: "hourly",
  performance: { rating: 4.6, ordersCompleted: 980 },
  status: "active"
}

// 10. Cleaner
{
  _id: ObjectId("660000000000000000000019"),
  employeeCode: "EMP010",
  firstName: "Patricia",
  lastName: "Brown",
  jobTitle: "Cleaner",
  department: "Maintenance",
  shift: "Night",
  hourlyRate: 12.00,
  paymentType: "hourly",
  performance: { rating: 4.4 },
  status: "active"
}
```

---

## 3. Orders Collection

**Purpose**: Track all customer orders from creation to completion

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  orderNumber: "ORD-20260306-0001",
  tableId: ObjectId("507f1f77bcf86cd799439020"), // Reference to tables collection
  tableNumber: 5,
  customerId: ObjectId("507f1f77bcf86cd799439021"), // Optional for registered customers
  customerName: "Walk-in Customer",
  waiterUserId: ObjectId("507f1f77bcf86cd799439011"),
  waiterName: "John Smith",
  items: [
    {
      menuItemId: ObjectId("507f1f77bcf86cd799439030"),
      name: "Grilled Salmon",
      quantity: 2,
      price: 24.99,
      specialInstructions: "No onions",
      status: "preparing" // pending, preparing, ready, served
    },
    {
      menuItemId: ObjectId("507f1f77bcf86cd799439031"),
      name: "Caesar Salad",
      quantity: 1,
      price: 12.99,
      specialInstructions: "",
      status: "preparing"
    }
  ],
  subtotal: 62.97,
  tax: 6.30,
  tip: 12.00,
  discount: 0,
  total: 81.27,
  status: "preparing", // pending, preparing, ready, served, completed, cancelled
  paymentStatus: "pending", // pending, paid, refunded
  paymentMethod: null, // cash, card, online
  orderType: "dine-in", // dine-in, takeout, delivery
  priority: "normal", // normal, high, urgent
  estimatedTime: 25, // minutes
  actualTime: null,
  notes: "",
  createdAt: ISODate("2026-03-06T12:00:00Z"),
  preparedAt: null,
  servedAt: null,
  completedAt: null,
  updatedAt: ISODate("2026-03-06T12:05:00Z")
}
```

### Indexes
```javascript
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })
db.orders.createIndex({ "tableId": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "createdAt": -1 })
db.orders.createIndex({ "waiterUserId": 1 })
db.orders.createIndex({ "paymentStatus": 1 })
```

### Query Optimization
```javascript
// Get today's orders - fast query
db.orders.find({
  createdAt: {
    $gte: ISODate("2026-03-06T00:00:00Z"),
    $lt: ISODate("2026-03-07T00:00:00Z")
  }
}).sort({ createdAt: -1 })

// Get active orders - indexed
db.orders.find({
  status: { $in: ["pending", "preparing", "ready"] }
})
```

---

## 4. MenuItems Collection

**Purpose**: Restaurant menu with pricing and availability

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439030"),
  name: "Grilled Salmon",
  description: "Fresh Atlantic salmon grilled to perfection with herbs",
  category: "Main Course", // Appetizer, Main Course, Dessert, Beverage, Side
  subcategory: "Seafood",
  price: 24.99,
  cost: 12.00, // Cost to prepare
  image: "https://storage.azure.com/menu/salmon.jpg",
  ingredients: [
    {
      inventoryItemId: ObjectId("507f1f77bcf86cd799439040"),
      name: "Salmon Fillet",
      quantity: 200, // grams
      unit: "g"
    },
    {
      inventoryItemId: ObjectId("507f1f77bcf86cd799439041"),
      name: "Olive Oil",
      quantity: 15,
      unit: "ml"
    }
  ],
  allergens: ["Fish"],
  isVegetarian: false,
  isVegan: false,
  isGlutenFree: true,
  spiceLevel: 1, // 0-5
  calories: 450,
  preparationTime: 20, // minutes
  availability: true,
  featured: true,
  soldCount: 235,
  rating: 4.7,
  reviews: 87,
  tags: ["popular", "healthy", "seafood"],
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-03-06T10:00:00Z")
}
```

### Indexes
```javascript
db.menuItems.createIndex({ "category": 1 })
db.menuItems.createIndex({ "availability": 1 })
db.menuItems.createIndex({ "featured": 1 })
db.menuItems.createIndex({ "name": "text", "description": "text" })
```

### Example Menu Items

```javascript
[
  {
    name: "Caesar Salad",
    category: "Appetizer",
    price: 12.99,
    preparationTime: 10,
    availability: true
  },
  {
    name: "Margherita Pizza",
    category: "Main Course",
    price: 16.99,
    preparationTime: 15,
    availability: true
  },
  {
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 8.99,
    preparationTime: 12,
    availability: true
  }
]
```

---

## 5. Inventory Collection

**Purpose**: Track ingredient stock levels and supplier information

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439040"),
  itemCode: "INV-001",
  name: "Salmon Fillet",
  category: "Seafood", // Seafood, Vegetables, Meat, Dairy, Dry Goods, Beverages
  unit: "kg",
  currentStock: 25.5,
  minimumStock: 10,
  maximumStock: 50,
  reorderPoint: 15,
  unitPrice: 18.50, // Per kg
  supplier: {
    name: "Fresh Seafood Co.",
    contactPerson: "Mike Johnson",
    phone: "+1234567893",
    email: "orders@freshseafood.com",
    address: "456 Harbor St, Seattle, WA"
  },
  lastRestocked: ISODate("2026-03-05T00:00:00Z"),
  expiryDate: ISODate("2026-03-12T00:00:00Z"),
  storageLocation: "Walk-in Freezer A",
  stockHistory: [
    {
      date: ISODate("2026-03-05T00:00:00Z"),
      type: "restock", // restock, usage, waste, adjustment
      quantity: 20,
      previousStock: 5.5,
      newStock: 25.5,
      reason: "Regular supplier delivery",
      performedBy: ObjectId("507f1f77bcf86cd799439011")
    }
  ],
  status: "in-stock", // in-stock, low-stock, out-of-stock, expiring-soon
  tags: ["perishable", "premium"],
  notes: "Store at -18°C",
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-03-05T10:00:00Z")
}
```

### Indexes
```javascript
db.inventory.createIndex({ "itemCode": 1 }, { unique: true })
db.inventory.createIndex({ "category": 1 })
db.inventory.createIndex({ "status": 1 })
db.inventory.createIndex({ "expiryDate": 1 })
db.inventory.createIndex({ "name": "text" })
```

### Low Stock Alert Query
```javascript
db.inventory.find({
  currentStock: { $lte: "$reorderPoint" },
  status: "low-stock"
})
```

---

## 6. Tables Collection

**Purpose**: Manage restaurant table status and reservations

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439020"),
  tableNumber: 5,
  capacity: 4,
  location: "Main Dining Area", // Main Dining, Patio, Private Room, Bar
  section: "A",
  status: "occupied", // available, occupied, reserved, cleaning
  currentOrderId: ObjectId("507f1f77bcf86cd799439013"),
  assignedWaiter: {
    userId: ObjectId("507f1f77bcf86cd799439011"),
    name: "John Smith"
  },
  reservation: {
    customerName: "Alice Johnson",
    customerPhone: "+1234567894",
    reservationTime: ISODate("2026-03-06T18:00:00Z"),
    partySize: 4,
    specialRequests: "Window seat preferred"
  },
  occupiedAt: ISODate("2026-03-06T12:00:00Z"),
  estimatedFreeAt: ISODate("2026-03-06T13:30:00Z"),
  qrCode: "https://restaurant.com/table/5/menu",
  isActive: true,
  notes: "",
  createdAt: ISODate("2026-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-03-06T12:00:00Z")
}
```

### Indexes
```javascript
db.tables.createIndex({ "tableNumber": 1 }, { unique: true })
db.tables.createIndex({ "status": 1 })
db.tables.createIndex({ "location": 1 })
```

---

## 7. Analytics Collection

**Purpose**: Store daily, weekly, and monthly aggregated analytics

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439050"),
  date: ISODate("2026-03-06T00:00:00Z"),
  period: "daily", // daily, weekly, monthly
  revenue: {
    total: 4523.50,
    cash: 1200.00,
    card: 2800.50,
    online: 523.00,
    tips: 678.90
  },
  orders: {
    total: 87,
    dineIn: 65,
    takeout: 15,
    delivery: 7,
    completed: 85,
    cancelled: 2,
    averageValue: 52.00,
    averageTime: 28 // minutes
  },
  menu: {
    topSellingItems: [
      {
        menuItemId: ObjectId("507f1f77bcf86cd799439030"),
        name: "Grilled Salmon",
        soldCount: 23,
        revenue: 574.77
      },
      {
        menuItemId: ObjectId("507f1f77bcf86cd799439031"),
        name: "Caesar Salad",
        soldCount: 31,
        revenue: 402.69
      }
    ],
    categories: [
      {
        name: "Main Course",
        revenue: 2850.00,
        orderCount: 52
      }
    ]
  },
  staff: {
    performanceByEmployee: [
      {
        employeeId: ObjectId("507f1f77bcf86cd799439012"),
        name: "John Smith",
        role: "Waiter",
        ordersServed: 23,
        revenue: 1196.00,
        rating: 4.7,
        hoursWorked: 8
      }
    ]
  },
  inventory: {
    itemsUsed: 45,
    stockValue: 8500.00,
    wastage: 120.00
  },
  customers: {
    totalServed: 187,
    newCustomers: 12,
    returningCustomers: 175,
    averageTableTurnover: 3.2
  },
  hourlyBreakdown: [
    {
      hour: 12,
      orders: 15,
      revenue: 780.50
    },
    {
      hour: 13,
      orders: 18,
      revenue: 936.00
    }
  ],
  aiInsights: {
    predictedBusyHours: [12, 13, 18, 19],
    recommendedStaffing: "High",
    inventoryAlerts: ["Salmon stock running low", "Order tomatoes"]
  },
  createdAt: ISODate("2026-03-06T23:59:00Z"),
  updatedAt: ISODate("2026-03-06T23:59:00Z")
}
```

### Indexes
```javascript
db.analytics.createIndex({ "date": -1 })
db.analytics.createIndex({ "period": 1 })
```

---

## 🔗 Relationships

```
users → employees (one-to-one)
employees → orders (one-to-many)
orders → menuItems (many-to-many)
menuItems → inventory (many-to-many)
orders → tables (many-to-one)
```

---

## 🎯 Query Examples

### Get Today's Revenue
```javascript
db.analytics.findOne({
  date: ISODate("2026-03-06T00:00:00Z"),
  period: "daily"
}, {
  "revenue.total": 1
})
```

### Get Active Orders by Waiter
```javascript
db.orders.find({
  waiterUserId: ObjectId("507f1f77bcf86cd799439011"),
  status: { $in: ["pending", "preparing", "ready"] }
}).sort({ createdAt: -1 })
```

### Get Low Stock Items
```javascript
db.inventory.find({
  $expr: { $lte: ["$currentStock", "$reorderPoint"] }
}).sort({ currentStock: 1 })
```

### Get Top Selling Items This Month
```javascript
db.analytics.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2026-03-01T00:00:00Z"),
        $lt: ISODate("2026-04-01T00:00:00Z")
      },
      period: "daily"
    }
  },
  {
    $unwind: "$menu.topSellingItems"
  },
  {
    $group: {
      _id: "$menu.topSellingItems.menuItemId",
      name: { $first: "$menu.topSellingItems.name" },
      totalSold: { $sum: "$menu.topSellingItems.soldCount" },
      totalRevenue: { $sum: "$menu.topSellingItems.revenue" }
    }
  },
  {
    $sort: { totalSold: -1 }
  },
  {
    $limit: 10
  }
])
```

### Get Employee Performance
```javascript
db.employees.aggregate([
  {
    $match: { status: "active" }
  },
  {
    $lookup: {
      from: "orders",
      localField: "userId",
      foreignField: "waiterUserId",
      as: "orders"
    }
  },
  {
    $project: {
      name: { $concat: ["$firstName", " ", "$lastName"] },
      jobTitle: 1,
      totalOrders: { $size: "$orders" },
      rating: "$performance.rating"
    }
  },
  {
    $sort: { totalOrders: -1 }
  }
])
```

---

## 🚀 Performance Optimization

### 1. Compound Indexes
```javascript
db.orders.createIndex({ "status": 1, "createdAt": -1 })
db.orders.createIndex({ "waiterUserId": 1, "status": 1 })
```

### 2. Text Search
```javascript
db.menuItems.createIndex({ 
  name: "text", 
  description: "text" 
})
```

### 3. TTL Index for Temporary Data
```javascript
db.sessions.createIndex(
  { "createdAt": 1 },
  { expireAfterSeconds: 86400 } // 24 hours
)
```

---

## 📦 Migration Scripts

### Initial Setup
```javascript
// Create database
use restaurant_management

// Create collections with validators
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        role: {
          enum: ["Owner", "Manager", "Head Chef", "Line Cook", "Waiter", "Host", "Cashier", "Inventory Manager", "Kitchen Assistant", "Delivery Driver", "Cleaner"]
        }
      }
    }
  }
})
```

---

**Last Updated**: March 6, 2026
**Version**: 1.0
