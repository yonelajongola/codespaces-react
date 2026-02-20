import { useEffect, useState } from "react";
import api from "../services/api";

const statusOptions = ["pending", "cooking", "ready", "completed"];

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders?view=assigned").then((response) => {
      setOrders(response.data || []);
    });
  }, []);

  const updateStatus = async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    setOrders((prev) => prev.map((order) => (order.id === orderId ? response.data : order)));
  };

  return (
    <div className="card">
      <h3>Assigned Orders</h3>
      <ul className="list">
        {orders.map((order) => (
          <li key={order.id} className="order-row">
            <div>
              <strong>Order #{order.id}</strong>
              <span className="muted">${Number(order.total).toFixed(2)}</span>
            </div>
            <select
              value={order.status}
              onChange={(event) => updateStatus(order.id, event.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
