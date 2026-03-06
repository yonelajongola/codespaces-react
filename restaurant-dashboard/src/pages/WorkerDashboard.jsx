import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import OrdersList from "../components/OrdersList";
import LowStockPanel from "../components/LowStockPanel";

function WorkerHome() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>Floor Live Board</h1>
        </div>
        <div className="chip">Service Shift</div>
      </header>
      <section className="grid three">
        <div className="card">
          <h3>Open Orders</h3>
          <div className="metric">14</div>
          <p className="muted">Across all active tables</p>
        </div>
        <div className="card">
          <h3>Tables Occupied</h3>
          <div className="metric">9 / 16</div>
          <p className="muted">Peak expected at 19:30</p>
        </div>
        <div className="card highlight">
          <h3>Priority Alert</h3>
          <p>Table 8 has a delayed main course. Marked urgent by host.</p>
        </div>
      </section>
      <section className="grid two">
        <OrdersList />
        <LowStockPanel />
      </section>
    </>
  );
}

function TableManagement() {
  const [tables, setTables] = useState([
    { id: 1, status: "Available", seats: 2 },
    { id: 2, status: "Occupied", seats: 4 },
    { id: 3, status: "Reserved", seats: 4 },
    { id: 4, status: "Occupied", seats: 6 },
    { id: 5, status: "Cleaning", seats: 2 },
    { id: 6, status: "Available", seats: 4 }
  ]);

  const nextStatus = (current) => {
    const flow = ["Available", "Occupied", "Cleaning", "Available"];
    if (current === "Reserved") {
      return "Occupied";
    }
    const index = flow.indexOf(current);
    return flow[(index + 1) % flow.length];
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>Table Management</h1>
        </div>
        <div className="chip">Tap to update status</div>
      </header>
      <section className="grid three">
        {tables.map((table) => (
          <button
            key={table.id}
            className="card table-card"
            onClick={() => {
              setTables((prev) =>
                prev.map((item) =>
                  item.id === table.id ? { ...item, status: nextStatus(item.status) } : item
                )
              );
            }}
          >
            <p className="eyebrow">Table {table.id}</p>
            <h3>{table.status}</h3>
            <p className="muted">{table.seats} seats</p>
          </button>
        ))}
      </section>
    </>
  );
}

function CreateOrder() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ table: "1", item: "Classic Burger", qty: 1, notes: "" });
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    // Fetch menu items from backend
    fetch("http://localhost:3000/api/foodData", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then(([itemData]) => {
        const items = itemData.map((item) => item.name);
        setMenuItems(items);
        if (items.length > 0) {
          setForm((prev) => ({ ...prev, item: items[0] }));
        }
      })
      .catch((error) => {
        console.error("Failed to fetch menu items:", error);
        setMenuItems(["Classic Burger", "Truffle Pasta", "Grilled Salmon", "Veggie Bowl"]);
      });
  }, []);

  const submitOrder = (event) => {
    event.preventDefault();
    const created = {
      id: `W-${Date.now().toString().slice(-4)}`,
      ...form,
      qty: Number(form.qty),
      createdAt: new Date().toLocaleTimeString()
    };
    setRecentOrder(created);
    setForm({ table: form.table, item: "Classic Burger", qty: 1, notes: "" });
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>Create Order</h1>
        </div>
      </header>
      <section className="grid two">
        <form className="card form" onSubmit={submitOrder}>
          <label>
            Table
            <select
              value={form.table}
              onChange={(event) => setForm((prev) => ({ ...prev, table: event.target.value }))}
            >
              <option value="1">Table 1</option>
              <option value="2">Table 2</option>
              <option value="3">Table 3</option>
              <option value="4">Table 4</option>
              <option value="5">Table 5</option>
            </select>
          </label>
          <label>
            Menu Item
            <select
              value={form.item}
              onChange={(event) => setForm((prev) => ({ ...prev, item: event.target.value }))}
            >
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))
              ) : (
                <option>Loading menu...</option>
              )}
            </select>
          </label>
          <label>
            Quantity
            <input
              min="1"
              max="10"
              type="number"
              value={form.qty}
              onChange={(event) => setForm((prev) => ({ ...prev, qty: event.target.value }))}
            />
          </label>
          <label>
            Notes
            <input
              type="text"
              placeholder="No onions, extra sauce..."
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </label>
          <button type="submit" className="primary">Send to Kitchen</button>
        </form>

        <div className="card">
          <h3>Latest Ticket</h3>
          {recentOrder ? (
            <div className="stack">
              <p><strong>Order {recentOrder.id}</strong></p>
              <p className="muted">Table {recentOrder.table}</p>
              <p>{recentOrder.qty}x {recentOrder.item}</p>
              <p className="muted">Sent at {recentOrder.createdAt}</p>
            </div>
          ) : (
            <p className="muted">No order submitted yet in this session.</p>
          )}
        </div>
      </section>
    </>
  );
}

function OrderStatus() {
  const [tickets, setTickets] = useState([
    { id: "231", table: 2, status: "Preparing", eta: "8 min" },
    { id: "232", table: 4, status: "Ready", eta: "Now" },
    { id: "233", table: 1, status: "Served", eta: "Done" },
    { id: "234", table: 6, status: "Preparing", eta: "12 min" }
  ]);

  const next = {
    Preparing: "Ready",
    Ready: "Served",
    Served: "Served"
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>Order Status</h1>
        </div>
      </header>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Table</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.table}</td>
                <td><span className="pill">{ticket.status}</span></td>
                <td>{ticket.eta}</td>
                <td>
                  <button
                    className="ghost"
                    onClick={() => {
                      setTickets((prev) =>
                        prev.map((item) =>
                          item.id === ticket.id
                            ? {
                                ...item,
                                status: next[item.status],
                                eta: next[item.status] === "Served" ? "Done" : "Now"
                              }
                            : item
                        )
                      );
                    }}
                    disabled={ticket.status === "Served"}
                  >
                    {ticket.status === "Served" ? "Completed" : "Advance"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function KitchenUpdates() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>Kitchen Updates</h1>
        </div>
      </header>
      <section className="grid two">
        <div className="card">
          <h3>Preparing</h3>
          <ul className="list">
            <li>
              <span>Table 2 - Salmon Bowl</span>
              <span className="pill">7 min</span>
            </li>
            <li>
              <span>Table 8 - Burger Combo</span>
              <span className="pill">5 min</span>
            </li>
            <li>
              <span>Table 11 - Kids Pasta</span>
              <span className="pill">9 min</span>
            </li>
          </ul>
        </div>
        <div className="card">
          <h3>Ready For Pickup</h3>
          <ul className="list">
            <li>
              <span>Table 4 - Truffle Pasta</span>
              <span className="pill">Ready</span>
            </li>
            <li>
              <span>Table 9 - Caesar Salad</span>
              <span className="pill">Ready</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default function WorkerDashboard() {
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    api.get("/restaurant/info").then((response) => {
      setRestaurantName(response.data.name || "Restaurant");
    }).catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar role="worker" restaurantName={restaurantName} />
      <main className="main">
        <Routes>
          <Route index element={<WorkerHome />} />
          <Route path="/tables" element={<TableManagement />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/status" element={<OrderStatus />} />
          <Route path="/kitchen" element={<KitchenUpdates />} />
        </Routes>
      </main>
    </div>
  );
}
