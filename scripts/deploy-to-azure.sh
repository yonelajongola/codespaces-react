#!/bin/bash

# Azure Restaurant Management System Deployment Script
# Run this script after creating all Azure resources

set -e

# Configuration
RESOURCE_GROUP="rg-restaurant-prod"
APP_NAME="restaurant-app"

echo "🚀 Starting deployment process..."

# Step 1: Deploy Backend to App Service
echo "📦 Building and deploying backend..."
cd /workspaces/codespaces-react/restaurant-backend

# Create deployment package
zip -r deploy.zip . -x "*.git*" "node_modules/*" "*.env*"

# Deploy to App Service
az webapp deploy \
  --name "${APP_NAME}-api" \
  --resource-group $RESOURCE_GROUP \
  --src-path deploy.zip \
  --type zip

echo "✅ Backend deployed successfully"

# Step 2: Build and deploy frontend
echo "🎨 Building frontend..."
cd ../restaurant-dashboard

# Install dependencies and build
npm ci
npm run build

echo "✅ Frontend built successfully"

# Step 3: Initialize database schema
echo "🗄️ Initializing database..."
cd ../restaurant-backend

# Run database setup (you'll need to implement this)
echo "⚠️  Manual step required: Run database migrations"
echo "   Connect to your PostgreSQL instance and run the schema.sql file"

echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure Azure AD B2C (see AZURE_SETUP.md)"
echo "2. Update frontend environment variables"
echo "3. Test all functionality"
echo ""
echo "🌐 Your applications:"
echo "   Frontend: https://${APP_NAME}-frontend.azurestaticapps.net"
echo "   Backend:  https://${APP_NAME}-api.azurewebsites.net"