#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration variables
RESOURCE_GROUP="restaurant-rg"
LOCATION="eastus"
SUBSCRIPTION_ID="${SUBSCRIPTION_ID}"
ENVIRONMENT="${ENVIRONMENT:-dev}"

# Backend configuration
BACKEND_APP_NAME="restaurant-api-${ENVIRONMENT}-$(date +%s | tail -c 5)"
BACKEND_PLAN="restaurant-plan-${ENVIRONMENT}"

# Frontend configuration  
FRONTEND_APP_NAME="restaurant-dashboard-${ENVIRONMENT}"

# Azure OpenAI configuration
OPENAI_NAME="restaurant-openai"
OPENAI_SKU="S0"

# Key Vault
KEYVAULT_NAME="restaurant-kv-${ENVIRONMENT}-$(date +%s | tail -c 5)"

# MongoDB (user should have this ready)
MONGODB_URI="${MONGODB_URI:-}"

echo -e "${BLUE}=== Restaurant Management System - Azure Deployment ===${NC}\n"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        echo -e "${RED}❌ Azure CLI not found. Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli${NC}"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Prerequisites check passed${NC}\n"
}

# Function to authenticate with Azure
authenticate_azure() {
    echo -e "${YELLOW}[2/7] Authenticating with Azure...${NC}"
    
    # Check if already logged in
    if ! az account show &> /dev/null; then
        echo "Opening browser for Azure login..."
        az login
    fi
    
    # Set subscription
    if [ -n "$SUBSCRIPTION_ID" ]; then
        az account set --subscription "$SUBSCRIPTION_ID"
        echo -e "${GREEN}✓ Using subscription: $SUBSCRIPTION_ID${NC}"
    else
        echo -e "${YELLOW}Current subscription:${NC}"
        az account show --query "name" -o tsv
    fi
    echo ""
}

# Function to create resource group
create_resource_group() {
    echo -e "${YELLOW}[3/7] Creating Resource Group...${NC}"
    
    if az group exists --name "$RESOURCE_GROUP" | grep -q true; then
        echo -e "${GREEN}✓ Resource group already exists: $RESOURCE_GROUP${NC}"
    else
        az group create \
            --name "$RESOURCE_GROUP" \
            --location "$LOCATION"
        echo -e "${GREEN}✓ Created resource group: $RESOURCE_GROUP${NC}"
    fi
    echo ""
}

# Function to create Key Vault
create_key_vault() {
    echo -e "${YELLOW}[4/7] Setting up Azure Key Vault...${NC}"
    
    # Create Key Vault
    az keyvault create \
        --name "$KEYVAULT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --enable-rbac-authorization false
    
    echo -e "${GREEN}✓ Created Key Vault: $KEYVAULT_NAME${NC}"
    
    # Store MongoDB URI if provided
    if [ -n "$MONGODB_URI" ]; then
        az keyvault secret set \
            --vault-name "$KEYVAULT_NAME" \
            --name "mongodb-uri" \
            --value "$MONGODB_URI"
        echo -e "${GREEN}✓ Stored MongoDB URI in Key Vault${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB URI not provided. Please add manually:${NC}"
        echo "  az keyvault secret set --vault-name $KEYVAULT_NAME --name mongodb-uri --value 'your-connection-string'"
    fi
    
    # Generate and store JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    az keyvault secret set \
        --vault-name "$KEYVAULT_NAME" \
        --name "jwt-secret" \
        --value "$JWT_SECRET"
    echo -e "${GREEN}✓ Generated and stored JWT secret${NC}"
    
    echo ""
}

# Function to create App Service Plan and Backend
create_backend() {
    echo -e "${YELLOW}[5/7] Setting up Backend API (App Service)...${NC}"
    
    # Create App Service Plan
    az appservice plan create \
        --name "$BACKEND_PLAN" \
        --resource-group "$RESOURCE_GROUP" \
        --sku B1 \
        --is-linux
    
    echo -e "${GREEN}✓ Created App Service Plan: $BACKEND_PLAN${NC}"
    
    # Create App Service
    az webapp create \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$BACKEND_PLAN" \
        --name "$BACKEND_APP_NAME" \
        --runtime "NODE|18-lts"
    
    echo -e "${GREEN}✓ Created App Service: $BACKEND_APP_NAME${NC}"
    
    # Configure app settings
    az webapp config appsettings set \
        --resource-group "$RESOURCE_GROUP" \
        --name "$BACKEND_APP_NAME" \
        --settings \
            NODE_ENV=production \
            PORT=8080
    
    echo -e "${GREEN}✓ Configured backend settings${NC}"
    
    echo -e "${BLUE}Backend URL: https://${BACKEND_APP_NAME}.azurewebsites.net${NC}"
    echo ""
}

# Function to create Static Web Apps for Frontend
create_frontend() {
    echo -e "${YELLOW}[6/7] Setting up Frontend Dashboard (Static Web Apps)...${NC}"
    
    # Create Static Web App
    STATIC_APP_ID=$(az staticwebapp create \
        --name "$FRONTEND_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --query id \
        --output tsv)
    
    if [ -z "$STATIC_APP_ID" ]; then
        # Fallback for regions that don't support Static Web Apps in preferred location
        az staticwebapp create \
            --name "$FRONTEND_APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --location "centralus" \
            --sku Free
        echo -e "${YELLOW}⚠ Static Web App created in alternate location (centralus)${NC}"
    fi
    
    echo -e "${GREEN}✓ Created Static Web App: $FRONTEND_APP_NAME${NC}"
    echo -e "${BLUE}Frontend URL: https://$(az staticwebapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostname -o tsv)${NC}"
    
    echo ""
}

# Function to setup Azure OpenAI Service
create_openai_service() {
    echo -e "${YELLOW}[7/7] Setting up Azure OpenAI Service...${NC}"
    
    # Check if service already exists
    if az cognitiveservices account show \
        --name "$OPENAI_NAME" \
        --resource-group "$RESOURCE_GROUP" &>/dev/null; then
        echo -e "${GREEN}✓ Azure OpenAI Service already exists${NC}"
    else
        az cognitiveservices account create \
            --name "$OPENAI_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --kind OpenAI \
            --sku "$OPENAI_SKU" \
            --location "$LOCATION" \
            --yes
        
        echo -e "${GREEN}✓ Created Azure OpenAI Service${NC}"
    fi
    
    # Get endpoint and key
    OPENAI_ENDPOINT=$(az cognitiveservices account show \
        --name "$OPENAI_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.endpoint" \
        --output tsv)
    
    OPENAI_KEY=$(az cognitiveservices account keys list \
        --name "$OPENAI_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "key1" \
        --output tsv)
    
    # Store in Key Vault
    az keyvault secret set \
        --vault-name "$KEYVAULT_NAME" \
        --name "openai-endpoint" \
        --value "$OPENAI_ENDPOINT"
    
    az keyvault secret set \
        --vault-name "$KEYVAULT_NAME" \
        --name "openai-key" \
        --value "$OPENAI_KEY"
    
    echo -e "${GREEN}✓ Stored OpenAI credentials in Key Vault${NC}"
    echo ""
}

# Main execution
main() {
    check_prerequisites
    authenticate_azure
    create_resource_group
    create_key_vault
    create_backend
    create_frontend
    create_openai_service
    
    echo -e "${GREEN}=== Deployment Setup Complete ===${NC}\n"
    echo -e "${BLUE}📋 Summary:${NC}"
    echo -e "  Resource Group: ${GREEN}$RESOURCE_GROUP${NC}"
    echo -e "  Key Vault: ${GREEN}$KEYVAULT_NAME${NC}"
    echo -e "  Backend API: ${GREEN}https://${BACKEND_APP_NAME}.azurewebsites.net${NC}"
    echo -e "  Frontend: ${GREEN}https://${FRONTEND_APP_NAME}...azurestaticapps.net${NC}"
    echo -e "  OpenAI Service: ${GREEN}$OPENAI_NAME${NC}"
    echo ""
    
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo "1. Deploy backend: cd restaurant-backend && npm run deploy:azure"
    echo "2. Deploy frontend: cd restaurant-dashboard && npm run deploy:azure"
    echo "3. Configure environment variables in Azure Portal"
    echo "4. Test endpoints at: https://${BACKEND_APP_NAME}.azurewebsites.net/health"
    echo ""
    
    echo -e "${YELLOW}🔑 Secrets stored in Key Vault:${NC}"
    echo "  - mongodb-uri"
    echo "  - jwt-secret"
    echo "  - openai-endpoint"
    echo "  - openai-key"
    echo ""
    
    # Save configuration to file for reference
    cat > azure-deployment.env << EOF
RESOURCE_GROUP=$RESOURCE_GROUP
LOCATION=$LOCATION
BACKEND_APP_NAME=$BACKEND_APP_NAME
BACKEND_PLAN=$BACKEND_PLAN
FRONTEND_APP_NAME=$FRONTEND_APP_NAME
KEYVAULT_NAME=$KEYVAULT_NAME
OPENAI_NAME=$OPENAI_NAME
EOF
    echo -e "${GREEN}✓ Configuration saved to: azure-deployment.env${NC}"
}

# Run main function
main
