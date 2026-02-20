const pool = require("../db");

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT id, restaurant_id, name, email, password, role FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

async function createUser({ restaurantId, name, email, passwordHash, role }) {
  const result = await pool.query(
    `INSERT INTO users (restaurant_id, name, email, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, restaurant_id, name, email, role`,
    [restaurantId, name, email, passwordHash, role]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  createUser
};
