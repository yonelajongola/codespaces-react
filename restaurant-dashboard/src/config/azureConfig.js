/**
 * Azure AD B2C Configuration for Restaurant Dashboard
 * 
 * To configure your Azure AD B2C:
 * 1. Create Azure AD B2C tenant at https://portal.azure.com
 * 2. Register application and get Client ID
 * 3. Set redirect URI to your dashboard URL
 * 4. Create user flows for sign-in
 * 5. Update environment variables below
 */

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "YOUR_AZURE_CLIENT_ID",
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 
      "https://login.microsoftonline.com/common",
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || 
      window.location.origin + "/login",
    postLogoutRedirectUri: window.location.origin + "/login",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      logLevel: import.meta.env.DEV ? 3 : 0, // Verbose in dev, Error in prod
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case 0: // Error
            console.error(message);
            break;
          case 1: // Warning
            console.warn(message);
            break;
          case 2: // Info
            console.info(message);
            break;
          case 3: // Verbose
            console.debug(message);
            break;
        }
      },
    },
  },
};

// API scopes for accessing backend
export const loginRequest = {
  scopes: [
    "User.Read",
    import.meta.env.VITE_AZURE_API_SCOPE || "api://restaurant-dashboard/access_as_user"
  ],
};

// Graph API endpoints
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

// Role mapping from Azure AD groups/roles to dashboard roles
export const roleMapping = {
  // Azure AD Group IDs or Role names
  "Restaurant.Owner": "owner",
  "Restaurant.Manager": "owner",
  "Restaurant.Worker": "worker",
  "Restaurant.Staff": "worker",
};

// Demo mode configuration (fallback when Azure not configured)
export const isDemoMode = () => {
  return !import.meta.env.VITE_AZURE_CLIENT_ID || 
         import.meta.env.VITE_AZURE_CLIENT_ID === "YOUR_AZURE_CLIENT_ID";
};
