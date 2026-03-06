# Azure Cloud Security Monitoring Guide

## 🎯 Quick Start

This guide helps you monitor and secure your Azure environment for the restaurant dashboard deployment.

## 🔐 Security Audit Script

### Run the Automated Security Audit

```bash
# Install Azure CLI (if not already installed)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Run the security audit
cd restaurant-dashboard/scripts
./azure-security-audit.sh

# Or specify a subscription
./azure-security-audit.sh your-subscription-id
```

### What the Script Checks

1. **Suspicious Login Activity** - Detects risky users and failed authentications
2. **Over-Permissioned Accounts** - Identifies excessive Owner/Contributor roles
3. **Exposed Storage** - Finds publicly accessible storage containers
4. **Public IP Risks** - Checks for insecure network configurations
5. **Weak Authentication** - Verifies MFA and Conditional Access policies
6. **Defender Status** - Reviews Microsoft Defender for Cloud coverage
7. **Key Vault Security** - Ensures proper secrets management

### Output

The script generates a timestamped report folder:
```
azure-security-report-20260306-123045/
├── findings.txt                    # Security issues found
├── subscription-owners.txt         # List of privileged accounts
├── service-principals.json         # Service principal inventory
├── storage-accounts.json           # Storage account details
├── public-ips.json                 # Public IP addresses
├── conditional-access-policies.json # Authentication policies
└── defender-plans.json             # Defender coverage status
```

## 🚨 Understanding Risk Levels

### 🔴 HIGH RISK - Immediate Action Required (0-24 hours)

**Examples**:
- Public storage containers with sensitive data
- No MFA enforcement for administrators
- NSG rules allowing 0.0.0.0/0 on critical ports (RDP/SSH)
- Risky users with active accounts
- SQL databases with public endpoints

**Impact**: Data breach, unauthorized access, compliance violations

### 🟡 MEDIUM RISK - Address Within 1 Week

**Examples**:
- Too many subscription owners (>5)
- Storage accounts without firewall rules
- Key Vault without purge protection
- Defender for Cloud on Free tier
- Legacy authentication enabled

**Impact**: Increased attack surface, potential data exposure

### 🟢 LOW RISK - Plan for Long-term Improvement

**Examples**:
- No Azure Key Vault configured
- Suboptimal password policies
- Missing activity log retention
- No budget alerts configured

**Impact**: Operational inefficiency, minor security gaps

## 📊 Manual Security Checks

### 1. Review Azure AD Sign-in Logs

```bash
# Check for failed sign-ins (requires Azure AD Premium)
az ad user list --filter "accountEnabled eq true" --query "[].userPrincipalName"

# Via Azure Portal:
# Azure Active Directory > Monitoring > Sign-in logs
# Filter: Status = Failure, Last 7 days
```

**Look for**:
- Multiple consecutive failures from same IP
- Sign-ins from unexpected countries
- Authentication from anonymizer services

### 2. Audit Role Assignments

```bash
# List all subscription-level role assignments
az role assignment list --include-inherited --all -o table

# Check specific user's permissions
az role assignment list --assignee user@domain.com -o table

# Find users with Owner role
az role assignment list --role "Owner" --query "[].{User:principalName, Scope:scope}" -o table
```

**Red flags**:
- Users with Owner role they don't need
- Service principals with excessive permissions
- Guest users with privileged access

### 3. Check Storage Account Security

```bash
# List all storage accounts
az storage account list -o table

# Check specific storage account security
az storage account show \
  --name STORAGE_NAME \
  --resource-group RESOURCE_GROUP \
  --query "{PublicAccess:allowBlobPublicAccess, FirewallAction:networkRuleSet.defaultAction}"

# Remediate: Disable public access
az storage account update \
  --name STORAGE_NAME \
  --resource-group RESOURCE_GROUP \
  --allow-blob-public-access false
```

### 4. Analyze Network Security Groups

```bash
# List all NSGs
az network nsg list -o table

# Check NSG rules for a specific group
az network nsg rule list \
  --nsg-name NSG_NAME \
  --resource-group RESOURCE_GROUP \
  -o table

# Find open rules (source = *)
az network nsg rule list \
  --nsg-name NSG_NAME \
  --resource-group RESOURCE_GROUP \
  --query "[?sourceAddressPrefix=='*']" -o table
```

**Dangerous patterns**:
- Source: `0.0.0.0/0` or `*`
- Ports: 22 (SSH), 3389 (RDP), 1433 (SQL)
- Direction: Inbound
- Action: Allow

### 5. Verify Microsoft Defender for Cloud

```bash
# Check Defender pricing tiers
az security pricing list -o table

# Enable Defender for specific resource type
az security pricing create \
  --name VirtualMachines \
  --tier Standard

# Get security recommendations
az security assessment list -o table
```

**Enable Defender for**:
- Virtual Machines
- Storage Accounts
- SQL Databases
- App Services
- Key Vault

### 6. Audit Key Vault Access

```bash
# List all Key Vaults
az keyvault list -o table

# Check access policies
az keyvault show \
  --name VAULT_NAME \
  --query "properties.accessPolicies[].{Principal:objectId, Permissions:permissions}" -o json

# Review diagnostic settings
az monitor diagnostic-settings list \
  --resource /subscriptions/SUB_ID/resourceGroups/RG/providers/Microsoft.KeyVault/vaults/VAULT_NAME \
  -o table
```

### 7. Check Conditional Access Policies

```bash
# List Conditional Access policies (requires Microsoft Graph)
az rest --method GET \
  --uri "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies"

# Check MFA status for users
az rest --method GET \
  --uri "https://graph.microsoft.com/v1.0/users" \
  --query "value[].{UPN:userPrincipalName, MFA:strongAuthenticationMethods}"
```

## 🛡️ Azure Security Services Setup

### Microsoft Defender for Cloud

1. **Enable Standard Tier**:
   ```bash
   # Enable for all resource types
   az security pricing create --name VirtualMachines --tier Standard
   az security pricing create --name StorageAccounts --tier Standard
   az security pricing create --name SqlServers --tier Standard
   az security pricing create --name AppServices --tier Standard
   az security pricing create --name KeyVaults --tier Standard
   ```

2. **Configure Security Contacts**:
   ```bash
   az security contact create \
     --email security@yourdomain.com \
     --name default \
     --alert-notifications on \
     --alerts-admins on
   ```

3. **Review in Portal**:
   - Go to Microsoft Defender for Cloud
   - Check Secure Score (target: >80%)
   - Review Recommendations
   - Monitor Security Alerts

### Azure Key Vault (Secrets Management)

```bash
# Create Key Vault
az keyvault create \
  --name restaurant-vault-prod \
  --resource-group restaurant-rg \
  --location eastus \
  --enable-soft-delete true \
  --enable-purge-protection true

# Store secret
az keyvault secret set \
  --vault-name restaurant-vault-prod \
  --name DatabaseConnectionString \
  --value "your-connection-string"

# Grant access to application
az keyvault set-policy \
  --name restaurant-vault-prod \
  --object-id APP_OBJECT_ID \
  --secret-permissions get list
```

### Microsoft Entra ID Protection

```bash
# Check risky users
az rest --method GET \
  --uri "https://graph.microsoft.com/v1.0/identityProtection/riskyUsers"

# Dismiss user risk (false positive)
az rest --method POST \
  --uri "https://graph.microsoft.com/v1.0/identityProtection/riskyUsers/dismiss" \
  --body '{"userIds": ["user-id"]}'

# Confirm user compromised
az rest --method POST \
  --uri "https://graph.microsoft.com/v1.0/identityProtection/riskyUsers/confirmCompromised" \
  --body '{"userIds": ["user-id"]}'
```

## 🔧 Common Remediation Steps

### Fix: Public Storage Container

**Issue**: Storage container allows public read access

**Remediation**:
```bash
# Disable public access on storage account
az storage account update \
  --name STORAGE_NAME \
  --resource-group RESOURCE_GROUP \
  --allow-blob-public-access false

# Configure firewall to allow specific IPs
az storage account network-rule add \
  --account-name STORAGE_NAME \
  --resource-group RESOURCE_GROUP \
  --ip-address YOUR_IP_ADDRESS
```

### Fix: No MFA Enforcement

**Issue**: MFA not required for admins

**Remediation** (via Portal):
1. Go to Azure AD > Security > Conditional Access
2. Create new policy:
   - Name: "Require MFA for Admins"
   - Users: Select admin roles
   - Cloud apps: All cloud apps
   - Grant: Require multi-factor authentication
3. Enable policy

**Via CLI**:
```bash
az rest --method POST \
  --uri "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies" \
  --body @mfa-policy.json
```

### Fix: Overly Permissive NSG Rule

**Issue**: NSG allows RDP from 0.0.0.0/0

**Remediation**:
```bash
# Delete risky rule
az network nsg rule delete \
  --nsg-name NSG_NAME \
  --resource-group RESOURCE_GROUP \
  --name RULE_NAME

# Create restrictive rule
az network nsg rule create \
  --nsg-name NSG_NAME \
  --resource-group RESOURCE_GROUP \
  --name AllowRDPFromOffice \
  --priority 100 \
  --source-address-prefixes YOUR_OFFICE_IP \
  --destination-port-ranges 3389 \
  --protocol Tcp \
  --access Allow
```

### Fix: Service Principal with Excessive Permissions

**Issue**: App has Contributor role on subscription

**Remediation**:
```bash
# Remove current role assignment
az role assignment delete \
  --assignee APP_ID \
  --role Contributor \
  --scope /subscriptions/SUBSCRIPTION_ID

# Assign limited role
az role assignment create \
  --assignee APP_ID \
  --role "Web Plan Contributor" \
  --scope /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP
```

## 📅 Security Monitoring Schedule

### Daily
- [ ] Review sign-in logs for anomalies
- [ ] Check Azure Defender alerts
- [ ] Monitor activity logs for critical changes

### Weekly
- [ ] Run `azure-security-audit.sh` script
- [ ] Review security recommendations
- [ ] Check for new CVEs affecting Azure resources
- [ ] Audit recent permission changes

### Monthly
- [ ] Access reviews for privileged roles
- [ ] Update security policies
- [ ] Review and rotate secrets/keys
- [ ] Compliance audit
- [ ] Security training for team

### Quarterly
- [ ] Full penetration test
- [ ] Disaster recovery drill
- [ ] Security architecture review
- [ ] Policy and procedure updates

## 🤖 Using the Azure Security Agent

Get instant help with security issues:

```
@azure I found a storage account with public access enabled, how do I secure it?

@azure How do I investigate suspicious login activity from an unknown IP?

@azure What's the best way to implement least privilege access for service principals?

@azure I got alert "Risky user detected" - what are the remediation steps?

@azure How do I enable Microsoft Defender for Cloud for all resources?
```

## 📚 Additional Resources

- [Microsoft Defender for Cloud Documentation](https://learn.microsoft.com/azure/defender-for-cloud/)
- [Azure Security Baseline](https://learn.microsoft.com/security/benchmark/azure/)
- [CIS Microsoft Azure Foundations Benchmark](https://www.cisecurity.org/benchmark/azure)
- [Azure Security Best Practices](https://learn.microsoft.com/azure/security/fundamentals/best-practices-and-patterns)
- [Microsoft Entra ID Protection](https://learn.microsoft.com/azure/active-directory/identity-protection/)

---

**Remember**: Security is an ongoing process, not a one-time task. Regular monitoring and remediation are essential.
