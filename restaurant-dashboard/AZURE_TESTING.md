# Azure Integration Testing Guide

Complete guide to test Azure AD B2C authentication, security monitoring, and the Azure agent.

## 🎯 Quick Test Menu

| Test Type | Time | Difficulty |
|-----------|------|------------|
| [Azure Agent](#1-test-azure-agent) | 2 min | Easy |
| [Demo Mode Auth](#2-test-demo-mode-authentication) | 5 min | Easy |
| [Security Audit Script](#3-test-security-audit-script) | 10 min | Medium |
| [Azure AD (Production)](#4-test-azure-ad-b2c-production) | 30 min | Advanced |
| [Security Monitoring](#5-test-security-monitoring) | 15 min | Medium |

---

## 1. Test Azure Agent

The Azure Security Agent is available immediately without any Azure configuration.

### Test Basic Invocation

**In VS Code Chat**:
```
@azure Hello, are you working?
```

**Expected Response**: Agent introduces itself and asks what Azure task you need help with.

### Test Security Queries

```
@azure What are the top 5 security checks I should run for a restaurant dashboard?
```

**Expected**: Detailed list of security checks with risk levels and commands.

```
@azure How do I detect suspicious login activity in Azure AD?
```

**Expected**: Step-by-step guide with Azure CLI commands and Portal instructions.

```
@azure I found a storage account with public access enabled. Show me how to fix it.
```

**Expected**: Risk assessment + remediation steps with CLI commands.

### Test Configuration Questions

```
@azure Walk me through setting up Azure AD B2C for my application
```

**Expected**: Complete setup guide from tenant creation to app registration.

```
@azure How do I configure MSAL for a React application?
```

**Expected**: Code examples and configuration steps.

### ✅ Success Criteria
- [ ] Agent responds to `@azure` invocation
- [ ] Provides security-focused answers
- [ ] Includes Azure CLI commands
- [ ] Risk levels (🔴/🟡/🟢) in security responses
- [ ] References Microsoft documentation

---

## 2. Test Demo Mode Authentication

Test the dashboard authentication WITHOUT Azure AD configuration.

### Prerequisites
- Dashboard dev server should be running
- `.env` file has `VITE_DEMO_MODE=true`

### Start the Dashboard

```bash
cd /workspaces/codespaces-react/restaurant-dashboard
npm run dev
```

**Expected Output**:
```
VITE v5.4.21 ready in 187 ms
➜  Local: http://localhost:5173/
```

### Test Login Page

1. **Navigate**: Open http://localhost:5173/login in browser

2. **Verify UI Elements**:
   - [ ] Page loads without errors
   - [ ] Shows "🍽️ Restaurant Ops" header
   - [ ] Shows "Demo mode - Azure AD not configured" message
   - [ ] "Demo Owner Access" button visible
   - [ ] "Demo Worker Access" button visible
   - [ ] "🔒 Secured by Azure AD" footer visible

### Test Owner Login

1. **Click**: "Demo Owner Access" button
2. **Expected**: Redirect to `/owner` dashboard
3. **Verify**:
   - [ ] Owner dashboard loads
   - [ ] Sidebar shows: Dashboard, Orders, Menu, Inventory, Staff, Reports, Settings
   - [ ] User info shows "Demo Owner" in sidebar footer
   - [ ] "Demo Mode" label visible
   - [ ] All menu items load (40+ items showing ZAR prices)

4. **Test Navigation**:
   - Click "Menu" → Should show menu items from MongoDB backend
   - Click "Reports" → Should show weekly revenue in ZAR
   - Click "Orders" → Should show orders table

### Test Worker Login

1. **Sign Out**: Click "Sign out" button in sidebar
2. **Return to Login**: Should redirect to `/login`
3. **Click**: "Demo Worker Access" button
4. **Expected**: Redirect to `/worker` dashboard
5. **Verify**:
   - [ ] Worker dashboard loads
   - [ ] Sidebar shows: Live Board, Tables, Create Order, Order Status, Kitchen Updates
   - [ ] User info shows "Demo Worker"
   - [ ] Can navigate between worker pages

6. **Test Create Order**:
   - Go to "Create Order" page
   - Dropdown should show real menu items from backend
   - Should have 40+ options

### Test Protected Routes

1. **Without Authentication**:
   ```
   Navigate to: http://localhost:5173/owner
   ```
   **Expected**: Redirect to `/login`

2. **Wrong Role Access**:
   - Login as Worker
   - Try to access: http://localhost:5173/owner
   - **Expected**: Redirect back to `/worker`

### Test Session Persistence

1. Login as Owner
2. Refresh page (F5)
3. **Expected**: Still logged in, no redirect
4. Close browser tab
5. Reopen: http://localhost:5173/
6. **Expected**: Auto-redirect to owner dashboard (session persists)

### ✅ Success Criteria
- [ ] Demo login buttons work for both roles
- [ ] Correct dashboard loads for each role
- [ ] Protected routes enforce authentication
- [ ] Role-based access control works
- [ ] Session persists across refreshes
- [ ] Sign out clears session
- [ ] Backend data displays correctly (ZAR currency)

---

## 3. Test Security Audit Script

Test the automated Azure security scanner.

### Prerequisites
```bash
# Install Azure CLI (if not installed)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Verify installation
az --version
```

### Login to Azure

```bash
az login
```

**Expected**: Opens browser for authentication. Follow prompts.

**Verify**:
```bash
# List subscriptions
az account list -o table

# Set default subscription if multiple
az account set --subscription "YOUR_SUBSCRIPTION_NAME"
```

### Run Security Audit

```bash
cd /workspaces/codespaces-react/restaurant-dashboard/scripts

# Make executable (if not already)
chmod +x azure-security-audit.sh

# Run audit
./azure-security-audit.sh
```

### Expected Output

```
==================================================
🔐 Azure Cloud Security Audit
==================================================
Subscription: your-subscription-id
Output Directory: ./azure-security-report-20260306-123045

1️⃣  Detecting Suspicious Login Activity...
----------------------------------------
Checking for multiple failed login attempts...
✅ No risky users detected

2️⃣  Identifying Over-Permissioned Accounts...
----------------------------------------
Subscription Owners: 3
✅ Acceptable number of subscription owners

3️⃣  Checking for Exposed Storage Containers...
----------------------------------------
Checking: storageaccount1
  ✅ Public blob access disabled
  ✅ Network restrictions configured

4️⃣  Detecting Public IP Risks...
----------------------------------------
Public IPs Found: 2
  - vm1-ip: 52.168.1.100
  - appgateway-ip: 20.50.30.40

Checking Network Security Groups...
  🔴 HIGH RISK: nsg-webapp has rules allowing Internet traffic
    - allow-http-inbound: Port 80 (Allow)

5️⃣  Checking Authentication Policies...
----------------------------------------
Conditional Access Policies: 2
Policies requiring MFA: 1
✅ MFA enforcement policies detected

6️⃣  Azure Defender for Cloud Status...
----------------------------------------
Microsoft Defender for Cloud Status:
  VirtualMachines: Standard
  StorageAccounts: Free
🟡 MEDIUM RISK: Some Defender plans on Free tier

7️⃣  Key Vault Security Assessment...
----------------------------------------
Key Vaults Found: 1
  restaurant-vault:
    Soft Delete: true
    Purge Protection: false

==================================================
📊 Security Audit Summary
==================================================
🔴 High Risk Findings: 2
🟡 Medium Risk Findings: 3
🟢 Low Risk Findings: 1

⚠️  ATTENTION REQUIRED: Review findings in ./azure-security-report-20260306-123045/findings.txt
```

### Review Output Files

```bash
# Navigate to report directory
cd azure-security-report-20260306-123045

# View findings
cat findings.txt

# Check specific reports
cat subscription-owners.txt
cat storage-accounts.json
cat public-ips.json
```

### Test Specific Scenarios

**Scenario 1: No Azure Resources**
```bash
# If you have a fresh subscription with no resources
./azure-security-audit.sh
```
**Expected**: Completes successfully with minimal findings, suggestions to deploy resources.

**Scenario 2: Test with Specific Subscription**
```bash
./azure-security-audit.sh "subscription-id-here"
```
**Expected**: Runs audit on specified subscription.

### ✅ Success Criteria
- [ ] Script runs without errors
- [ ] Creates timestamped output directory
- [ ] Generates findings.txt with categorized issues
- [ ] All 7 security checks complete
- [ ] JSON reports created for resources
- [ ] Summary shows counts by risk level
- [ ] Can identify actual security issues if present

---

## 4. Test Azure AD B2C (Production)

Test real Azure AD authentication once configured.

### Prerequisites Setup

1. **Complete Azure AD B2C Configuration**:
   - Follow `AZURE_SETUP.md` completely
   - Create tenant
   - Register application
   - Get Client ID

2. **Update Environment**:
   ```bash
   cd /workspaces/codespaces-react/restaurant-dashboard
   
   # Edit .env
   nano .env
   ```

   **Update values**:
   ```env
   VITE_AZURE_CLIENT_ID=your-actual-client-id-here
   VITE_AZURE_AUTHORITY=https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1_signupsignin
   VITE_AZURE_REDIRECT_URI=http://localhost:5173/login
   VITE_DEMO_MODE=false
   ```

3. **Restart Dev Server**:
   ```bash
   npm run dev
   ```

### Test Azure AD Login

1. **Navigate**: http://localhost:5173/login

2. **Verify UI**:
   - [ ] Shows "Sign in with Microsoft" button (blue, with Microsoft logo)
   - [ ] Message: "Secure staff access powered by Azure AD"
   - [ ] NO demo buttons visible

3. **Click**: "Sign in with Microsoft"

4. **Expected**: 
   - Redirects to Azure AD B2C login page
   - URL contains your tenant name
   - Shows Microsoft login interface

5. **Enter Credentials**:
   - Use test user created in Azure AD
   - Or sign up if using sign-up flow

6. **After Authentication**:
   - Should redirect back to http://localhost:5173/login
   - Then auto-redirect to appropriate dashboard based on role
   - User info shows real name from Azure AD

### Test MFA (If Enabled)

1. Login with user that has MFA enabled
2. **Expected**:
   - After password, prompted for second factor
   - Phone/app verification code
   - Successfully logs in after MFA

### Test Role-Based Access

**Scenario 1: Owner Role**
```
User has role: "Restaurant.Owner" in Azure AD
Expected: Redirect to /owner dashboard
Sidebar: Shows all owner pages
```

**Scenario 2: Worker Role**
```
User has role: "Restaurant.Worker" in Azure AD
Expected: Redirect to /worker dashboard
Sidebar: Shows worker pages only
```

**Scenario 3: No Role Assigned**
```
User exists but no app role assigned
Expected: Defaults to "worker" role (check azureConfig.js)
```

### Test Token Refresh

1. Login successfully
2. Wait 60 minutes (token expiry)
3. Perform action (e.g., navigate to different page)
4. **Expected**: Token refreshes silently, no re-login required

### Test Logout

1. Click "Sign out" in sidebar
2. **Expected**:
   - Redirects to `/login`
   - Azure AD session ended
   - User info cleared
   - Token removed from localStorage

3. **Verify**:
   ```javascript
   // Open browser console
   localStorage.getItem('token') // Should be null
   localStorage.getItem('role')  // Should be null
   ```

### Test Error Scenarios

**Scenario 1: Wrong Redirect URI**
```
.env has: VITE_AZURE_REDIRECT_URI=http://localhost:5173/wrong
Azure Portal has: http://localhost:5173/login

Expected Error: AADSTS50011 - Redirect URI mismatch
Fix: Update .env to match Azure Portal
```

**Scenario 2: Invalid Client ID**
```
.env has: VITE_AZURE_CLIENT_ID=invalid-id

Expected Error: AADSTS700016 - Application not found
Fix: Copy correct Client ID from Azure Portal
```

**Scenario 3: User Not Found**
```
Login with email not in Azure AD B2C

Expected: User creation flow (if sign-up enabled)
Or: Error message if sign-up disabled
```

### ✅ Success Criteria
- [ ] "Sign in with Microsoft" button appears
- [ ] Redirects to Azure AD B2C login
- [ ] Successful authentication
- [ ] Role correctly assigned from Azure AD
- [ ] User info displays (name, email)
- [ ] Token stored in localStorage
- [ ] Protected routes work
- [ ] Sign out clears session
- [ ] Token refresh works silently
- [ ] MFA prompts if enabled

---

## 5. Test Security Monitoring

Test security detection and monitoring capabilities.

### Test Suspicious Login Detection

**Simulate**: Multiple failed login attempts

```bash
# Using Azure Agent
@azure How do I detect if someone tried to login multiple times with wrong password?
```

**Expected**: Guide on checking Azure AD sign-in logs.

**Manual Test**:
1. Open Azure Portal → Azure AD → Sign-in logs
2. Filter: Status = Failure, Last 24 hours
3. Look for repeated attempts from same IP

### Test Permission Auditing

```bash
# List all role assignments
az role assignment list --all -o table
```

**Ask Agent**:
```
@azure Analyze these role assignments and tell me if anyone has excessive permissions:
[paste output]
```

**Expected**: Agent identifies over-permissioned accounts.

### Test Storage Exposure Check

```bash
# List storage accounts
az storage account list -o table

# Check specific account
az storage account show \
  --name STORAGE_NAME \
  --resource-group RG_NAME \
  --query "{PublicAccess:allowBlobPublicAccess, Firewall:networkRuleSet.defaultAction}"
```

**Ask Agent**:
```
@azure This storage account has allowBlobPublicAccess set to true. What's the risk and how do I fix it?
```

**Expected**: Risk assessment + remediation steps.

### Test NSG Analysis

```bash
# List NSGs
az network nsg list -o table

# Check rules
az network nsg rule list \
  --nsg-name NSG_NAME \
  --resource-group RG_NAME \
  -o table
```

**Look for**:
- Source: `*` or `0.0.0.0/0`
- Ports: 22, 3389, 1433
- Action: Allow

**Ask Agent**:
```
@azure I have an NSG rule allowing port 3389 from 0.0.0.0/0. Is this secure?
```

**Expected**: 🔴 HIGH RISK rating with immediate remediation steps.

### Test Defender for Cloud

```bash
# Check Defender status
az security pricing list -o table

# Get recommendations
az security assessment list -o table | head -20
```

**Ask Agent**:
```
@azure I have 15 resources on Microsoft Defender Free tier. Should I upgrade?
```

**Expected**: Cost-benefit analysis and upgrade recommendations.

### ✅ Success Criteria
- [ ] Can detect failed login attempts
- [ ] Can identify over-permissioned accounts
- [ ] Can find exposed storage containers
- [ ] Can analyze NSG rules for risks
- [ ] Agent provides risk-based recommendations
- [ ] All commands execute successfully

---

## 6. Integration Testing

Test complete authentication + backend data flow.

### Prerequisites
- MongoDB backend running on port 3000
- Dashboard running on port 5173
- Authenticated (demo or Azure AD)

### Test Data Flow

1. **Login as Owner** (demo or Azure AD)
2. **Navigate to Menu** page
3. **Verify**:
   ```
   - Shows "Loading..." initially
   - Loads 40+ menu items from MongoDB
   - Items show real data:
     * Wagyu Beef Burger with Truffle Aioli - R 189.00
     * Margherita with Buffalo Mozzarella - R 99.00
   - Search works
   - All items have ZAR currency format
   ```

4. **Navigate to Reports** page
5. **Verify**:
   ```
   - Revenue shows ZAR format: R 34,220.00
   - Average order value: R 61.11
   - Chart displays correctly
   ```

6. **Open Browser Console**:
   ```javascript
   // Check auth token
   console.log(localStorage.getItem('token'));
   // Should show: "demo-token" or Azure JWT

   // Check role
   console.log(localStorage.getItem('role'));
   // Should show: "owner" or "worker"
   ```

7. **Check Network Tab**:
   - POST to `http://localhost:3000/api/foodData`
   - Status: 200
   - Response: Array of menu items
   - Authorization header present

### Test Worker Flow

1. **Login as Worker**
2. **Navigate to Create Order**
3. **Verify**:
   - Menu item dropdown loads from backend
   - 40+ items available
   - Can submit order

### ✅ Success Criteria
- [ ] Authentication flow completes
- [ ] Backend API calls succeed
- [ ] Menu items load from MongoDB
- [ ] Currency displays as ZAR
- [ ] Role-based pages work
- [ ] Network requests include auth token
- [ ] No console errors

---

## 🐛 Troubleshooting Guide

### Issue: Azure Agent Not Responding

**Symptoms**: `@azure` doesn't trigger agent

**Solutions**:
1. Check file exists: `.github/agents/azure.agent.md`
2. Verify YAML frontmatter is valid
3. Restart VS Code
4. Try: `@Azure` (capital A)
5. Check agent description matches your query

### Issue: Demo Mode Not Working

**Symptoms**: Login buttons don't work

**Solutions**:
```bash
# Check .env
cat restaurant-dashboard/.env | grep DEMO
# Should show: VITE_DEMO_MODE=true

# Check console for errors
# Open Browser DevTools → Console

# Verify auth context loaded
# Console: localStorage.getItem('token')
```

### Issue: Backend Data Not Loading

**Symptoms**: Menu shows "Loading..." forever

**Solutions**:
```bash
# Check MongoDB backend is running
lsof -i :3000
# Should show node process

# Test API directly
curl -X POST http://localhost:3000/api/foodData -H "Content-Type: application/json"
# Should return JSON array

# Restart backend
cd /workspaces/codespaces-react/backend
npm start
```

### Issue: Azure AD Login Fails

**Symptoms**: Error after clicking "Sign in with Microsoft"

**Common Errors**:

| Error | Cause | Fix |
|-------|-------|-----|
| AADSTS50011 | Redirect URI mismatch | Update .env or Azure Portal |
| AADSTS700016 | Invalid Client ID | Copy correct ID from Azure Portal |
| AADSTS90014 | Missing user consent | Grant admin consent in Azure Portal |
| AADSTS7000215 | Invalid client secret | Not needed for SPA, remove from config |

**Debug**:
```javascript
// Browser console
console.log(import.meta.env.VITE_AZURE_CLIENT_ID);
console.log(import.meta.env.VITE_AZURE_AUTHORITY);
console.log(import.meta.env.VITE_AZURE_REDIRECT_URI);
```

### Issue: Security Audit Script Fails

**Symptoms**: `azure-security-audit.sh` errors

**Solutions**:
```bash
# Check Azure CLI installed
az --version

# Check logged in
az account show

# Check permissions
az role assignment list --assignee $(az account show --query user.name -o tsv)
# Should have at least "Reader" role

# Run with verbose output
bash -x ./azure-security-audit.sh
```

---

## 📊 Test Report Template

Use this template to document your testing:

```markdown
# Azure Integration Test Report
Date: 2026-03-06
Tester: Your Name

## 1. Azure Agent Test
- [ ] Agent responds to @azure
- [ ] Security queries work
- [ ] Provides CLI commands
- Issues: None / [describe]

## 2. Demo Mode Authentication
- [ ] Owner login works
- [ ] Worker login works
- [ ] Protected routes enforced
- [ ] Session persists
- Issues: None / [describe]

## 3. Security Audit Script
- [ ] Script executes
- [ ] Generates reports
- [ ] Identifies risks
- Findings: [count] HIGH, [count] MEDIUM, [count] LOW

## 4. Azure AD B2C (if configured)
- [ ] Microsoft login button appears
- [ ] Authentication succeeds
- [ ] Role assignment correct
- [ ] Token refresh works
- Issues: None / [describe]

## 5. Security Monitoring
- [ ] Can detect failed logins
- [ ] Can audit permissions
- [ ] Can check storage exposure
- [ ] Agent provides risk ratings
- Issues: None / [describe]

## 6. Integration Testing
- [ ] Backend data loads
- [ ] ZAR currency displays
- [ ] Auth token sent to API
- [ ] Role-based access works
- Issues: None / [describe]

## Overall Status
✅ PASS / ❌ FAIL / ⚠️ PARTIAL

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
```

---

## 🚀 Next Steps After Testing

1. **If Demo Mode Tests Pass**:
   - Great! Continue development
   - Configure Azure AD when ready for production

2. **If Azure AD Tests Pass**:
   - Deploy to production
   - Configure custom domain
   - Enable MFA for all users
   - Set up monitoring alerts

3. **If Security Audit Finds Issues**:
   - Prioritize HIGH risk findings
   - Use `@azure` agent for remediation guidance
   - Re-run audit after fixes
   - Document changes

4. **For Production Readiness**:
   - Complete SECURITY_CHECKLIST.md
   - Run penetration tests
   - Configure backup and recovery
   - Set up monitoring dashboards
   - Train team on security procedures

---

**Need Help?** Ask the Azure agent:
```
@azure I'm having trouble with [specific test]. What should I check?
```
