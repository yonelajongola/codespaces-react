const { getRestaurantInfo, updateRestaurant } = require("../models/restaurantModel");

async function getInfo(req, res) {
  try {
    const restaurant = await getRestaurantInfo(req.user.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return res.json(restaurant);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function updateInfo(req, res) {
  try {
    const restaurant = await updateRestaurant(req.user.restaurantId, req.body);
    return res.json(restaurant);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getInfo,
  updateInfo
};
