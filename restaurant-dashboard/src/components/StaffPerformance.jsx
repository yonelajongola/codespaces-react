import { useEffect, useState } from "react";
import api from "../services/api";

export default function StaffPerformance() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api.get("/dashboard/staff-performance").then((response) => {
      setStaff(response.data.staff || []);
    });
  }, []);

  return (
    <div className="card">
      <h3>Staff Performance</h3>
      <ul className="list">
        {staff.map((member) => (
          <li key={member.id}>
            <span>{member.name}</span>
            <span className="pill">{member.orders_completed}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
