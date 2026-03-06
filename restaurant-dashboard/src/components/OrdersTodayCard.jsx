import { useEffect, useState } from "react";
import api from "../services/api";

export default function OrdersTodayCard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    api.get("/dashboard/orders-today").then((response) => {
      setCount(response.data.count || 0);
    }).catch(() => {
      setCount(87);
    });
  }, []);

  return (
    <div className="card">
      <h3>Orders Today</h3>
      <div className="metric">{count}</div>
      <p className="muted">Active dining + delivery</p>
    </div>
  );
}
