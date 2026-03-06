# Azure Cloud Security - Quick Reference Checklist

## 🚀 Quick Security Audit

```bash
cd restaurant-dashboard/scripts
./azure-security-audit.sh
```

## Risk Level Guide

| Level | Response Time | Examples |
|-------|--------------|----------|
| 🔴 **HIGH** | 0-24 hours | Public storage, no MFA, open RDP/SSH |
| 🟡 **MEDIUM** | Within 1 week | Too many admins, missing firewall |
| 🟢 **LOW** | Ongoing improvement | No Key Vault, weak passwords |

## ✅ Security Checklist

### Authentication & Identity
- [ ] MFA enabled for all users (especially admins)
- [ ] Conditional Access policies configured
- [ ] Legacy authentication blocked
- [ ] Password policy: 14+ characters, complexity required
- [ ] Regular access reviews (quarterly)
- [ ] Guest user access reviewed
- [ ] Privileged Identity Management (PIM) enabled
- [ ] Sign-in risk policies active

### Network Security
- [ ] NSG rules: No 0.0.0.0/0 on critical ports
- [ ] Azure Firewall deployed
- [ ] VMs use Azure Bastion (no public RDP/SSH)
- [ ] Private endpoints for PaaS services
- [ ] DDoS Protection enabled
- [ ] Application Gateway with WAF
- [ ] Virtual Network service endpoints configured

### Data Protection
- [ ] Storage accounts: Public access disabled
- [ ] Storage firewall rules configured
- [ ] Encryption at rest enabled
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Azure Backup configured
- [ ] Soft delete enabled on storage/Key Vault
- [ ] Purge protection enabled
- [ ] Customer-managed keys (CMK) for sensitive data

### Secrets Management
- [ ] Azure Key Vault deployed
- [ ] Application uses Key Vault (not hardcoded secrets)
- [ ] Managed identities for Azure resources
- [ ] Key Vault firewall enabled
- [ ] Diagnostic logging enabled
- [ ] Access policies follow least privilege
- [ ] Keys rotated regularly (90 days)
- [ ] Audit logs monitored

### Monitoring & Detection
- [ ] Microsoft Defender for Cloud: Standard tier
- [ ] Azure Monitor configured
- [ ] Activity logs exported to Log Analytics
- [ ] Security alerts configured
- [ ] Budget alerts set
- [ ] Microsoft Sentinel (SIEM) deployed
- [ ] Automated remediation workflows
- [ ] Security dashboard reviewed daily

### Compliance & Governance
- [ ] Azure Policy assignments active
- [ ] Resource tags enforced
- [ ] Naming conventions followed
- [ ] Cost management configured
- [ ] Subscription limits monitored
- [ ] Compliance reports generated
- [ ] Security baseline implemented
- [ ] Regular security audits scheduled

### Application Security
- [ ] App Service: HTTPS only
- [ ] App Service: Managed identity enabled
- [ ] API Management: Authentication required
- [ ] SQL Database: Firewall rules configured
- [ ] SQL Database: TDE enabled
- [ ] Container Registry: Private
- [ ] Function Apps: Require authentication

### Incident Response
- [ ] Security contact configured in Defender
- [ ] Incident response plan documented
- [ ] Runbooks for common incidents
- [ ] Backup and recovery tested
- [ ] Team trained on response procedures
- [ ] Communication plan established

## 🎯 Restaurant Dashboard Specific

### Pre-Deployment
- [ ] Azure AD B2C tenant created
- [ ] App registration configured
- [ ] User flows created
- [ ] Conditional Access for dashboard admins
- [ ] MFA enforced for all roles
- [ ] Service principal with minimal permissions

### Post-Deployment
- [ ] Database connection uses Key Vault
- [ ] App Service uses managed identity
- [ ] CORS configured correctly
- [ ] Custom domain with SSL
- [ ] Application Insights enabled
- [ ] Diagnostic logs streaming
- [ ] Availability tests configured
- [ ] Alert rules for errors/downtime

### Operational Security
- [ ] Regular audit of dashboard users
- [ ] Monitor for unusual order patterns
- [ ] Payment data handling reviewed
- [ ] PCI-DSS compliance if processing cards
- [ ] Customer data retention policy
- [ ] GDPR compliance for EU customers
- [ ] Regular penetration testing

## 🔍 Quick Commands

### Check Security Score
```bash
az security secure-score list -o table
```

### List Active Alerts
```bash
az security alert list -o table
```

### Find Public IPs
```bash
az network public-ip list --query "[].{Name:name, IP:ipAddress, Resource:resourceGroup}" -o table
```

### Check MFA Status
```bash
az rest --method GET --uri "https://graph.microsoft.com/v1.0/reports/credentialUserRegistrationDetails"
```

### Review Role Assignments
```bash
az role assignment list --all --query "[?roleDefinitionName=='Owner' || roleDefinitionName=='Contributor']" -o table
```

### Enable Defender for Cloud
```bash
az security pricing create --name VirtualMachines --tier Standard
az security pricing create --name StorageAccounts --tier Standard
az security pricing create --name SqlServers --tier Standard
az security pricing create --name AppServices --tier Standard
az security pricing create --name KeyVaults --tier Standard
```

## 🤖 Ask the Azure Agent

```
@azure Audit my environment for security risks

@azure How do I secure an exposed storage account?

@azure What's the fastest way to enable MFA for all users?

@azure I have 10 subscription owners, is that too many?

@azure Show me how to implement least privilege access
```

## 📊 Monthly Security Review

1. Run `azure-security-audit.sh`
2. Review all HIGH/MEDIUM findings
3. Check Defender recommendations
4. Update access reviews
5. Rotate secrets/keys
6. Review cost and usage
7. Update security documentation
8. Team security training session

## 🆘 Emergency Response

### Suspected Compromise
1. **Identify** affected resources
2. **Isolate** compromised accounts/resources
3. **Revoke** access tokens and credentials
4. **Rotate** all secrets immediately
5. **Investigate** logs for attacker activity
6. **Remediate** vulnerabilities
7. **Document** incident
8. **Report** to stakeholders

### Commands
```bash
# Disable compromised user
az ad user update --id user@domain.com --account-enabled false

# Revoke all sessions
az ad user update --id user@domain.com --force-change-password-next-sign-in true

# Rotate storage keys
az storage account keys renew --account-name STORAGE --resource-group RG --key key1

# Check recent activity
az monitor activity-log list --start-time 2026-03-06T00:00:00Z --query "[].{Time:eventTimestamp, User:caller, Action:operationName.value}" -o table
```

## 📞 Support

- **Azure Security Agent**: `@azure [your question]`
- **Microsoft Support**: https://portal.azure.com > Help + Support
- **Security Center**: https://portal.azure.com > Microsoft Defender for Cloud
- **Azure Status**: https://status.azure.com

---

**Print this checklist** and review monthly. Security is everyone's responsibility.
