import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Login from "./pages/Login.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";

function getRole() {
  return localStorage.getItem("role");
}

function ProtectedRoute({ children, allowed }) {
  const role = getRole();
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (allowed && !allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/owner/*"
        element={
          <ProtectedRoute allowed={["owner", "manager"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/*"
        element={
          <ProtectedRoute allowed={["worker"]}>
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
