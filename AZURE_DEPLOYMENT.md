# Azure Deployment Walkthrough

## Backend (Azure App Service)

1. Create an Azure App Service (Linux, Node 18 LTS).
2. Connect the GitHub repository and select the branch to deploy.
3. In App Service Configuration, set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY` (or Azure OpenAI values)
   - `CORS_ORIGIN` (dashboard URL)
4. Add a startup command if needed: `npm start`.
5. Deploy and verify `/health` returns `{"status":"ok"}`.

## Database (Azure Database for PostgreSQL)

1. Create an Azure Database for PostgreSQL Flexible Server.
2. Configure networking (public access for dev or private endpoint for production).
3. Create the database and run [restaurant-backend/schema.sql](restaurant-backend/schema.sql).
4. Copy the connection string into `DATABASE_URL`.

## Frontend (Azure Static Web Apps)

1. Create a Static Web App, connect the GitHub repo.
2. Set the app location to `restaurant-dashboard`.
3. Build command: `npm run build`.
4. Output location: `dist`.
5. Add `VITE_API_URL` in Static Web Apps settings.

## Optional: Azure OpenAI

1. Create an Azure OpenAI resource.
2. Deploy a model (example: `gpt-4o-mini`).
3. Set:
   - `AI_PROVIDER=azure`
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_KEY`
   - `AZURE_OPENAI_DEPLOYMENT`
   - `AZURE_OPENAI_API_VERSION`

## Notes

- Use HTTPS-only settings in App Service.
- Add a custom domain and managed TLS if needed.
- For production, enable private networking and VNET integration.
