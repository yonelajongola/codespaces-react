const express = require("express");
const authenticateToken = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const { lowStock, inventoryValue } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/low-stock", authenticateToken, allowRoles("owner", "manager", "worker"), lowStock);
router.get("/value", authenticateToken, allowRoles("owner", "manager"), inventoryValue);

module.exports = router;
