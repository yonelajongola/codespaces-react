require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const dashboardRoutes = require("./routes/dashboard");
const inventoryRoutes = require("./routes/inventory");
const restaurantRoutes = require("./routes/restaurant");
const aiWaiterRoutes = require("./routes/aiWaiter");
const publicRoutes = require("./routes/public");

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  credentials: true
}));
app.use(express.json());

// API routes
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/orders", ordersRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/ai", aiWaiterRoutes);
app.use("/public", publicRoutes);

// Serve frontend from dashboard build
const frontendPath = path.join(__dirname, "../restaurant-dashboard/dist");
app.use(express.static(frontendPath, { maxAge: "1h" }));

// SPA fallback—serve index.html for any non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
