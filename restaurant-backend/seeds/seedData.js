require("dotenv").config();

const pool = require("../db");

async function run() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get the demo restaurant
    const restaurantResult = await client.query(
      `SELECT id FROM restaurants WHERE name = $1`,
      [process.env.SEED_RESTAURANT_NAME || "RestoFlow Demo"]
    );

    if (restaurantResult.rows.length === 0) {
      console.error("No restaurant found. Run seed:users first.");
      process.exitCode = 1;
      return;
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Seed menu items
    const menuItems = [
      { name: "Burger", price: 12.99, cost: 5.50, category: "Mains" },
      { name: "Pizza", price: 14.99, cost: 6.00, category: "Mains" },
      { name: "Pasta", price: 11.99, cost: 4.50, category: "Mains" },
      { name: "Caesar Salad", price: 9.99, cost: 3.00, category: "Sides" },
      { name: "Fries", price: 4.99, cost: 1.50, category: "Sides" },
      { name: "Soda", price: 2.99, cost: 0.50, category: "Drinks" },
      { name: "Water", price: 1.99, cost: 0.25, category: "Drinks" }
    ];

    for (const item of menuItems) {
      await client.query(
        `INSERT INTO menu_items (restaurant_id, name, price, cost, category)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [restaurantId, item.name, item.price, item.cost, item.category]
      );
    }

    // Seed inventory
    const inventory = [
      { ingredient: "Cheese", quantity: 20, threshold: 5, unit_cost: 2.50 },
      { ingredient: "Beef Patties", quantity: 30, threshold: 10, unit_cost: 3.00 },
      { ingredient: "Tomatoes", quantity: 15, threshold: 8, unit_cost: 0.50 },
      { ingredient: "Lettuce", quantity: 10, threshold: 5, unit_cost: 0.75 },
      { ingredient: "Bread", quantity: 25, threshold: 10, unit_cost: 1.00 },
      { ingredient: "Pasta", quantity: 40, threshold: 15, unit_cost: 0.80 }
    ];

    for (const inv of inventory) {
      await client.query(
        `INSERT INTO inventory (restaurant_id, ingredient, quantity, threshold, unit_cost)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [restaurantId, inv.ingredient, inv.quantity, inv.threshold, inv.unit_cost]
      );
    }

    // Seed sample orders
    const getWorkerId = await client.query(
      `SELECT id FROM users WHERE restaurant_id = $1 AND role = 'worker' LIMIT 1`,
      [restaurantId]
    );

    const workerId = getWorkerId.rows[0]?.id;
    const menuItemsResult = await client.query(
      `SELECT id, price FROM menu_items WHERE restaurant_id = $1 LIMIT 3`,
      [restaurantId]
    );

    if (menuItemsResult.rows.length > 0) {
      const orders = [
        { total: 25.97, status: "completed" },
        { total: 19.98, status: "completed" },
        { total: 32.96, status: "ready" },
        { total: 14.97, status: "cooking" },
        { total: 28.95, status: "pending" }
      ];

      for (const order of orders) {
        const orderResult = await client.query(
          `INSERT INTO orders (restaurant_id, total, status, worker_id, created_at)
           VALUES ($1, $2, $3, $4, NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 7))
           RETURNING id`,
          [restaurantId, order.total, order.status, workerId || null]
        );

        const orderId = orderResult.rows[0].id;

        // Add items to order
        for (const item of menuItemsResult.rows.slice(0, 2)) {
          await client.query(
            `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
             VALUES ($1, $2, $3, $4)`,
            [orderId, item.id, 1, item.price]
          );
        }
      }
    }

    await client.query("COMMIT");
    console.log("Seeded menu items, inventory, and sample orders.");
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
