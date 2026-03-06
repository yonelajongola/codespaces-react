import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh",
        fontSize: "1.2rem",
        color: "#666"
      }}>
        <div>🔐 Initializing secure session...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={role === "owner" ? "/owner" : "/worker"} replace /> 
            : <Navigate to="/login" replace />
        } 
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/owner/*"
        element={
          <ProtectedRoute requiredRole="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/*"
        element={
          <ProtectedRoute requiredRole="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
