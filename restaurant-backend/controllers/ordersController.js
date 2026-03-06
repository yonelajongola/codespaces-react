const { getOrdersByRestaurant, getOrdersByWorker, updateOrderStatus } = require("../models/orderModel");

async function listOrders(req, res) {
  const restaurantId = req.user.restaurantId;
  const view = req.query.view;

  if (view === "assigned") {
    const orders = await getOrdersByWorker(restaurantId, req.user.id);
    return res.json(orders);
  }

  const orders = await getOrdersByRestaurant(restaurantId);
  return res.json(orders);
}

async function changeOrderStatus(req, res) {
  const restaurantId = req.user.restaurantId;
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Missing status" });
  }

  const order = await updateOrderStatus(id, restaurantId, status);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  return res.json(order);
}

module.exports = {
  listOrders,
  changeOrderStatus
};
