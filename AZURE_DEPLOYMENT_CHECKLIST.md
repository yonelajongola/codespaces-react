# Azure Deployment Checklist

## Pre-Deployment Checklist

### Azure Account Setup
- [ ] Azure subscription created
- [ ] Azure CLI installed and logged in
- [ ] Subscription ID known
- [ ] Organization/access policies reviewed

### Prerequisites Installed
- [ ] Node.js 18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git installed: `git --version`
- [ ] Azure CLI installed: `az --version`
- [ ] OpenSSL available (for generating secrets)

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0 or Azure IPs)
- [ ] Connection string copied and saved securely
- [ ] Connection string format verified:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
  ```

### Environment Variables
- [ ] `MONGODB_URI` environment variable set
- [ ] `ENVIRONMENT` variable set (dev/staging/prod)
- [ ] Test connection to MongoDB from local machine

---

## Deployment Checklist

### Phase 1: Infrastructure Setup
- [ ] Run `./azure-deploy.sh`
- [ ] Verify all resources created successfully
- [ ] Check `azure-deployment.env` file was created
- [ ] Note the resource names and URLs for later

### Phase 2: Backend Deployment
- [ ] Navigate to `restaurant-backend` directory: `cd restaurant-backend`
- [ ] Verify `package.json` has necessary scripts
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `../deploy-backend.sh` to deploy
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Test backend health endpoint
- [ ] Verify environment variables in App Service settings
- [ ] Check deployment logs for any errors
- [ ] Return to root: `cd ..`

### Phase 3: Frontend Deployment
- [ ] Navigate to `restaurant-dashboard` directory: `cd restaurant-dashboard`
- [ ] Verify `package.json` has deployment scripts
- [ ] Review `.env.production` configuration
- [ ] Run `npm install` to ensure dependencies
- [ ] Run `../deploy-frontend.sh` to deploy
- [ ] Wait for build and deployment to complete (5-10 minutes)
- [ ] Verify frontend accessibility
- [ ] Test API connectivity from frontend
- [ ] Return to root: `cd ..`

---

## Post-Deployment Verification

### Functionality Tests
- [ ] Frontend loads without errors
- [ ] Navigation between pages works
- [ ] Backend API is accessible from frontend
- [ ] Authentication flows work correctly
- [ ] Database queries return expected data
- [ ] OpenAI integration functions properly

### Performance Checks
- [ ] Frontend page loads in < 3 seconds
- [ ] API responses in < 1 second
- [ ] No console errors in browser
- [ ] No errors in backend logs

### Security Verification
- [ ] All secrets are in Key Vault (not in code)
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] API authentication is required
- [ ] Database connections are encrypted
- [ ] No sensitive data in logs

### Monitoring Setup
- [ ] Application Insights enabled (optional)
- [ ] Health check endpoints configured
- [ ] Log collection set up
- [ ] Alert rules configured for failures

---

## Configuration & Customization

### Custom Domain (Optional)
- [ ] Domain registered (or prepared)
- [ ] DNS records created for Azure
- [ ] SSL certificate obtained (or auto-configured)
- [ ] Custom domain added to App Service
- [ ] Custom domain added to Static Web Apps
- [ ] SSL binding configured

### Environment-Specific Configuration
- [ ] Production secrets configured in Key Vault
- [ ] API rate limiting configured
- [ ] Logging levels appropriate for environment
- [ ] Database backups scheduled
- [ ] Auto-scaling rules set up

### Scaling Configuration
- [ ] Review App Service tier (production consider S1+)
- [ ] Configure auto-scale rules based on metrics
- [ ] Set up appropriate alarms/alerts
- [ ] Plan for expected traffic load

---

## Documentation & Handoff

### Documentation Complete
- [ ] `AZURE_QUICK_START.md` reviewed
- [ ] `DEPLOYMENT_SUMMARY.md` created
- [ ] All URLs and resource names documented
- [ ] Troubleshooting guide reviewed
- [ ] Cost estimates calculated

### Team Communication
- [ ] Team members notified of deployment
- [ ] Access credentials securely shared (if applicable)
- [ ] Support contact information provided
- [ ] Escalation procedures documented
- [ ] Runbook created for operations team

---

## Maintenance & Monitoring

### Regular Checks
- [ ] Monitor application logs daily
- [ ] Check error rates and performance metrics
- [ ] Review Key Vault access logs
- [ ] Monitor database connection count
- [ ] Check API response times

### Updates & Patches
- [ ] Establish npm dependency update schedule
- [ ] Test updates in staging before prod
- [ ] Plan Node.js runtime updates
- [ ] Schedule security reviews quarterly
- [ ] Review Azure service updates

### Cost Optimization
- [ ] Monitor Azure spend weekly
- [ ] Identify unused resources
- [ ] Evaluate reserved instances for production
- [ ] Consider Azure Hybrid Benefit if applicable
- [ ] Schedule monthly cost review

---

## Rollback Procedures

### In Case of Issues
- [ ] Identify specific failure
- [ ] Check application logs
- [ ] Review recent code changes
- [ ] Database integrity verified
- [ ] Restore from backup if needed
- [ ] Rollback deployment if necessary

### Rollback Commands
```bash
# Roll back to previous deployment
az webapp deployment slot swap \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --slot staging

# Or redeploy previous version
git checkout <previous-commit-hash>
./deploy-backend.sh
./deploy-frontend.sh
```

---

## Sign-Off

- [ ] Deployment completed successfully
- [ ] All tests passed
- [ ] Team lead approval obtained
- [ ] Stakeholders notified
- [ ] Post-deployment documentation updated

**Deployment Date**: _______________

**Deployed By**: _______________

**Approved By**: _______________

**Notes**: 
```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

## Useful Commands Reference

### View Deployment Status
```bash
az deployment group list --resource-group restaurant-rg
```

### View Secrets
```bash
az keyvault secret list --vault-name restaurant-kv-dev-xxxxx
```

### View Logs
```bash
az webapp log tail --resource-group restaurant-rg --name restaurant-api-dev-xxxxx
```

### Restart Services
```bash
az webapp restart --resource-group restaurant-rg --name restaurant-api-dev-xxxxx
```

### Check Metrics
```bash
az monitor metrics list \
  --resource-group restaurant-rg \
  --resource-type "Microsoft.Web/sites" \
  --resource restaurant-api-dev-xxxxx \
  --metric "Requests" \
  --output table
```

---

**Status**: ⏳ Ready to Deploy
