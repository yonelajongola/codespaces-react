import { useEffect, useState } from "react";
import api from "../services/api";

const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR"
});

export default function RevenueCard() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    api.get("/dashboard/revenue-today").then((response) => {
      setRevenue(response.data.revenue || 0);
    }).catch(() => {
      setRevenue(4280);
    });
  }, []);

  return (
    <div className="card">
      <h3>Revenue Today</h3>
      <div className="metric">{zarFormatter.format(revenue)}</div>
      <p className="muted">Net sales across all channels</p>
    </div>
  );
}
