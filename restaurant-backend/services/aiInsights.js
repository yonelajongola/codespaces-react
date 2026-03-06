const OpenAI = require("openai");

function createClient() {
  if (process.env.AI_PROVIDER === "azure") {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    return new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY }
    });
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

async function generateDailyInsight({ today, yesterday, topItem, lowStock }) {
  const client = createClient();
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: `Revenue today: ${today}\nRevenue yesterday: ${yesterday}\nTop item: ${topItem}\nLow stock: ${lowStock}\nGenerate short business insights in 1-2 sentences.`
      }
    ],
    temperature: 0.4
  });

  return response.choices[0].message.content.trim();
}

module.exports = {
  generateDailyInsight
};
