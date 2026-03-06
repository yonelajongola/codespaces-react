# Azure Deployment Guide - Quick Start

## 🚀 Overview

This guide will help you deploy the Restaurant Management System to Microsoft Azure with all necessary services (App Service, Static Web Apps, Key Vault, and Azure OpenAI).

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Azure Subscription** - [Create a free account](https://azure.microsoft.com/free/)
2. **Azure CLI** - [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
3. **Node.js 18+** - [Download Node.js](https://nodejs.org)
4. **Git** - [Download Git](https://git-scm.com)
5. **MongoDB Atlas Account** - [Create free tier](https://www.mongodb.com/cloud/atlas)

### Verify Installation

```bash
az --version
node --version
npm --version
git --version
```

---

## 🔑 Environment Setup

### Step 1: Prepare MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster or use existing one
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/restaurant_management?retryWrites=true&w=majority
```

### Step 2: Set Environment Variables

Export your MongoDB URI before running deployment:

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/restaurant_management?retryWrites=true&w=majority"
export ENVIRONMENT="dev"  # or 'prod' for production
```

---

## 🎯 Deployment Steps

### Step 1: Create Azure Infrastructure

Run the main deployment script to create all Azure resources:

```bash
# Make scripts executable
chmod +x azure-deploy.sh deploy-backend.sh deploy-frontend.sh

# Run Azure infrastructure setup
./azure-deploy.sh
```

**What this does:**
- ✅ Authenticates with Azure
- ✅ Creates Resource Group
- ✅ Sets up Key Vault (secrets management)
- ✅ Creates App Service Plan & Backend API
- ✅ Creates Static Web Apps (Frontend)
- ✅ Sets up Azure OpenAI Service
- ✅ Stores all credentials securely

**Output:** Creates `azure-deployment.env` with all resource names

### Step 2: Deploy Backend API

```bash
./deploy-backend.sh
```

**What this does:**
- ✅ Installs dependencies
- ✅ Configures App Service settings
- ✅ Retrieves secrets from Key Vault
- ✅ Deploys code to Azure App Service
- ✅ Verifies deployment health

**Expected Output:**
```
✓ Backend is accessible
  URL: https://restaurant-api-dev-xxxxx.azurewebsites.net
```

### Step 3: Deploy Frontend Dashboard

```bash
cd restaurant-dashboard
../deploy-frontend.sh
```

**What this does:**
- ✅ Installs dependencies
- ✅ Builds optimized production bundle
- ✅ Configures environment variables
- ✅ Deploys to Static Web Apps
- ✅ Sets up CORS for API communication

**Expected Output:**
```
✓ Frontend is accessible
  URL: https://restaurant-dashboard-dev-xxxxx.azurestaticapps.net
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│           Azure Cloud Platform                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐      ┌─────────────────┐ │
│  │  Static Web Apps │◄────►│  App Service    │ │
│  │   (Frontend)     │      │   (Backend API) │ │
│  └──────────────────┘      └─────────────────┘ │
│         ▲                           ▲           │
│         │                           │           │
│  ┌──────┴───────────────────────────┴─────┐    │
│  │  Azure Services                        │    │
│  │  ├─ Key Vault (Secrets)               │    │
│  │  ├─ Azure OpenAI                      │    │
│  │  ├─ Application Insights (Monitoring) │    │
│  │  └─ Log Analytics                     │    │
│  └────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
           ▼              ▼
    ┌─────────────┐  ┌──────────────┐
    │ MongoDB     │  │ Users/Clients│
    │ Atlas       │  └──────────────┘
    └─────────────┘
```

---

## 🔒 Security Best Practices

### Secrets Management

All sensitive data is stored in Azure Key Vault:

```bash
# View stored secrets
az keyvault secret list --vault-name restaurant-kv-dev-xxxxx

# Access a secret
az keyvault secret show --vault-name restaurant-kv-dev-xxxxx --name mongodb-uri
```

### Network Security

- **App Service**: Protected by Azure's DDoS protection
- **Secrets**: Never stored in code or environment files
- **HTTPS**: All communications encrypted
- **API Keys**: Regularly rotated via Key Vault

### Database Access

MongoDB Atlas is configured with:
- ✅ Network access restricted to Azure resources
- ✅ Strong password-based authentication
- ✅ Connection string with encryption
- ✅ IP whitelist (add Azure App Service IPs)

---

## ✅ Verification & Testing

### Test Backend API

```bash
# Check health endpoint
curl https://restaurant-api-dev-xxxxx.azurewebsites.net/health

# Expected response:
# {"status": "ok"}
```

### Test Frontend Access

```bash
# Open in browser
open https://restaurant-dashboard-dev-xxxxx.azurestaticapps.net
# or
curl https://restaurant-dashboard-dev-xxxxx.azurestaticapps.net
```

### View Application Logs

```bash
# Backend logs
az webapp log tail --resource-group restaurant-rg --name restaurant-api-dev-xxxxx

# Frontend deployment logs
az staticwebapp show-build --resource-group restaurant-rg --name restaurant-dashboard-dev
```

### Monitor Resources

```bash
# Get resource status
az resource list --resource-group restaurant-rg --output table

# Check App Service CPU and memory
az monitor metrics list \
  --resource-group restaurant-rg \
  --resource-type "Microsoft.Web/sites" \
  --resource restaurant-api-dev-xxxxx \
  --metric CpuTime --output table
```

---

## 🔄 Continuous Deployment (Optional)

To set up automatic deployments from GitHub:

### GitHub Actions Setup

1. Create `.github/workflows/deploy-azure.yml` in your repo
2. Configure with your Azure credentials
3. Commits to main branch will auto-deploy

```bash
# Generate deployment credentials
az ad sp create-for-rbac \
  --name restaurant-deployment \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/restaurant-rg \
  --json-auth
```

---

## 📊 Cost Estimation

### Default Configuration

| Service | SKU | Est. Cost/Month |
|---------|-----|---------|
| App Service Plan | B1 | $12.50 |
| Static Web Apps | Free | $0 |
| Key Vault | Standard | $0.60 |
| Azure OpenAI | S0 | $0.001/1K tokens |
| Data Transfer | - | Variable |
| **Total (approx.)** | - | **$15-30** |

**Note:** Costs are estimates. See [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)

---

## 🆘 Troubleshooting

### Deployment Script Fails

```bash
# Clear and retry
git remote remove azure 2>/dev/null || true
./deploy-backend.sh
```

### Backend Not Responding

```bash
# Check logs
az webapp log tail --resource-group restaurant-rg --name restaurant-api-dev-xxxxx

# Restart service
az webapp restart --resource-group restaurant-rg --name restaurant-api-dev-xxxxx

# Check configuration
az webapp config show --resource-group restaurant-rg --name restaurant-api-dev-xxxxx
```

### Frontend Build Issues

```bash
# Clear cache and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### MongoDB Connection Issues

```bash
# Verify connection string
echo $MONGODB_URI

# Check network access in Atlas
# MongoDB Atlas → Network Access → ensure Azure IPs are whitelisted

# Test connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('✓ Connected'))
  .catch(e => console.log('✗ Error:', e.message))
"
```

### OpenAI Service Not Available

```bash
# Check resource status
az cognitiveservices account show \
  --resource-group restaurant-rg \
  --name restaurant-openai

# Verify API key
az keyvault secret show \
  --vault-name restaurant-kv-dev-xxxxx \
  --name openai-key
```

---

## 🛠️ Cleanup (Tear Down)

To delete all Azure resources and stop incurring costs:

```bash
# Delete entire resource group (WARNING: This deletes everything)
az group delete --name restaurant-rg --yes --no-wait

# Or delete individual resources
az webapp delete --resource-group restaurant-rg --name restaurant-api-dev-xxxxx
az staticwebapp delete --resource-group restaurant-rg --name restaurant-dashboard-dev
```

---

## 📞 Support & Resources

- **Azure CLI Docs**: https://docs.microsoft.com/en-us/cli/azure/
- **App Service Docs**: https://docs.microsoft.com/en-us/azure/app-service/
- **Static Web Apps Docs**: https://docs.microsoft.com/en-us/azure/static-web-apps/
- **Azure OpenAI Docs**: https://docs.microsoft.com/en-us/azure/cognitive-services/openai/

---

## ✨ Next Steps

After successful deployment:

1. **Configure Custom Domain**
   ```bash
   az webapp config hostname add \
     --resource-group restaurant-rg \
     --webapp-name restaurant-api-dev-xxxxx \
     --hostname yourdomain.com
   ```

2. **Set Up Auto-Scaling**
   ```bash
   az appservice plan update \
     --resource-group restaurant-rg \
     --name restaurant-plan-dev \
     --sku S1
   ```

3. **Enable Application Insights**
   ```bash
   az extension add --name application-insights
   az monitor app-insights component create \
     --resource-group restaurant-rg \
     --app restaurant-insights \
     --location eastus
   ```

4. **Configure CI/CD Pipeline**
   - Connect GitHub repository
   - Set up automatic deployments

---

**Happy Deploying! 🚀**
