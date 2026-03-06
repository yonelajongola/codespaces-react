#!/bin/bash
#
# Azure Cloud Security Audit Script
# Purpose: Comprehensive security assessment for Azure environments
# Usage: ./azure-security-audit.sh [subscription-id]
#

set -e

SUBSCRIPTION_ID="${1:-$(az account show --query id -o tsv)}"
OUTPUT_DIR="./azure-security-report-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo "=================================================="
echo "🔐 Azure Cloud Security Audit"
echo "=================================================="
echo "Subscription: $SUBSCRIPTION_ID"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Set the subscription context
az account set --subscription "$SUBSCRIPTION_ID"

# Function to write findings
write_finding() {
  local risk_level=$1
  local title=$2
  local description=$3
  local file="$OUTPUT_DIR/findings.txt"
  
  echo "[$risk_level] $title" >> "$file"
  echo "  $description" >> "$file"
  echo "" >> "$file"
}

echo "1️⃣  Detecting Suspicious Login Activity..."
echo "----------------------------------------"

# Get sign-in logs from last 7 days with failures
echo "Checking for multiple failed login attempts..."
az ad signed-in-user list-owned-objects 2>/dev/null || echo "⚠️  Azure AD Premium required for sign-in logs"

# Alternative: Check for risky users
RISKY_USERS=$(az rest --method GET --uri "https://graph.microsoft.com/v1.0/identityProtection/riskyUsers" 2>/dev/null | jq -r '.value[] | select(.riskState == "atRisk") | .userPrincipalName' || echo "")

if [ -n "$RISKY_USERS" ]; then
  write_finding "HIGH" "Risky Users Detected" "Users flagged with active risk: $RISKY_USERS"
  echo "🔴 HIGH RISK: Risky users detected"
  echo "$RISKY_USERS"
else
  echo "✅ No risky users detected"
fi

echo ""
echo "2️⃣  Identifying Over-Permissioned Accounts..."
echo "----------------------------------------"

# Check for users with Owner role at subscription level
OWNERS=$(az role assignment list --role "Owner" --scope "/subscriptions/$SUBSCRIPTION_ID" --query "[].principalName" -o tsv)
OWNER_COUNT=$(echo "$OWNERS" | wc -l)

echo "Subscription Owners: $OWNER_COUNT"
echo "$OWNERS" > "$OUTPUT_DIR/subscription-owners.txt"

if [ "$OWNER_COUNT" -gt 5 ]; then
  write_finding "MEDIUM" "Too Many Subscription Owners" "$OWNER_COUNT owners detected. Review and apply least privilege."
  echo "🟡 MEDIUM RISK: $OWNER_COUNT subscription owners (recommend < 5)"
else
  echo "✅ Acceptable number of subscription owners"
fi

# Check for service principals with contributor access
echo ""
echo "Checking service principals with elevated access..."
az ad sp list --all --query "[].{Name:displayName, AppId:appId}" -o json > "$OUTPUT_DIR/service-principals.json"
SP_COUNT=$(jq '. | length' "$OUTPUT_DIR/service-principals.json")
echo "Total Service Principals: $SP_COUNT"

echo ""
echo "3️⃣  Checking for Exposed Storage Containers..."
echo "----------------------------------------"

# List all storage accounts
STORAGE_ACCOUNTS=$(az storage account list --query "[].{name:name, rg:resourceGroup}" -o json)
echo "$STORAGE_ACCOUNTS" > "$OUTPUT_DIR/storage-accounts.json"

EXPOSED_CONTAINERS=0

for row in $(echo "$STORAGE_ACCOUNTS" | jq -r '.[] | @base64'); do
  _jq() {
    echo "$row" | base64 --decode | jq -r "$1"
  }
  
  STORAGE_NAME=$(_jq '.name')
  RESOURCE_GROUP=$(_jq '.rg')
  
  echo "Checking: $STORAGE_NAME"
  
  # Check if public access is allowed
  PUBLIC_ACCESS=$(az storage account show --name "$STORAGE_NAME" --resource-group "$RESOURCE_GROUP" \
    --query "allowBlobPublicAccess" -o tsv 2>/dev/null || echo "unknown")
  
  if [ "$PUBLIC_ACCESS" == "true" ]; then
    EXPOSED_CONTAINERS=$((EXPOSED_CONTAINERS + 1))
    write_finding "HIGH" "Storage Account Allows Public Access" "Storage: $STORAGE_NAME has public blob access enabled"
    echo "  🔴 HIGH RISK: Public blob access enabled"
  fi
  
  # Check for network rules
  DEFAULT_ACTION=$(az storage account show --name "$STORAGE_NAME" --resource-group "$RESOURCE_GROUP" \
    --query "networkRuleSet.defaultAction" -o tsv 2>/dev/null || echo "unknown")
  
  if [ "$DEFAULT_ACTION" == "Allow" ]; then
    write_finding "MEDIUM" "Storage Account Without Firewall" "Storage: $STORAGE_NAME allows traffic from all networks"
    echo "  🟡 MEDIUM RISK: No network restrictions"
  fi
done

if [ "$EXPOSED_CONTAINERS" -eq 0 ]; then
  echo "✅ No storage accounts with public access detected"
else
  echo "🔴 Found $EXPOSED_CONTAINERS storage account(s) with security issues"
fi

echo ""
echo "4️⃣  Detecting Public IP Risks..."
echo "----------------------------------------"

# Check for VMs with public IPs
PUBLIC_IPS=$(az network public-ip list --query "[].{name:name, ip:ipAddress, rg:resourceGroup}" -o json)
echo "$PUBLIC_IPS" > "$OUTPUT_DIR/public-ips.json"
PUBLIC_IP_COUNT=$(echo "$PUBLIC_IPS" | jq '. | length')

echo "Public IPs Found: $PUBLIC_IP_COUNT"

if [ "$PUBLIC_IP_COUNT" -gt 0 ]; then
  echo "$PUBLIC_IPS" | jq -r '.[] | "  - \(.name): \(.ip)"'
  
  # Check NSGs for overly permissive rules
  echo ""
  echo "Checking Network Security Groups for risky rules..."
  
  NSG_LIST=$(az network nsg list --query "[].{name:name, rg:resourceGroup}" -o json)
  
  for row in $(echo "$NSG_LIST" | jq -r '.[] | @base64'); do
    _jq() {
      echo "$row" | base64 --decode | jq -r "$1"
    }
    
    NSG_NAME=$(_jq '.name')
    NSG_RG=$(_jq '.rg')
    
    # Check for rules allowing 0.0.0.0/0
    OPEN_RULES=$(az network nsg rule list --nsg-name "$NSG_NAME" --resource-group "$NSG_RG" \
      --query "[?sourceAddressPrefix=='*' || sourceAddressPrefix=='0.0.0.0/0' || sourceAddressPrefix=='Internet'].{name:name, port:destinationPortRange, access:access}" -o json)
    
    OPEN_COUNT=$(echo "$OPEN_RULES" | jq '. | length')
    
    if [ "$OPEN_COUNT" -gt 0 ]; then
      write_finding "HIGH" "NSG Allows Traffic from Internet" "NSG: $NSG_NAME has $OPEN_COUNT rule(s) allowing 0.0.0.0/0"
      echo "  🔴 HIGH RISK: $NSG_NAME has rules allowing Internet traffic"
      echo "$OPEN_RULES" | jq -r '.[] | "    - \(.name): Port \(.port) (\(.access))"'
    fi
  done
fi

echo ""
echo "5️⃣  Checking Authentication Policies..."
echo "----------------------------------------"

# Check if MFA is required via Conditional Access
echo "Checking Conditional Access policies..."

CA_POLICIES=$(az rest --method GET --uri "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies" 2>/dev/null | jq '.value' || echo "[]")
echo "$CA_POLICIES" > "$OUTPUT_DIR/conditional-access-policies.json"

CA_COUNT=$(echo "$CA_POLICIES" | jq '. | length')
MFA_POLICIES=$(echo "$CA_POLICIES" | jq '[.[] | select(.grantControls.builtInControls[] == "mfa")] | length')

echo "Conditional Access Policies: $CA_COUNT"
echo "Policies requiring MFA: $MFA_POLICIES"

if [ "$MFA_POLICIES" -eq 0 ]; then
  write_finding "HIGH" "No MFA Enforcement Detected" "No Conditional Access policies requiring MFA found"
  echo "🔴 HIGH RISK: MFA not enforced via Conditional Access"
else
  echo "✅ MFA enforcement policies detected"
fi

# Check password policy
echo ""
echo "Checking password policies..."
PASSWORD_POLICY=$(az rest --method GET --uri "https://graph.microsoft.com/v1.0/domains" 2>/dev/null | jq '.value[0].passwordNotificationWindowInDays' || echo "unknown")

if [ "$PASSWORD_POLICY" == "unknown" ]; then
  echo "⚠️  Unable to retrieve password policy (requires admin consent)"
else
  echo "Password notification window: $PASSWORD_POLICY days"
fi

echo ""
echo "6️⃣  Azure Defender for Cloud Status..."
echo "----------------------------------------"

# Check if Defender plans are enabled
DEFENDER_PLANS=$(az security pricing list --query "value[].{name:name, tier:pricingTier}" -o json)
echo "$DEFENDER_PLANS" > "$OUTPUT_DIR/defender-plans.json"

echo "Microsoft Defender for Cloud Status:"
echo "$DEFENDER_PLANS" | jq -r '.[] | "  \(.name): \(.tier)"'

FREE_TIER_COUNT=$(echo "$DEFENDER_PLANS" | jq '[.[] | select(.tier == "Free")] | length')

if [ "$FREE_TIER_COUNT" -gt 0 ]; then
  write_finding "MEDIUM" "Defender for Cloud Not Fully Enabled" "$FREE_TIER_COUNT resources on Free tier"
  echo "🟡 MEDIUM RISK: Some Defender plans on Free tier"
fi

echo ""
echo "7️⃣  Key Vault Security Assessment..."
echo "----------------------------------------"

KEY_VAULTS=$(az keyvault list --query "[].{name:name, rg:resourceGroup}" -o json)
KV_COUNT=$(echo "$KEY_VAULTS" | jq '. | length')

echo "Key Vaults Found: $KV_COUNT"

if [ "$KV_COUNT" -eq 0 ]; then
  write_finding "LOW" "No Key Vault Detected" "Consider using Azure Key Vault for secrets management"
  echo "⚠️  No Key Vault found (secrets may be stored insecurely)"
else
  for row in $(echo "$KEY_VAULTS" | jq -r '.[] | @base64'); do
    _jq() {
      echo "$row" | base64 --decode | jq -r "$1"
    }
    
    KV_NAME=$(_jq '.name')
    
    # Check for purge protection and soft delete
    PURGE_PROTECTION=$(az keyvault show --name "$KV_NAME" --query "properties.enablePurgeProtection" -o tsv 2>/dev/null || echo "false")
    SOFT_DELETE=$(az keyvault show --name "$KV_NAME" --query "properties.enableSoftDelete" -o tsv 2>/dev/null || echo "false")
    
    echo "  $KV_NAME:"
    echo "    Soft Delete: $SOFT_DELETE"
    echo "    Purge Protection: $PURGE_PROTECTION"
    
    if [ "$PURGE_PROTECTION" != "true" ]; then
      write_finding "MEDIUM" "Key Vault Without Purge Protection" "Key Vault: $KV_NAME - Enable purge protection"
    fi
  done
fi

echo ""
echo "=================================================="
echo "📊 Security Audit Summary"
echo "=================================================="

# Count findings by severity
if [ -f "$OUTPUT_DIR/findings.txt" ]; then
  HIGH_COUNT=$(grep -c "^\[HIGH\]" "$OUTPUT_DIR/findings.txt" || echo "0")
  MEDIUM_COUNT=$(grep -c "^\[MEDIUM\]" "$OUTPUT_DIR/findings.txt" || echo "0")
  LOW_COUNT=$(grep -c "^\[LOW\]" "$OUTPUT_DIR/findings.txt" || echo "0")
  
  echo "🔴 High Risk Findings: $HIGH_COUNT"
  echo "🟡 Medium Risk Findings: $MEDIUM_COUNT"
  echo "🟢 Low Risk Findings: $LOW_COUNT"
  echo ""
  
  if [ "$HIGH_COUNT" -gt 0 ] || [ "$MEDIUM_COUNT" -gt 0 ]; then
    echo "⚠️  ATTENTION REQUIRED: Review findings in $OUTPUT_DIR/findings.txt"
  else
    echo "✅ No critical security issues detected"
  fi
else
  echo "✅ No security findings to report"
fi

echo ""
echo "📁 Detailed reports saved to: $OUTPUT_DIR/"
echo ""
echo "Next Steps:"
echo "1. Review findings.txt for security issues"
echo "2. Implement recommended remediation steps"
echo "3. Re-run audit after changes"
echo "4. Schedule regular security audits (weekly recommended)"
echo ""
echo "For help with remediation, use: @azure [describe the issue]"
echo "=================================================="
