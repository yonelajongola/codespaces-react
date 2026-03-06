const { searchOrders, getRecommendations } = require("../services/aiWaiter");

async function search(req, res) {
  const { query } = req.body;
  const restaurantId = req.user.restaurantId;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const result = await searchOrders(query, restaurantId);
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function recommendations(req, res) {
  const restaurantId = req.user.restaurantId;

  try {
    const result = await getRecommendations(restaurantId);
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  search,
  recommendations
};
