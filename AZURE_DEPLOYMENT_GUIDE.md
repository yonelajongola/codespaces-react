# Azure Deployment Guide

## 🚀 Complete Deployment Process

This guide walks you through deploying the entire restaurant management system to Microsoft Azure.

---

## 📋 Prerequisites

- Azure subscription ([Free trial available](https://azure.microsoft.com/free/))
- Azure CLI installed ([Install guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
- Node.js 18+ installed
- MongoDB Atlas account ([Free tier available](https://www.mongodb.com/cloud/atlas/register))
- Git installed

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Azure Cloud                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐        ┌──────────────────┐       │
│  │ Static Web Apps │◄──────►│   App Service    │       │
│  │   (Frontend)    │        │    (Backend)     │       │
│  └─────────────────┘        └──────────────────┘       │
│         │                           │                   │
│         │                           │                   │
│  ┌──────▼───────────────────────────▼──────────┐       │
│  │         Azure Services                       │       │
│  │  - OpenAI Service                           │       │
│  │  - Document Intelligence                    │       │
│  │  - Key Vault                                │       │
│  │  - Application Insights                     │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   MongoDB Atlas       │
              │   (Database)          │
              └───────────────────────┘
```

---

## 🎯 Step 1: Setup Azure CLI

### 1.1 Login to Azure

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "Your-Subscription-ID"

# Verify login
az account show
```

### 1.2 Create Resource Group

```bash
# Create resource group
az group create \
  --name restaurant-rg \
  --location eastus

# Verify creation
az group show --name restaurant-rg
```

---

## 📦 Step 2: Setup MongoDB Atlas

### 2.1 Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Build a Database"
3. Choose "FREE" tier (M0)
4. Select Azure as cloud provider
5. Choose "East US" region
6. Name your cluster: `restaurant-cluster`
7. Click "Create"

### 2.2 Configure Database Access

```bash
# In MongoDB Atlas Dashboard:
# 1. Click "Database Access" → "Add New Database User"
# 2. Create user:
#    Username: restaurant_admin
#    Password: Generate secure password
#    Role: Read and write to any database

# 3. Click "Network Access" → "Add IP Address"
# 4. Click "Allow Access from Anywhere" (0.0.0.0/0)
#    Note: For production, restrict to Azure App Service IPs
```

### 2.3 Get Connection String

```bash
# In Atlas Dashboard:
# 1. Click "Connect" on your cluster
# 2. Choose "Connect your application"
# 3. Copy connection string:

MONGODB_URI=mongodb+srv://restaurant_admin:<password>@restaurant-cluster.xxxxx.mongodb.net/restaurant_management?retryWrites=true&w=majority
```

---

## 🔐 Step 3: Setup Azure Key Vault

### 3.1 Create Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name restaurant-keyvault-$(date +%s) \
  --resource-group restaurant-rg \
  --location eastus

# Note: Key Vault names must be globally unique
# Save the vault name for later use
KEYVAULT_NAME="restaurant-keyvault-1234567890"
```

### 3.2 Store Secrets

```bash
# Store MongoDB connection string
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "MongoDB-URI" \
  --value "your-mongodb-connection-string"

# Store JWT secret
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "JWT-Secret" \
  --value "$(openssl rand -base64 32)"

# Store Azure OpenAI key (we'll add this later)
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "OpenAI-API-Key" \
  --value "your-openai-key"
```

---

## 🤖 Step 4: Setup Azure AI Services

### 4.1 Create Azure OpenAI Service

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus \
  --yes

# Get endpoint and key
az cognitiveservices account show \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --query "properties.endpoint" \
  --output tsv

az cognitiveservices account keys list \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --query "key1" \
  --output tsv

# Deploy GPT-4 model
az cognitiveservices account deployment create \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard
```

### 4.2 Create Document Intelligence Service

```bash
# Create Document Intelligence resource
az cognitiveservices account create \
  --name restaurant-doc-intel \
  --resource-group restaurant-rg \
  --kind FormRecognizer \
  --sku S0 \
  --location eastus \
  --yes

# Get endpoint and key
az cognitiveservices account show \
  --name restaurant-doc-intel \
  --resource-group restaurant-rg \
  --query "properties.endpoint" \
  --output tsv

az cognitiveservices account keys list \
  --name restaurant-doc-intel \
  --resource-group restaurant-rg \
  --query "key1" \
  --output tsv
```

### 4.3 Store AI Service Keys in Key Vault

```bash
# Get the keys
OPENAI_KEY=$(az cognitiveservices account keys list \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --query "key1" --output tsv)

DOC_INTEL_KEY=$(az cognitiveservices account keys list \
  --name restaurant-doc-intel \
  --resource-group restaurant-rg \
  --query "key1" --output tsv)

# Store in Key Vault
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "OpenAI-API-Key" \
  --value "$OPENAI_KEY"

az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "Document-Intelligence-Key" \
  --value "$DOC_INTEL_KEY"
```

---

## 🗄️ Step 5: Deploy Backend (Azure App Service)

### 5.1 Prepare Backend Code

```bash
# Navigate to backend directory
cd restaurant-backend

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=8080
MONGODB_URI=@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/MongoDB-URI/)
JWT_SECRET=@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/JWT-Secret/)
AZURE_OPENAI_ENDPOINT=https://restaurant-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/OpenAI-API-Key/)
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://restaurant-doc-intel.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/Document-Intelligence-Key/)
EOF

# Install dependencies
npm install

# Test locally
npm start
```

### 5.2 Create App Service Plan

```bash
# Create App Service Plan (Linux, Node.js)
az appservice plan create \
  --name restaurant-plan \
  --resource-group restaurant-rg \
  --location eastus \
  --sku B1 \
  --is-linux

# B1 = Basic tier, 1 core, 1.75 GB RAM
# For production, consider: P1V2 or higher
```

### 5.3 Create Web App

```bash
# Create Web App
az webapp create \
  --name restaurant-api-$(date +%s) \
  --resource-group restaurant-rg \
  --plan restaurant-plan \
  --runtime "NODE:18-lts"

# Save the app name
APP_NAME="restaurant-api-1234567890"
```

### 5.4 Configure Web App

```bash
# Enable system-assigned managed identity
az webapp identity assign \
  --name $APP_NAME \
  --resource-group restaurant-rg

# Get the identity's principal ID
PRINCIPAL_ID=$(az webapp identity show \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --query principalId \
  --output tsv)

# Grant Key Vault access to the managed identity
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list
```

### 5.5 Configure Application Settings

```bash
# Set environment variables
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    MONGODB_URI="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/MongoDB-URI/)" \
    JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/JWT-Secret/)" \
    AZURE_OPENAI_ENDPOINT="https://restaurant-openai.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/OpenAI-API-Key/)" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="https://restaurant-doc-intel.cognitiveservices.azure.com/" \
    AZURE_DOCUMENT_INTELLIGENCE_KEY="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/Document-Intelligence-Key/)"

# Enable Key Vault references
az webapp config set \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --key-vault-reference-identity "SystemAssigned"
```

### 5.6 Deploy Backend Code

#### Option A: Deploy via Git (Recommended)

```bash
# Configure deployment source
az webapp deployment source config-local-git \
  --name $APP_NAME \
  --resource-group restaurant-rg

# Get Git URL
GIT_URL=$(az webapp deployment source show \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --query url --output tsv)

# Add Azure remote
git init
git add .
git commit -m "Initial commit"
git remote add azure $GIT_URL

# Get deployment credentials
az webapp deployment list-publishing-credentials \
  --name $APP_NAME \
  --resource-group restaurant-rg

# Push to Azure
git push azure main
```

#### Option B: Deploy via ZIP

```bash
# Create deployment package
npm install --production
zip -r ../backend.zip . -x "*.env" "node_modules/*" ".git/*"

# Deploy
az webapp deploy \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --src-path ../backend.zip \
  --type zip
```

### 5.7 Test Backend Deployment

```bash
# Get the backend URL
BACKEND_URL=$(az webapp show \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --query defaultHostName \
  --output tsv)

# Test health endpoint
curl https://$BACKEND_URL/health

# Should return: {"status":"ok"}
```

---

## 🎨 Step 6: Deploy Frontend (Azure Static Web Apps)

### 6.1 Prepare Frontend Code

```bash
# Navigate to frontend directory
cd ../restaurant-dashboard

# Update API endpoint in .env
cat > .env << EOF
VITE_API_URL=https://${BACKEND_URL}
EOF

# Install dependencies
npm install

# Build for production
npm run build
```

### 6.2 Create Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name restaurant-frontend \
  --resource-group restaurant-rg \
  --location eastus \
  --sku Free

# Get deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name restaurant-frontend \
  --resource-group restaurant-rg \
  --query properties.apiKey \
  --output tsv)
```

### 6.3 Deploy Frontend

#### Option A: Deploy via Azure CLI

```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy ./dist \
  --deployment-token $DEPLOYMENT_TOKEN \
  --app-name restaurant-frontend
```

#### Option B: Deploy via GitHub Actions (Recommended)

1. Push code to GitHub
2. In Azure Portal, go to your Static Web App
3. Click "Deployment" → "GitHub"
4. Connect your repository
5. Configure:
   - Branch: `main`
   - Build preset: `Vite`
   - App location: `/restaurant-dashboard`
   - Output location: `dist`

GitHub Actions workflow will be auto-generated.

### 6.4 Configure Custom Domain (Optional)

```bash
# Add custom domain
az staticwebapp hostname set \
  --name restaurant-frontend \
  --resource-group restaurant-rg \
  --hostname restaurant.yourdomain.com

# Follow DNS configuration instructions provided
```

### 6.5 Get Frontend URL

```bash
# Get Static Web App URL
az staticwebapp show \
  --name restaurant-frontend \
  --resource-group restaurant-rg \
  --query defaultHostname \
  --output tsv

# Visit: https://restaurant-frontend.azurestaticapps.net
```

---

## 📊 Step 7: Setup Monitoring

### 7.1 Create Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app restaurant-insights \
  --location eastus \
  --resource-group restaurant-rg \
  --application-type web

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app restaurant-insights \
  --resource-group restaurant-rg \
  --query instrumentationKey \
  --output tsv)

# Add to App Service
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=${INSTRUMENTATION_KEY}"
```

### 7.2 Enable Logging

```bash
# Enable application logging
az webapp log config \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --application-logging filesystem \
  --level information

# Enable detailed error messages
az webapp config set \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --http-logging-enabled true \
  --detailed-error-messages-enabled true

# Stream logs
az webapp log tail \
  --name $APP_NAME \
  --resource-group restaurant-rg
```

---

## 🗃️ Step 8: Initialize Database

### 8.1 Seed Database with Initial Data

```bash
# SSH into App Service (or run locally with production connection)
cd restaurant-backend

# Run seed scripts
node seeds/seedEmployees.js
node seeds/seedMenu.js
node seeds/seedUsers.js

# Verify data
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const Employee = require('./models/Employee');
Employee.countDocuments().then(count => {
  console.log('Employees:', count);
  process.exit(0);
});
"
```

---

## 🔒 Step 9: Security Checklist

### 9.1 Enable HTTPS Only

```bash
# Force HTTPS
az webapp update \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --https-only true
```

### 9.2 Configure CORS

```bash
# Set allowed origins
az webapp cors add \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --allowed-origins "https://restaurant-frontend.azurestaticapps.net"
```

### 9.3 Enable Web Application Firewall (Optional)

```bash
# For App Service, consider Azure Front Door with WAF
az network front-door create \
  --name restaurant-frontdoor \
  --resource-group restaurant-rg \
  --backend-address ${BACKEND_URL}
```

---

## 💰 Step 10: Cost Management

### 10.1 Set Up Budget Alerts

```bash
# Create budget
az consumption budget create \
  --budget-name restaurant-monthly-budget \
  --amount 100 \
  --time-grain Monthly \
  --start-date "2026-03-01" \
  --end-date "2027-03-01" \
  --resource-group restaurant-rg
```

### 10.2 Monitor Costs

```bash
# View current costs
az consumption usage list \
  --start-date 2026-03-01 \
  --end-date 2026-03-31 \
  --query "[].{Service:instanceName, Cost:pretaxCost}" \
  --output table
```

---

## 📈 Step 11: Scaling & Performance

### 11.1 Auto-Scale App Service

```bash
# Enable autoscale
az monitor autoscale create \
  --name restaurant-autoscale \
  --resource-group restaurant-rg \
  --resource $APP_NAME \
  --resource-type Microsoft.Web/sites \
  --min-count 1 \
  --max-count 5 \
  --count 1

# Add scale-out rule (CPU > 75%)
az monitor autoscale rule create \
  --autoscale-name restaurant-autoscale \
  --resource-group restaurant-rg \
  --condition "Percentage CPU > 75 avg 5m" \
  --scale out 1
```

### 11.2 Configure CDN (Optional)

```bash
# Create CDN profile for static assets
az cdn profile create \
  --name restaurant-cdn \
  --resource-group restaurant-rg \
  --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
  --name restaurant-cdn-endpoint \
  --profile-name restaurant-cdn \
  --resource-group restaurant-rg \
  --origin restaurant-frontend.azurestaticapps.net
```

---

## 🧪 Step 12: Testing Deployment

### 12.1 Test Backend API

```bash
# Test health endpoint
curl https://${BACKEND_URL}/health

# Test login (create test user first)
curl -X POST https://${BACKEND_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@restaurant.com","password":"password123"}'

# Test protected endpoint
curl -X GET https://${BACKEND_URL}/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 12.2 Test Frontend

```bash
# Open browser
open https://restaurant-frontend.azurestaticapps.net

# Test login
# Test creating an order
# Test viewing analytics
```

---

## 🔄 Step 13: CI/CD Setup (GitHub Actions)

### 13.1 Backend CI/CD

Create `.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches:
      - main
    paths:
      - 'restaurant-backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd restaurant-backend
          npm ci --production
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_APP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: restaurant-backend
```

### 13.2 Get Publish Profile

```bash
# Get publish profile
az webapp deployment list-publishing-profiles \
  --name $APP_NAME \
  --resource-group restaurant-rg \
  --xml

# Add to GitHub Secrets as: AZURE_WEBAPP_PUBLISH_PROFILE
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=8080
MONGODB_URI=<from-keyvault>
JWT_SECRET=<from-keyvault>
AZURE_OPENAI_ENDPOINT=https://restaurant-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=<from-keyvault>
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://restaurant-doc-intel.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=<from-keyvault>
APPLICATIONINSIGHTS_CONNECTION_STRING=<instrumentation-key>
```

### Frontend (.env)
```env
VITE_API_URL=https://restaurant-api-xxx.azurewebsites.net
```

---

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check logs
az webapp log tail --name $APP_NAME --resource-group restaurant-rg

# Check environment variables
az webapp config appsettings list --name $APP_NAME --resource-group restaurant-rg

# Restart app
az webapp restart --name $APP_NAME --resource-group restaurant-rg
```

### Database connection issues
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-connection-string')
  .then(() => console.log('Connected'))
  .catch(err => console.error(err));
"
```

### Key Vault access denied
```bash
# Verify managed identity has access
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list
```

---

## 🎉 Deployment Complete!

Your restaurant management system is now live on Azure!

**URLs:**
- Frontend: `https://restaurant-frontend.azurestaticapps.net`
- Backend API: `https://restaurant-api-xxx.azurewebsites.net`
- MongoDB: `MongoDB Atlas`

**Next Steps:**
1. Create admin user account
2. Upload menu items
3. Add employees
4. Configure payment methods
5. Train staff on the system

---

## 📊 Monthly Cost Estimate

| Service | Tier | Estimated Cost |
|---------|------|----------------|
| App Service (B1) | Basic | $13/month |
| Static Web Apps | Free | $0/month |
| MongoDB Atlas (M0) | Free | $0/month |
| Azure OpenAI | Pay-as-you-go | ~$20/month |
| Document Intelligence | Pay-as-you-go | ~$5/month |
| Key Vault | Standard | $0.03/month |
| Application Insights | Basic | ~$5/month |
| **Total** | | **~$43/month** |

*Costs may vary based on usage*

---

**Last Updated**: March 6, 2026
**Version**: 1.0
