import { useEffect, useState } from "react";
import api from "../services/api";

const fallbackStaff = [
  { id: 1, name: "Sarah Williams", role: "Restaurant Manager", shift: "Full Day", score: 4.8 },
  { id: 2, name: "Maria Garcia", role: "Head Chef", shift: "Full Day", score: 5.0 },
  { id: 3, name: "David Chen", role: "Line Cook", shift: "Morning", score: 4.5 },
  { id: 4, name: "John Smith", role: "Waiter", shift: "Morning", score: 4.7 },
  { id: 5, name: "Emily Rodriguez", role: "Host", shift: "Afternoon", score: 4.6 },
  { id: 6, name: "Robert Taylor", role: "Cashier", shift: "Afternoon", score: 4.5 },
  { id: 7, name: "Lisa Anderson", role: "Inventory Manager", shift: "Morning", score: 4.8 },
  { id: 8, name: "Carlos Martinez", role: "Kitchen Assistant", shift: "Morning", score: 4.2 },
  { id: 9, name: "James Wilson", role: "Delivery Driver", shift: "Afternoon", score: 4.6 },
  { id: 10, name: "Patricia Brown", role: "Cleaner", shift: "Night", score: 4.4 }
];

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/staff-performance").then((response) => {
      const apiStaff = response.data.staff || [];
      if (apiStaff.length > 0) {
        setStaff(
          apiStaff.map((member) => ({
            id: member.id,
            name: member.name,
            role: member.role || "Worker",
            shift: member.shift || "Assigned",
            score: Number(member.rating || 4)
          }))
        );
      } else {
        setStaff(fallbackStaff);
      }
      setLoading(false);
    }).catch(() => {
      setStaff(fallbackStaff);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Owner</p>
          <h1>Employee Management</h1>
        </div>
        <div className="chip">{staff.length} Team Members</div>
      </header>
      <div className="card">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : staff.length === 0 ? (
          <p className="muted">No staff yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.shift}</td>
                  <td>{member.score.toFixed(1)} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
