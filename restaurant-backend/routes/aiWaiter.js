const express = require("express");
const authenticateToken = require("../middleware/auth");
const { search, recommendations } = require("../controllers/aiWaiterController");

const router = express.Router();

router.post("/search", authenticateToken, search);
router.get("/recommendations", authenticateToken, recommendations);

module.exports = router;
