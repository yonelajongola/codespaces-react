const pool = require("../db");

async function getLowStock(restaurantId) {
  const result = await pool.query(
    `SELECT id, ingredient, quantity, threshold, unit_cost
     FROM inventory
     WHERE restaurant_id = $1
       AND quantity <= threshold
     ORDER BY quantity ASC`,
    [restaurantId]
  );
  return result.rows;
}

async function getInventoryValue(restaurantId) {
  const result = await pool.query(
    `SELECT COALESCE(SUM(quantity * unit_cost), 0) AS value
     FROM inventory
     WHERE restaurant_id = $1`,
    [restaurantId]
  );
  return Number(result.rows[0].value);
}

module.exports = {
  getLowStock,
  getInventoryValue
};
