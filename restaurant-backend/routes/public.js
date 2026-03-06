const express = require("express");
const router = express.Router();
const { getPublicMenu, createPublicOrder } = require("../controllers/publicController");

// Public routes - no authentication required
router.get("/menu", getPublicMenu);
router.post("/order", createPublicOrder);

module.exports = router;
