#!/bin/bash
set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Restaurant Frontend - Azure Static Web Apps Deployment ===${NC}\n"

# Check if in restaurant-dashboard directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from restaurant-dashboard directory.${NC}"
    exit 1
fi

# Read configuration
if [ ! -f "../azure-deployment.env" ]; then
    echo -e "${YELLOW}Error: azure-deployment.env not found in parent directory.${NC}"
    exit 1
fi

source ../azure-deployment.env

FRONTEND_APP_NAME=${FRONTEND_APP_NAME}
RESOURCE_GROUP=${RESOURCE_GROUP}
BACKEND_URL="https://${BACKEND_APP_NAME}.azurewebsites.net"

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✓ Dependencies installed${NC}\n"

echo -e "${YELLOW}Step 2: Setting up environment variables...${NC}"

# Create .env.production
cat > .env.production << EOF
VITE_API_URL=${BACKEND_URL}
VITE_ENVIRONMENT=production
EOF

echo -e "${GREEN}✓ Environment configured${NC}\n"

echo -e "${YELLOW}Step 3: Building frontend...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Build failed: dist directory not created${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}\n"

echo -e "${YELLOW}Step 4: Deploying to Azure Static Web Apps...${NC}"

# Get Static Web App deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
    --name "$FRONTEND_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.apiKey" \
    --output tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo -e "${YELLOW}⚠ Deployment token not found. Using Azure CLI deployment...${NC}"
    
    # Upload to Static Web App using Azure CLI
    az staticwebapp update \
        --name "$FRONTEND_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --source ./dist
    
    echo -e "${GREEN}✓ Frontend uploaded via Azure CLI${NC}"
else
    echo -e "${BLUE}Using Static Web Apps deployment token...${NC}"
    
    # Install Static Web Apps CLI if needed
    if ! command -v swa &> /dev/null; then
        echo "Installing Azure Static Web Apps CLI..."
        npm install -g @azure/static-web-apps-cli
    fi
    
    # Deploy using SWA CLI
    swa deploy ./dist \
        --deployment-token "$DEPLOYMENT_TOKEN" \
        --env production
    
    echo -e "${GREEN}✓ Frontend deployed via SWA CLI${NC}"
fi

echo -e "${YELLOW}Step 5: Verifying deployment...${NC}"

# Get the deployed URL
FRONTEND_URL=$(az staticwebapp show \
    --name "$FRONTEND_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "defaultHostname" \
    --output tsv)

FRONTEND_URL="https://${FRONTEND_URL}"

sleep 5

# Verify deployment
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${YELLOW}⚠ Initial check returned: $HTTP_CODE (may still be initializing)${NC}"
fi

echo ""
echo -e "${GREEN}=== Frontend Deployment Complete ===${NC}\n"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "  App Name: ${GREEN}$FRONTEND_APP_NAME${NC}"
echo -e "  URL: ${GREEN}${FRONTEND_URL}${NC}"
echo -e "  Backend API: ${GREEN}${BACKEND_URL}${NC}"
echo -e "  Status: ${GREEN}Ready${NC}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Visit your application: ${FRONTEND_URL}"
echo "2. View deployment logs:"
echo "   az staticwebapp show-build --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME"
echo "3. Configure custom domain:"
echo "   az staticwebapp hostname set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME --hostname yourdomain.com"
echo "4. Set up CI/CD with GitHub Actions (optional)"
echo ""

# Create configuration summary
cat > ../DEPLOYMENT_SUMMARY.md << EOF
# Azure Deployment Summary

## Deployment Date
$(date)

## Resources Created
- **Resource Group**: $RESOURCE_GROUP
- **Backend API**: https://${BACKEND_APP_NAME}.azurewebsites.net
- **Frontend Dashboard**: ${FRONTEND_URL}
- **Key Vault**: $KEYVAULT_NAME
- **OpenAI Service**: $OPENAI_NAME

## Configuration
- **Backend Runtime**: Node.js 18 LTS
- **Frontend Framework**: React/Vite
- **Database**: MongoDB Atlas
- **AI Service**: Azure OpenAI

## Stored Secrets (in Key Vault)
- mongodb-uri
- jwt-secret
- openai-endpoint
- openai-key

## Important URLs
- Backend API: ${BACKEND_URL}
- Frontend Dashboard: ${FRONTEND_URL}
- Azure Portal: https://portal.azure.com

## Management Commands
\`\`\`bash
# View logs
az webapp log tail --resource-group $RESOURCE_GROUP --name ${BACKEND_APP_NAME}

# Restart backend
az webapp restart --resource-group $RESOURCE_GROUP --name ${BACKEND_APP_NAME}

# Scale backend
az appservice plan update --name ${BACKEND_PLAN} --resource-group $RESOURCE_GROUP --sku S1

# View frontend build
az staticwebapp show-build --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME
\`\`\`

## Next Steps
1. Test the deployment at ${FRONTEND_URL}
2. Monitor application health via Azure Portal
3. Configure custom domains if needed
4. Set up CI/CD pipelines for automated deployments
5. Configure auto-scaling for production workloads
EOF

echo -e "${GREEN}✓ Deployment summary saved to: ../DEPLOYMENT_SUMMARY.md${NC}"
