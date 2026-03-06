import { useEffect, useState } from "react";
import api from "../services/api";

export default function StaffPerformance() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api.get("/dashboard/staff-performance").then((response) => {
      setStaff(response.data.staff || []);
    }).catch(() => {
      setStaff([
        { id: 1, name: "John Smith", orders_completed: 27 },
        { id: 2, name: "Emily Rodriguez", orders_completed: 24 },
        { id: 3, name: "David Chen", orders_completed: 22 }
      ]);
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
