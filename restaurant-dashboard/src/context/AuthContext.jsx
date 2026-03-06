import { createContext, useContext, useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest, isDemoMode, roleMapping } from "../config/azureConfig";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check if in demo mode
    if (isDemoMode()) {
      setDemoMode(true);
      // Check localStorage for demo credentials
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      if (storedToken && storedRole) {
        setRole(storedRole);
        setUser({ name: storedRole === "owner" ? "Demo Owner" : "Demo Worker" });
      }
      setLoading(false);
      return;
    }

    // Azure AD authentication
    if (inProgress === InteractionStatus.None && accounts.length > 0) {
      const account = accounts[0];
      setUser({
        name: account.name,
        email: account.username,
        id: account.localAccountId,
      });

      // Extract role from Azure AD claims
      const idTokenClaims = account.idTokenClaims;
      let userRole = "worker"; // default

      // Check for roles in token claims
      if (idTokenClaims?.roles && Array.isArray(idTokenClaims.roles)) {
        for (const azureRole of idTokenClaims.roles) {
          if (roleMapping[azureRole]) {
            userRole = roleMapping[azureRole];
            break;
          }
        }
      }

      // Check for groups
      if (idTokenClaims?.groups && Array.isArray(idTokenClaims.groups)) {
        for (const groupId of idTokenClaims.groups) {
          if (roleMapping[groupId]) {
            userRole = roleMapping[groupId];
            break;
          }
        }
      }

      // Store for API calls
      localStorage.setItem("role", userRole);
      setRole(userRole);
      setLoading(false);
    } else if (inProgress === InteractionStatus.None) {
      setLoading(false);
    }
  }, [accounts, inProgress]);

  const loginWithAzure = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Azure login error:", error);
      throw error;
    }
  };

  const loginDemo = (demoRole) => {
    setDemoMode(true);
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("role", demoRole);
    setRole(demoRole);
    setUser({ name: demoRole === "owner" ? "Demo Owner" : "Demo Worker" });
  };

  const logout = () => {
    if (demoMode) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      setRole(null);
      window.location.href = "/login";
    } else {
      instance.logoutRedirect();
    }
  };

  const getAccessToken = async () => {
    if (demoMode) {
      return "demo-token";
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.error("Token acquisition error:", error);
      // Trigger interactive login
      await instance.acquireTokenRedirect(loginRequest);
      return null;
    }
  };

  const value = {
    user,
    role,
    isAuthenticated: isAuthenticated || (demoMode && !!user),
    loading,
    demoMode,
    loginWithAzure,
    loginDemo,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
