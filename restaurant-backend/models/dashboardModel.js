const pool = require("../db");

async function getRevenueToday(restaurantId) {
  const result = await pool.query(
    `SELECT COALESCE(SUM(total), 0) AS revenue
     FROM orders
     WHERE restaurant_id = $1
       AND created_at::date = CURRENT_DATE`,
    [restaurantId]
  );
  return Number(result.rows[0].revenue);
}

async function getOrdersTodayCount(restaurantId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM orders
     WHERE restaurant_id = $1
       AND created_at::date = CURRENT_DATE`,
    [restaurantId]
  );
  return result.rows[0].count;
}

async function getRevenueLast7Days(restaurantId) {
  const result = await pool.query(
    `SELECT created_at::date AS day, COALESCE(SUM(total), 0) AS revenue
     FROM orders
     WHERE restaurant_id = $1
       AND created_at::date >= CURRENT_DATE - INTERVAL '6 days'
     GROUP BY day
     ORDER BY day`,
    [restaurantId]
  );
  return result.rows.map((row) => ({ day: row.day, revenue: Number(row.revenue) }));
}

async function getTopItems(restaurantId) {
  const result = await pool.query(
    `SELECT mi.name AS item_name, SUM(oi.quantity)::int AS count
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN menu_items mi ON mi.id = oi.menu_item_id
     WHERE o.restaurant_id = $1
     GROUP BY mi.name
     ORDER BY count DESC
     LIMIT 5`,
    [restaurantId]
  );
  return result.rows;
}

async function getStaffPerformance(restaurantId) {
  const result = await pool.query(
    `SELECT u.id, u.name, COUNT(o.id)::int AS orders_completed
     FROM users u
     LEFT JOIN orders o ON o.worker_id = u.id AND o.status = 'completed'
     WHERE u.restaurant_id = $1
       AND u.role IN ('worker', 'manager')
     GROUP BY u.id, u.name
     ORDER BY orders_completed DESC`,
    [restaurantId]
  );
  return result.rows;
}

module.exports = {
  getRevenueToday,
  getOrdersTodayCount,
  getRevenueLast7Days,
  getTopItems,
  getStaffPerformance
};
