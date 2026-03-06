import { useEffect, useState } from "react";
import api from "../services/api";

export default function TopItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/dashboard/top-items").then((response) => {
      setItems(response.data.items || []);
    }).catch(() => {
      setItems([
        { item_name: "Truffle Pasta", count: 56 },
        { item_name: "Citrus Salmon", count: 42 },
        { item_name: "Classic Burger", count: 38 }
      ]);
    });
  }, []);

  return (
    <div className="card">
      <h3>Top Items</h3>
      <ul className="list">
        {items.map((item, index) => (
          <li key={`${item.item_name}-${index}`}>
            <span>{item.item_name}</span>
            <span className="pill">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
