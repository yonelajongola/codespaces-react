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
          <h1>Live Orders</h1>
        </div>
        <div className="chip">Kitchen Ops</div>
      </header>
      <section className="grid two">
        <OrdersList />
        <LowStockPanel />
      </section>
    </>
  );
}

function MyTasks() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>My Tasks</h1>
        </div>
      </header>
      <div className="card">
        <p className="muted">Task tracking coming soon...</p>
      </div>
    </>
  );
}

function Completed() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Worker</p>
          <h1>Completed Orders</h1>
        </div>
      </header>
      <div className="card">
        <p className="muted">Completed order history coming soon...</p>
      </div>
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
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/completed" element={<Completed />} />
        </Routes>
      </main>
    </div>
  );
}
