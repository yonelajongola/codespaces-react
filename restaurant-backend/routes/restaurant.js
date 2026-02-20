const express = require("express");
const authenticateToken = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const { getInfo, updateInfo } = require("../controllers/restaurantController");

const router = express.Router();

router.get("/info", authenticateToken, getInfo);
router.put("/info", authenticateToken, allowRoles("owner", "manager"), updateInfo);

module.exports = router;
