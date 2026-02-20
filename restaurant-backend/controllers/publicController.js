const db = require("../db");

const getPublicMenu = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, description, price, category FROM menu_items WHERE available = true ORDER BY category, name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Menu fetch error:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};

const createPublicOrder = async (req, res) => {
  const { items, customerName, customerPhone, specialRequests } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Create order
    const orderResult = await client.query(
      "INSERT INTO orders (restaurant_id, status, customer_name, customer_phone, special_requests, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id",
      [1, "pending", customerName, customerPhone, specialRequests || ""]
    );
    const orderId = orderResult.rows[0].id;

    // Add order items
    let totalPrice = 0;
    for (const item of items) {
      const menuResult = await client.query(
        "SELECT price FROM menu_items WHERE id = $1",
        [item.menuItemId]
      );
      if (menuResult.rows.length === 0) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      const price = menuResult.rows[0].price;
      totalPrice += price * item.quantity;

      await client.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.menuItemId, item.quantity, price]
      );
    }

    // Update order total
    await client.query("UPDATE orders SET total_price = $1 WHERE id = $2", [
      totalPrice,
      orderId,
    ]);

    await client.query("COMMIT");

    res.status(201).json({
      orderId,
      totalPrice,
      status: "pending",
      message: "Order created successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
};

module.exports = { getPublicMenu, createPublicOrder };
