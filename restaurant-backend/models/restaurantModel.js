const pool = require("../db");

async function getRestaurantInfo(restaurantId) {
  const result = await pool.query(
    "SELECT id, name, subscription_plan, created_at FROM restaurants WHERE id = $1",
    [restaurantId]
  );
  return result.rows[0];
}

async function updateRestaurant(restaurantId, updates) {
  const result = await pool.query(
    `UPDATE restaurants
     SET name = COALESCE($1, name),
         subscription_plan = COALESCE($2, subscription_plan)
     WHERE id = $3
     RETURNING id, name, subscription_plan, created_at`,
    [updates.name || null, updates.subscription_plan || null, restaurantId]
  );
  return result.rows[0];
}

module.exports = {
  getRestaurantInfo,
  updateRestaurant
};
