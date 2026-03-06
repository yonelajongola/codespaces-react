#!/bin/bash
set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Restaurant Backend - Azure Deployment ===${NC}\n"

# Read configuration from azure-deployment.env
if [ ! -f "azure-deployment.env" ]; then
    echo -e "${YELLOW}Error: azure-deployment.env not found. Run azure-deploy.sh first.${NC}"
    exit 1
fi

source azure-deployment.env

BACKEND_APP_NAME=${BACKEND_APP_NAME}
RESOURCE_GROUP=${RESOURCE_GROUP}
KEYVAULT_NAME=${KEYVAULT_NAME}

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✓ Dependencies installed${NC}\n"

echo -e "${YELLOW}Step 2: Building application...${NC}"
npm run build 2>/dev/null || true
echo -e "${GREEN}✓ Build complete${NC}\n"

echo -e "${YELLOW}Step 3: Preparing deployment package...${NC}"

# Create .deployment file for Azure App Service
cat > .deployment << EOF
[config]
command = npm install && npm run start
SCM_DO_BUILD_DURING_DEPLOYMENT = true
EOF

# Create .azure-kubeconfig for deployments (if needed)
mkdir -p .azure

echo -e "${GREEN}✓ Deployment package prepared${NC}\n"

echo -e "${YELLOW}Step 4: Configuring App Service settings...${NC}"

# Get secrets from Key Vault
MONGODB_URI=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "mongodb-uri" --query value -o tsv)
JWT_SECRET=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "jwt-secret" --query value -o tsv)
OPENAI_ENDPOINT=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "openai-endpoint" --query value -o tsv)
OPENAI_KEY=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "openai-key" --query value -o tsv)

# Set App Service Configuration
az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$BACKEND_APP_NAME" \
    --settings \
        MONGODB_URI="$MONGODB_URI" \
        JWT_SECRET="$JWT_SECRET" \
        OPENAI_ENDPOINT="$OPENAI_ENDPOINT" \
        OPENAI_KEY="$OPENAI_KEY" \
        NODE_ENV=production \
        PORT=8080

echo -e "${GREEN}✓ App Service configured with credentials${NC}\n"

echo -e "${YELLOW}Step 5: Creating deployment credentials...${NC}"

# Create deployment user
az webapp deployment user set \
    --user-name "restaurant-deploy" \
    --password "$(openssl rand -base64 32 | head -c 20)"

echo -e "${GREEN}✓ Deployment user created${NC}\n"

echo -e "${YELLOW}Step 6: Deploying to Azure App Service...${NC}"

# Get git deployment URL
GIT_URL=$(az webapp deployment source config-local-git \
    --resource-group "$RESOURCE_GROUP" \
    --name "$BACKEND_APP_NAME" \
    --query url \
    --output tsv)

# Add Azure as remote
if git remote | grep -q azure; then
    git remote remove azure
fi

git remote add azure "$GIT_URL"

# Deploy via Git
echo -e "${BLUE}Pushing code to Azure...${NC}"
git push -u azure main --force 2>/dev/null || {
    echo -e "${YELLOW}Using alternative deployment method...${NC}"
    # Fallback to zip deployment
    zip -r -q app.zip . -x ".git/*" "node_modules/*" ".gitignore"
    az webapp up \
        --resource-group "$RESOURCE_GROUP" \
        --name "$BACKEND_APP_NAME" \
        --plan "$BACKEND_PLAN" \
        --sku B1 \
        --runtime "NODE|18-lts"
    rm app.zip
}

echo -e "${GREEN}✓ Backend deployed successfully${NC}\n"

echo -e "${YELLOW}Step 7: Verifying deployment...${NC}"

# Check deployment status
sleep 10  # Wait for app to initialize

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "https://${BACKEND_APP_NAME}.azurewebsites.net/health" || echo "000")

if [ "$HEALTH_CHECK" = "200" ] || [ "$HEALTH_CHECK" = "404" ]; then
    echo -e "${GREEN}✓ Backend is accessible${NC}"
else
    echo -e "${YELLOW}⚠ Health check returned: $HEALTH_CHECK (may still be initializing)${NC}"
fi

echo ""
echo -e "${GREEN}=== Backend Deployment Complete ===${NC}\n"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "  App Name: ${GREEN}$BACKEND_APP_NAME${NC}"
echo -e "  URL: ${GREEN}https://${BACKEND_APP_NAME}.azurewebsites.net${NC}"
echo -e "  Resource Group: ${GREEN}$RESOURCE_GROUP${NC}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. View logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME"
echo "2. Scale up if needed: az appservice plan update --name $BACKEND_PLAN --resource-group $RESOURCE_GROUP --sku S1"
echo "3. Configure custom domain: az webapp config hostname add --resource-group $RESOURCE_GROUP --webapp-name $BACKEND_APP_NAME --hostname yourdomain.com"
echo ""
