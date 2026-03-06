# Azure AD Security Setup Guide

This dashboard is integrated with **Azure Active Directory (Azure AD)** for enterprise-grade authentication and authorization.

## 🎯 Current Status

**Demo Mode Active** - The dashboard runs in demo mode until Azure AD is configured.

## 🔐 Azure AD B2C Configuration Steps

### Step 1: Create Azure AD B2C Tenant

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Azure AD B2C" and click **Create**
3. Select **Create a new Azure AD B2C Tenant**
4. Fill in:
   - Organization name: `YourRestaurant`
   - Initial domain name: `yourrestaurant` (will be `yourrestaurant.onmicrosoft.com`)
   - Country/Region: Your location
5. Click **Create** (takes 1-2 minutes)

### Step 2: Register Application

1. In your B2C tenant, go to **App registrations** > **New registration**
2. Fill in:
   - Name: `Restaurant Dashboard`
   - Supported account types: **Accounts in this organizational directory only**
   - Redirect URI: 
     - Platform: **Single-page application (SPA)**
     - URI: `http://localhost:5173/login` (for development)
     - Add production URI later: `https://yourdomain.com/login`
3. Click **Register**
4. **Copy the Application (client) ID** - you'll need this

### Step 3: Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Implicit grant and hybrid flows**, enable:
   - ✅ Access tokens
   - ✅ ID tokens
3. Under **Single-page application** section:
   - Add redirect URI: `http://localhost:5173/login`
   - Add logout redirect URI: `http://localhost:5173/login`
4. Click **Save**

### Step 4: Create User Flows (Sign-in Policy)

1. Go to **User flows** > **New user flow**
2. Select **Sign up and sign in**
3. Version: **Recommended**
4. Name: `signupsignin` (will create `B2C_1_signupsignin`)
5. Identity providers: ✅ Email signup
6. User attributes and claims:
   - Collect: Email Address, Display Name, Given Name, Surname
   - Return: Email Addresses, Display Name, User's Object ID
7. Click **Create**

### Step 5: Assign Users and Roles

#### Option A: Create Users in Azure AD
1. Go to **Users** > **New user** > **Create user**
2. Fill in user details and assign to groups

#### Option B: Use App Roles
1. In your app registration, go to **App roles**
2. Create roles:
   - **Restaurant.Owner**: For managers/owners
   - **Restaurant.Worker**: For staff/workers
3. Go to **Enterprise applications** > find your app > **Users and groups**
4. Assign users to roles

### Step 6: Update Environment Variables

Edit `/restaurant-dashboard/.env`:

```env
# Replace YOUR_AZURE_CLIENT_ID with the Application (client) ID from Step 2
VITE_AZURE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE

# Replace with your tenant ID or use B2C authority
VITE_AZURE_AUTHORITY=https://yourrestaurant.b2clogin.com/yourrestaurant.onmicrosoft.com/B2C_1_signupsignin

# Update redirect URI for production
VITE_AZURE_REDIRECT_URI=http://localhost:5173/login

# Optional: API scope if you have a backend API
VITE_AZURE_API_SCOPE=api://restaurant-dashboard/access_as_user

# Set to false to enable Azure AD
VITE_DEMO_MODE=false
```

### Step 7: Test Authentication

1. Restart the dashboard: `npm run dev`
2. Navigate to `http://localhost:5173/login`
3. You should see **"Sign in with Microsoft"** button
4. Click it and test login with your Azure AD user

## 🎭 Role Mapping

The dashboard maps Azure AD roles to dashboard access:

| Azure AD Role/Group | Dashboard Access |
|---------------------|------------------|
| Restaurant.Owner    | Owner Dashboard  |
| Restaurant.Manager  | Owner Dashboard  |
| Restaurant.Worker   | Worker Dashboard |
| Restaurant.Staff    | Worker Dashboard |

Edit role mapping in `/restaurant-dashboard/src/config/azureConfig.js`

## 🔧 Troubleshooting

### Issue: "AADSTS16000: No valid tokens provided"
- **Solution**: Clear browser cache and localStorage
- Check that redirect URI matches exactly in Azure Portal and .env

### Issue: "AADSTS50011: Redirect URI mismatch"
- **Solution**: Add the exact redirect URI in Azure Portal > Authentication
- Must include protocol (http/https) and match character-for-character

### Issue: "User does not have access"
- **Solution**: Assign user to app role in Enterprise Applications
- Or add user to appropriate Azure AD group

### Issue: Demo mode still active
- **Solution**: Check .env file has `VITE_DEMO_MODE=false`
- Restart dev server after changing .env
- Verify `VITE_AZURE_CLIENT_ID` is set correctly

## 📚 Documentation References

- [Azure AD B2C Documentation](https://learn.microsoft.com/azure/active-directory-b2c/)
- [MSAL.js Documentation](https://learn.microsoft.com/javascript/api/@azure/msal-browser/)
- [SPA Authorization Flow](https://learn.microsoft.com/azure/active-directory/develop/scenario-spa-overview)

## 🚀 Production Deployment

When deploying to production:

1. Update redirect URIs in Azure Portal to include production domain
2. Update `.env` with production values
3. Build: `npm run build`
4. Deploy dist folder to Azure Static Web Apps, Netlify, or Vercel
5. Configure custom domain
6. Test authentication flow thoroughly

## 💡 Custom Agent

Use the Azure agent for configuration help:

```
@azure How do I configure Azure AD B2C for my restaurant dashboard?
```

The Azure agent can help with:
- Configuration troubleshooting
- Security best practices
- Deployment guidance
- Azure CLI commands
- ARM template creation

## 🔐 Security Best Practices

✅ **Implemented:**
- Token-based authentication (JWT)
- Role-based access control (RBAC)
- Secure token storage (localStorage with httpOnly fallback)
- MSAL library for secure OAuth 2.0 flow
- Protected routes and components

✅ **Recommended:**
- Enable MFA for all admin accounts
- Use managed identities for backend API
- Implement conditional access policies
- Regular security audits
- Monitor sign-in logs in Azure Portal

---

**Support**: For Azure configuration issues, invoke the `@azure` agent or consult Microsoft documentation.
