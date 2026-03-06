# Azure Deployment - Complete Implementation Guide

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Deployment Scripts](#deployment-scripts)
4. [Step-by-Step Instructions](#step-by-step-instructions)
5. [Configuration Details](#configuration-details)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Cost Management](#cost-management)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### For the Impatient (5 minutes)

```bash
# 1. Set MongoDB connection
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority"

# 2. Run infrastructure setup
./azure-deploy.sh

# 3. Deploy backend
./deploy-backend.sh

# 4. Deploy frontend
cd restaurant-dashboard && ../deploy-frontend.sh

# Done! ✅
```

---

## 🏗️ Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AZURE CLOUD PLATFORM                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              FRONTEND TIER                            │  │
│  │  Azure Static Web Apps                              │  │
│  │  ├─ React Dashboard                                 │  │
│  │  ├─ Built with Vite                                │  │
│  │  └─ Auto-deployed on git push                       │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │ HTTPS                                  │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              BACKEND TIER                             │  │
│  │  Azure App Service (Linux, Node.js 18)              │  │
│  │  ├─ Express REST API                               │  │
│  │  ├─ JWT Authentication                             │  │
│  │  ├─ Rate Limiting                                  │  │
│  │  └─ Health Check Endpoints                         │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┼───────────────────────────────────┐  │
│  │        SECURITY & SERVICES TIER                      │  │
│  │                                                      │  │
│  │  ┌─────────────────┐  ┌─────────────────────────┐  │  │
│  │  │  Azure Key      │  │  Azure OpenAI Service   │  │  │
│  │  │  Vault          │  │  ├─ GPT-4 Models      │  │  │
│  │  │  ├─ Secrets     │  │  ├─ AI Waiter         │  │  │
│  │  │  ├─ Keys        │  │  └─ Document Analysis  │  │  │
│  │  │  └─ Certs       │  │                        │  │  │
│  │  └─────────────────┘  └─────────────────────────┘  │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
           │                               │
           ▼                               ▼
    ┌──────────────────┐      ┌──────────────────────┐
    │  MongoDB Atlas   │      │   Users & Browsers   │
    │  (Database)      │      │                      │
    └──────────────────┘      └──────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | User dashboard & interface |
| **Backend** | Node.js 18 + Express | REST API & business logic |
| **Database** | MongoDB Atlas | Data storage & retrieval |
| **AI** | Azure OpenAI (GPT-4) | AI features & automation |
| **Security** | Azure Key Vault | Secret management |
| **Hosting** | Azure App Service & Static Web Apps | Cloud deployment |
| **Deployment** | Git + Azure CLI | Automated deployment |

---

## 📦 Deployment Scripts

### 1. `azure-deploy.sh` - Infrastructure Setup
**Purpose**: Creates all Azure resources

**Duration**: 10-15 minutes
**Cost Impact**: ~$15/month

**What it creates**:
- Resource Group (logical container)
- App Service Plan (backend hosting)
- App Service (Node.js application)
- Static Web Apps (frontend hosting)
- Key Vault (secrets storage)
- Azure OpenAI Service
- Storage for logs and monitoring

**Usage**:
```bash
./azure-deploy.sh
```

**Output**:
- `azure-deployment.env` - All resource names and IDs

---

### 2. `deploy-backend.sh` - Backend Deployment
**Purpose**: Deploy Node.js API to App Service

**Duration**: 5-10 minutes
**Runs in**: `restaurant-backend` directory

**What it does**:
1. Installs npm dependencies
2. Retrieves secrets from Key Vault
3. Configures environment variables
4. Deploys code via Git
5. Starts the application
6. Verifies health check

**Usage**:
```bash
./deploy-backend.sh
# or
npm run deploy:azure
```

---

### 3. `deploy-frontend.sh` - Frontend Deployment
**Purpose**: Build & deploy React dashboard to Static Web Apps

**Duration**: 5-10 minutes
**Runs in**: `restaurant-dashboard` directory

**What it does**:
1. Installs npm dependencies
2. Builds production bundle with Vite
3. Configures API endpoints
4. Uploads to Static Web Apps
5. Verifies deployment
6. Creates summary report

**Usage**:
```bash
cd restaurant-dashboard
../deploy-frontend.sh
# or
npm run deploy:azure
```

---

## 🎯 Step-by-Step Instructions

### Phase 1: Prerequisites (5 minutes)

#### 1.1 Install Required Tools
```bash
# Check installations
node --version    # Should be 18+
npm --version
git --version
az --version      # Azure CLI

# If missing, install:
# - Node.js: https://nodejs.org
# - Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
```

#### 1.2 Set Up MongoDB Atlas

**Steps:**
1. Visit [MongoDB Atlas](https://cloud.mongodb.com)
2. Create/select cluster (Free tier M0 available)
3. Create database user with strong password
4. Add network access (IP whitelist)
5. Get connection string

**Save your connection string:**
```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/restaurant_management?retryWrites=true&w=majority"
```

#### 1.3 Verify Git Repository

```bash
# Ensure you're in root directory
cd /workspaces/codespaces-react

# Check git status
git status

# All files should be committed
git add .
git commit -m "Initial commit before Azure deployment"
```

---

### Phase 2: Infrastructure Setup (10 minutes)

#### 2.1 Authenticate with Azure

```bash
# Login to Azure
az login

# If multiple subscriptions, select one
az account set --subscription "Subscription-ID"

# Verify
az account show
```

#### 2.2 Run Infrastructure Script

```bash
# From root directory
./azure-deploy.sh
```

**During execution, you'll see:**
```
✓ Prerequisites check passed
✓ Authenticated with Azure
✓ Created resource group: restaurant-rg
✓ Created Key Vault: restaurant-kv-dev-xxxxx
✓ Created App Service Plan: restaurant-plan-dev
✓ Created App Service: restaurant-api-dev-xxxxx
✓ Created Static Web Apps: restaurant-dashboard-dev-xxxxx
✓ Created OpenAI Service: restaurant-openai
```

#### 2.3 Verify Resources Created

```bash
# List all resources
az resource list --resource-group restaurant-rg

# Should see ~7 resources created
```

#### 2.4 Save Configuration

```bash
# Verify azure-deployment.env exists
cat azure-deployment.env

# This file contains all resource names for next steps
```

---

### Phase 3: Backend Deployment (5 minutes)

#### 3.1 Navigate to Backend

```bash
cd restaurant-backend

# Verify package.json
cat package.json
```

#### 3.2 Deploy Backend

```bash
# Option 1: Use deployment script
../deploy-backend.sh

# Option 2: Use npm script
npm run deploy:azure
```

#### 3.3 Wait for Deployment

```bash
# Deployment usually takes 3-5 minutes
# You'll see progress messages:

# ✓ Dependencies installed
# ✓ App Service configured
# ✓ Code deployed
# ✓ Health check passed
```

#### 3.4 Verify Backend

```bash
# Test the API (replace xxxxx with actual resource name)
curl https://restaurant-api-dev-xxxxx.azurewebsites.net/health

# Should return:
# {"status":"ok","environment":"production","uptime":xxx}

# Return to root
cd ..
```

---

### Phase 4: Frontend Deployment (5 minutes)

#### 4.1 Navigate to Frontend

```bash
cd restaurant-dashboard

# Verify environment
cat src/config/api.js  # Check API endpoint config
```

#### 4.2 Deploy Frontend

```bash
# Option 1: Use deployment script
../deploy-frontend.sh

# Option 2: Use npm script
npm run deploy:azure
```

#### 4.3 Monitor Build

```bash
# You'll see:
# ✓ Dependencies installed
# ✓ Build complete (Vite optimization)
# ✓ Features deployed
# ✓ Deployment verified
```

#### 4.4 Verify Frontend

```bash
# Open in browser (replace xxxxx with actual name)
# https://restaurant-dashboard-dev-xxxxx.azurestaticapps.net

# Or test with curl
curl https://restaurant-dashboard-dev-xxxxx.azurestaticapps.net

# Return to root
cd ..
```

---

## ⚙️ Configuration Details

### Environment Variables

All configuration is managed through Azure Key Vault:

```bash
# View all secrets
az keyvault secret list --vault-name restaurant-kv-dev-xxxxx

# View specific secret
az keyvault secret show \
  --vault-name restaurant-kv-dev-xxxxx \
  --name jwt-secret
```

### Secrets Stored

| Secret | Purpose | Stored By |
|--------|---------|-----------|
| `mongodb-uri` | Database connection | Deployment script |
| `jwt-secret` | Token signing | Deployment script |
| `openai-endpoint` | AI service endpoint | Deployment script |
| `openai-key` | AI service authentication | Deployment script |

### App Service Configuration

```bash
# View all settings
az webapp config appsettings list \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# Update a setting
az webapp config appsettings set \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --settings CUSTOM_VAR=value
```

### CORS Configuration

Frontend can communicate with backend:

```javascript
// Automatically configured with:
// - Frontend URL in CORS whitelist
// - Credentials allowed
// - Common HTTP methods enabled
```

---

## 📊 Monitoring & Maintenance

### View Application Logs

```bash
# Real-time backend logs
az webapp log tail \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# Last 50 lines
az webapp log tail \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --lines 50
```

### Monitor Performance

```bash
# Check CPU usage
az monitor metrics list \
  --resource-group restaurant-rg \
  --resource-type "Microsoft.Web/sites" \
  --resource restaurant-api-dev-xxxxx \
  --metric "CpuTime" \
  --start-time 2024-01-01T00:00:00Z \
  --interval PT1H
```

### Check Deployment Status

```bash
# Get deployment history
az webapp deployment list \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# Get latest deployment status
az webapp deployment slot list \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx
```

### Restart Services

```bash
# Restart backend
az webapp restart \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# Clear cache (if applicable)
az webapp config appsettings set \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --settings WEBSITE_DISABLE_FILE_IO_CACHE=true
```

---

## 💰 Cost Management

### Cost Breakdown (Monthly Estimate)

| Service | SKU | Est. Cost |
|---------|-----|-----------|
| App Service Plan | B1 | $12.50 |
| Static Web Apps | Free | $0.00 |
| Key Vault | Standard | $0.60 |
| Azure OpenAI | S0 | Pay-per-use |
| Data Transfer | - | Variable |
| **Total** | | **$15-30+** |

### Cost Optimization Tips

1. **Use Free Tier Static Web Apps** ✅ (Frontend)
2. **Monitor OpenAI Usage** - Only charge for tokens used
3. **Upgrade Plan When Needed**
   ```bash
   # For production traffic
   az appservice plan update \
     --resource-group restaurant-rg \
     --name restaurant-plan-dev \
     --sku S1  # or higher for more capacity
   ```

4. **Delete Unused Resources**
   ```bash
   # Remove specific resource
   az webapp delete \
     --resource-group restaurant-rg \
     --name restaurant-api-dev-xxxxx
   ```

5. **Review Bill Monthly**
   ```bash
   # Check costs
   az costmanagement query \
     --timeframe MonthToDate \
     --type AmortizedCost
   ```

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"

**Symptoms**: Database connection timeout

**Solutions**:
```bash
# 1. Verify connection string
echo $MONGODB_URI

# 2. Check MongoDB Atlas network access
# - Go to MongoDB Atlas Dashboard
# - Click Network Access
# - Add 0.0.0.0/0 or specific Azure IPs

# 3. Test connection locally
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Connected'))
  .catch(e => console.log('Error:', e.message))
"
```

### "Frontend returns 503 errors"

**Symptoms**: "Service Unavailable"

**Solutions**:
```bash
# 1. Check deployment status
az webapp deployment list \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# 2. View recent logs
az webapp log tail \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# 3. Restart service
az webapp restart \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx

# 4. Wait 2-5 minutes for startup
```

### "OpenAI API returns 401 Unauthorized"

**Symptoms**: "Invalid credentials"

**Solutions**:
```bash
# 1. Verify API key
az keyvault secret show \
  --vault-name restaurant-kv-dev-xxxxx \
  --name openai-key

# 2. Check endpoint
az keyvault secret show \
  --vault-name restaurant-kv-dev-xxxxx \
  --name openai-endpoint

# 3. Verify API version in code matches deployment

# 4. Check quota in Azure Portal
# - Go to Azure OpenAI resource
# - Check "Tokens Per Minute" limit
```

### "CORS error: 'No 'Access-Control-Allow-Origin' header"

**Symptoms**: Frontend cannot communicate with backend

**Solutions**:
```bash
# 1. Verify CORS configuration
curl -i https://restaurant-api-dev-xxxxx.azurewebsites.net/health

# 2. Update CORS if needed
az webapp config appsettings set \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --settings FRONTEND_URL=https://restaurant-dashboard-dev.azurestaticapps.net

# 3. Restart API
az webapp restart \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx
```

---

## 📚 Additional Resources

### Official Documentation
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/)
- [Azure OpenAI Service](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)

### Useful Azure CLI Commands
```bash
# List all commands
az webapp --help

# Get help on specific command
az webapp config appsettings --help

# Format output as table
az resource list --output table

# Output as JSON for scripts
az resource list --output json
```

### Next Steps
1. ✅ Infrastructure deployed
2. ✅ Backend running
3. ✅ Frontend live
4. 📊 Set up monitoring
5. 🔐 Configure custom domain
6. 🚀 Enable CI/CD

---

**Deployment Status**: ✅ **Complete**

**Deployment Date**: March 6, 2024

**Support**: Check AZURE_QUICK_START.md for detailed guides

---
