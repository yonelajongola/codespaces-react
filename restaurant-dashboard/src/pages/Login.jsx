import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginWithCredentials = async (loginEmail, loginPassword) => {
    setError("");
    try {
      const response = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      navigate(response.data.role === "worker" ? "/worker" : "/owner");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginWithCredentials(email, password);
  };

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1>Restaurant Ops</h1>
        <p className="muted">Secure staff access to live operations.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary">
            Sign In
          </button>
          <div className="demo-actions">
            <button
              type="button"
              className="ghost"
              onClick={() => loginWithCredentials("owner@restoflow.test", "DemoPass123!")}
            >
              Demo Owner
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => loginWithCredentials("worker@restoflow.test", "DemoPass123!")}
            >
              Demo Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
