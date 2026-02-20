# Azure OpenAI Setup for AI Waiter

## Step 1: Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new resource: **Azure OpenAI**
3. Fill in:
   - Resource group: `restaurant-ai`
   - Name: `restaurant-openai`
   - Region: East US or your preferred region
   - Pricing tier: Standard (S0)
4. Click "Create"

## Step 2: Deploy a Model

1. Open your Azure OpenAI resource
2. Go to **Model deployments** → **Create new deployment**
3. Select deployment name: `gpt-4o-mini` (or `gpt-4o`)
4. Select model: `gpt-4o-mini` or `gpt-4o`
5. Click **Create**

## Step 3: Get Your Credentials

1. In your Azure OpenAI resource, go to **Keys and Endpoint**
2. Copy:
   - **Endpoint**: (e.g., `https://xxxx.openai.azure.com/`)
   - **Key 1** or **Key 2**: (your API key)

## Step 4: Update Backend `.env`

In `/workspaces/codespaces-react/restaurant-backend/.env`, update:

```
AZURE_OPENAI_ENDPOINT=https://xxxx.openai.azure.com/
AZURE_OPENAI_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

## Step 5: Restart Backend

```bash
cd /workspaces/codespaces-react/restaurant-backend
npm run dev
```

## Features Unlocked

✅ AI Waiter search in dashboards (text + voice)
✅ Smart recommendations
✅ Natural language order queries
✅ Inventory insights

## Test It

1. Go to http://localhost:5000/ (unified) or http://localhost:5174/ (lite)
2. Login as owner
3. Click "🤖 AI Waiter" button
4. Ask questions like:
   - "What's my revenue today?"
   - "Show me orders from this week"
   - "Recommend what to restock"
5. Click 🎤 to use voice input

## Cost

- Azure OpenAI GPT-4o-mini: ~$0.15 per 1M tokens
- Free tier: First $5/month
