import { useEffect, useState } from "react";
import api from "../services/api";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/staff-performance").then((response) => {
      setStaff(response.data.staff || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Owner</p>
          <h1>Staff Performance</h1>
        </div>
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
                <th>Orders Completed</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.orders_completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
