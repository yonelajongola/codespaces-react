import { useEffect, useState } from "react";
import api from "../services/api";

export default function TopItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/dashboard/top-items").then((response) => {
      setItems(response.data.items || []);
    });
  }, []);

  return (
    <div className="card">
      <h3>Top Items</h3>
      <ul className="list">
        {items.map((item) => (
          <li key={item.item_name}>
            <span>{item.item_name}</span>
            <span className="pill">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
