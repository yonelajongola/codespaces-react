import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import RevenueCard from "../components/RevenueCard";
import OrdersTodayCard from "../components/OrdersTodayCard";
import RevenueChart from "../components/RevenueChart";
import TopItems from "../components/TopItems";
import StaffPerformance from "../components/StaffPerformance";
import InsightCard from "../components/InsightCard";
import OrdersPage from "./Orders";
import MenuPage from "./Menu";
import InventoryPage from "./Inventory";
import StaffPage from "./Staff";
import ReportsPage from "./Reports";
import SettingsPage from "./Settings";

export default function OwnerDashboard() {
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    api.get("/restaurant/info").then((response) => {
      setRestaurantName(response.data.name || "Restaurant");
    }).catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar role="owner" restaurantName={restaurantName} />
      <main className="main">
        <Routes>
          <Route
            index
            element={
              <>
                <header className="page-header">
                  <div>
                    <p className="eyebrow">Owner Dashboard</p>
                    <h1>Daily Pulse</h1>
                  </div>
                  <div className="chip">Multi-tenant ready</div>
                </header>
                <section className="grid two">
                  <RevenueCard />
                  <OrdersTodayCard />
                </section>
                <section className="grid one">
                  <RevenueChart />
                </section>
                <section className="grid two">
                  <TopItems />
                  <StaffPerformance />
                </section>
                <section className="grid one">
                  <InsightCard />
                </section>
              </>
            }
          />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
