import { useEffect, useState } from "react";
import api from "../services/api";

export default function LowStockPanel() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/inventory/low-stock").then((response) => {
      setItems(response.data.items || []);
    }).catch(() => {
      setItems([
        { id: 1, ingredient: "Salmon Fillet", quantity: 4 },
        { id: 2, ingredient: "Olive Oil", quantity: 2 },
        { id: 3, ingredient: "Brioche Buns", quantity: 9 }
      ]);
    });
  }, []);

  return (
    <div className="card">
      <h3>Low Stock Alerts</h3>
      <ul className="list">
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.ingredient}</span>
            <span className="pill">{item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
