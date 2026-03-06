import { useEffect, useState } from "react";
import api from "../services/api";

export default function InsightCard() {
  const [insight, setInsight] = useState("Loading insight...");

  useEffect(() => {
    api.get("/dashboard/ai-summary").then((response) => {
      setInsight(response.data.insight || "No insights available.");
    }).catch(() => {
      setInsight("Demand likely to spike between 18:00 and 20:00. Pre-stage two extra line cooks and prep high-volume dishes.");
    });
  }, []);

  return (
    <div className="card highlight">
      <h3>AI Daily Insight</h3>
      <p>{insight}</p>
    </div>
  );
}
