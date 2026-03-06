const OpenAI = require("openai");

function createAzureClient() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

  if (!endpoint || !apiKey || !deployment) {
    throw new Error("Missing Azure OpenAI credentials. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT");
  }

  return new OpenAI({
    apiKey,
    baseURL: `${endpoint}/openai/deployments/${deployment}`,
    defaultQuery: { "api-version": apiVersion },
    defaultHeaders: { "api-key": apiKey }
  });
}

async function searchOrders(query, restaurantId) {
  const client = createAzureClient();
  const model = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are a helpful restaurant waiter AI assistant. Answer questions about orders, inventory, and operations briefly."
      },
      {
        role: "user",
        content: `Restaurant query: ${query}`
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  return response.choices[0].message.content.trim();
}

async function getRecommendations(restaurantId) {
  const client = createAzureClient();
  const model = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are a restaurant operations assistant. Provide 2-3 brief recommendations for improving operations."
      },
      {
        role: "user",
        content: "Based on typical restaurant operations, what recommendations would you suggest?"
      }
    ],
    temperature: 0.6,
    max_tokens: 150
  });

  return response.choices[0].message.content.trim();
}

module.exports = {
  searchOrders,
  getRecommendations
};
