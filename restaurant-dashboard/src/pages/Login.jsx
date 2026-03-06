import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginWithAzure, loginDemo, demoMode, isAuthenticated, role } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated && role) {
    navigate(role === "owner" ? "/owner" : "/worker", { replace: true });
    return null;
  }

  const handleAzureLogin = async () => {
    setError("");
    try {
      await loginWithAzure();
    } catch (err) {
      setError("Azure authentication failed. Please try again.");
      console.error("Azure login error:", err);
    }
  };

  const handleDemoLogin = (demoRole) => {
    setError("");
    try {
      loginDemo(demoRole);
      navigate(demoRole === "owner" ? "/owner" : "/worker");
    } catch (err) {
      setError("Demo login failed.");
    }
  };

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1>🍽️ Restaurant Ops</h1>
        <p className="muted">
          {demoMode 
            ? "Demo mode - Azure AD not configured" 
            : "Secure staff access powered by Azure AD"}
        </p>

        {!demoMode && (
          <div className="form" style={{ marginTop: "1.5rem" }}>
            <button 
              type="button" 
              className="primary azure-login-btn"
              onClick={handleAzureLogin}
              style={{
                background: "#0078d4",
                border: "none",
                padding: "0.75rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%"
              }}
            >
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H10V10H0V0Z" fill="#F25022"/>
                <path d="M11 0H21V10H11V0Z" fill="#7FBA00"/>
                <path d="M0 11H10V21H0V11Z" fill="#00A4EF"/>
                <path d="M11 11H21V21H11V11Z" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>
            <p className="muted" style={{ textAlign: "center", margin: "1rem 0", fontSize: "0.875rem" }}>
              Your Azure AD credentials
            </p>
          </div>
        )}

        {demoMode && (
          <div className="demo-actions" style={{ marginTop: "1.5rem" }}>
            <p style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#666" }}>
              Select demo role to continue:
            </p>
            <button
              type="button"
              className="primary"
              onClick={() => handleDemoLogin("owner")}
              style={{ marginBottom: "0.75rem", width: "100%" }}
            >
              👔 Demo Owner Access
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => handleDemoLogin("worker")}
              style={{ width: "100%" }}
            >
              👨‍🍳 Demo Worker Access
            </button>
          </div>
        )}

        {error && (
          <div 
            className="error" 
            style={{ 
              marginTop: "1rem", 
              padding: "0.75rem", 
              background: "#fee", 
              border: "1px solid #fcc",
              borderRadius: "4px",
              color: "#c33"
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#666", textAlign: "center" }}>
          <p>🔒 Secured by Azure Active Directory</p>
          {demoMode && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
              Configure Azure AD in .env to enable SSO
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
