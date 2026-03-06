const express = require("express");
const authenticateToken = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const { listOrders, changeOrderStatus } = require("../controllers/ordersController");

const router = express.Router();

router.get("/", authenticateToken, listOrders);
router.put("/:id/status", authenticateToken, allowRoles("owner", "manager", "worker"), changeOrderStatus);

module.exports = router;
