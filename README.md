# 🍔 Foodie Bar - Full Stack Food Ordering App

A modern, full-stack food delivery application built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse menu items, add them to cart, place orders, and view order history.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT & bcrypt
- 🍕 **Browse Menu** - View food items organized by categories
- 🛒 **Shopping Cart** - Add, update, and remove items with size/quantity options
- 💳 **Checkout & Payment** - Mock payment flow with order confirmation
- 📦 **Order History** - View past orders with details
- 🎨 **Responsive Design** - Mobile-first UI with Bootstrap
- 🔍 **Search Functionality** - Find food items quickly
- 📊 **Admin Features** - Database seeding and management scripts

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management for cart
- **Bootstrap 5** - Responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yonelajongola/codespaces-react.git
cd codespaces-react
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**

Create `.env` in the root directory:
```env
VITE_API_BASE=http://localhost:5000
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CORS_ORIGIN=*
```

5. **Seed the database (optional)**
```bash
cd backend
node seedDB.js
cd ..
```

### Running Locally

**Start the backend server:**
```bash
npm run server
# Or: cd backend && npm start
```

**In a new terminal, start the frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
codespaces-react/
├── backend/
│   ├── models/          # Mongoose schemas
│   │   ├── Users.js
│   │   └── Orders.js
│   ├── Routes/          # API routes
│   │   ├── CreateUser.js
│   │   ├── DisplayData.js
│   │   └── OrderData.js
│   ├── app.js           # Express app config
│   ├── index.js         # Server entry point
│   ├── db.js            # MongoDB connection
│   ├── seedDB.js        # Database seeding
│   └── package.json
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.jsx
│   │   ├── Card.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   ├── home/            # Page components
│   │   ├── Main.jsx
│   │   ├── CartPage.jsx
│   │   ├── Payment.jsx
│   │   ├── Receipt.jsx
│   │   └── MyOrder.jsx
│   ├── App.jsx          # Main app component
│   └── index.jsx        # Entry point
├── .env                 # Frontend env variables
├── vite.config.js       # Vite configuration
└── package.json

```

## 🔑 API Endpoints

### Authentication
- `POST /api/createuser` - Register new user
- `POST /api/loginuser` - Login user

### Food Data
- `POST /api/foodData` - Get all food items & categories

### Orders
- `POST /api/orderData` - Create/update order
- `POST /api/myOrderData` - Get user's order history

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variable:
   - `VITE_API_BASE` = your backend URL
4. Deploy

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
7. Deploy

**Live Demo:**
- Frontend: [Your Vercel URL]
- Backend: https://react-backend-vo5q.onrender.com

## 🔧 Available Scripts

```bash
# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run server       # Start backend server
cd backend && npm run dev  # Start with nodemon (auto-reload)

# Database
cd backend && node seedDB.js    # Seed database with sample data
cd backend && node checkDB.js   # Check database collections
```

## 🎨 Features in Detail

### User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- Protected routes for logged-in users

### Shopping Cart
- Add items with customizable size and quantity
- Persistent cart state using Context API
- Real-time price calculation

### Order Management
- Save orders to database
- View order history with timestamps
- Order details with item breakdown

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Yonela Jongola**
- GitHub: [@yonelajongola](https://github.com/yonelajongola)

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database
- Unsplash for food images
- Bootstrap team for UI components

---

⭐ Star this repo if you find it helpful!
