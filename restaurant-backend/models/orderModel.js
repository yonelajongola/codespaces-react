const pool = require("../db");

async function getOrdersByRestaurant(restaurantId) {
  const result = await pool.query(
    `SELECT id, total, status, worker_id, created_at
     FROM orders
     WHERE restaurant_id = $1
     ORDER BY created_at DESC`,
    [restaurantId]
  );
  return result.rows;
}

async function getOrdersByWorker(restaurantId, workerId) {
  const result = await pool.query(
    `SELECT id, total, status, worker_id, created_at
     FROM orders
     WHERE restaurant_id = $1 AND worker_id = $2
     ORDER BY created_at DESC`,
    [restaurantId, workerId]
  );
  return result.rows;
}

async function updateOrderStatus(orderId, restaurantId, status) {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE id = $2 AND restaurant_id = $3
     RETURNING id, total, status, worker_id, created_at`,
    [status, orderId, restaurantId]
  );
  return result.rows[0];
}

module.exports = {
  getOrdersByRestaurant,
  getOrdersByWorker,
  updateOrderStatus
};
