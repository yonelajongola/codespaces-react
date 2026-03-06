const { getLowStock, getInventoryValue } = require("../models/inventoryModel");

async function lowStock(req, res) {
  const lowStockItems = await getLowStock(req.user.restaurantId);
  return res.json({ items: lowStockItems });
}

async function inventoryValue(req, res) {
  const value = await getInventoryValue(req.user.restaurantId);
  return res.json({ value });
}

module.exports = {
  lowStock,
  inventoryValue
};
