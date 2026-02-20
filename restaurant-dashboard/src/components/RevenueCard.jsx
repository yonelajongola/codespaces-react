import { useEffect, useState } from "react";
import api from "../services/api";

export default function RevenueCard() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    api.get("/dashboard/revenue-today").then((response) => {
      setRevenue(response.data.revenue || 0);
    });
  }, []);

  return (
    <div className="card">
      <h3>Revenue Today</h3>
      <div className="metric">${revenue.toLocaleString()}</div>
      <p className="muted">Net sales across all channels</p>
    </div>
  );
}
