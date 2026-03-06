require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../db");

const restaurantName = process.env.SEED_RESTAURANT_NAME || "RestoFlow Demo";
const ownerEmail = process.env.SEED_OWNER_EMAIL || "owner@restoflow.test";
const workerEmail = process.env.SEED_WORKER_EMAIL || "worker@restoflow.test";
const password = process.env.SEED_PASSWORD || "DemoPass123!";

async function run() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const restaurantResult = await client.query(
      `INSERT INTO restaurants (name)
       VALUES ($1)
       RETURNING id`,
      [restaurantName]
    );

    const restaurantId = restaurantResult.rows[0].id;
    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      `INSERT INTO users (restaurant_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [restaurantId, "Owner Demo", ownerEmail, passwordHash, "owner"]
    );

    await client.query(
      `INSERT INTO users (restaurant_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [restaurantId, "Worker Demo", workerEmail, passwordHash, "worker"]
    );

    await client.query("COMMIT");

    console.log("Seeded demo restaurant and users.");
    console.log(`Owner: ${ownerEmail}`);
    console.log(`Worker: ${workerEmail}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
