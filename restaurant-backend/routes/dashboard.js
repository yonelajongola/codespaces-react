const express = require("express");
const authenticateToken = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const {
  revenueToday,
  ordersToday,
  revenueLast7Days,
  topItems,
  staffPerformance,
  inventorySummary,
  aiSummary,
  forecastNextDay
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/revenue-today", authenticateToken, allowRoles("owner", "manager"), revenueToday);
router.get("/orders-today", authenticateToken, allowRoles("owner", "manager"), ordersToday);
router.get("/revenue-7days", authenticateToken, allowRoles("owner", "manager"), revenueLast7Days);
router.get("/top-items", authenticateToken, allowRoles("owner", "manager"), topItems);
router.get("/staff-performance", authenticateToken, allowRoles("owner", "manager"), staffPerformance);
router.get("/inventory-summary", authenticateToken, allowRoles("owner", "manager"), inventorySummary);
router.get("/ai-summary", authenticateToken, allowRoles("owner", "manager"), aiSummary);
router.get("/forecast", authenticateToken, allowRoles("owner", "manager"), forecastNextDay);

module.exports = router;
