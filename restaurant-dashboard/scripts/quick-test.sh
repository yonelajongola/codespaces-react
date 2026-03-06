#!/bin/bash
#
# Quick Azure Integration Test
# Run immediate tests on your setup
#

echo "🧪 Azure Integration Quick Test"
echo "================================"
echo ""

# Test 1: Configuration Check
echo "1️⃣  Configuration Check"
echo "-------------------"
cd /workspaces/codespaces-react/restaurant-dashboard

if [ -f ".env" ]; then
  DEMO_MODE=$(grep "VITE_DEMO_MODE" .env | cut -d'=' -f2)
  CLIENT_ID=$(grep "VITE_AZURE_CLIENT_ID" .env | cut -d'=' -f2)
  
  echo "✅ .env file found"
  echo "   Demo Mode: $DEMO_MODE"
  echo "   Client ID: $CLIENT_ID"
  
  if [ "$DEMO_MODE" = "true" ]; then
    echo "   ✓ Demo mode is enabled (good for testing)"
  else
    echo "   ✓ Azure AD mode (requires configuration)"
  fi
else
  echo "❌ .env file not found"
  exit 1
fi
echo ""

# Test 2: Backend Check
echo "2️⃣  Backend Connection Test"
echo "------------------------"
if curl -s -X POST http://localhost:3000/api/foodData -H "Content-Type: application/json" > /dev/null; then
  ITEM_COUNT=$(curl -s -X POST http://localhost:3000/api/foodData -H "Content-Type: application/json" | jq '.[0] | length')
  echo "✅ Backend API responding"
  echo "   Menu items loaded: $ITEM_COUNT"
else
  echo "❌ Backend not responding on port 3000"
fi
echo ""

# Test 3: Dashboard Check
echo "3️⃣  Dashboard Availability"
echo "-----------------------"
if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Dashboard running on http://localhost:5173"
  echo "   Login page: http://localhost:5173/login"
else
  echo "❌ Dashboard not running on port 5173"
fi
echo ""

# Test 4: Azure Agent Check
echo "4️⃣  Azure Agent Status"
echo "-------------------"
if [ -f "/workspaces/codespaces-react/.github/agents/azure.agent.md" ]; then
  echo "✅ Azure agent installed"
  echo "   Usage: @azure [your question]"
  echo "   Test it: @azure Hello, are you working?"
else
  echo "❌ Azure agent not found"
fi
echo ""

# Test 5: Security Script Check
echo "5️⃣  Security Audit Script"
echo "----------------------"
if [ -f "/workspaces/codespaces-react/restaurant-dashboard/scripts/azure-security-audit.sh" ]; then
  echo "✅ Security audit script available"
  if [ -x "/workspaces/codespaces-react/restaurant-dashboard/scripts/azure-security-audit.sh" ]; then
    echo "   ✓ Script is executable"
  else
    echo "   ⚠️  Script needs execute permission"
    echo "   Fix: chmod +x scripts/azure-security-audit.sh"
  fi
else
  echo "❌ Security audit script not found"
fi
echo ""

# Test 6: Build Check
echo "6️⃣  Build Status"
echo "-------------"
if [ -d "/workspaces/codespaces-react/restaurant-dashboard/dist" ]; then
  BUILD_SIZE=$(du -sh /workspaces/codespaces-react/restaurant-dashboard/dist | cut -f1)
  echo "✅ Production build exists"
  echo "   Size: $BUILD_SIZE"
else
  echo "⚠️  No production build (run: npm run build)"
fi
echo ""

# Summary
echo "================================"
echo "📊 Test Summary"
echo "================================"
echo ""
echo "✅ Ready to test:"
echo "   • Demo authentication"
echo "   • Backend data integration"
echo "   • Azure agent queries"
echo ""
echo "🔗 Quick Links:"
echo "   Dashboard: http://localhost:5173/login"
echo "   Backend API: http://localhost:3000/api/foodData"
echo ""
echo "📖 Full Test Guide:"
echo "   See: restaurant-dashboard/AZURE_TESTING.md"
echo ""
echo "🚀 Quick Tests:"
echo "   1. Open http://localhost:5173/login"
echo "   2. Click 'Demo Owner Access'"
echo "   3. Navigate to Menu page"
echo "   4. Verify items show ZAR currency"
echo ""
echo "🤖 Test Azure Agent:"
echo "   In VS Code chat, type:"
echo "   @azure What are the top 5 security checks for Azure?"
echo ""
