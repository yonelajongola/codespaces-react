import { useEffect, useState } from "react";
import api from "../services/api";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/inventory/low-stock").then((response) => {
      setInventory(response.data.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Owner</p>
          <h1>Inventory</h1>
        </div>
      </header>
      <div className="card">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : inventory.length === 0 ? (
          <p className="muted">All stock levels normal.</p>
        ) : (
          <>
            <h3>Low Stock Items</h3>
            <ul className="list">
              {inventory.map((item) => (
                <li key={item.id}>
                  <span>{item.ingredient}</span>
                  <span className="pill">{item.quantity}/{item.threshold}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
