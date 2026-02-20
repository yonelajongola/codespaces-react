import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/dashboard/revenue-7days").then((response) => {
      setData(response.data.data || []);
    });
  }, []);

  return (
    <div className="card">
      <h3>7-Day Revenue</h3>
      <div className="chart">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "#f6f2ee" }} />
            <YAxis tick={{ fill: "#f6f2ee" }} />
            <Tooltip contentStyle={{ background: "#1b1b1b", border: "none" }} />
            <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#revenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
